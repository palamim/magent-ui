'use client';

import { useMagent } from '@/providers/magent.provider';

const Home = () => {
  const { plan, proposing, error, dir, propose } = useMagent();

  // once a plan exists, the main panel will render it (next slice).
  // for now, a minimal confirmation so we can verify propose works.
  if (plan) {
    return (
      <div className="p-8" style={{ maxWidth: 720 }}>
        <p style={{ color: 'var(--foreground-muted)', fontSize: 13 }}>{plan.type}</p>
        <p style={{ fontWeight: 600, marginTop: 4 }}>{plan.description}</p>
        <pre
          className="mt-4 whitespace-pre-wrap"
          style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.6 }}
        >
          {plan.instructions}
        </pre>
      </div>
    );
  }

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

export default Home;
