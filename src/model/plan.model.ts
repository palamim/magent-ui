// The planner's output — what the server returns from /proposal.
// Mirrors the Plan type in the magent backend (two repos, a copy each for now).
export interface Plan {
  description: string;
  type: string;
  slug: string;
  targetFiles: string[];
  contextFiles: string[];
  instructions: string;
}
