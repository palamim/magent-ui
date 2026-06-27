'use client';

import { useMagent } from '@/providers/magent.provider';

export const DirectionNudge = () => {
  const { dir, hasRealDirection, mode } = useMagent();

  if (!dir || hasRealDirection || mode === 'direct') return null;

  return (
    <div
      className="mx-3 mt-2 mb-1 text-left rounded-lg border px-3 py-2.5 transition-colors"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p style={{ fontSize: 11, color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
        Running with a starter direction. Set one with the{' '}
        <strong style={{ color: 'var(--foreground)' }}>Director</strong> for sharper plans.
      </p>
    </div>
  );
};
