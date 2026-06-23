'use client';

import { SelectedView, useMagent } from '@/providers/magent.provider';
import { PlanView } from '@/modules/main-pannel/plan.view';
import { FileDiffView } from '@/modules/main-pannel/file-diff.view';
import { EmptyPlan } from '@/modules/main-pannel/empty-plan.view';
import { DirectionView } from '@/modules/main-pannel/direction.view';
import { DocDiffView } from '@/modules/main-pannel/doc-diff.view';
import { EmptyDirection } from '@/modules/main-pannel/empty-direction.view';
import { ChatBar } from '@/modules/main-pannel/chat-bar';

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
