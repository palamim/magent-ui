'use client';

import { SelectedView, useMagent } from '@/providers/magent.provider';
import { TaskView } from '@/modules/main-panel/task.view';
import { FileDiffView } from '@/modules/main-panel/file-diff.view';
import { EmptyPlan } from '@/modules/main-panel/empty-plan.view';
import { DirectionView } from '@/modules/main-panel/direction.view';
import { DocDiffView } from '@/modules/main-panel/doc-diff.view';
import { EmptyDirection } from '@/modules/main-panel/empty-direction.view';
import { ChatBar } from '@/modules/main-panel/chat-bar';
import { FeatureCompleteView } from '@/modules/main-panel/feature-complete.view';
import { PlanView } from '@/modules/main-panel/plan.view';
import { ThinkingView } from '@/modules/main-panel/thinking.view';

export const MainPanel = () => {
  const { selectedView, directing, planning, executing } = useMagent();

  const thinking = directing || planning || executing;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-auto min-h-0">
        {thinking ? (
          <ThinkingView kind={directing ? 'director' : planning ? 'planner' : 'executor'} />
        ) : (
          <CurrentView view={selectedView} />
        )}
      </div>
      <ChatBar />
    </div>
  );
};

const CurrentView = ({ view }: { view: SelectedView }) => {
  switch (view.kind) {
    case 'empty-plan':
      return <EmptyPlan />;
    case 'plan':
      return <PlanView />;
    case 'empty-direction':
      return <EmptyDirection />;
    case 'task':
      return <TaskView />;
    case 'direction':
      return <DirectionView />;
    case 'file':
      return <FileDiffView path={view.path} />;
    case 'doc':
      return <DocDiffView name={view.name} />;
    case 'feature-complete':
      return <FeatureCompleteView />;
    default:
      return null;
  }
};
