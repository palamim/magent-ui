'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchProposal } from '@/core/api/proposal.api';
import { executePlan, approveExecution, discardExecution } from '@/core/api/execution.api';
import type { Plan } from '@/model/plan.model';
import type { ExecutionResult } from '@/model/execution.model';
import { FileDiff, parseDiff } from '@/lib/parse-diff';
import { loadStoredDir, storeDir } from '@/lib/project-storage';

// what the main panel is currently showing
type SelectedView = { kind: 'none' } | { kind: 'plan' } | { kind: 'file'; path: string };

interface MagentState {
  dir: string;
  plan: Plan | null;
  execution: ExecutionResult | null;
  selectedView: SelectedView;
  files: FileDiff[];
  proposing: boolean;
  executing: boolean;
  acting: boolean;
  error: string | null;
}

interface MagentActions {
  selectProject: (dir: string) => void;
  selectView: (view: SelectedView) => void;
  propose: () => Promise<void>;
  execute: () => Promise<void>;
  approve: () => Promise<void>;
  discard: () => Promise<void>;
}

type MagentContextValue = MagentState & MagentActions;

const MagentContext = createContext<MagentContextValue | null>(null);

export const MagentProvider = ({ children }: { children: ReactNode }) => {
  const [dir, setDirState] = useState('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [selectedView, setSelectedView] = useState<SelectedView>({ kind: 'none' });
  const [files, setFiles] = useState<FileDiff[]>([]);

  const [proposing, setProposing] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadStoredDir();
    // eslint-disable-next-line -- reading persisted dir from localStorage after mount is a valid external-sync
    if (stored) setDirState(stored);
  }, []);

  const selectProject = (path: string) => {
    setDirState(path);
    storeDir(path);
  };

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
      const parsed = parseDiff(result.diff);
      setFiles(parsed);
      // auto-select the first file so the main panel shows something
      if (parsed.length > 0) {
        setSelectedView({ kind: 'file', path: parsed[0].path });
      }
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
    setFiles([]);
  };

  const selectView = (view: SelectedView) => setSelectedView(view);

  const value: MagentContextValue = {
    dir,
    plan,
    execution,
    selectedView,
    files,
    proposing,
    executing,
    acting,
    error,
    selectProject,
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
