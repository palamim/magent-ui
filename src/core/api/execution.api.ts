import { apiClient } from '@/core/api/client';
import type { Plan } from '@/model/plan.model';
import { ExecutionResult, ApproveExecutionResult, DiscardExecutionResult, InspectTool } from '@/model/execution.model';

export const apiExecute = (dir: string, plan: Plan, refinements: string[] = []): Promise<ExecutionResult> =>
  apiClient.post<ExecutionResult>('/execute', { dir, plan, refinements });

export const apiInspectExecution = (dir: string, branch: string, tool: InspectTool): Promise<{ opened: boolean }> =>
  apiClient.post('/inspect-execution', { dir, branch, tool });

export const apiApproveExecution = (
  dir: string,
  branch: string,
  plan: Plan,
  feedback: string[] = [],
  note: string = '',
): Promise<ApproveExecutionResult> =>
  apiClient.post<ApproveExecutionResult>('/approve-execution', { dir, branch, plan, feedback, note });

export const apiDiscardExecution = (
  dir: string,
  branch: string,
  plan: Plan,
  feedback: string[] = [],
  note: string = '',
): Promise<DiscardExecutionResult> =>
  apiClient.post<DiscardExecutionResult>('/discard-execution', { dir, branch, plan, feedback, note });
