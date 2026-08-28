# Overpowered Architecture

## Design goal

The suite separates **runtime capabilities** from **working policies**.

A harness may already provide goals, tools, subagents, RAG, database access, memory, and skill management. These skills should not reimplement those features. They decide how and when to use capabilities to produce reliable knowledge-work outcomes.

## Layers

### Level 0: discipline primitives

Primitives constrain behavior and expose failure modes. They are intentionally small.

- `evidence-first`
- `assumption-audit`
- `completion-audit`
- `human-gates`
- `dry-run`
- `checkpoint`

### Level 1: knowledge and evidence

- `know-enough`
- `find-precedent`
- `ask-the-data`
- `reconcile`
- `what-changed`

### Level 2: process and automation

- `find-the-exceptions`
- `automate-this`

### Level 3: meta and orchestration

- `using-overpowered`
- `skillify`

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

## Decision table

| Situation | Primary skill | Optional companions |
|---|---|---|
| Missing organization-specific knowledge | `know-enough` | `find-precedent`, `reconcile` |
| Need historical analogs | `find-precedent` | `know-enough` |
| Structured files / analytical question | `ask-the-data` | `evidence-first`, `completion-audit` |
| Sources disagree | `reconcile` | `know-enough` |
| Compare revisions or snapshots | `what-changed` | `know-enough`, `reconcile` |
| Rules/process likely hide edge cases | `find-the-exceptions` | `assumption-audit` |
| Turn human process into executable workflow | `automate-this` | `find-the-exceptions`, `human-gates`, `dry-run` |
| Risky side effects | `dry-run` | `human-gates` |
| About to claim done | `completion-audit` | `evidence-first` |
| Long/cross-agent task | `checkpoint` | `completion-audit` |
| Package a proven workflow for reuse | `skillify` | `completion-audit` |

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
- `find-the-exceptions`: material branches are covered or explicitly unknown.
- `automate-this`: every step has an implementation mode, inputs/outputs, failure path, and responsibility.
- `completion-audit`: every material completion criterion has acceptable evidence or is marked not proven.

This prevents “research forever” behavior.
