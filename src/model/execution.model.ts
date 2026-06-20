export interface ExecutionResult {
  branch: string;
  status: 'committed' | 'no-net-changes' | 'gave-up';
  diff: string; // raw unified-diff text for now
}
