'use client';

import { ThinkingDots } from '@/components/thinking-dots';
import { useMagent } from '@/providers/magent.provider';

export const EmptyDirection = () => {
  const { dir, directing, error, direct } = useMagent();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p style={{ color: 'var(--foreground-muted)' }}>Let&apos;s talk direction</p>
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
        {directing ? (
          <>
            Thinking
            <ThinkingDots />
          </>
        ) : (
          'Propose next direction'
        )}
      </button>
      {!dir && (
        <p style={{ color: 'var(--foreground-faint)', fontSize: 12 }}>Set a project path in the sidebar first</p>
      )}
      {error && <p style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</p>}
    </div>
  );
};
