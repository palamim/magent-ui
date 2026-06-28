'use client';

import { useState } from 'react';
import { FaFolder, FaFolderOpen } from 'react-icons/fa6';

import { useMagent } from '@/providers/magent.provider';
import { SettingsPanel } from './settings-panel';
import { SocialLinks } from '@/components/social-links';
import { FolderPicker } from '@/modules/shell/folder-picker';
import { DirectionNudge } from './direction-nudge';

export const Sidebar = () => {
  const {
    dir,
    selectProject,
    task,
    files,
    selectedView,
    selectView,
    enterDirector,
    exitDirector,
    mode,
    direction,
    plan,
  } = useMagent();
  const [picking, setPicking] = useState(false);

  const modified = files.filter((f) => f.status === 'modified');
  const created = files.filter((f) => f.status === 'created');

  return (
    <aside
      className="flex flex-col w-[260px] shrink-0 border-r"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* project selector */}
      <div className="px-3 py-3 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        {!dir ? (
          <button
            onClick={() => setPicking(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded transition-colors"
            style={{
              background: 'var(--accent)',
              color: 'var(--background)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <FaFolderOpen size={14} />
            Choose a project folder
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <FaFolder size={14} style={{ color: 'var(--foreground-muted)', flexShrink: 0 }} />
            <span className="flex-1 truncate" style={{ color: 'var(--foreground)', fontSize: 13, fontWeight: 500 }}>
              {dir.split('/').filter(Boolean).pop()}
            </span>
            <button
              onClick={() => setPicking(true)}
              className="shrink-0 px-2 py-1 rounded transition-colors"
              style={{ color: 'var(--foreground-muted)', fontSize: 11, background: 'var(--surface-raised)' }}
              title="Change project folder"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {picking && <FolderPicker onSelect={(path) => selectProject(path)} onClose={() => setPicking(false)} />}

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

      <DirectionNudge />

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
        <>
          <nav className="flex-1 overflow-auto py-3">
            {!plan ? (
              <p className="px-4" style={{ color: 'var(--foreground-faint)', fontSize: 13 }}>
                No active Planner thread
              </p>
            ) : (
              <>
                {/* the feature block — the goal IS the overview link */}
                <button
                  onClick={() => selectView({ kind: 'plan' })}
                  className="w-full text-left px-4 py-3 transition-colors"
                  style={{
                    background: selectedView.kind === 'plan' ? 'var(--accent-muted)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--foreground-faint)' }}
                  >
                    CURRENT FEATURE
                  </div>
                  <div
                    className="mt-1 line-clamp-2"
                    style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.35, fontWeight: 500 }}
                  >
                    {plan.goal}
                  </div>
                  <div className="mt-1" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
                    {plan.tasks.filter((t) => t.status === 'done').length}/{plan.tasks.length} tasks
                  </div>
                </button>
                <SidebarSection label="Tasks" />
                {plan.tasks.map((t) => {
                  const isNext = task?.id === t.id;
                  const done = t.status === 'done';
                  return (
                    <SidebarTaskItem
                      key={t.id}
                      label={`${t.id}. ${t.slug}`}
                      done={done}
                      isNext={isNext}
                      active={isNext && selectedView.kind === 'task'}
                      onClick={isNext ? () => selectView({ kind: 'task' }) : undefined} // only the next task is runnable
                    />
                  );
                })}

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
        </>
      )}
      <SettingsPanel />
      <div
        style={{
          background: 'var(--surface-raised)',
        }}
      >
        <SocialLinks />
      </div>
    </aside>
  );
};

const SidebarSection = ({ label }: { label: string }) => (
  <p
    className="w-full text-left px-4 pt-3 pb-1 uppercase tracking-wide transition-colors"
    style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--foreground-faint)' }}
  >
    {label}
  </p>
);

const SidebarItem = ({
  label,
  active,
  onClick,
  disabled = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (disabled)
    return (
      <button
        onClick={onClick}
        className="w-full text-left px-4 py-1.5 truncate transition-colors hover:bg-[var(--surface-raised)]"
        style={{
          background: 'transparent',
          color: 'var(--foreground-muted)',
          opacity: 0.6,
          fontSize: 12,
          display: 'inline',
        }}
        disabled={disabled}
      >
        {label}
      </button>
    );
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-1.5 truncate transition-colors"
      style={{
        background: active ? 'var(--accent-muted)' : 'transparent',
        color: 'var(--foreground)',
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
};

const SidebarTaskItem = ({
  label,
  done,
  isNext,
  active,
  onClick,
}: {
  label: string;
  done: boolean;
  isNext: boolean;
  active: boolean;
  onClick?: () => void;
}) => {
  const icon = done ? '✓' : isNext ? '→' : '○';
  const iconColor = done ? 'var(--positive)' : isNext ? 'var(--magent-bright)' : 'var(--foreground-faint)';
  const clickable = !!onClick;

  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      className="w-full text-left px-4 py-1.5 truncate transition-colors flex items-center gap-2"
      style={{
        background: active ? 'var(--accent-muted)' : 'transparent',
        color: done ? 'var(--foreground-muted)' : 'var(--foreground)',
        fontSize: 13,
        cursor: clickable ? 'pointer' : 'default',
        opacity: clickable || done ? 1 : 0.55,
      }}
    >
      <span style={{ color: iconColor, width: 14, fontSize: 13 }}>{icon}</span>
      <span className="truncate">{label}</span>
      {isNext && <span style={{ color: 'var(--magent-bright)', fontSize: 10, marginLeft: 'auto' }}>next</span>}
    </button>
  );
};

const fileName = (path: string) => path.split('/').pop() ?? path;
