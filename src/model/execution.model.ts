export interface ExecutionResult {
  branch: string;
  status: 'committed' | 'no-net-changes' | 'gave-up';
  diff: string;
}

export interface KeepExecutionResult {
  kept: boolean;
}
export interface DiscardExecutionResult {
  discarded: boolean;
}

export type InspectTool = 'vscode' | 'finder' | 'terminal' | 'ghostty';
