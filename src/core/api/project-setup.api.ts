import { apiClient } from '@/core/api/client';

export const apiProjectStatus = (dir: string): Promise<{ needsGitignoreSetup: boolean; hasRealDirection: boolean }> =>
  apiClient.get(`/project-status?dir=${encodeURIComponent(dir)}`);

export const apiSetupProject = (dir: string): Promise<{ done: boolean }> => apiClient.post('/setup-project', { dir });
