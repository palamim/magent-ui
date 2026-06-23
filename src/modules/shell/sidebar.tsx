'use client';

import { useMagent } from '@/providers/magent.provider';
import { SettingsPanel } from './settings-panel';

export const Sidebar = () => {
  const { dir, selectProject, plan, files, selectedView, selectView, enterDirector, exitDirector, mode, direction } =
    useMagent();

  const projectName = dir ? dir.split('/').filter(Boolean).pop() : null;

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
          onChange={(e) => selectProject(e.target.value)}
          placeholder="Project path…"
          className="w-full bg-transparent outline-none"
          style={{ color: 'var(--foreground)', fontSize: 13 }}
        />
      </div>
      {projectName && (
        <span
          className="px-2 py-0.5 rounded shrink-0"
          style={{
            background: projectName.includes('target') ? 'var(--running)' : 'var(--surface-raised)',
            color: projectName.includes('target') ? 'var(--background)' : 'var(--foreground-muted)',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {projectName}
        </span>
      )}

      {/* mode selector */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <div
          className="flex p-1 rounded-lg border transition-all"
          style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
        >
          <button
            onClick={exitDirector}
            className="flex-1 text-center py-1.5 rounded-md font-medium transition-all cursor-pointer"
            style={{
              background: mode === 'build' ? 'var(--surface-raised)' : 'transparent',
              color: mode === 'build' ? 'var(--foreground)' : 'var(--foreground-muted)',
              border: mode === 'build' ? '1px solid var(--border)' : '1px solid transparent',
              boxShadow: mode === 'build' ? '0 2px 4px rgba(0,0,0,0.4)' : 'none',
              fontSize: 12,
            }}
          >
            Build
          </button>
          <button
            onClick={enterDirector}
            className="flex-1 text-center py-1.5 rounded-md font-medium transition-all cursor-pointer"
            style={{
              background: mode === 'direct' ? 'var(--surface-raised)' : 'transparent',
              color: mode === 'direct' ? 'var(--foreground)' : 'var(--foreground-muted)',
              border: mode === 'direct' ? '1px solid var(--border)' : '1px solid transparent',
              boxShadow: mode === 'direct' ? '0 2px 4px rgba(0,0,0,0.4)' : 'none',
              fontSize: 12,
            }}
          >
            Direct
          </button>
        </div>
      </div>

      {mode === 'direct' && (
        <nav className="flex-1 overflow-auto py-3">
          {!direction ? (
            <p className="px-4" style={{ color: 'var(--foreground-faint)', fontSize: 13 }}>
              No active Director thread
            </p>
          ) : (
            <>
              <SidebarSection label="Direction" />
              <SidebarItem
                label="Rationale"
                active={selectedView.kind === 'direction'}
                onClick={() => selectView({ kind: 'direction' })}
              />
              {direction.docs.map((doc) => (
                <SidebarItem
                  key={doc.name}
                  label={doc.name}
                  active={selectedView.kind === 'doc' && selectedView.name === doc.name}
                  onClick={() => selectView({ kind: 'doc', name: doc.name })}
                />
              ))}
            </>
          )}
        </nav>
      )}

      {/* current thread */}

      {mode === 'build' && (
        <nav className="flex-1 overflow-auto py-3">
          {!plan ? (
            <p className="px-4" style={{ color: 'var(--foreground-faint)', fontSize: 13 }}>
              No active Planner thread
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
      )}
      <SettingsPanel />
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
