'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { fetchProposal } from '@/core/api/proposal.api';
import { executePlan, approveExecution, discardExecution } from '@/core/api/execution.api';
import type { Plan } from '@/model/plan.model';
import type { ExecutionResult } from '@/model/execution.model';

// what the main panel is currently showing
type SelectedView = { kind: 'none' } | { kind: 'plan' } | { kind: 'file'; path: string };

interface MagentState {
  dir: string;
  plan: Plan | null;
  execution: ExecutionResult | null;
  selectedView: SelectedView;
  proposing: boolean;
  executing: boolean;
  acting: boolean;
  error: string | null;
}

interface MagentActions {
  setDir: (dir: string) => void;
  selectView: (view: SelectedView) => void;
  propose: () => Promise<void>;
  execute: () => Promise<void>;
  approve: () => Promise<void>;
  discard: () => Promise<void>;
}

type MagentContextValue = MagentState & MagentActions;

const MagentContext = createContext<MagentContextValue | null>(null);

export const MagentProvider = ({ children }: { children: ReactNode }) => {
  const [dir, setDir] = useState('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [selectedView, setSelectedView] = useState<SelectedView>({ kind: 'none' });

  const [proposing, setProposing] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const propose = async () => {
    setProposing(true);
    setError(null);
    setPlan(null);
    setExecution(null);
    try {
      const { plan } = await fetchProposal(dir);
      setPlan(plan);
      setSelectedView({ kind: 'plan' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Proposal failed');
    } finally {
      setProposing(false);
    }
  };

  const execute = async () => {
    if (!plan) return;
    setExecuting(true);
    setError(null);
    try {
      const result = await executePlan(dir, plan);
      setExecution(result);
      // auto-select first changed file, or fall back to plan
      // (file list parsing comes when we wire the sidebar nav)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const approve = async () => {
    if (!plan || !execution) return;
    setActing(true);
    setError(null);
    try {
      await approveExecution(dir, execution.branch, plan);
      resetThread();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approve failed');
    } finally {
      setActing(false);
    }
  };

  const discard = async () => {
    if (!plan || !execution) return;
    setActing(true);
    setError(null);
    try {
      await discardExecution(dir, execution.branch, plan);
      resetThread();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discard failed');
    } finally {
      setActing(false);
    }
  };

  const resetThread = () => {
    setPlan(null);
    setExecution(null);
    setSelectedView({ kind: 'none' });
  };

  const selectView = (view: SelectedView) => setSelectedView(view);

  const value: MagentContextValue = {
    dir,
    plan,
    execution,
    selectedView,
    proposing,
    executing,
    acting,
    error,
    setDir,
    selectView,
    propose,
    execute,
    approve,
    discard,
  };

  return <MagentContext.Provider value={value}>{children}</MagentContext.Provider>;
};

export const useMagent = () => {
  const ctx = useContext(MagentContext);
  if (!ctx) throw new Error('useMagent must be used within MagentProvider');
  return ctx;
};
