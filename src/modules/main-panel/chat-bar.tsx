import { ChatBox } from '@/components/chat-box';
import { useMagent } from '@/providers/magent.provider';

export const ChatBar = () => {
  const {
    mode,
    direction,
    plan,
    execution,
    directing,
    planning,
    executing,
    refineDirection,
    refinePlan,
    refineExecution,
  } = useMagent();

  if (mode === 'direct' && direction)
    return <ChatBox placeholder="Refine this direction…" onSubmit={refineDirection} loading={directing} />;
  if (mode === 'build' && plan && !execution)
    return <ChatBox placeholder="Refine this plan…" onSubmit={refinePlan} loading={planning} />;
  if (mode === 'build' && execution)
    return <ChatBox placeholder="Refine this code…" onSubmit={refineExecution} loading={executing} />;
  return null;
};
