import { apiClient } from '@/core/api/client';
import type { Plan } from '@/model/plan.model';

interface PlanResponse {
  plan: Plan;
}

export const fetchPlan = (dir: string): Promise<PlanResponse> => apiClient.post<PlanResponse>('/plan', { dir });
