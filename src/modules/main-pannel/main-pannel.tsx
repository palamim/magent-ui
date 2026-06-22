'use client';

import { useMagent } from '@/providers/magent.provider';
import { PlanView } from '@/modules/main-pannel/plan.view';
import { FileDiffView } from '@/modules/main-pannel/file-diff.view';
import { EmptyPlan } from '@/modules/main-pannel/empty-plan.view';
import { DirectionView } from '@/modules/main-pannel/direction.view';
import { DocDiffView } from '@/modules/main-pannel/doc-diff.view';
import { EmptyDirection } from '@/modules/main-pannel/empty-direction.view';

export const MainPanel = () => {
  const { selectedView } = useMagent();

  if (selectedView.kind === 'empty-plan') return <EmptyPlan />;
  if (selectedView.kind === 'plan') return <PlanView />;
  if (selectedView.kind === 'file') return <FileDiffView path={selectedView.path} />;
  if (selectedView.kind === 'empty-direction') return <EmptyDirection />;
  if (selectedView.kind === 'direction') return <DirectionView />;
  if (selectedView.kind === 'direction-doc') return <DocDiffView which="direction" />;
  if (selectedView.kind === 'conventions-doc') return <DocDiffView which="conventions" />;
  return null;
};
