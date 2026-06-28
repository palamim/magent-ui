export const DevBadge = () => {
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <span
      className="px-1 py-0.5 rounded shrink-0"
      style={{
        background: 'var(--magent-muted)',
        color: 'var(--magent)',
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.05em',
      }}
    >
      DEVELOPMENT MODE
    </span>
  );
};
