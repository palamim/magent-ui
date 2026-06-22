'use client';

import { useMagent } from '@/providers/magent.provider';

export const EmptyPlan = () => {
  const { dir, proposing, error, propose } = useMagent();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p style={{ color: 'var(--foreground-muted)' }}>Let&apos;s build something</p>
      <button
        onClick={propose}
        disabled={proposing || !dir}
        className="px-4 py-2 rounded transition-colors"
        style={{
          background: proposing || !dir ? 'var(--surface-raised)' : 'var(--accent)',
          color: proposing || !dir ? 'var(--foreground-faint)' : 'var(--background)',
          fontSize: 13,
          cursor: proposing || !dir ? 'default' : 'pointer',
        }}
      >
        {proposing ? 'Thinking…' : 'Propose next step'}
      </button>
      {!dir && (
        <p style={{ color: 'var(--foreground-faint)', fontSize: 12 }}>Set a project path in the sidebar first</p>
      )}
      {error && <p style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</p>}
    </div>
  );
};
