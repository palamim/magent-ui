'use client';
import { useState } from 'react';

interface ChatBoxProps {
  placeholder: string;
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const ChatBox = ({ placeholder, onSubmit, disabled, loading }: ChatBoxProps & { loading?: boolean }) => {
  const [text, setText] = useState('');
  const submit = () => {
    if (!text.trim() || disabled) return;
    onSubmit(text.trim());
    setText('');
  };

  return (
    <div className="border-t px-16 py-3 shrink-0" style={{ borderColor: 'var(--border)' }}>
      <div
        className="rounded-lg border px-3 py-2 transition-colors"
        style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={loading ? 'Thinking…' : placeholder}
          disabled={loading}
          rows={6}
          className="w-full bg-transparent outline-none resize-none"
          style={{ color: 'var(--foreground)', fontSize: 13, lineHeight: 1.5 }}
        />
      </div>
    </div>
  );
};
