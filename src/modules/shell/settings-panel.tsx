'use client';

import { useState } from 'react';
import { FaGear } from 'react-icons/fa6';

import { useAutoPush } from '@/hooks/use-auto-push.hook';

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
        <FaGear /> Settings
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
