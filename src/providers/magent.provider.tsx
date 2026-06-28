'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiPlan, apiRefinePlan, apiPlanState, apiFinishPlan, apiAbandonPlan } from '@/core/api/plan.api';
import { apiExecute, apiInspectExecution, apiKeepExecution, apiDiscardExecution } from '@/core/api/execution.api';
import { apiTaskState } from '@/core/api/task.api';
import { apiDirect, apiApproveDirection, apiDiscardDirection, apiRefineDirection } from '@/core/api/direction.api';
import { apiAddComment } from '@/core/api/comment.api';
import { apiProjectStatus, apiSetupProject } from '@/core/api/project-setup.api';
import type { Plan, Task } from '@/model/plan.model';
import type { ExecutionResult, InspectTool } from '@/model/execution.model';
import { DirectionProposal } from '@/model/direction.model';
import { FileDiff, parseDiff } from '@/lib/parse-diff';
import { usePersistedString } from '@/hooks/user-persisted-state.hook';
import { Agent } from '@/model/agent.model';
import { apiBranchDiff } from '@/core/api/branch-diff.api';
import { apiGetConfig, apiSetConfig, MagentConfig } from '@/core/api/config.api';

type Mode = 'build' | 'direct';

// what the main panel is currently showing
export type SelectedView =
  | { kind: 'empty-plan' }
  | { kind: 'plan' }
  | { kind: 'task' }
  | { kind: 'file'; path: string }
  | { kind: 'empty-direction' }
  | { kind: 'direction' }
  | { kind: 'doc'; name: string };

interface MagentState {
  // config
  config: MagentConfig | null;

  // shell
  dir: string;
  mode: Mode;
  selectedView: SelectedView;
  acting: boolean;
  error: string | null;
  needsGitSetup: boolean;
  hasRealDirection: boolean;

  // director
  direction: DirectionProposal | null;
  directing: boolean;

  // planner / plan
  plan: Plan | null;
  task: Task | null;
  planning: boolean;
  replanning: boolean;

  // execution
  execution: ExecutionResult | null;
  executing: boolean;
  executionStatus: 'committed' | 'no-net-changes' | 'gave-up' | null;
  files: FileDiff[];
  deciding: boolean;

  // feedback
  pendingComment: Agent | null;
}

interface MagentActions {
  // config
  updateConfig: (patch: Partial<MagentConfig>) => Promise<void>;

  // shell
  selectProject: (dir: string) => void;
  selectView: (view: SelectedView) => void;
  enterDirector: () => void;
  exitDirector: () => void;
  confirmGitSetup: () => Promise<void>;
  cancelGitSetup: () => void;

  // director
  direct: () => Promise<void>;
  approveDirection: () => Promise<void>;
  discardDirection: () => Promise<void>;
  refineDirection: (text: string) => Promise<void>;

  // planner / plan
  proposePlan: () => Promise<void>;
  refinePlan: (text: string) => Promise<void>;
  finishPlan: (comment?: string) => Promise<void>;
  abandonPlan: (comment?: string) => Promise<void>;
  refreshPlanState: () => Promise<void>;
  refreshTask: () => Promise<void>;

  // execution
  execute: () => Promise<void>;
  keepExecution: (comment?: string) => Promise<void>;
  discardExecution: (comment?: string) => Promise<void>;
  refineExecution: (text: string) => Promise<void>;
  inspectExecution: (tool: InspectTool) => Promise<void>;
  refreshBranchState: () => Promise<void>;

  // feedback
  submitComment: (text: string) => Promise<void>;
  dismissComment: () => void;
}

type MagentContextValue = MagentState & MagentActions;

const MagentContext = createContext<MagentContextValue | null>(null);

export const MagentProvider = ({ children }: { children: ReactNode }) => {
  // --- CONFIG ---
  const [config, setConfig] = useState<MagentConfig | null>(null);

  // --- SHELL ---
  const [dir, setDir] = usePersistedString('magent:project-dir', '');
  const [mode, setMode] = useState<Mode>('build');
  const [selectedView, setSelectedView] = useState<SelectedView>({ kind: 'empty-plan' });
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsGitSetup, setNeedsGitSetup] = useState(false);
  const [pendingAction, setPendingAction] = useState<'propose' | 'direct' | null>(null);
  const [hasRealDirection, setHasRealDirection] = useState(false);

  // --- DIRECTOR ---
  const [direction, setDirection] = useState<DirectionProposal | null>(null);
  const [directing, setDirecting] = useState(false);

  // --- PLANNER / PLAN ---
  const [plan, setPlan] = useState<Plan | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [planning, setPlanning] = useState(false);
  const [replanning, setReplanning] = useState(false);

  // --- EXECUTION ---
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [executing, setExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<'committed' | 'no-net-changes' | 'gave-up' | null>(null);
  const [files, setFiles] = useState<FileDiff[]>([]);
  const [deciding, setDeciding] = useState(false);
  const [execRefinements, setExecRefinements] = useState<string[]>([]);

  // --- FEEDBACK ---
  const [pendingComment, setPendingComment] = useState<Agent | null>(null);

  // --- SHELL ---
  const selectProject = (path: string) => setDir(path);
  const selectView = (view: SelectedView) => setSelectedView(view);

  const enterDirector = () => {
    setPendingComment(null);
    setMode('direct');
    setSelectedView({ kind: 'empty-direction' });
  };

  const exitDirector = () => {
    setDirection(null);
    setPendingComment(null);
    setMode('build');
    // return to where the build thread was: the diff if there's an execution, else the plan, else empty
    if (execution && files.length > 0) setSelectedView({ kind: 'file', path: files[0].path });
    else if (plan) setSelectedView({ kind: 'plan' });
    else setSelectedView({ kind: 'empty-plan' });
  };

  const needsSetup = async (): Promise<boolean> => {
    if (!dir) return false;
    try {
      const { needsGitignoreSetup } = await apiProjectStatus(dir);
      if (needsGitignoreSetup) {
        setNeedsGitSetup(true);
        return true;
      }
    } catch {
      // status check failed — let the run proceed and hit the normal precondition error
    }
    return false;
  };

  const confirmGitSetup = async () => {
    await apiSetupProject(dir);
    setNeedsGitSetup(false);
    if (pendingAction === 'propose') await runProposePlan();
    else if (pendingAction === 'direct') await runDirect();
    setPendingAction(null);
  };

  const cancelGitSetup = () => {
    setNeedsGitSetup(false);
    setPendingAction(null);
  };

  // --- DIRECTOR ---

  const runDirect = async () => {
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

  const direct = async () => {
    if (!dir) return;
    if (await needsSetup()) {
      setPendingAction('direct');
      return;
    }
    await runDirect();
  };

  const approveDirection = async () => {
    if (!direction) return;
    setActing(true);
    try {
      await apiApproveDirection(dir, direction.rationale, direction.direction, direction.conventions, [], '');
      setHasRealDirection(true);
      exitDirector();
      setPendingComment(Agent.DIRECTOR);
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
      exitDirector();
      setPendingComment(Agent.DIRECTOR);
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

  // --- PLANNER / PLAN ---

  const runProposePlan = async () => {
    setPlanning(true);
    setError(null);
    setExecution(null);
    setExecutionStatus(null);
    try {
      await apiPlan(dir);
      await refreshPlanState();
      await refreshTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Proposal failed');
    } finally {
      setPlanning(false);
    }
  };

  const proposePlan = async () => {
    if (!dir) return;
    if (await needsSetup()) {
      setPendingAction('propose');
      return;
    }
    await runProposePlan();
    setSelectedView({ kind: 'plan' });
  };

  const refinePlan = async (text: string) => {
    if (!plan) return;
    setPlanning(true);
    setError(null);
    try {
      await apiRefinePlan(dir, plan, text);
      await apiPlan(dir);
      await refreshPlanState();
      await refreshTask();
      setSelectedView({ kind: 'plan' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refine failed');
    } finally {
      setPlanning(false);
    }
  };

  const refreshPlanState = async () => {
    if (!dir) return;
    try {
      const { plan } = await apiPlanState(dir);
      setPlan(plan); // the whole plan
    } catch {
      /* non-fatal */
    }
  };

  const refreshTask = async () => {
    if (!dir) return;
    try {
      const { task } = await apiTaskState(dir);
      setTask(task); // the next runnable task (or null)
    } catch {
      /* non-fatal */
    }
  };

  const finishPlan = async (comment = '') => {
    setActing(true);
    setError(null);
    try {
      await apiFinishPlan(dir, comment);
      setPlan(null);
      setTask(null);
      resetThread();
      setPendingComment(Agent.PLANNER);
      setSelectedView({ kind: 'empty-plan' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Finish failed');
    } finally {
      setActing(false);
    }
  };

  const abandonPlan = async (comment = '') => {
    setActing(true);
    setError(null);
    try {
      await apiAbandonPlan(dir, comment);
      setPlan(null);
      setTask(null);
      resetThread();
      setPendingComment(Agent.PLANNER);
      setSelectedView({ kind: 'empty-plan' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Abandon failed');
    } finally {
      setActing(false);
    }
  };

  // --- EXECUTION ---

  const runExecute = async (refinements: string[] = []) => {
    setExecuting(true);
    setError(null);
    try {
      const result = await apiExecute(dir, refinements);
      if (result.status === 'committed') {
        setExecutionStatus('committed');
        setExecution(result);
        setDeciding(true); // ← committed, awaiting decision
        const parsed = parseDiff(result.diff);
        setFiles(parsed);
        if (parsed.length > 0) setSelectedView({ kind: 'file', path: parsed[0].path });
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

  const execute = async () => {
    if (!task) return; // need a runnable task
    await runExecute();
  };

  const refineExecution = async (text: string) => {
    if (!task || !execution) return;
    setExecRefinements((prev) => [...prev, text]);
    await runExecute([text]);
  };

  const inspectExecution = async (tool: InspectTool) => {
    if (!execution) return;
    try {
      await apiInspectExecution(dir, execution.branch, tool);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inspect failed');
    }
  };

  const keepExecution = async (comment = '') => {
    if (!execution) return;
    setActing(true);
    setError(null);
    try {
      await apiKeepExecution(dir, execRefinements, comment);
      setExecution(null);
      setDeciding(false);
      setExecutionStatus(null);
      setExecRefinements([]);
      setSelectedView({ kind: 'plan' });
      setPendingComment(Agent.EXECUTOR);
      await backgroundReplan();
      await refreshBranchState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Keep failed');
    } finally {
      setActing(false);
    }
  };

  const backgroundReplan = async () => {
    setReplanning(true);
    try {
      await apiPlan(dir);
      await refreshPlanState();
      await refreshTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not prepare the next task');
    } finally {
      setReplanning(false);
    }
  };

  const discardExecution = async (comment = '') => {
    if (!execution) return;
    setActing(true);
    setError(null);
    try {
      await apiDiscardExecution(dir, execution.branch, execRefinements, comment);
      setExecution(null);
      setDeciding(false);
      setExecutionStatus(null);
      setExecRefinements([]);
      setSelectedView({ kind: 'plan' });
      setPendingComment(Agent.EXECUTOR);
      await refreshBranchState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discard failed');
    } finally {
      setActing(false);
    }
  };

  const refreshBranchState = async () => {
    if (!dir) return;
    try {
      const { diff, deciding, branch } = await apiBranchDiff(dir);
      setFiles(diff ? parseDiff(diff) : []);
      setDeciding(deciding);
      setExecution(deciding ? { branch, status: 'committed', diff } : null);
    } catch {
      /* non-fatal */
    }
  };

  // --- EFFECTS ---

  useEffect(() => {
    let active = true;
    (async () => {
      if (!dir) {
        if (active) {
          setPlan(null);
          setTask(null);
          setHasRealDirection(false);
        }
        return;
      }
      try {
        const [{ plan }, { task }, branchState, status, config] = await Promise.all([
          apiPlanState(dir),
          apiTaskState(dir),
          apiBranchDiff(dir),
          apiProjectStatus(dir),
          apiGetConfig(dir),
        ]);
        if (!active) return;
        setConfig(config);
        setPlan(plan);
        setTask(task);
        setHasRealDirection(status.hasRealDirection);
        setFiles(branchState.diff ? parseDiff(branchState.diff) : []);
        setDeciding(branchState.deciding);
        setExecution(
          branchState.deciding ? { branch: branchState.branch, status: 'committed', diff: branchState.diff } : null,
        );
        if (plan) setSelectedView({ kind: 'plan' });
      } catch {
        /* non-fatal */
      }
    })();
    return () => {
      active = false;
    };
  }, [dir]);

  // --- SHARED HELPERS ---

  const resetThread = () => {
    setExecution(null);
    setExecutionStatus(null);
    setDeciding(false);
    setFiles([]);
    setExecRefinements([]);
    setSelectedView(plan ? { kind: 'plan' } : { kind: 'empty-plan' });
  };

  const submitComment = async (text: string) => {
    if (!pendingComment || !text.trim()) {
      setPendingComment(null);
      return;
    }
    try {
      await apiAddComment(dir, pendingComment, text);
    } catch {
      /* non-fatal */
    }
    setPendingComment(null);
  };

  const dismissComment = () => setPendingComment(null);

  const updateConfig = async (patch: Partial<MagentConfig>) => {
    if (!dir) return;
    try {
      const next = await apiSetConfig(dir, patch);
      setConfig(next);
    } catch {
      /* non-fatal */
    }
  };

  const value: MagentContextValue = {
    //config
    config,
    updateConfig,

    // shell + state
    dir,
    mode,
    selectedView,
    selectProject,
    selectView,
    enterDirector,
    exitDirector,
    needsGitSetup,
    confirmGitSetup,
    cancelGitSetup,
    hasRealDirection,
    acting,
    error,

    // director
    direction,
    directing,
    direct,
    approveDirection,
    discardDirection,
    refineDirection,

    // planner / plan
    plan,
    task,
    planning,
    replanning,
    proposePlan,
    refinePlan,
    finishPlan,
    abandonPlan,
    refreshPlanState,
    refreshTask,

    // execution
    execution,
    executing,
    executionStatus,
    files,
    execute,
    keepExecution,
    discardExecution,
    refineExecution,
    inspectExecution,
    refreshBranchState,
    deciding,

    // feedback
    pendingComment,
    submitComment,
    dismissComment,
  };

  return <MagentContext.Provider value={value}>{children}</MagentContext.Provider>;
};

export const useMagent = () => {
  const ctx = useContext(MagentContext);
  if (!ctx) throw new Error('useMagent must be used within MagentProvider');
  return ctx;
};
