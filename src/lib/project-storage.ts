const KEY = 'magent:project-dir';

export const loadStoredDir = (): string => {
  if (typeof window === 'undefined') return ''; // SSR guard
  return localStorage.getItem(KEY) ?? '';
};

export const storeDir = (dir: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, dir);
};
