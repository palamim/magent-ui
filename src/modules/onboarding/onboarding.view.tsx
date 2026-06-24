// modules/onboarding/onboarding-screen.tsx
'use client';

import { ExternalLink } from '@/components/external-link';
import { SocialLinks } from '@/components/social-links';

type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

interface OnboardingScreenProps {
  status: ConnectionStatus;
  onRetry: () => void;
}

export const OnboardingView = ({ status, onRetry }: OnboardingScreenProps) => {
  const checking = status === 'checking';

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-6"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="text-center" style={{ maxWidth: 480 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Magent</h1>
        <p className="mt-2" style={{ color: 'var(--foreground-muted)', fontSize: 14, lineHeight: 1.6 }}>
          Set the direction. Magent plans and builds toward it.
        </p>
      </div>

      <div
        className="w-full rounded-lg border px-6 py-5"
        style={{ maxWidth: 480, background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground-muted)' }}>
          To use Magent, run the brain locally:
        </p>
        <ol className="mt-3 space-y-2" style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.6 }}>
          <li>
            1. Clone the brain repo and add your Anthropic API key:{' '}
            <ExternalLink href="https://github.com/palamim/magent">github.com/palamim/magent</ExternalLink>
          </li>
          <li>
            2. Run <code style={{ color: 'var(--foreground)' }}>npm run server</code> — it serves on port 7842.
          </li>
          <li>3. Your browser may ask to allow access to your local network — click Allow.</li>
          <li>4. Hit Retry below.</li>
        </ol>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={onRetry}
            disabled={checking}
            className="px-4 py-2 rounded transition-colors"
            style={{
              background: checking ? 'var(--surface-raised)' : 'var(--accent)',
              color: checking ? 'var(--foreground-faint)' : 'var(--background)',
              fontSize: 13,
              cursor: checking ? 'default' : 'pointer',
            }}
          >
            {checking ? 'Connecting…' : 'Retry connection'}
          </button>
          <StatusDot status={status} />
        </div>
      </div>

      <p
        style={{ color: 'var(--foreground-faint)', fontSize: 12, lineHeight: 1.6, maxWidth: 480 }}
        className="text-center"
      >
        The brain runs entirely on your machine. Your code never leaves your computer. Magent works on a branch and only
        merges to main when you approve.
      </p>

      <SocialLinks />
    </div>
  );
};

const StatusDot = ({ status }: { status: ConnectionStatus }) => {
  const color =
    status === 'connected' ? 'var(--positive)' : status === 'checking' ? 'var(--running)' : 'var(--negative)';
  const label = status === 'connected' ? 'Connected' : status === 'checking' ? 'Checking…' : 'Disconnected';
  return (
    <span className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--foreground-faint)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
};
