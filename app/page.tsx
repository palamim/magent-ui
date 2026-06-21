'use client';

import { useState } from 'react';
import { fetchProposal } from '@/core/api/proposal.api';
import { executePlan, approveExecution, discardExecution } from '@/core/api/execution.api';
import type { Plan } from '@/model/plan.model';
import type { ExecutionResult } from '@/model/execution.model';

export default function Home() {
  const [dir, setDir] = useState('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [proposing, setProposing] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [acting, setActing] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePropose = async () => {
    setProposing(true);
    setError(null);
    setPlan(null);
    setExecution(null);
    try {
      const { plan } = await fetchProposal(dir);
      setPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setProposing(false);
    }
  };

  const handleExecute = async () => {
    if (!plan) return;
    setExecuting(true);
    setError(null);
    setExecution(null);
    try {
      const result = await executePlan(dir, plan);
      setExecution(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const handleApprove = async () => {
    if (!plan || !execution) return;
    setActing(true);
    setError(null);
    try {
      const result = await approveExecution(dir, execution.branch, plan);
      setOutcome(result.pushed ? 'Approved, merged, and pushed.' : 'Approved and merged — push failed, push manually.');
      // loop complete — clear so you can propose the next thing
      setPlan(null);
      setExecution(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approve failed');
    } finally {
      setActing(false);
    }
  };

  const handleDiscard = async () => {
    if (!plan || !execution) return;
    setActing(true);
    setError(null);
    try {
      await discardExecution(dir, execution.branch, plan);
      setOutcome('Discarded — branch deleted.');
      setPlan(null);
      setExecution(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discard failed');
    } finally {
      setActing(false);
    }
  };

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1>Magent</h1>

      {/* project dir + propose */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <input
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          placeholder="/path/to/your/project"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handlePropose} disabled={proposing || !dir}>
          {proposing ? 'Thinking…' : 'Propose'}
        </button>
      </div>

      {error && <p style={{ color: 'crimson', marginTop: 24 }}>{error}</p>}
      {outcome && <p style={{ color: 'green', marginTop: 24 }}>{outcome}</p>}

      {/* the proposal */}
      {plan && (
        <section style={{ marginTop: 32 }}>
          <p style={{ fontWeight: 600 }}>
            {plan.type}: {plan.description}
          </p>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{plan.instructions}</pre>
          <p style={{ marginTop: 12, opacity: 0.7 }}>Target files: {plan.targetFiles?.join(', ') || '(none)'}</p>

          <button onClick={handleExecute} disabled={executing} style={{ marginTop: 16 }}>
            {executing ? 'Running…' : 'Run this'}
          </button>
        </section>
      )}

      {/* the execution result + diff */}
      {execution && (
        <section style={{ marginTop: 32 }}>
          <p style={{ fontWeight: 600 }}>
            {execution.status} — branch <code>{execution.branch}</code>
          </p>
          {execution.status === 'no-net-changes' ? (
            <p style={{ opacity: 0.7, marginTop: 12 }}>No net changes.</p>
          ) : (
            <>
              <pre
                style={{
                  marginTop: 12,
                  padding: 16,
                  background: '#1a1a1a',
                  color: '#e0e0e0',
                  overflowX: 'auto',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {renderDiff(execution.diff)}
              </pre>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button onClick={handleApprove} disabled={acting}>
                  {acting ? 'Working…' : 'Approve (merge & push)'}
                </button>
                <button onClick={handleDiscard} disabled={acting}>
                  {acting ? 'Working…' : 'Discard'}
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}

// minimal diff coloring — green for additions, red for removals, dim for context
function renderDiff(diff: string) {
  return diff.split('\n').map((line, i) => {
    const color =
      line.startsWith('+') && !line.startsWith('+++')
        ? '#4ade80'
        : line.startsWith('-') && !line.startsWith('---')
          ? '#f87171'
          : line.startsWith('@@')
            ? '#60a5fa'
            : '#888';
    return (
      <div key={i} style={{ color, whiteSpace: 'pre' }}>
        {line || ' '}
      </div>
    );
  });
}
