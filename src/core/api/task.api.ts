import { apiClient } from '@/core/api/client';
import type { Task } from '@/model/plan.model';

export const apiTaskState = (dir: string): Promise<{ task: Task | null }> =>
  apiClient.get(`/task-state?dir=${encodeURIComponent(dir)}`);
