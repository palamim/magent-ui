'use client';

import { ThinkingDots } from '@/components/thinking-dots';
import { useMagent } from '@/providers/magent.provider';

export const PlanView = () => {
  const { plan, discardPlan, execute, execution, executing, error, acting } = useMagent();

  if (!plan) return null;

  return (
    <div className="p-8" style={{ maxWidth: 760 }}>
      <p
        className="uppercase tracking-wide"
        style={{ color: 'var(--foreground-faint)', fontSize: 11, fontWeight: 600 }}
      >
        {plan.type}
      </p>
      <h2 className="mt-1" style={{ fontSize: 18, fontWeight: 600 }}>
        {plan.description}
      </h2>

      <pre
        className="mt-5 whitespace-pre-wrap"
        style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.6 }}
      >
        {plan.instructions}
      </pre>

      {plan.targetFiles.length > 0 && (
        <p className="mt-5" style={{ color: 'var(--foreground-faint)', fontSize: 12 }}>
          Target files: {plan.targetFiles.map((f) => f.split('/').pop()).join(', ')}
        </p>
      )}

      {/* Run lives with the plan — execute this proposal */}
      {!execution && (
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
          {!executing && (
            <button
              onClick={() => discardPlan('')}
              disabled={acting}
              className="mt-6 ml-2 px-4 py-2 rounded"
              style={{
                background: 'transparent',
                border: '1px solid var(--negative-border)',
                color: 'var(--negative)',
                fontSize: 13,
              }}
            >
              Discard
            </button>
          )}
        </>
      )}

      {error && (
        <p className="mt-4" style={{ color: 'var(--negative)', fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
};
