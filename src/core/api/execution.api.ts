import { apiClient } from '@/core/api/client';
import type { Plan } from '@/model/plan.model';
import { ExecutionResult, ApproveResult, DiscardResult, InspectTool } from '@/model/execution.model';

export const executePlan = (dir: string, plan: Plan, feedback: string[] = []): Promise<ExecutionResult> =>
  apiClient.post<ExecutionResult>('/execute', { dir, plan, feedback });

export const inspectBranch = (dir: string, branch: string, tool: InspectTool): Promise<{ opened: boolean }> =>
  apiClient.post('/inspect', { dir, branch, tool });

export const approveExecution = (
  dir: string,
  branch: string,
  plan: Plan,
  feedback: string[] = [],
  note: string = '',
): Promise<ApproveResult> => apiClient.post<ApproveResult>('/approve', { dir, branch, plan, feedback, note });

export const discardExecution = (
  dir: string,
  branch: string,
  plan: Plan,
  feedback: string[] = [],
  note: string = '',
): Promise<DiscardResult> => apiClient.post<DiscardResult>('/discard', { dir, branch, plan, feedback, note });
