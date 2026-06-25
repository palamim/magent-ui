import { apiClient } from '@/core/api/client';
import type { Plan } from '@/model/plan.model';

interface PlanTaskResponse {
  plan: Plan;
}

interface FeatureCompleteResponse {
  status: 'feature-complete';
  goal: string;
}

export type PlanResponse = PlanTaskResponse | FeatureCompleteResponse;

export const apiPlan = (dir: string): Promise<PlanResponse> => apiClient.post<PlanResponse>('/plan', { dir });

export const apiApprovePlan = (
  dir: string,
  plan: Plan,
  refinements: string[] = [],
  comment: string = '',
): Promise<{ recorded: boolean }> => apiClient.post('/approve-plan', { dir, plan, refinements, comment });

export const apiDiscardPlan = (
  dir: string,
  plan: Plan,
  refinements: string[] = [],
  comment: string = '',
): Promise<{ recorded: boolean }> => apiClient.post('/discard-plan', { dir, plan, refinements, comment });

export const apiRefinePlan = (dir: string, plan: Plan, comment: string): Promise<{ recorded: boolean }> =>
  apiClient.post('/refine-plan', { dir, plan, comment });
