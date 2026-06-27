import { apiClient } from '@/core/api/client';
import { Agent } from '@/model/agent.model';

export const apiAddComment = (dir: string, agent: Agent, comment: string): Promise<{ added: boolean }> =>
  apiClient.post('/add-comment', { dir, agent, comment });
