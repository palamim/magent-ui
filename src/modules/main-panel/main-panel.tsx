'use client';

import { SelectedView, useMagent } from '@/providers/magent.provider';
import { PlanView } from '@/modules/main-panel/plan.view';
import { FileDiffView } from '@/modules/main-panel/file-diff.view';
import { EmptyPlan } from '@/modules/main-panel/empty-plan.view';
import { DirectionView } from '@/modules/main-panel/direction.view';
import { DocDiffView } from '@/modules/main-panel/doc-diff.view';
import { EmptyDirection } from '@/modules/main-panel/empty-direction.view';
import { ChatBar } from '@/modules/main-panel/chat-bar';

export const MainPanel = () => {
  const { selectedView } = useMagent();
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-auto min-h-0">
        <CurrentView view={selectedView} />
      </div>
      <ChatBar />
    </div>
  );
};

const CurrentView = ({ view }: { view: SelectedView }) => {
  switch (view.kind) {
    case 'empty-plan':
      return <EmptyPlan />;
    case 'empty-direction':
      return <EmptyDirection />;
    case 'plan':
      return <PlanView />;
    case 'direction':
      return <DirectionView />;
    case 'file':
      return <FileDiffView path={view.path} />;
    case 'doc':
      return <DocDiffView name={view.name} />;
    default:
      return null;
  }
};
