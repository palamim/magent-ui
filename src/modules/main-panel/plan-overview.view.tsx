'use client';

import { useMagent } from '@/providers/magent.provider';
import type { Task } from '@/model/plan.model';

export const PlanOverview = () => {
  const { taskPlan, executing, execution, proposePlan, planning } = useMagent();

  if (!taskPlan) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: 'var(--foreground-faint)', fontSize: 13 }}
      >
        No active plan.
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto px-8 py-6">
      {/* header */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--foreground-faint)' }}>
        CURRENT FEATURE
      </div>
      <h2 className="mt-1" style={{ fontSize: 18, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.3 }}>
        {taskPlan.goal}
      </h2>
      <p className="mt-2" style={{ fontSize: 12, color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
        {taskPlan.frontier}
      </p>
      <div
        className="flex items-center gap-2 mt-3 px-3 py-2 rounded"
        style={{ background: 'var(--running-bg)', border: '1px solid var(--running)' }}
      >
        <span style={{ color: 'var(--running)', fontSize: 13 }}>⚠</span>
        <p style={{ fontSize: 12, color: 'var(--foreground)', lineHeight: 1.4 }}>
          Task status reflects the last plan check — it updates when you continue the feature, not live as work happens.
        </p>
      </div>

      {/* task list */}
      <div className="mt-6 flex flex-col gap-1">
        {taskPlan.tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            running={executing && execution?.branch?.includes(task.slug)} // pops when this task is executing
          />
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={proposePlan}
          disabled={planning}
          className="px-4 py-2 rounded transition-colors"
          style={{
            background: planning ? 'var(--surface-raised)' : 'var(--accent)',
            color: planning ? 'var(--foreground-faint)' : 'var(--background)',
            fontSize: 13,
            cursor: planning ? 'default' : 'pointer',
          }}
        >
          {planning ? 'Thinking…' : 'Continue this feature'}
        </button>
      </div>
    </div>
  );
};

const TaskRow = ({ task, running }: { task: Task; running?: boolean }) => {
  const done = task.status === 'done';
  const icon = done ? '✓' : running ? '→' : '○';
  const iconColor = done ? 'var(--positive)' : running ? 'var(--running)' : 'var(--foreground-faint)';

  return (
    <div
      className="flex items-start gap-3 px-3 py-2.5 rounded transition-colors"
      style={{
        background: running ? 'var(--running-bg)' : 'transparent',
        border: running ? '1px solid var(--running)' : '1px solid transparent',
      }}
    >
      <span style={{ color: iconColor, fontSize: 14, lineHeight: 1.4, width: 16 }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 13, color: done ? 'var(--foreground-muted)' : 'var(--foreground)', fontWeight: 500 }}>
          {task.slug}
        </div>
        <div className="mt-0.5" style={{ fontSize: 12, color: 'var(--foreground-muted)', lineHeight: 1.45 }}>
          {task.description}
        </div>
      </div>
    </div>
  );
};
