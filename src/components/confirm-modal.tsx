'use client';

interface ConfirmModalProps {
  title: string;
  body: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ title, body, confirmLabel, confirmColor, onConfirm, onCancel }: ConfirmModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-6"
    style={{ background: 'rgba(0,0,0,0.5)' }}
    onClick={onCancel}
  >
    <div
      className="rounded-lg border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', width: 420 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-6 py-5">
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{title}</p>
        <p className="mt-2" style={{ fontSize: 13, color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
          {body}
        </p>
      </div>
      <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onCancel}
          style={{ color: 'var(--foreground-muted)', fontSize: 13, background: 'transparent' }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded"
          style={{
            background: confirmColor,
            color: 'var(--background)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);
