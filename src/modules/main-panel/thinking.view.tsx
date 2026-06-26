'use client';

import { useState, useEffect } from 'react';

type ThinkingKind = 'director' | 'planner' | 'executor';

const PHRASES: Record<ThinkingKind, string[]> = {
  director: [
    'Reading your project…',
    'Understanding the current state…',
    'Weighing what matters most…',
    'Shaping the direction…',
  ],
  planner: [
    'Reading the direction…',
    'Looking at the codebase…',
    'Breaking the work into steps…',
    'Sequencing the tasks…',
  ],
  executor: ['Reading the relevant files…', 'Writing the changes…', 'Checking the work…'],
};

const LABELS: Record<ThinkingKind, string> = {
  director: 'Setting direction',
  planner: 'Planning the next step',
  executor: 'Building',
};

const TIMES: Record<ThinkingKind, string> = {
  director: 'Director usually takes 2–3 minutes',
  planner: 'Planner usually takes under a minute',
  executor: 'Executor usually takes under a minute',
};

interface ThinkingViewProps {
  kind: ThinkingKind;
}

export const ThinkingView = ({ kind }: ThinkingViewProps) => {
  const phrases = PHRASES[kind];
  const label = LABELS[kind];
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8">
      {/* the pulse */}
      <div className="relative" style={{ width: 48, height: 48 }}>
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: 'var(--accent)', opacity: 0.25 }}
        />
        <span className="absolute inset-0 rounded-full" style={{ background: 'var(--accent)', opacity: 0.9 }} />
      </div>

      <div className="text-center">
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{label}</p>
        <p
          key={phraseIdx}
          className="mt-2 thinking-phrase"
          style={{ fontSize: 13, color: 'var(--foreground-muted)', minHeight: 20 }}
        >
          {phrases[phraseIdx]}
        </p>
      </div>

      <div className="text-center">
        <p className="mt-2" style={{ fontSize: 11, color: 'var(--foreground-faint)' }}>
          {TIMES[kind]}
        </p>
      </div>

      <style>{`
        .thinking-phrase { animation: fadePhrase 2.8s ease-in-out; }
        @keyframes fadePhrase {
          0% { opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
