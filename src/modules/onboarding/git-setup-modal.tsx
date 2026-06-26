'use client';

import { useState } from 'react';

interface GitSetupModalProps {
  onConfirm: () => Promise<void>; // append + commit, then proceed
  onClose: () => void;
}

export const GitSetupModal = ({ onConfirm, onClose }: GitSetupModalProps) => {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setWorking(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
      setWorking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={working ? undefined : onClose}
    >
      <div
        className="rounded-lg border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', width: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>One-time setup for this project</p>
          <p className="mt-2" style={{ fontSize: 13, color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
            Magent keeps its memory in a local <code style={{ color: 'var(--foreground)' }}>.magent/</code> folder. To
            keep it out of your git, it adds one line to your{' '}
            <code style={{ color: 'var(--foreground)' }}>.gitignore</code>:
          </p>

          {/* the diff */}
          <div
            className="mt-3 rounded px-3 py-2 font-mono"
            style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', fontSize: 12 }}
          >
            <span style={{ color: 'var(--positive)' }}>+ .magent/</span>
          </div>

          <p className="mt-3" style={{ fontSize: 12, color: 'var(--foreground-faint)', lineHeight: 1.6 }}>
            This is the only change Magent makes to your git, committed on its own. Everything Magent stores stays{' '}
            <strong style={{ color: 'var(--foreground-muted)' }}>local to your machine</strong> — your code and your
            memory never leave your computer.
          </p>

          {error && (
            <p className="mt-3" style={{ color: 'var(--negative)', fontSize: 12 }}>
              {error}
            </p>
          )}
        </div>

        <div
          className="px-6 py-4 border-t flex items-center justify-end gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            onClick={onClose}
            disabled={working}
            style={{ color: 'var(--foreground-muted)', fontSize: 13, background: 'transparent' }}
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={working}
            className="px-4 py-2 rounded transition-colors"
            style={{
              background: working ? 'var(--surface-raised)' : 'var(--accent)',
              color: working ? 'var(--foreground-faint)' : 'var(--background)',
              fontSize: 13,
            }}
          >
            {working ? 'Setting up…' : 'Add line and continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
