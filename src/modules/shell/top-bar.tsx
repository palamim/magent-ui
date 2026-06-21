'use client';

import { useMagent } from '@/providers/magent.provider';

export const TopBar = () => {
  const { execution, acting, approve, discard } = useMagent();

  return (
    <header
      className="flex items-center justify-end gap-2 h-12 px-4 border-b shrink-0"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {execution ? (
        <>
          <button
            onClick={discard}
            disabled={acting}
            className="px-3 py-1.5 rounded transition-colors"
            style={{
              background: 'transparent',
              border: '1px solid var(--negative-border)',
              color: 'var(--negative)',
              fontSize: 13,
              cursor: acting ? 'default' : 'pointer',
              opacity: acting ? 0.5 : 1,
            }}
          >
            Discard
          </button>
          <button
            onClick={approve}
            disabled={acting}
            className="px-3 py-1.5 rounded transition-colors"
            style={{
              background: acting ? 'var(--surface-raised)' : 'var(--positive)',
              color: acting ? 'var(--foreground-faint)' : 'var(--background)',
              fontSize: 13,
              fontWeight: 500,
              cursor: acting ? 'default' : 'pointer',
            }}
          >
            {acting ? 'Working…' : 'Approve'}
          </button>
        </>
      ) : (
        <span style={{ color: 'var(--foreground-faint)', fontSize: 13 }}>—</span>
      )}
    </header>
  );
};
