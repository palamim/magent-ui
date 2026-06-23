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

const renderDiffLines = (diff: string) => {
  const lines = parseDiffLines(diff);

  const rows = lines.map((l, i) => {
    if (l.type === 'hunk') {
      return (
        <div
          key={i}
          style={{
            display: 'flex',
            background: 'var(--surface-raised)',
            fontSize: 13,
            lineHeight: 1.5,
            fontFamily: 'var(--font-geist-mono), monospace',
            minWidth: 'max-content',
          }}
        >
          <div style={{ width: '3rem', flexShrink: 0, padding: '0 0.5rem' }}>{' '}</div>
          <div style={{ width: '3rem', flexShrink: 0, padding: '0 0.5rem' }}>{' '}</div>
          <div style={{ flex: 1, padding: '0 0.5rem', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--border)',
                borderRadius: '0.25rem',
                padding: '0.375rem 0.75rem',
                margin: '0.25rem 0',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--diff-hunk)',
              }}
            >
              {l.content.trim()}
            </span>
          </div>
        </div>
      );
    }

    const rowBg =
      l.type === 'add'
        ? 'var(--positive-bg)'
        : l.type === 'remove'
          ? 'var(--negative-bg)'
          : 'transparent';

    const textColor =
      l.type === 'add'
        ? 'var(--diff-add-text)'
        : l.type === 'remove'
          ? 'var(--diff-remove-text)'
          : 'var(--diff-context)';

    const lineNumCellStyle: React.CSSProperties = {
      width: '3rem',
      textAlign: 'right',
      color: 'var(--foreground-faint)',
      fontSize: 13,
      padding: '0 0.5rem',
      flexShrink: 0,
      userSelect: 'none',
    };

    return (
      <div
        key={i}
        style={{
          display: 'flex',
          background: rowBg,
          fontSize: 13,
          lineHeight: 1.5,
          fontFamily: 'var(--font-geist-mono), monospace',
          minWidth: 'max-content',
        }}
      >
        <div style={lineNumCellStyle}>
          {l.oldLineNum !== null ? l.oldLineNum : '\u00a0'}
        </div>
        <div style={lineNumCellStyle}>
          {l.newLineNum !== null ? l.newLineNum : '\u00a0'}
        </div>
        <div style={{ flex: 1, padding: '0 0.5rem', whiteSpace: 'pre', color: textColor }}>
          {l.content || '\u00a0'}
        </div>
      </div>
    );
  });

  return (
    <div className="flex-1 overflow-hidden">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'auto',
          background: 'var(--code-bg)',
          flex: 1,
        }}
      >
        {rows}
      </div>
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
