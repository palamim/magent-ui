'use client';

import { useMagent } from '@/providers/magent.provider';

export const EmptyDirection = () => {
  const { dir, directing, error, direct } = useMagent();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p style={{ color: 'var(--foreground-muted)' }}>Let&apos;s think of the next frontier!</p>
      <button
        onClick={direct}
        disabled={directing || !dir}
        className="px-4 py-2 rounded transition-colors"
        style={{
          background: directing || !dir ? 'var(--surface-raised)' : 'var(--accent)',
          color: directing || !dir ? 'var(--foreground-faint)' : 'var(--background)',
          fontSize: 13,
          cursor: directing || !dir ? 'default' : 'pointer',
        }}
      >
        {directing ? 'Thinking…' : 'Propose next frontier'}
      </button>
      {!dir && (
        <p style={{ color: 'var(--foreground-faint)', fontSize: 12 }}>Set a project path in the sidebar first</p>
      )}
      {error && <p style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</p>}
    </div>
  );
};
