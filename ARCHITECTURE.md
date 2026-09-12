# Overpowered Architecture

## Design goal

The suite separates **runtime capabilities** from **working policies**.

A harness may already provide goals, tools, subagents, RAG, database access, memory, and skill management. Overpowered should not reimplement those features. Its skills decide how and when to use capabilities to produce reliable knowledge-work outcomes.

Version 0.2 adds a second boundary: **adaptive capability acquisition**. When the current loadout is genuinely insufficient, `gear-up` may create the smallest temporary capability needed for the task. Durable promotion is handled separately through the Skill Academy and `skillify`.

## Layers

### Level 0: discipline primitives

Primitives constrain behavior and expose failure modes. They are intentionally small.

- `evidence-first`
- `assumption-audit`
- `completion-audit`
- `human-gates`
- `dry-run`
- `checkpoint`

### Level 1: knowledge, evidence, and decision

- `know-enough`
- `find-precedent`
- `ask-the-data`
- `reconcile`
- `what-changed`
- `make-the-call`

### Level 2: process and automation

- `map-the-work`
- `find-the-exceptions`
- `automate-this`

The boundaries are deliberate: `map-the-work` establishes evidence-aware current-state understanding; `find-the-exceptions` enriches non-happy paths and decision models; `automate-this` compiles understood work into an executable design. Likewise, `know-enough` determines and acquires sufficient evidence, while `make-the-call` closes the choice once evidence is sufficient.

### Level 3: orchestration

- `using-overpowered`

### Level 4: adaptive capability

- `gear-up` — acquire the smallest missing capability temporarily during execution.
- `skillify` — generalize/package a qualified or proven workflow for durable reuse.
- **Skill Academy protocol** — evidence-based lifecycle between temporary creation and permanent deployment; documented in `ACADEMY.md`, not implemented as an always-loaded skill.

## Adaptive capability lifecycle

```text
task
  │
  ├─ existing capability adequate? ───────────────► use it
  │
  ├─ missing knowledge? ─────────────────────────► know-enough
  │
  ├─ Academy candidate adequate? ────────────────► stage/evaluate it
  │
  └─ real execution capability gap
             │
             ▼
          gear-up
             │
      smallest validated artifact
             │
      activate / use / measure
          ┌──┴───────────────┐
          │                  │
     ineffective          useful
          │                  │
       discard          candidate
                             │
                      repeated evidence
                             │
                         qualified
                             │
                          skillify
                             │
                         graduated
```

The runtime adapter supplies hot-loading mechanics; Overpowered supplies the decision policy and lifecycle. The Pi implementation lives in `extensions/overpowered-runtime/`: it contributes temporary skill paths during resource discovery, injects task context before agent start, wraps generated executables without exposing Pi's `ExtensionAPI`, and persists reload-safe state. See `adapters/pi.md`.

## Composition rules

1. Invoke the smallest skill set that changes the outcome.
2. Process skills may call primitives; primitives should not call broad process skills.
3. Retrieval is driven by an information objective, never by availability alone.
4. Authority and precedent are separate evidence classes.
5. Conflicts are surfaced or reconciled, never silently averaged away.
6. Automation architecture is selected step-by-step; “use an agent” is not the default.
7. Human gates are based on authority/risk/ambiguity, not tradition.
8. Risky side effects should be simulated before execution when feasible.
9. Completion claims require evidence proportional to the claim.
10. A checkpoint contains durable state, not a transcript summary.
11. **Reuse before creation.** Installed skills/tools, generic operations, and suitable Academy entries outrank generated capability.
12. **Knowledge gaps are not capability gaps.** Retrieve missing facts instead of generating a skill/tool.
13. **Create the weakest sufficient artifact.** One primary artifact per gap is the default budget.
14. **Temporary is the default.** A capability must earn persistence through evidence.
15. **Runtime state must be truthful.** A staged file is not an active skill/tool until the harness confirms activation.
16. **Clarify only what changes the work.** Discover available facts first, then ask only for unresolved input that materially changes the next action.
17. **Decide once evidence is sufficient.** Use `make-the-call` instead of leaving viable options in an uncommitted catalogue.
18. **Understand actual work before automation only when needed.** Use `map-the-work` when current state is materially unclear; do not remap an adequate specification.
19. **Pressure-test by composition.** Select from `assumption-audit`, `find-the-exceptions`, `dry-run`, and `completion-audit` according to material failure modes.

## Decision table

| Situation | Primary skill | Optional companions |
|---|---|---|
| Missing organization-specific knowledge | `know-enough` | `find-precedent`, `reconcile` |
| Need historical analogs | `find-precedent` | `know-enough` |
| Structured files / analytical question | `ask-the-data` | `evidence-first`, `completion-audit` |
| Sources disagree | `reconcile` | `know-enough` |
| Compare revisions or snapshots | `what-changed` | `know-enough`, `reconcile` |
| Choose among viable options | `make-the-call` | `know-enough`, `reconcile`, `assumption-audit` |
| Understand how current work actually happens | `map-the-work` | `reconcile`, `find-the-exceptions` |
| Rules/process likely hide edge cases | `find-the-exceptions` | `assumption-audit` |
| Turn human process into executable workflow | `automate-this` | `map-the-work` if unclear, `find-the-exceptions`, `human-gates`, `dry-run` |
| Risky side effects | `dry-run` | `human-gates` |
| About to claim done | `completion-audit` | `evidence-first` |
| Long/cross-agent task | `checkpoint` | `completion-audit` |
| Current loadout cannot execute a material step after reuse/Academy checks | `gear-up` | `dry-run`, `human-gates` |
| Qualified/proven workflow should become a portable durable skill | `skillify` | `completion-audit` |

## Capability types for `gear-up`

In increasing order of power/cost:

1. no generated artifact — use existing capability;
2. scoped temporary context (`AGENTS.md` equivalent);
3. temporary skill;
4. temporary deterministic tool;
5. skill + tool pair only when procedure and mechanism both add independent value;
6. agent/subagent definition only when the harness supports it and a distinct role/tool/context boundary is materially useful.

## Knowledge source semantics

`know-enough` recognizes at least four evidence roles:

- **authoritative**: current normative source; policy, approved product reference, signed source of truth.
- **precedent**: historical example; useful for analogy, not authority.
- **observational**: telemetry, reports, operational data; evidence about what happened.
- **reference**: informative material that may guide interpretation but is not controlling.

A source can be high quality and still have the wrong role for a decision.

## Stopping conditions

Every non-trivial skill has an explicit stop condition:

- `know-enough`: additional retrieval is unlikely to change the next decision.
- `find-precedent`: enough comparable cases exist to identify reusable patterns and material differences.
- `reconcile`: every material conflict is resolved, bounded, or escalated.
- `make-the-call`: exactly one of `DECIDE`, `TEST`, or `DEFER` is justified with a bounded next action.
- `map-the-work`: the current flow and its evidence status are sufficient for the user's next decision.
- `find-the-exceptions`: material branches are covered or explicitly unknown.
- `automate-this`: every step has an implementation mode, inputs/outputs, failure path, and responsibility.
- `gear-up`: the proven capability gap is closed by the smallest validated artifact, value has been observed, and the artifact is discarded or nominated to the Academy.
- `completion-audit`: every material completion criterion has acceptable evidence or is marked not proven.
- `skillify`: the portable package is structurally coherent, evaluation-ready, and its graduation/deployment status is truthful.

This prevents both “research forever” and “generate helpers forever” behavior.
