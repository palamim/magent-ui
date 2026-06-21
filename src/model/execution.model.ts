export interface ExecutionResult {
  branch: string;
  status: 'committed' | 'no-net-changes' | 'gave-up';
  diff: string; // raw unified-diff text for now
}

export interface ApproveResult {
  merged: boolean;
  pushed: boolean;
}
export interface DiscardResult {
  discarded: boolean;
}

export type InspectTool = 'vscode' | 'finder' | 'terminal' | 'ghostty';
