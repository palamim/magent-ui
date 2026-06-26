'use client';

import { useMagent } from '@/providers/magent.provider';

export const DirectionNudge = () => {
  const { dir, hasRealDirection, enterDirector, mode } = useMagent();

  if (!dir || hasRealDirection || mode === 'direct') return null;

  return (
    <button
      onClick={enterDirector}
      className="mx-3 mt-2 mb-1 text-left rounded-lg border px-3 py-2.5 transition-colors"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p style={{ fontSize: 11, color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
        Running with a starter direction. Set a real one with the{' '}
        <strong style={{ color: 'var(--foreground)' }}>Director</strong> for sharper plans.
      </p>
      <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 600 }}>Set a direction →</span>
    </button>
  );
};
