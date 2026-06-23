'use client';

import { DiffView } from '@/components/diff-view';
import { useMagent } from '@/providers/magent.provider';

export const FileDiffView = ({ path }: { path: string }) => {
  const { files } = useMagent();
  const file = files.find((f) => f.path === path);
  if (!file) return null;
  return <DiffView label={file.path} status={file.status} diff={file.hunks} />;
};
