## Magent UI — MAGENT.md

This document is the permanent, long-haul intent for magent-ui. The Director reads it to set
direction. It holds what the project is, the taste behind it, a high-level map of its
structure, and the long-term horizon. It does not hold day-to-day direction (direction.md,
which the Director writes) or coding conventions (conventions.md).

### 1. Project

magent-ui is the web interface for Magent — the face of an agentic coding tool. It is a
Next.js (App Router) client application that runs hosted (public), and talks to a Magent
"brain" running locally on the user's machine (a separate repo, an Express server on
localhost). The UI sends commands; the brain reads files, runs git, and calls the model — all
locally. The UI holds NO logic of its own: it renders state and transports requests. Keep that
line absolute — no file access, no git, no model calls in the browser; that is the brain's job.

The product is built on one thesis: **building is no longer the bottleneck — direction is.**
Most agentic coding tools pour everything into the executor (writing code). Magent's
differentiation is the layer above: a Director that sets direction, a Planner that turns it
into tasks, an Executor that builds. The UI exists to make that three-level flow legible and
fast: set direction, propose a step, see the diff, approve. The whole thing should feel like a
calm, fast builder's instrument — the terminal-and-git cycle collapsed into a few clicks.

The audience is developers — people who will point this at their own repos. They value
precision, speed, and trust (they are letting a tool touch their code and git). The interface
must earn that trust: always show what an action will do, never surprise.

### 2. Taste

- **A builder's instrument: calm, fast, legible.** Full dark — layered near-black surfaces
  (not pure black), off-white text (not pure white). Depth comes from subtle surface
  elevation, not heavy borders or shadows. Small, modern, sans-serif type. Information-dense
  but never cramped.
- **Restraint over decoration.** A neutral accent, used sparingly. State colors carry meaning
  (green for approve/merge/additions, red for discard/removals, amber for in-progress). The
  code/diff area is the darkest surface — the locked-in, do-the-work layer. No flourish that
  doesn't aid the work.
- **Trust is a feature.** The UI touches the user's files and git. Every consequential action
  states what it will do (merges to main, pushes to remote) before it does it. Safe defaults
  (merge-only, no auto-push unless turned on). Transparency over cleverness.
- **Simplicity first.** The smallest change that does the job. Build the tent before the
  cathedral. Don't build for problems not yet observed. Refactor only on real, felt pain;
  delete cruft that no longer earns its place. One coherent slice per step.

### 3. Structure — a high-level map

This orients direction-setting; detailed coding conventions live in conventions.md.

- **Next.js App Router** client app. `app/` holds routes and layout only.
- **A connection gate** wraps the app: the UI is useless until it reaches the user's local
  brain, so a gate handles checking / connected / disconnected, and the disconnected state
  doubles as onboarding (how to run the brain, the browser permission prompt, trust copy).
- **`src/core/api/`** — the transport layer. One client (base URL, error unwrapping) and
  per-resource modules (the only place that talks to the brain). Components never fetch
  directly.
- **`src/providers/`** — shared state. A central provider holds the thread lifecycle (the
  direction/plan/execution flow, what's selected, the actions). Components consume it via a
  hook; they render and trigger, they don't hold logic.
- **`src/modules/`** — feature UI (the shell: sidebar/main-panel/top-bar; the main-panel
  views; onboarding). **`src/components/`** — generic primitives, promoted only on second use.
  **`src/hooks/`** — standalone reusable hooks. **`src/model/`** — shared types mirroring the
  brain's shapes.
- The architecture mirrors the product: three agents (Director, Planner, Executor), each with
  the same action vocabulary (propose, approve, discard, refine), reflected in the UI's
  structure. The shell has two modes — **Direct** (set direction) and **Build** (plan +
  execute toward it).
- The division that matters: **the UI presents and transports; the brain decides and acts.**
  Direction should never propose moving logic into the UI.

### 4. The long arc — the horizon

magent-ui will grow into the full surface of the direction-layer thesis. Nearer term: richer
diffs, better feedback collection, a settings surface, version-awareness between UI and brain,
smoother onboarding. Further out: the Director evolving toward a true chief-of-staff that
proposes direction proactively, orchestrates work, and eventually ingests outside signal (like
user feedback on a shipped product) to inform what to build. The ambition is for Magent to be
the tool that serious solo builders and small teams use to decide _what_ to build, not just to
build it — reaching the practitioners who feel that direction, not building, is now the work.

This is the horizon the Director steers toward when proposing direction — context for reasoning
about what to pursue next, not a checklist.
