import { apiClient } from '@/core/api/client';
import type { Plan } from '@/model/plan.model';
import { ExecutionResult, ApproveExecutionResult, DiscardExecutionResult, InspectTool } from '@/model/execution.model';

export const executePlan = (dir: string, plan: Plan, feedback: string[] = []): Promise<ExecutionResult> =>
  apiClient.post<ExecutionResult>('/execute', { dir, plan, feedback });

export const inspectBranch = (dir: string, branch: string, tool: InspectTool): Promise<{ opened: boolean }> =>
  apiClient.post('/inspect', { dir, branch, tool });

export const apiApproveExecution = (
  dir: string,
  branch: string,
  plan: Plan,
  feedback: string[] = [],
  note: string = '',
): Promise<ApproveExecutionResult> =>
  apiClient.post<ApproveExecutionResult>('/approve', { dir, branch, plan, feedback, note });

export const apiDiscardExecution = (
  dir: string,
  branch: string,
  plan: Plan,
  feedback: string[] = [],
  note: string = '',
): Promise<DiscardExecutionResult> =>
  apiClient.post<DiscardExecutionResult>('/discard', { dir, branch, plan, feedback, note });
