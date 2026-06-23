'use client';

interface DiffViewProps {
  label: string;
  status?: string;
  diff: string;
}

interface DiffLine {
  type: 'context' | 'add' | 'remove' | 'hunk';
  oldLineNum: number | null;
  newLineNum: number | null;
  content: string;
}

const parseDiffLines = (diff: string): DiffLine[] => {
  const lines = diff.split('\n');
  const result: DiffLine[] = [];
  let oldLine = 0;
  let newLine = 0;

  for (const line of lines) {
    if (line.startsWith('@@')) {
      const match = line.match(/@@ -?(\d+)(?:,\d+)? \+?(\d+)/);
      if (match) {
        oldLine = parseInt(match[1], 10);
        newLine = parseInt(match[2], 10);
      }
      result.push({ type: 'hunk', oldLineNum: null, newLineNum: null, content: line });
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      result.push({ type: 'add', oldLineNum: null, newLineNum: newLine, content: line });
      newLine++;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      result.push({ type: 'remove', oldLineNum: oldLine, newLineNum: null, content: line });
      oldLine++;
    } else {
      result.push({ type: 'context', oldLineNum: oldLine, newLineNum: newLine, content: line });
      if (oldLine > 0 || newLine > 0) {
        oldLine++;
        newLine++;
      }
    }
  }

  return result;
};

const lineNumStyle: React.CSSProperties = {
  width: '3rem',
  textAlign: 'right',
  color: 'var(--foreground-faint)',
  fontSize: 13,
  background: 'var(--code-bg)',
  padding: '0 0.5rem',
  borderRight: '1px solid var(--code-border)',
  lineHeight: 1.5,
  fontFamily: 'var(--font-geist-mono), monospace',
  userSelect: 'none',
  flexShrink: 0,
};

const renderDiffLines = (diff: string) => {
  const lines = parseDiffLines(diff);

  const oldLineNums = lines.map((l, i) => (
    <div key={i} style={lineNumStyle}>
      {l.oldLineNum !== null ? l.oldLineNum : '\u00a0'}
    </div>
  ));

  const newLineNums = lines.map((l, i) => (
    <div key={i} style={{ ...lineNumStyle, borderRight: 'none' }}>
      {l.newLineNum !== null ? l.newLineNum : '\u00a0'}
    </div>
  ));

  const contentLines = lines.map((l, i) => {
    if (l.type === 'hunk') {
      return (
        <div
          key={i}
          style={{
            background: 'var(--surface-raised)',
            color: 'var(--diff-hunk)',
            fontSize: 13,
            lineHeight: 1.5,
            fontFamily: 'var(--font-geist-mono), monospace',
            whiteSpace: 'pre',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid var(--border)',
              borderRadius: '0.25rem',
              padding: '0.375rem 0.75rem',
              margin: '0.25rem 0.5rem',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {l.content.trim()}
          </span>
        </div>
      );
    }

    const lineStyle: React.CSSProperties = {
      fontSize: 13,
      lineHeight: 1.5,
      fontFamily: 'var(--font-geist-mono), monospace',
      whiteSpace: 'pre',
      padding: '0 0.5rem',
      ...(l.type === 'add'
        ? { background: 'var(--positive-bg)', color: 'var(--diff-add-text)' }
        : l.type === 'remove'
          ? { background: 'var(--negative-bg)', color: 'var(--diff-remove-text)' }
          : { color: 'var(--diff-context)' }),
    };

    return (
      <div key={i} style={lineStyle}>
        {l.content || '\u00a0'}
      </div>
    );
  });

  return (
    <div className="flex flex-1 overflow-hidden" style={{ background: 'var(--code-bg)' }}>
      {/* Line number columns */}
      <div style={{ display: 'flex', flexShrink: 0, borderRight: '1px solid var(--code-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{oldLineNums}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{newLineNums}</div>
      </div>
      {/* Content column */}
      <div style={{ flex: 1, overflowX: 'auto' }}>{contentLines}</div>
    </div>
  );
};

export const DiffView = ({ label, status, diff }: DiffViewProps) => (
  <div className="h-full flex flex-col">
    <div
      className="px-6 h-10 flex items-center border-b shrink-0"
      style={{ borderColor: 'var(--border)', position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface)' }}
    >
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
    <div className="flex flex-1 overflow-hidden">{renderDiffLines(diff)}</div>
  </div>
);
