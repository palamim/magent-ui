'use client';

interface DiffViewProps {
  label: string;
  status?: string;
  diff: string;
}

export const DiffView = ({ label, status, diff }: DiffViewProps) => (
  <div className="h-full flex flex-col">
    <div className="px-6 h-10 flex items-center border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
      <span style={{ color: 'var(--foreground-muted)', fontSize: 13 }}>{label}</span>
      {status && (
        <span
          className="ml-3 uppercase tracking-wide"
          style={{
            color: status === 'created' ? 'var(--positive)' : 'var(--foreground-faint)',
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {status}
        </span>
      )}
    </div>
    <pre
      className="flex-1 overflow-auto p-6 m-0"
      style={{
        background: 'var(--code-bg)',
        fontSize: 13,
        lineHeight: 1.5,
        fontFamily: 'var(--font-geist-mono), monospace',
      }}
    >
      {renderDiffLines(diff)}
    </pre>
  </div>
);

const renderDiffLines = (diff: string) =>
  diff.split('\n').map((line, i) => {
    const color =
      line.startsWith('+') && !line.startsWith('+++')
        ? 'var(--diff-add-text)'
        : line.startsWith('-') && !line.startsWith('---')
          ? 'var(--diff-remove-text)'
          : line.startsWith('@@')
            ? 'var(--diff-hunk)'
            : 'var(--diff-context)';
    return (
      <div key={i} style={{ color, whiteSpace: 'pre' }}>
        {line || ' '}
      </div>
    );
  });
