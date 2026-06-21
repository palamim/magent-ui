'use client';

import { useMagent } from '@/providers/magent.provider';
import { PlanView } from '@/modules/main-pannel/plan.view';
import { FileDiffView } from '@/modules/main-pannel/file-diff.view';
import { EmptyState } from '@/modules/main-pannel/empty-state.view';

export const MainPanel = () => {
  const { selectedView } = useMagent();

  if (selectedView.kind === 'none') return <EmptyState />;
  if (selectedView.kind === 'plan') return <PlanView />;
  if (selectedView.kind === 'file') return <FileDiffView path={selectedView.path} />;
  return null;
};
