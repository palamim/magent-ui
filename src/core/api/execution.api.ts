import { apiClient } from '@/core/api/client';
import { ExecutionResult, KeepExecutionResult, DiscardExecutionResult, InspectTool } from '@/model/execution.model';

export const apiExecute = (dir: string, refinements: string[] = []): Promise<ExecutionResult> =>
  apiClient.post<ExecutionResult>('/execute', { dir, refinements });

export const apiInspectExecution = (dir: string, branch: string, tool: InspectTool): Promise<{ opened: boolean }> =>
  apiClient.post('/inspect-execution', { dir, branch, tool });

export const apiKeepExecution = (
  dir: string,
  refinements: string[] = [],
  comment: string = '',
): Promise<KeepExecutionResult> =>
  apiClient.post<KeepExecutionResult>('/keep-execution', { dir, refinements, comment });

export const apiDiscardExecution = (
  dir: string,
  branch: string,
  refinements: string[] = [],
  comment: string = '',
): Promise<DiscardExecutionResult> =>
  apiClient.post<DiscardExecutionResult>('/discard-execution', { dir, branch, refinements, comment });
