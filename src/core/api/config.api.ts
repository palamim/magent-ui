// core/api/config.api.ts
import { apiClient } from '@/core/api/client';

export interface MagentConfig {
  baseBranch: string;
  autoPush: boolean;
}

export const apiGetConfig = (dir: string): Promise<MagentConfig> =>
  apiClient.get(`/config?dir=${encodeURIComponent(dir)}`);

export const apiSetConfig = (dir: string, config: Partial<MagentConfig>): Promise<MagentConfig> =>
  apiClient.post('/config', { dir, ...config });

export const apiListBranches = (dir: string): Promise<{ branches: string[] }> =>
  apiClient.get(`/branches?dir=${encodeURIComponent(dir)}`);
