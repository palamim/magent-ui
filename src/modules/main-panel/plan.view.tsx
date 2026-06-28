'use client';

import { useState } from 'react';

import { useMagent } from '@/providers/magent.provider';
import { ConfirmModal } from '@/components/confirm-modal';
import type { Task } from '@/model/plan.model';

export const PlanView = () => {
  const [busy, setBusy] = useState<'finish' | 'abandon' | null>(null);
  const { plan, task, replanning, selectView, finishPlan, abandonPlan, acting, config } = useMagent();
  const [confirming, setConfirming] = useState<'finish' | 'abandon' | null>(null);

  if (!plan) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: 'var(--foreground-faint)', fontSize: 13 }}
      >
        No active plan.
      </div>
    );
  }

  const done = plan.tasks.filter((t) => t.status === 'done').length;
  const total = plan.tasks.length;
  const allDone = done === total;

  // actions
  const doFinish = async () => {
    setBusy('finish');
    await finishPlan();
    setBusy(null);
  };
  const doAbandon = async () => {
    setBusy('abandon');
    await abandonPlan();
    setBusy(null);
  };

  return (
    <div className="h-full overflow-auto px-8 py-6" style={{ position: 'relative' }}>
      {replanning && <ReplanningOverlay />}

      <div style={{ opacity: replanning ? 0.4 : 1, transition: 'opacity 0.2s' }}>
        {/* header */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--foreground-faint)' }}>
          CURRENT FEATURE
        </div>
        <h2 className="mt-1" style={{ fontSize: 18, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.3 }}>
          {plan.goal}
        </h2>
        <p className="mt-2" style={{ fontSize: 12, color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
          {plan.frontier}
        </p>

        {/* dependencies */}
        {plan.dependencies?.length > 0 && (
          <div
            className="mt-4 rounded px-3 py-2"
            style={{ background: 'var(--running-bg)', border: '1px solid var(--running)' }}
          >
            <p style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
              <strong style={{ color: 'var(--foreground)' }}>Installs:</strong> {plan.dependencies.join(', ')}
              <span style={{ color: 'var(--foreground-faint)' }}> — added automatically when you run this plan.</span>
            </p>
          </div>
        )}

        {/* task list */}
        <div className="mt-6 flex flex-col gap-1">
          {plan.tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              isNext={task?.id === t.id}
              onRun={task?.id === t.id ? () => selectView({ kind: 'task' }) : undefined}
            />
          ))}
        </div>

        {/* plan-level actions */}
        <div className="mt-8 flex items-center gap-3 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setConfirming('finish')}
            disabled={acting || replanning}
            className="px-4 py-2 rounded transition-colors"
            style={{
              background: allDone ? 'var(--positive)' : 'var(--surface-raised)',
              color: allDone ? 'var(--background)' : 'var(--foreground)',
              border: allDone ? 'none' : '1px solid var(--border)',
              fontSize: 13,
              fontWeight: 500,
              cursor: acting ? 'default' : 'pointer',
            }}
            title={allDone ? 'Merge this feature to main' : 'Merge now, even though tasks remain'}
          >
            {busy === 'finish' ? 'Merging…' : allDone ? 'Finish & merge' : 'Merge now'}
          </button>

          {!allDone && (
            <span style={{ fontSize: 11, color: 'var(--foreground-faint)' }}>
              {done}/{total}
              {` `} done — merging now ships what&apos;s complete.
            </span>
          )}

          <button
            onClick={() => setConfirming('abandon')}
            disabled={acting || replanning}
            className="ml-auto px-4 py-2 rounded transition-colors"
            style={{
              background: 'transparent',
              border: '1px solid var(--negative-border)',
              color: 'var(--negative)',
              fontSize: 13,
              cursor: acting ? 'default' : 'pointer',
            }}
            title="Throw away this whole feature branch"
          >
            {busy === 'abandon' ? 'Abandoning…' : 'Abandon'}
          </button>
        </div>
      </div>

      {/* confirms */}
      {confirming === 'finish' && (
        <ConfirmModal
          title={allDone ? 'Merge this feature into main?' : 'Merge now, with tasks remaining?'}
          body={
            `This merges the ${plan.type}/${plan.slug} branch into main` +
            (config?.autoPush ? ' and pushes to remote.' : '.') +
            (allDone
              ? ''
              : ` ${total - done} task${total - done > 1 ? 's' : ''} still pending — only completed work ships.`)
          }
          confirmLabel={allDone ? 'Merge' : 'Merge now'}
          confirmColor="var(--positive)"
          onConfirm={() => {
            setConfirming(null);
            doFinish();
          }}
          onCancel={() => setConfirming(null)}
        />
      )}
      {confirming === 'abandon' && (
        <ConfirmModal
          title="Throw away this feature?"
          body={`This deletes the ${plan.type}/${plan.slug} branch and all its commits. This cannot be undone.`}
          confirmLabel="Throw away"
          confirmColor="var(--negative)"
          onConfirm={() => {
            setConfirming(null);
            doAbandon();
          }}
          onCancel={() => setConfirming(null)}
        />
      )}
    </div>
  );
};

const ReplanningOverlay = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: 'var(--surface-raised)', border: '1px solid var(--running)' }}
    >
      <span
        className="inline-block rounded-full animate-ping"
        style={{ width: 8, height: 8, background: 'var(--running)' }}
      />
      <span style={{ fontSize: 12, color: 'var(--foreground)' }}>Updating the plan…</span>
    </div>
  </div>
);

const TaskRow = ({ task, isNext, onRun }: { task: Task; isNext?: boolean; onRun?: () => void }) => {
  const done = task.status === 'done';
  const icon = done ? '✓' : isNext ? '→' : '○';
  const iconColor = done ? 'var(--positive)' : isNext ? 'var(--magent-bright)' : 'var(--foreground-faint)';

  return (
    <div
      onClick={onRun}
      className="flex items-start gap-3 px-3 py-2.5 rounded transition-colors"
      style={{
        background: isNext ? 'var(--magent-muted)' : 'transparent',
        border: isNext ? '1px solid var(--magent-border)' : '1px solid transparent',
        cursor: onRun ? 'pointer' : 'default',
      }}
    >
      <span style={{ color: iconColor, fontSize: 14, lineHeight: 1.4, width: 16 }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 13, color: done ? 'var(--foreground-muted)' : 'var(--foreground)', fontWeight: 500 }}>
          {task.slug} {isNext && <span style={{ color: 'var(--magent-bright)', fontSize: 11 }}>· next</span>}
        </div>
        <div className="mt-0.5" style={{ fontSize: 12, color: 'var(--foreground-muted)', lineHeight: 1.45 }}>
          {task.description}
        </div>
      </div>
    </div>
  );
};
