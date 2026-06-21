export function Sidebar() {
  return (
    <aside
      className="flex flex-col w-[260px] shrink-0 border-r"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* project selector (top) */}
      <div className="flex items-center h-12 px-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <span style={{ color: 'var(--foreground-muted)', fontSize: 13 }}>No project selected</span>
      </div>

      {/* current thread (navigation) */}
      <nav className="flex-1 overflow-auto px-2 py-3">
        {/* PLAN / EXECUTION nav goes here once wired — empty at rest */}
        <p className="px-2" style={{ color: 'var(--foreground-faint)', fontSize: 13 }}>
          No active thread
        </p>
      </nav>
    </aside>
  );
}
