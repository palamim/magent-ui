'use client';

import { useMagent } from '@/providers/magent.provider';

export const Sidebar = () => {
  const { dir, setDir, plan, files, selectedView, selectView } = useMagent();

  const modified = files.filter((f) => f.status === 'modified');
  const created = files.filter((f) => f.status === 'created');

  return (
    <aside
      className="flex flex-col w-[260px] shrink-0 border-r"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* project selector */}
      <div className="flex items-center h-12 px-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <input
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          placeholder="Project path…"
          className="w-full bg-transparent outline-none"
          style={{ color: 'var(--foreground)', fontSize: 13 }}
        />
      </div>

      {/* current thread */}
      <nav className="flex-1 overflow-auto py-3">
        {!plan ? (
          <p className="px-4" style={{ color: 'var(--foreground-faint)', fontSize: 13 }}>
            No active thread
          </p>
        ) : (
          <>
            <SidebarSection label="Plan" />
            <SidebarItem
              label={plan.slug}
              active={selectedView.kind === 'plan'}
              onClick={() => selectView({ kind: 'plan' })}
            />

            {files.length > 0 && (
              <>
                {modified.length > 0 && <SidebarSection label="Modified" />}
                {modified.map((f) => (
                  <SidebarItem
                    key={f.path}
                    label={fileName(f.path)}
                    active={selectedView.kind === 'file' && selectedView.path === f.path}
                    onClick={() => selectView({ kind: 'file', path: f.path })}
                  />
                ))}

                {created.length > 0 && <SidebarSection label="Created" />}
                {created.map((f) => (
                  <SidebarItem
                    key={f.path}
                    label={fileName(f.path)}
                    active={selectedView.kind === 'file' && selectedView.path === f.path}
                    onClick={() => selectView({ kind: 'file', path: f.path })}
                  />
                ))}
              </>
            )}
          </>
        )}
      </nav>
    </aside>
  );
};

const SidebarSection = ({ label }: { label: string }) => (
  <p
    className="px-4 pt-3 pb-1 uppercase tracking-wide"
    style={{ color: 'var(--foreground-faint)', fontSize: 11, fontWeight: 600 }}
  >
    {label}
  </p>
);

const SidebarItem = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-1.5 truncate transition-colors"
    style={{
      background: active ? 'var(--accent-muted)' : 'transparent',
      color: active ? 'var(--foreground)' : 'var(--foreground-muted)',
      fontSize: 13,
    }}
  >
    {label}
  </button>
);

const fileName = (path: string) => path.split('/').pop() ?? path;
