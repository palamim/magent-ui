'use client';

import { ThinkingDots } from '@/components/thinking-dots';
import { useMagent } from '@/providers/magent.provider';

export const TaskView = () => {
  const { task, execute, execution, executing, error, executionStatus, replanning, deciding } = useMagent();

  if (!task) return null;

  return (
    <div className="p-8" style={{ maxWidth: 760 }}>
      <p
        className="uppercase tracking-wide"
        style={{ color: 'var(--foreground-faint)', fontSize: 11, fontWeight: 600 }}
      >
        {task.type}
      </p>
      <h2 className="mt-1" style={{ fontSize: 18, fontWeight: 600 }}>
        {task.description}
      </h2>

      <pre
        className="mt-5 whitespace-pre-wrap"
        style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.6 }}
      >
        {task.instructions}
      </pre>

      {task.targetFiles.length > 0 && (
        <p className="mt-5" style={{ color: 'var(--foreground-faint)', fontSize: 12 }}>
          Target files: {task.targetFiles.map((f) => f.split('/').pop()).join(', ')}
        </p>
      )}

      {/* Run lives with the task — execute this proposal */}
      {!deciding && !execution && !executionStatus && !replanning && (
        <>
          <button
            onClick={execute}
            disabled={executing}
            className="mt-6 px-4 py-2 rounded transition-colors"
            style={{
              background: executing ? 'var(--surface-raised)' : 'var(--accent)',
              color: executing ? 'var(--foreground-faint)' : 'var(--background)',
              fontSize: 13,
              cursor: executing ? 'default' : 'pointer',
            }}
          >
            {executing ? (
              <>
                Running
                <ThinkingDots />
              </>
            ) : (
              'Run this'
            )}
          </button>
        </>
      )}

      {executionStatus === 'no-net-changes' && (
        <div className="mt-6">
          <p style={{ color: 'var(--foreground-muted)', fontSize: 13, textAlign: 'center' }}>
            The agent ran but found nothing to change — try refining the task
          </p>
        </div>
      )}

      {executionStatus === 'gave-up' && (
        <div className="mt-6">
          <p style={{ color: 'var(--foreground-muted)', fontSize: 13, textAlign: 'center' }}>
            The agent gave up — try refining the task or check the project path.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4" style={{ color: 'var(--negative)', fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
};
