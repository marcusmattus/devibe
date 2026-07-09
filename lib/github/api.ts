import { Buffer } from "buffer";
import type { ProjectFile } from "../../constants/sampleProject";
import type { GitHubRepo, GitHubUser } from "./types";

const API_BASE = "https://api.github.com";

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".css",
  ".html",
  ".yml",
  ".yaml",
  ".env",
  ".txt",
  ".xml",
  ".svg",
  ".gradle",
  ".properties",
  ".swift",
  ".kt",
  ".go",
  ".py",
  ".rb",
  ".sh",
]);

const MAX_FILES = 30;

async function githubFetch<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  return githubFetch<GitHubUser>("/user", token);
}

export async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
  return githubFetch<GitHubRepo[]>("/user/repos?sort=updated&per_page=100", token);
}

interface TreeResponse {
  tree: { path: string; type: string; sha: string }[];
}

interface ContentResponse {
  name: string;
  path: string;
  content?: string;
  encoding?: string;
  type: string;
}

function languageFromPath(path: string): string {
  if (path.endsWith(".tsx")) return "typescript";
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".jsx")) return "javascript";
  if (path.endsWith(".js")) return "javascript";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".md")) return "markdown";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".yml") || path.endsWith(".yaml")) return "yaml";
  return "plaintext";
}

function isTextFile(path: string): boolean {
  const lower = path.toLowerCase();
  return [...TEXT_EXTENSIONS].some((ext) => lower.endsWith(ext));
}

function decodeContent(content: string, encoding?: string): string {
  if (encoding === "base64") {
    return Buffer.from(content, "base64").toString("utf-8");
  }
  return content;
}

export async function fetchRepoFiles(
  token: string,
  owner: string,
  repo: string,
  branch: string
): Promise<ProjectFile[]> {
  const tree = await githubFetch<TreeResponse>(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    token
  );

  const paths = tree.tree
    .filter((item) => item.type === "blob" && isTextFile(item.path))
    .map((item) => item.path)
    .slice(0, MAX_FILES);

  const files: ProjectFile[] = [];

  for (const path of paths) {
    try {
      const content = await githubFetch<ContentResponse>(
        `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`,
        token
      );

      if (content.type !== "file" || !content.content) continue;

      files.push({
        path,
        name: content.name,
        content: decodeContent(content.content, content.encoding),
        language: languageFromPath(path),
      });
    } catch {
      // Skip files that fail to load (binary, too large, etc.)
    }
  }

  if (files.length === 0) {
    files.push({
      path: "README.md",
      name: "README.md",
      content: `# ${repo}\n\nImported from GitHub. No text files were found in the default branch.`,
      language: "markdown",
    });
  }

  return files;
}

export async function validateToken(token: string): Promise<GitHubUser> {
  return fetchGitHubUser(token);
}
