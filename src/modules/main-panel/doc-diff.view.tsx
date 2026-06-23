'use client';

import { DiffView } from '@/components/diff-view';
import { useMagent } from '@/providers/magent.provider';

export const DocDiffView = ({ name }: { name: string }) => {
  const { direction } = useMagent();
  if (!direction) return null;
  const doc = direction.docs.find((d) => d.name === name);
  if (!doc) return null;
  return <DiffView label={doc.name} diff={doc.diff} />;
};
