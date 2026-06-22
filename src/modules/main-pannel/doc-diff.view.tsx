'use client';

import { DiffView } from '@/components/diff-view';
import { useMagent } from '@/providers/magent.provider';

export const DocDiffView = ({ which }: { which: 'direction' | 'conventions' }) => {
  const { direction } = useMagent();
  if (!direction) return null;
  const diff = which === 'direction' ? direction.directionDiff : direction.conventionsDiff;
  const label = which === 'direction' ? 'direction.md' : 'conventions.md';
  return <DiffView label={label} diff={diff} />;
};
