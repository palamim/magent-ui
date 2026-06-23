import { usePersistedBool } from '@/hooks/user-persisted-state.hook';

export const useAutoPush = () => {
  const [autoPush, setAutoPush] = usePersistedBool('magent:auto-push', false);
  return { autoPush, toggle: () => setAutoPush(!autoPush) };
};
