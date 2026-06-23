'use client';

import { useMagent } from '@/providers/magent.provider';

export const DirectionView = () => {
  const { direction, approveDirection, acting, error } = useMagent();

  if (!direction) return null;

  return (
    <div className="p-8" style={{ maxWidth: 760 }}>
      <h2 className="mt-1" style={{ fontSize: 18, fontWeight: 600 }}>
        Direction Proposal
      </h2>

      <pre
        className="mt-5 whitespace-pre-wrap"
        style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.6 }}
      >
        {direction.rationale}
      </pre>

      <button
        onClick={approveDirection}
        disabled={acting}
        className="mt-6 px-4 py-2 rounded transition-colors"
        style={{
          background: acting ? 'var(--surface-raised)' : 'var(--accent)',
          color: acting ? 'var(--foreground-faint)' : 'var(--background)',
          fontSize: 13,
          cursor: acting ? 'default' : 'pointer',
        }}
      >
        {acting ? 'Running…' : 'Approve'}
      </button>

      {error && (
        <p className="mt-4" style={{ color: 'var(--negative)', fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
};
