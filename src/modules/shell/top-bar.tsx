export function TopBar() {
  return (
    <header
      className="flex items-center justify-end gap-2 h-12 px-4 border-b shrink-0"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* inspect dropdown + approve + discard appear here after execution */}
      <span style={{ color: 'var(--foreground-faint)', fontSize: 13 }}>—</span>
    </header>
  );
}
