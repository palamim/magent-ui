import { apiClient } from '@/core/api/client';

interface BrowseEntry {
  name: string;
  path: string;
}
interface BrowseResult {
  current: string;
  parent: string;
  entries: BrowseEntry[];
}

export const apiBrowse = (path?: string): Promise<BrowseResult> =>
  apiClient.get(`/browse${path ? `?path=${encodeURIComponent(path)}` : ''}`);
