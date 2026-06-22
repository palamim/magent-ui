export interface ExecutionResult {
  branch: string;
  status: 'committed' | 'no-net-changes' | 'gave-up';
  diff: string; // raw unified-diff text for now
}

export interface ApproveExecutionResult {
  merged: boolean;
  pushed: boolean;
}
export interface DiscardExecutionResult {
  discarded: boolean;
}

export type InspectTool = 'vscode' | 'finder' | 'terminal' | 'ghostty';
