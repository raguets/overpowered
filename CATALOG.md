# Overpowered Skill Catalog

## Level 0 — Discipline primitives

### Overpowered / `evidence-first`
Use when conclusions, claims, recommendations, or decisions depend on facts that should be traceable.

### Overpowered / `assumption-audit`
Use when a plan or analysis contains unstated beliefs that could materially affect the result.

### Overpowered / `completion-audit`
Use before declaring a task complete when success can be checked against observable criteria.

### Overpowered / `human-gates`
Use when designing or executing workflows that mix automated and human decisions.

### Overpowered / `dry-run`
Use before broad, irreversible, costly, or hard-to-audit side effects.

### Overpowered / `checkpoint`
Use to make work resumable in a clean context or by another agent/harness.

## Level 1 — Knowledge, evidence, and decision

### Overpowered / `know-enough`
Use when task quality depends on organization-specific, historical, current, or otherwise missing knowledge and retrieval tools or knowledge bases are available.

### Overpowered / `find-precedent`
Use when prior cases, contracts, proposals, decisions, incidents, designs, or projects may provide a useful analogy.

### Overpowered / `ask-the-data`
Use when the answer lives in structured files such as Excel, CSV, JSON, or Parquet and should be queried reproducibly.

### Overpowered / `reconcile`
Use when multiple sources disagree, overlap, or use incompatible terminology.

### Overpowered / `what-changed`
Use when comparing versions, snapshots, policies, procedures, datasets, configurations, contracts, APIs, or other evolving artifacts.

### Overpowered / `make-the-call`
Use when multiple viable options remain and the user expects closure. Turns sufficient evidence into a clear decision, a discriminating bounded test, or an explicit justified defer.

## Level 2 — Process and automation

### Overpowered / `map-the-work`
Use when actual current-state work must be understood across actors, handoffs, systems, data, decisions, variants, and tacit rules before improvement, redesign, or automation.

### Overpowered / `find-the-exceptions`
Use when rules or processes have a plausible happy path but hidden edge cases could break execution.

### Overpowered / `automate-this`
Use when a human activity or business process should be transformed into an executable automation design.

## Level 3 — Orchestration

### Overpowered / `using-overpowered`
Use to select and sequence this suite without loading irrelevant skills, and to route to adaptive capability only when the current loadout has a proven execution gap.

## Level 4 — Adaptive capability

### Overpowered / `gear-up`
Use when a material part of the objective cannot be executed reliably with installed skills/tools, generic runtime operations, current context, knowledge retrieval, or a suitable Skill Academy candidate. Creates the smallest temporary skill/context/tool needed, validates and activates it when the runtime supports hot loading, measures real task value, then discards or nominates it for Academy evaluation.

### Overpowered / `skillify`
Use after a workflow/capability has real reuse evidence—especially after Skill Academy qualification—to generalize and package the reusable method as a portable skill with evals. It is not the hot-generation mechanism.

## Suite protocol (not an always-loaded skill)

### Skill Academy
See `ACADEMY.md`. It defines the evidence lifecycle **ephemeral → candidate → qualified → graduated**, plus rejected/retired states, so one-off generated capabilities do not pollute durable harness configuration.
