<!-- BEGIN:magent-intent -->

## Magent UI

### 1. Project

magent-ui is the local web interface for Magent — the face of the agent. It is a
Next.js (App Router) client application that talks to the Magent server (Express,
at the URL in NEXT_PUBLIC_MAGENT_API_URL) to run the agent and present its work.
It collapses Magent's terminal-and-git workflow into one window: point at a project,
see the proposal, read per-file diffs, and approve/refine/discard with clicks.

The UI holds NO Magent logic. It never reads files, runs git, or calls the model —
all of that lives in the server. The UI's job is presentation and transport: render
state, and call the server via the core/api layer. Keep that line clean — no logic
leaks into the browser.

### 2. Taste

- **Full dark.** A builder's instrument: calm, fast, legible, easy on the eyes for
  long sessions. Layered near-black surfaces (not pure black), off-white text (not
  pure white). Depth comes from subtle surface elevation, not heavy borders or shadows.
- **Small, modern, sans-serif type.** Restrained, not theatrical. Information-dense
  but legible.
- **Neutral accent for now.** No brand color yet. A bright neutral for interactive/
  active states. Accessory state colors are decided: green for positive (approve,
  merge, diff additions), red for negative (discard, diff removals), amber for
  in-progress. The code/diff area is the darkest surface — the "locked-in, do-the-work"
  layer.
- **Minimal and purposeful.** The smallest change that does the job. No decoration that
  doesn't aid the work. Build the tent before the cathedral.

### 3. Architecture & conventions (read before writing code)

This is a layered app — respect the separation of concerns:

- **app/** — App Router routes/layouts only (route-level composition). The shell is
  applied in layout.tsx.
- **src/core/api/** — the transport layer. `client.ts` is the ONE place fetch details
  live (base URL, method, error unwrapping). Per-resource modules (`proposal.api.ts`,
  `execution.api.ts`) expose typed functions. Components NEVER call fetch directly —
  they call these. If you add a server call, add it here.
- **src/model/** — shared domain types (Plan, ExecutionResult, FileDiff). Mirror the
  server's shapes.
- **src/providers/** — shared state (MagentProvider holds the thread lifecycle: dir,
  plan, execution, files, selectedView, and the actions propose/execute/approve/discard).
  Components consume it via useMagent(). The provider owns the api calls and state;
  components render and trigger.
- **src/modules/** — feature-scoped composed UI (the shell, the main-panel views).
  Specific to a feature.
- **src/components/** — generic, reused-across-features primitives. Promote here only
  when a second feature needs something; start feature-scoped in modules/.
- **src/lib/** — generic helpers with no domain knowledge (diff parsing, storage).

Conventions: dot-suffix filenames by role (`magent.provider.tsx`, `proposal.api.ts`,
`plan.view.tsx`). Components as const arrow functions. Anything using a hook or
interactivity is a client component ('use client'). Use the design tokens in
globals.css (var(--background), var(--foreground), --positive, --negative, etc.) —
never hardcode colors.

### 4. Layout (the established frame)

Three regions:

- **Sidebar (left)** — navigation only. Project selector at top, then the active
  thread: Plan, then Modified/Created file lists. Clicking an item sets what the main
  panel shows. Empty when no thread.
- **Main panel (center/right)** — views whatever the sidebar selected: the plan (with
  an in-panel Run button), or a single file's diff. Empty state ("Let's build
  something" + Propose) at rest.
- **Top bar** — thread-level actions, post-execution: inspect, approve, discard.
  Approve is the prominent (green) action; discard is the quieter (outlined) one.

The Run button lives WITH the plan (it executes that plan), not in the top bar.
Thread-level post-execution actions live in the top bar.

### 5. Direction

**Guardrails — don't propose these:**

- No business logic in the UI (no file/git/model operations — that's the server).
- No new dependencies unless a real, felt friction demands one.
- No light mode / theme switching — the app is dark, committed.
- No brand color work — neutral accent for now.
- No multi-project management yet — one selected project, persisted.
- No backend changes from here — this repo is the frontend only.
- Nothing from the long arc below.

### 6. Long arc — context, not a backlog

magent-ui will grow: the refinement chat (feedback input), inspect (open the branch in
an editor/terminal), richer diff rendering (syntax-highlighted, side-by-side), and
eventually the direction-layer vision (the planner as a chief-of-staff that proposes
direction, orchestrates executors, ingests feedback). And someday, safe self-modification
(Magent building its own UI without the running instance corrupting itself).

This section is context, not a to-do list. Build only the current frontier.

<!-- END:magent-intent -->
