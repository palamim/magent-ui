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
    <div className="border-t px-8 py-3 shrink-0" style={{ borderColor: 'var(--border)' }}>
      <div
        className="relative rounded-lg border px-3 py-2"
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
          rows={4}
          className="w-full bg-transparent outline-none resize-none pr-10" /* pr-10 = room for button */
          style={{ color: 'var(--foreground)', fontSize: 13, lineHeight: 1.5 }}
        />
        {/* absolute inside the box, bottom-right */}
        <button
          onClick={submit}
          disabled={!text.trim() || loading}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-md flex items-center justify-center transition-colors"
          style={{
            background: text.trim() && !loading ? 'var(--accent)' : 'var(--surface)',
            color: text.trim() && !loading ? 'var(--background)' : 'var(--foreground-faint)',
            cursor: text.trim() && !loading ? 'pointer' : 'default',
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
};
