'use client';
import { useState } from 'react';

interface ChatBoxProps {
  placeholder: string;
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const ChatBox = ({ placeholder, onSubmit, disabled }: ChatBoxProps) => {
  const [text, setText] = useState('');
  const submit = () => {
    if (!text.trim() || disabled) return;
    onSubmit(text.trim());
    setText('');
  };
  return (
    <div className="border-t px-4 py-3 shrink-0" style={{ borderColor: 'var(--border)' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        className="w-full bg-transparent outline-none resize-none"
        style={{ color: 'var(--foreground)', fontSize: 13 }}
      />
    </div>
  );
};
