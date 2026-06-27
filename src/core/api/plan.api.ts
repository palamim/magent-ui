import { apiClient } from '@/core/api/client';
import type { Plan } from '@/model/plan.model';

export type PlanResponse = { kind: 'task' } | { kind: 'feature-complete'; goal: string };

export const apiPlan = (dir: string): Promise<PlanResponse> => apiClient.post<PlanResponse>('/plan', { dir });

export const apiRefinePlan = (dir: string, plan: Plan, comment: string): Promise<{ recorded: boolean }> =>
  apiClient.post('/refine-plan', { dir, plan, comment });

export const apiPlanState = (dir: string): Promise<{ plan: Plan | null }> =>
  apiClient.get(`/plan-state?dir=${encodeURIComponent(dir)}`);

export const apiFinishPlan = (
  dir: string,
  push: boolean,
  comment = '',
): Promise<{ merged: boolean; pushed: boolean }> => apiClient.post('/finish-plan', { dir, push, comment });

export const apiAbandonPlan = (dir: string, comment = ''): Promise<{ abandoned: boolean }> =>
  apiClient.post('/abandon-plan', { dir, comment });
