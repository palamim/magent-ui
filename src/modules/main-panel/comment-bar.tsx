'use client';

import { useState } from 'react';

import { useMagent } from '@/providers/magent.provider';

export const CommentBar = () => {
  const { pendingComment, submitComment, dismissComment } = useMagent();
  const [text, setText] = useState('');
  if (!pendingComment) return null;

  const submit = () => {
    submitComment(text);
    setText('');
  };
  const skip = () => {
    dismissComment();
    setText('');
  };

  return (
    <div
      className="border-t px-4 py-3 flex items-center gap-2"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') skip();
        }}
        placeholder={`Any feedback for the ${pendingComment} next time? Magent learns from it (optional)`}
        autoFocus
        className="flex-1 bg-transparent outline-none"
        style={{ color: 'var(--foreground)', fontSize: 13 }}
      />
      <button
        onClick={submit}
        disabled={!text.trim()}
        className="px-3 py-1 rounded"
        style={{
          background: text.trim() ? 'var(--accent)' : 'var(--surface-raised)',
          color: text.trim() ? 'var(--background)' : 'var(--foreground-faint)',
          fontSize: 12,
        }}
      >
        Add
      </button>
      <button onClick={skip} style={{ color: 'var(--foreground-faint)', fontSize: 12, background: 'transparent' }}>
        Skip
      </button>
    </div>
  );
};
