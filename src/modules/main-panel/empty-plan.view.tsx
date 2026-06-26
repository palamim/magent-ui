'use client';

import { ThinkingDots } from '@/components/thinking-dots';
import { useMagent } from '@/providers/magent.provider';

export const EmptyPlan = () => {
  const { dir, planning, error, proposePlan } = useMagent();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      <div style={{ maxWidth: 460 }}>
        <p style={{ color: 'var(--foreground)', fontSize: 16, fontWeight: 600 }}>Let&apos;s build something</p>
        <p className="mt-3" style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.7 }}>
          Magent works in three steps. The <strong style={{ color: 'var(--foreground)' }}>Planner</strong> proposes a
          task, the <strong style={{ color: 'var(--foreground)' }}>Executor</strong> builds it on a branch, and you
          review the diff and approve. Hit propose to see your first plan.
        </p>
      </div>

      <button
        onClick={proposePlan}
        disabled={planning || !dir}
        className="px-4 py-2 rounded transition-colors"
        style={{
          background: planning || !dir ? 'var(--surface-raised)' : 'var(--accent)',
          color: planning || !dir ? 'var(--foreground-faint)' : 'var(--background)',
          fontSize: 13,
          cursor: planning || !dir ? 'default' : 'pointer',
        }}
      >
        {planning ? (
          <>
            Thinking
            <ThinkingDots />
          </>
        ) : (
          'Propose plan'
        )}
      </button>

      {!dir && (
        <p style={{ color: 'var(--foreground-faint)', fontSize: 12 }}>Set a project path in the sidebar first</p>
      )}

      {error && <p style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</p>}
    </div>
  );
};
