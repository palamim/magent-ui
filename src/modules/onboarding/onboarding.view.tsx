'use client';

import { ExternalLink } from '@/components/external-link';
import { SocialLinks } from '@/components/social-links';
import Image from 'next/image';

type ConnectionStatus = 'checking' | 'connected' | 'disconnected';
interface OnboardingScreenProps {
  status: ConnectionStatus;
  onRetry: () => void;
}

export const OnboardingView = ({ status, onRetry }: OnboardingScreenProps) => {
  const checking = status === 'checking';

  return (
    <div
      className="flex min-h-screen flex-col items-center px-6 py-16"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="w-full" style={{ maxWidth: 640 }}>
        {/* HERO — the why, first */}
        <div className="text-center">
          <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>Magent</h1>
          <p className="mt-3" style={{ fontSize: 17, color: 'var(--foreground)', lineHeight: 1.5 }}>
            Building isn&apos;t the bottleneck anymore. Direction is.
          </p>
          <p
            className="mt-2"
            style={{ fontSize: 14, color: 'var(--foreground-muted)', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}
          >
            Magent is the direction layer for AI coding. It proposes the direction your project should move toward and
            orchestrates agents that build it, while you supervise, approving, sharpening, and giving feedback the
            agents learn from.
          </p>
        </div>

        {/* THE LOOP VISUAL — the proof */}
        <div
          className="mt-8 rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <Image src="/magent-hero.gif" width={1280} height={732} alt={'Magent Loop Gif'} style={{ width: '100%' }} />
        </div>

        {/* HOW — collapsed below the pitch */}
        <div
          className="mt-8 rounded-lg border px-6 py-5"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground-muted)' }}>
            Run the brain locally to start — it stays on your machine:
          </p>
          <ol className="mt-3 space-y-2" style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.6 }}>
            <li>
              1. Clone <ExternalLink href="https://github.com/palamim/magent">github.com/palamim/magent</ExternalLink>{' '}
              and add your Anthropic API key.
            </li>
            <li>
              2. Run <code style={{ color: 'var(--foreground)' }}>npm run server</code> (serves on port 7842).
            </li>
            <li>3. Your browser will ask to allow local-network access — click Allow.</li>
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

        {/* trust */}
        <p className="mt-6 text-center" style={{ color: 'var(--foreground-faint)', fontSize: 12, lineHeight: 1.6 }}>
          The brain runs entirely on your machine. Your code never leaves your computer. Magent works on a branch and
          only merges to main when you approve. The repo is open source — read exactly what it does.
        </p>
        <div className="mt-6 flex justify-center">
          <SocialLinks />
        </div>
      </div>
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
