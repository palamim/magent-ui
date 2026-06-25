import { useMagent } from '@/providers/magent.provider';

export const FeatureCompleteView = () => {
  const { featureComplete, proposePlan, planning } = useMagent();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 44, height: 44, background: 'var(--positive-bg)' }}
      >
        <span style={{ color: 'var(--positive)', fontSize: 22 }}>✓</span>
      </div>
      <div>
        <p style={{ color: 'var(--foreground)', fontSize: 15, fontWeight: 600 }}>Feature complete</p>
        {featureComplete && (
          <p
            className="mt-1"
            style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.5, maxWidth: 360 }}
          >
            {featureComplete}
          </p>
        )}
      </div>
      <p style={{ color: 'var(--foreground-faint)', fontSize: 12, lineHeight: 1.5, maxWidth: 360 }}>
        Propose again to start the next feature, or run the Director to set a new direction.
      </p>
      <button
        onClick={proposePlan}
        disabled={planning}
        className="mt-2 px-4 py-2 rounded transition-colors"
        style={{
          background: planning ? 'var(--surface-raised)' : 'var(--accent)',
          color: planning ? 'var(--foreground-faint)' : 'var(--background)',
          fontSize: 13,
          cursor: planning ? 'default' : 'pointer',
        }}
      >
        {planning ? 'Thinking…' : 'Propose next feature'}
      </button>
    </div>
  );
};
