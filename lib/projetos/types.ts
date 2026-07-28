export type ProjectStatus = "live" | "building" | "paused";

export type Project = {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  cover_url: string | null;
  tech: string[];
  status: ProjectStatus;
  live_url: string | null;
  repo_url: string | null;
  problem: string | null;
  solution: string | null;
  role: string | null;
  result: string | null;
  position: number;
  published: boolean;
};
