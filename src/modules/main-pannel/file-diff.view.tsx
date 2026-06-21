'use client';

import { useMagent } from '@/providers/magent.provider';

export const FileDiffView = ({ path }: { path: string }) => {
  const { files } = useMagent();
  const file = files.find((f) => f.path === path);

  if (!file) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 h-10 flex items-center border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <span style={{ color: 'var(--foreground-muted)', fontSize: 13 }}>{file.path}</span>
        <span
          className="ml-3 uppercase tracking-wide"
          style={{
            color: file.status === 'created' ? 'var(--positive)' : 'var(--foreground-faint)',
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {file.status}
        </span>
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
        {renderDiffLines(file.hunks)}
      </pre>
    </div>
  );
};

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
