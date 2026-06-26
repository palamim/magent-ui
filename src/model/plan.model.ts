// The planner's output — what the server returns from /proposal.
// Mirrors the Plan type in the magent backend (two repos, a copy each for now).
export interface Plan {
  description: string;
  type: string;
  slug: string;
  targetFiles: string[];
  contextFiles: string[];
  instructions: string;
  taskId?: string;
}

export enum TaskStatus {
  PENDING = 'pending',
  DONE = 'done',
}

export interface Task {
  id: string;
  slug: string;
  description: string;
  instructions: string;
  targetFiles: string[];
  contextFiles: string[];
  status: TaskStatus;
}

// the Planner's persistent multi-run plan (lives in planner/plan.json)
export interface TaskPlan {
  frontier: string; // the slice of direction.md this plan serves (so we know when to replan)
  goal: string; // one-line: what this whole plan achieves
  type: string; // feat/fix/etc for the eventual commits
  slug: string; // kebab, for branch/commit naming
  dependencies: string[]; // npm packages installed before execution
  tasks: Task[];
}
