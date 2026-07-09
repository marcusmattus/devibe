import { create } from "zustand";
import { Project, ProjectFile, SAMPLE_FILES, SAMPLE_PROJECTS } from "../constants/sampleProject";

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  activeFile: ProjectFile | null;
  setActiveProject: (project: Project) => void;
  setActiveFile: (file: ProjectFile) => void;
  updateFileContent: (path: string, content: string) => void;
  createProject: (name: string, type: string) => void;
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
    };
    set((state) => ({
      projects: [newProject, ...state.projects],
      activeProject: newProject,
      activeFile: newProject.files[0],
    }));
  },
}));
