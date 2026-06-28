'use client';

import { VscVscode } from 'react-icons/vsc';

import { DevBadge } from '@/components/dev-badge';
import { InspectTool } from '@/model/execution.model';
import { useMagent } from '@/providers/magent.provider';
import { FaCodeBranch } from 'react-icons/fa6';
import { deriveBranchName } from '@/lib/branch';

export const TopBar = () => {
  const { execution, acting, keepExecution, discardExecution, inspectExecution, config, plan } = useMagent();

  const base = config?.baseBranch;
  const working = plan ? deriveBranchName(plan.type, plan.slug) : null;

  return (
    <header
      className="flex items-center justify-between gap-2 h-12 px-4 border-b shrink-0"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-2">
        <DevBadge />

        {/* branch indicator: base > working */}
        {base && (
          <div className="flex items-center gap-1.5" style={{ fontSize: 12 }}>
            <FaCodeBranch size={11} style={{ color: 'var(--magent)' }} />
            <span
              title="Base branch — change in Settings"
              className="rounded px-1.5 py-0.5"
              style={{ color: 'var(--foreground-muted)', background: 'var(--surface-raised)' }}
            >
              {base}
            </span>
            {working && (
              <>
                <span style={{ color: 'var(--foreground-faint)' }}>›</span>
                <span
                  title="Current working branch"
                  className="px-1.5 py-0.5"
                  style={{ color: 'var(--accent)', fontWeight: 500 }}
                >
                  {working}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      {execution ? (
        <div className="flex items-center justify-between gap-2 h-12 px-4 shrink-0">
          <button
            onClick={() => inspectExecution('vscode')}
            title="Open in VS Code"
            className="px-2 py-2 rounded flex items-center justify-center"
            style={{
              background: 'var(--surface-raised)',
              color: 'var(--foreground-muted)',
              border: '1px solid var(--border)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <VscVscode color="var(--link)" />
          </button>
          <select
            onChange={(e) => {
              if (e.target.value) {
                inspectExecution(e.target.value as InspectTool);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="px-2 py-1.5 rounded"
            style={{
              background: 'var(--surface-raised)',
              color: 'var(--foreground-muted)',
              border: '1px solid var(--border)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <option value="" disabled>
              Inspect
            </option>
            <option value="vscode">VS Code</option>
            <option value="finder">Finder</option>
            <option value="terminal">Terminal</option>
            <option value="ghostty">Ghostty</option>
          </select>
          <button
            onClick={() => discardExecution()}
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
            title="Undo this commit, stay on the branch"
          >
            Discard
          </button>
          <button
            onClick={() => keepExecution()}
            disabled={acting}
            className="px-3 py-1.5 rounded transition-colors"
            style={{
              background: acting ? 'var(--surface-raised)' : 'var(--positive)',
              color: acting ? 'var(--foreground-faint)' : 'var(--background)',
              fontSize: 13,
              fontWeight: 500,
              cursor: acting ? 'default' : 'pointer',
            }}
            title="Keep this commit on the branch"
          >
            {acting ? 'Working…' : 'Keep'}
          </button>
        </div>
      ) : (
        <span style={{ color: 'var(--foreground-faint)', fontSize: 13 }}></span>
      )}
    </header>
  );
};
