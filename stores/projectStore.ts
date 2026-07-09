import { create } from "zustand";
import { Project, ProjectFile, SAMPLE_FILES, SAMPLE_PROJECTS } from "../constants/sampleProject";
import type { GitHubRepo } from "../lib/github/types";
import { fetchRepoFiles } from "../lib/github/api";

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  activeFile: ProjectFile | null;
  setActiveProject: (project: Project) => void;
  setActiveFile: (file: ProjectFile) => void;
  updateFileContent: (path: string, content: string) => void;
  createProject: (name: string, type: string) => void;
  importGitHubRepo: (repo: GitHubRepo, token: string) => Promise<Project>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: SAMPLE_PROJECTS,
  activeProject: SAMPLE_PROJECTS[0],
  activeFile: SAMPLE_FILES[0],

  setActiveProject: (project) =>
    set({
      activeProject: project,
      activeFile: project.files[0] ?? null,
    }),

  setActiveFile: (file) => set({ activeFile: file }),

  updateFileContent: (path, content) => {
    const { activeProject, activeFile } = get();
    if (!activeProject) return;

    const updatedFiles = activeProject.files.map((f) =>
      f.path === path ? { ...f, content } : f
    );

    const updatedProject = { ...activeProject, files: updatedFiles };
    const updatedProjects = get().projects.map((p) =>
      p.id === activeProject.id ? updatedProject : p
    );

    set({
      projects: updatedProjects,
      activeProject: updatedProject,
      activeFile:
        activeFile?.path === path
          ? { ...activeFile, content }
          : activeFile,
    });
  },

  createProject: (name, type) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      type,
      status: "draft",
      updatedAt: "Just now",
      files: [...SAMPLE_FILES],
      source: "local",
    };
    set((state) => ({
      projects: [newProject, ...state.projects],
      activeProject: newProject,
      activeFile: newProject.files[0],
    }));
  },

  importGitHubRepo: async (repo, token) => {
    const files = await fetchRepoFiles(
      token,
      repo.owner.login,
      repo.name,
      repo.default_branch
    );

    const existing = get().projects.find(
      (p) => p.github?.fullName === repo.full_name
    );

    const project: Project = {
      id: existing?.id ?? `github-${repo.id}`,
      name: repo.name,
      type: repo.language ? `${repo.language} · GitHub` : "GitHub",
      status: "in_progress",
      updatedAt: formatRelativeDate(repo.updated_at),
      files,
      source: "github",
      github: {
        owner: repo.owner.login,
        repo: repo.name,
        fullName: repo.full_name,
        defaultBranch: repo.default_branch,
        htmlUrl: repo.html_url,
        private: repo.private,
      },
    };

    set((state) => {
      const withoutExisting = state.projects.filter((p) => p.id !== project.id);
      return {
        projects: [project, ...withoutExisting],
        activeProject: project,
        activeFile: project.files[0] ?? null,
      };
    });

    return project;
  },
}));

function formatRelativeDate(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
