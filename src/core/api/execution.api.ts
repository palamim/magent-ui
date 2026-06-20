import { apiClient } from '@/core/api/client';
import type { Plan } from '@/model/plan.model';
import type { ExecutionResult } from '@/model/execution.model';

export const executePlan = (dir: string, plan: Plan, feedback: string[] = []): Promise<ExecutionResult> =>
  apiClient.post<ExecutionResult>('/execute', { dir, plan, feedback });
