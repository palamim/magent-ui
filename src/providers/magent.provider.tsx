'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { apiPlan, apiApprovePlan, apiDiscardPlan, apiRefinePlan, PlanResponse } from '@/core/api/plan.api';
import { apiExecute, apiInspectExecution, apiApproveExecution, apiDiscardExecution } from '@/core/api/execution.api';
import { apiDirect, apiApproveDirection, apiDiscardDirection, apiRefineDirection } from '@/core/api/direction.api';
import type { Plan } from '@/model/plan.model';
import type { ExecutionResult, InspectTool } from '@/model/execution.model';
import { DirectionProposal } from '@/model/direction.model';
import { FileDiff, parseDiff } from '@/lib/parse-diff';
import { usePersistedString } from '@/hooks/user-persisted-state.hook';
import { useAutoPush } from '@/hooks/use-auto-push.hook';

type Mode = 'build' | 'direct';

// what the main panel is currently showing
export type SelectedView =
  | { kind: 'empty-plan' }
  | { kind: 'plan' }
  | { kind: 'file'; path: string }
  | { kind: 'empty-direction' }
  | { kind: 'direction' }
  | { kind: 'doc'; name: string }
  | { kind: 'feature-complete' };

interface MagentState {
  dir: string;
  mode: Mode;
  direction: DirectionProposal | null;
  directing: boolean;
  plan: Plan | null;
  planning: boolean;
  execution: ExecutionResult | null;
  executing: boolean;
  executionStatus: 'committed' | 'no-net-changes' | 'gave-up' | null;
  featureComplete: string | null;
  selectedView: SelectedView;
  files: FileDiff[];
  acting: boolean;
  error: string | null;
}

interface MagentActions {
  enterDirector: () => void;
  exitDirector: () => void;
  selectProject: (dir: string) => void;
  selectView: (view: SelectedView) => void;
  proposePlan: () => Promise<void>;
  discardPlan: (text: string) => Promise<void>;
  refinePlan: (text: string) => Promise<void>;
  direct: () => Promise<void>;
  approveDirection: () => Promise<void>;
  discardDirection: () => Promise<void>;
  refineDirection: (text: string) => Promise<void>;
  execute: () => Promise<void>;
  inspectExecution: (tool: InspectTool) => Promise<void>;
  approveExecution: () => Promise<void>;
  discardExecution: () => Promise<void>;
  refineExecution: (text: string) => Promise<void>;
  executionStatus: 'committed' | 'no-net-changes' | 'gave-up' | null;
}

type MagentContextValue = MagentState & MagentActions;

const MagentContext = createContext<MagentContextValue | null>(null);

export const MagentProvider = ({ children }: { children: ReactNode }) => {
  const [dir, setDir] = usePersistedString('magent:project-dir', '');
  const [mode, setMode] = useState<Mode>('build');
  const [direction, setDirection] = useState<DirectionProposal | null>(null);
  const [directing, setDirecting] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [planning, setPlanning] = useState(false);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [selectedView, setSelectedView] = useState<SelectedView>({ kind: 'empty-plan' });
  const [files, setFiles] = useState<FileDiff[]>([]);
  const [executing, setExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<'committed' | 'no-net-changes' | 'gave-up' | null>(null);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [execRefinements, setExecRefinements] = useState<string[]>([]);
  const [featureComplete, setFeatureComplete] = useState<string | null>(null);
  const { autoPush } = useAutoPush();

  const selectProject = (path: string) => setDir(path);

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
      const result = await apiDirect(dir);
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

  const refineDirection = async (text: string) => {
    if (!direction) return;
    setDirecting(true);
    setError(null);
    try {
      await apiRefineDirection(dir, direction.rationale, text);
      const result = await apiDirect(dir);
      setDirection(result);
      setSelectedView({ kind: 'direction' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refine failed');
    } finally {
      setDirecting(false);
    }
  };

  const applyPlanResult = (result: PlanResponse) => {
    if ('status' in result) {
      setFeatureComplete(result.goal);
      setSelectedView({ kind: 'feature-complete' });
    } else {
      setPlan(result.plan);
      setSelectedView({ kind: 'plan' });
    }
  };

  const proposePlan = async () => {
    setPlanning(true);
    setError(null);
    setPlan(null);
    setExecution(null);
    setFeatureComplete(null);
    try {
      applyPlanResult(await apiPlan(dir));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Proposal failed');
    } finally {
      setPlanning(false);
    }
  };

  const discardPlan = async (comment: string) => {
    if (!plan) return;
    setActing(true);
    setError(null);
    try {
      await apiDiscardPlan(dir, plan, [], comment);
      resetThread();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discard failed');
    } finally {
      setActing(false);
    }
  };

  const refinePlan = async (text: string) => {
    if (!plan) return;
    setPlanning(true);
    setError(null);
    setFeatureComplete(null);
    try {
      await apiRefinePlan(dir, plan, text);
      applyPlanResult(await apiPlan(dir));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refine failed');
    } finally {
      setPlanning(false);
    }
  };

  const execute = async () => {
    if (!plan) return;
    setExecuting(true);
    setError(null);
    try {
      await apiApprovePlan(dir, plan, [], '');
      const result = await apiExecute(dir, plan);
      if (result.status === 'committed') {
        setExecutionStatus('committed');
        setExecution(result);
        const parsed = parseDiff(result.diff);
        setFiles(parsed);
        if (parsed.length > 0) {
          setSelectedView({ kind: 'file', path: parsed[0].path });
        }
      } else if (result.status === 'no-net-changes') {
        setExecutionStatus('no-net-changes');
      } else if (result.status === 'gave-up') {
        setExecutionStatus('gave-up');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const inspectExecution = async (tool: InspectTool) => {
    if (!execution) return;
    try {
      await apiInspectExecution(dir, execution.branch, tool);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inspect failed');
    }
  };

  const approveExecution = async () => {
    if (!plan || !execution) return;
    setActing(true);
    setError(null);
    try {
      await apiApproveExecution(dir, execution.branch, plan, autoPush);
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

  const refineExecution = async (text: string) => {
    if (!plan || !execution) return;
    setExecuting(true);
    setError(null);
    try {
      const next = [...execRefinements, text];
      setExecRefinements(next);
      const result = await apiExecute(dir, plan, [text]);
      if (result.status === 'committed') {
        setExecutionStatus('committed');
        setExecution(result);
        const parsed = parseDiff(result.diff);
        setFiles(parsed);
        if (parsed.length > 0) setSelectedView({ kind: 'file', path: parsed[0].path });
      } else if (result.status === 'no-net-changes') {
        setExecutionStatus('no-net-changes');
      } else if (result.status === 'gave-up') {
        setExecutionStatus('gave-up');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refine failed');
    } finally {
      setExecuting(false);
    }
  };

  const resetThread = () => {
    setPlan(null);
    setExecution(null);
    setExecutionStatus(null);
    setSelectedView({ kind: 'empty-plan' });
    setFiles([]);
  };

  const selectView = (view: SelectedView) => setSelectedView(view);

  const value: MagentContextValue = {
    dir,
    mode,
    direction,
    directing,
    direct,
    approveDirection,
    discardDirection,
    refineDirection,
    plan,
    planning,
    proposePlan,
    discardPlan,
    refinePlan,
    execution,
    executing,
    executionStatus,
    execute,
    approveExecution,
    discardExecution,
    inspectExecution,
    refineExecution,
    featureComplete,
    selectedView,
    files,
    acting,
    error,
    enterDirector,
    exitDirector,
    selectProject,
    selectView,
  };

  return <MagentContext.Provider value={value}>{children}</MagentContext.Provider>;
};

export const useMagent = () => {
  const ctx = useContext(MagentContext);
  if (!ctx) throw new Error('useMagent must be used within MagentProvider');
  return ctx;
};
