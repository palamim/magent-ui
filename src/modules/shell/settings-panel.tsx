'use client';

import { usePersistedBool } from '@/hooks/user-persisted-state';
import { useState } from 'react';

export const useAutoPush = () => {
  const [autoPush, setAutoPush] = usePersistedBool('magent:auto-push', false);
  return { autoPush, toggle: () => setAutoPush(!autoPush) };
};

export const SettingsPanel = () => {
  const [open, setOpen] = useState(false);
  const { autoPush, toggle } = useAutoPush();

  return (
    <div className="border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 transition-colors"
        style={{ color: 'var(--foreground-muted)', fontSize: 13 }}
      >
        <GearIcon /> Settings
      </button>

      {open && (
        <div className="px-4 pb-3">
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span style={{ color: 'var(--foreground)', fontSize: 13 }}>Auto-push to remote</span>
            <button
              onClick={toggle}
              className="relative rounded-full transition-colors"
              style={{
                width: 36,
                height: 20,
                background: autoPush ? 'var(--positive)' : 'var(--surface-raised)',
                border: '1px solid var(--border)',
              }}
            >
              <span
                className="absolute rounded-full transition-all"
                style={{
                  width: 14,
                  height: 14,
                  top: 2,
                  left: autoPush ? 19 : 3,
                  background: 'var(--foreground)',
                }}
              />
            </button>
          </label>
          <p className="mt-2" style={{ color: 'var(--foreground-faint)', fontSize: 11, lineHeight: 1.5 }}>
            {autoPush
              ? 'Approving merges to main and pushes to your remote.'
              : 'Approving merges to main locally. Your remote is never touched.'}
          </p>
        </div>
      )}
    </div>
  );
};

const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
