import { apiClient } from './client';
import type { Plan } from '@/model/plan.model';

interface ProposalResponse {
  plan: Plan;
}

export const fetchProposal = (dir: string): Promise<ProposalResponse> =>
  apiClient.post<ProposalResponse>('/proposal', { dir });
