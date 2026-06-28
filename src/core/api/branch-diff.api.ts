import { apiClient } from '@/core/api/client';

export const apiBranchDiff = (dir: string): Promise<{ diff: string; deciding: boolean; branch: string }> =>
  apiClient.get(`/branch-diff?dir=${encodeURIComponent(dir)}`);
