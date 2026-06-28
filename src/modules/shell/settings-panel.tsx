'use client';

import { useState, useEffect } from 'react';
import { FaGear } from 'react-icons/fa6';

import { useMagent } from '@/providers/magent.provider';
import { apiListBranches } from '@/core/api/config.api';

export const SettingsPanel = () => {
  const [open, setOpen] = useState(false);
  const { config, updateConfig, plan, dir } = useMagent();
  const [branches, setBranches] = useState<string[]>([]);

  // load available branches when the panel opens (and there's a project)
  useEffect(() => {
    if (!open || !dir) return;
    apiListBranches(dir)
      .then((r) => setBranches(r.branches))
      .catch(() => setBranches([]));
  }, [open, dir]);

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
        <div className="px-4 pb-3 flex flex-col gap-4">
          {/* base branch */}
          <div>
            <span style={{ color: 'var(--foreground)', fontSize: 13 }}>Base branch</span>
            <select
              value={config?.baseBranch ?? ''}
              disabled={!!plan}
              onChange={(e) => updateConfig({ baseBranch: e.target.value })}
              className="mt-1 w-full px-2 py-1.5 rounded"
              style={{
                background: 'var(--surface-raised)',
                color: plan ? 'var(--foreground-faint)' : 'var(--foreground)',
                border: '1px solid var(--border)',
                fontSize: 13,
                cursor: plan ? 'not-allowed' : 'pointer',
              }}
            >
              {/* ensure the current value is present even if branches haven't loaded */}
              {config?.baseBranch && !branches.includes(config.baseBranch) && (
                <option value={config.baseBranch}>{config.baseBranch}</option>
              )}
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <p className="mt-1" style={{ color: 'var(--foreground-faint)', fontSize: 11, lineHeight: 1.5 }}>
              {plan
                ? 'Finish or abandon the current feature to change the base branch.'
                : `Magent branches off ${config?.baseBranch ?? 'this branch'} and merges back into it.`}
            </p>
          </div>

          {/* auto-push */}
          <div>
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span style={{ color: 'var(--foreground)', fontSize: 13 }}>Auto-push to remote</span>
              <button
                onClick={() => updateConfig({ autoPush: !config?.autoPush })}
                className="relative rounded-full transition-colors"
                style={{
                  width: 36,
                  height: 20,
                  background: config?.autoPush ? 'var(--positive)' : 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                }}
              >
                <span
                  className="absolute rounded-full transition-all"
                  style={{
                    width: 14,
                    height: 14,
                    top: 2,
                    left: config?.autoPush ? 19 : 3,
                    background: 'var(--foreground)',
                  }}
                />
              </button>
            </label>
            <p className="mt-2" style={{ color: 'var(--foreground-faint)', fontSize: 11, lineHeight: 1.5 }}>
              {config?.autoPush
                ? `Approving merges to ${config?.baseBranch ?? 'your base branch'} and pushes to your remote.`
                : `Approving merges to ${config?.baseBranch ?? 'your base branch'} locally. Your remote is never touched.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
