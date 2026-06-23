export const ThinkingDots = () => (
  <span className="thinking-dots">
    <span>.</span>
    <span>.</span>
    <span>.</span>
    <style>{`
      .thinking-dots span { animation: blink 1.4s infinite both; }
      .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
      .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes blink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
    `}</style>
  </span>
);
