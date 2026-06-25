// modules/shell/current-plan-summary.tsx
'use client';
import { useMagent } from '@/providers/magent.provider';

export const CurrentPlanSummary = () => {
  const { taskPlan, selectView } = useMagent();
  if (!taskPlan) return null;

  const done = taskPlan.tasks.filter((t) => t.status === 'done').length;
  const total = taskPlan.tasks.length;

  return (
    <button
      onClick={() => selectView({ kind: 'plan-overview' })}
      className="w-full text-left px-4 py-3 border-b transition-colors"
      style={{ borderColor: 'var(--border)' }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--foreground-faint)' }}>
        CURRENT FEATURE
      </div>
      <div className="mt-1 line-clamp-2" style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.4 }}>
        {taskPlan.goal}
      </div>
      <div className="mt-1" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
        {done}/{total} tasks
      </div>
    </button>
  );
};
