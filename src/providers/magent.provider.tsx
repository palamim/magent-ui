'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchProposal } from '@/core/api/proposal.api';
import { executePlan, apiApproveExecution, apiDiscardExecution, inspectBranch } from '@/core/api/execution.api';
import { apiApproveDirection, apiDiscardDirection, fetchDirection } from '@/core/api/direction.api';
import type { Plan } from '@/model/plan.model';
import type { ExecutionResult, InspectTool } from '@/model/execution.model';
import { DirectionProposal } from '@/model/direction.model';
import { FileDiff, parseDiff } from '@/lib/parse-diff';
import { loadStoredDir, storeDir } from '@/lib/project-storage';

type Mode = 'build' | 'direct';

// what the main panel is currently showing
type SelectedView =
  | { kind: 'empty-plan' }
  | { kind: 'plan' }
  | { kind: 'file'; path: string }
  | { kind: 'empty-direction' }
  | { kind: 'direction' }
  | { kind: 'doc'; name: string };

interface MagentState {
  dir: string;
  mode: Mode;
  direction: DirectionProposal | null;
  plan: Plan | null;
  execution: ExecutionResult | null;
  selectedView: SelectedView;
  files: FileDiff[];
  directing: boolean;
  proposing: boolean;
  executing: boolean;
  acting: boolean;
  error: string | null;
}

interface MagentActions {
  enterDirector: () => void;
  exitDirector: () => void;
  selectProject: (dir: string) => void;
  selectView: (view: SelectedView) => void;
  direct: () => Promise<void>;
  propose: () => Promise<void>;
  execute: () => Promise<void>;
  inspect: (tool: InspectTool) => Promise<void>;
  approveDirection: () => Promise<void>;
  discardDirection: () => Promise<void>;
  approveExecution: () => Promise<void>;
  discardExecution: () => Promise<void>;
}

type MagentContextValue = MagentState & MagentActions;

const MagentContext = createContext<MagentContextValue | null>(null);

export const MagentProvider = ({ children }: { children: ReactNode }) => {
  const [dir, setDirState] = useState('');
  const [mode, setMode] = useState<Mode>('build');

  // Director Agent
  const [direction, setDirection] = useState<DirectionProposal | null>(null);
  const [directing, setDirecting] = useState(false);

  const [plan, setPlan] = useState<Plan | null>(null);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [selectedView, setSelectedView] = useState<SelectedView>({ kind: 'empty-plan' });
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

  const enterDirector = () => {
    resetThread();
    setMode('direct');
    setSelectedView({ kind: 'empty-direction' });
  };

  const exitDirector = () => {
    setDirection(null);
    setMode('build');
    setSelectedView({ kind: 'empty-plan' });
  };

  const direct = async () => {
    setDirecting(true);
    setError(null);
    setDirection(null);
    try {
      const result = await fetchDirection(dir);
      setDirection(result);
      setSelectedView({ kind: 'direction' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Director failed');
    } finally {
      setDirecting(false);
    }
  };

  const approveDirection = async () => {
    if (!direction) return;
    setActing(true);
    try {
      await apiApproveDirection(dir, direction.rationale, direction.direction, direction.conventions, [], '');
      exitDirector();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approve failed');
    } finally {
      setActing(false);
    }
  };

  const discardDirection = async () => {
    if (!direction) return;
    setActing(true);
    try {
      await apiDiscardDirection(dir, direction.rationale, [], '');
      setDirection(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discard failed');
    } finally {
      setActing(false);
    }
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

  const inspect = async (tool: InspectTool) => {
    if (!execution) return;
    try {
      await inspectBranch(dir, execution.branch, tool);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inspect failed');
    }
  };

  const approveExecution = async () => {
    if (!plan || !execution) return;
    setActing(true);
    setError(null);
    try {
      await apiApproveExecution(dir, execution.branch, plan);
      resetThread();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approve failed');
    } finally {
      setActing(false);
    }
  };

  const discardExecution = async () => {
    if (!plan || !execution) return;
    setActing(true);
    setError(null);
    try {
      await apiDiscardExecution(dir, execution.branch, plan);
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
    setSelectedView({ kind: 'empty-plan' });
    setFiles([]);
  };

  const selectView = (view: SelectedView) => setSelectedView(view);

  const value: MagentContextValue = {
    dir,
    mode,
    direction,
    plan,
    execution,
    selectedView,
    files,
    directing,
    proposing,
    executing,
    acting,
    error,
    enterDirector,
    exitDirector,
    selectProject,
    selectView,
    direct,
    propose,
    execute,
    inspect,
    approveDirection,
    discardDirection,
    approveExecution,
    discardExecution,
  };

  return <MagentContext.Provider value={value}>{children}</MagentContext.Provider>;
};

export const useMagent = () => {
  const ctx = useContext(MagentContext);
  if (!ctx) throw new Error('useMagent must be used within MagentProvider');
  return ctx;
};
