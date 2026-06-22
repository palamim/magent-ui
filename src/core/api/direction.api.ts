import { apiClient } from '@/core/api/client';
import { ApproveDirectionResult, DirectionProposal, DiscardDirectionResult } from '@/model/direction.model';

export const fetchDirection = (dir: string): Promise<DirectionProposal> =>
  apiClient.post<DirectionProposal>('/direct', { dir });

export const apiApproveDirection = (
  dir: string,
  rationale: string,
  direction: string,
  conventions: string,
  refinements: string[] = [],
  comment: string = '',
): Promise<ApproveDirectionResult> =>
  apiClient.post<ApproveDirectionResult>('/approve-direction', {
    dir,
    rationale,
    direction,
    conventions,
    refinements,
    comment,
  });

export const apiDiscardDirection = (
  dir: string,
  rationale: string,
  refinements: string[] = [],
  comment: string = '',
): Promise<DiscardDirectionResult> =>
  apiClient.post<DiscardDirectionResult>('/discard-direction', { dir, rationale, refinements, comment });
