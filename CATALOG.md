# Overpowered Skill Catalog

## Level 0 — Discipline primitives

### `evidence-first`
Use when conclusions, claims, recommendations, or decisions depend on facts that should be traceable.

### `assumption-audit`
Use when a plan or analysis contains unstated beliefs that could materially affect the result.

### `completion-audit`
Use before declaring a task complete when success can be checked against observable criteria.

### `human-gates`
Use when designing or executing workflows that mix automated and human decisions.

### `dry-run`
Use before broad, irreversible, costly, or hard-to-audit side effects.

### `checkpoint`
Use to make work resumable in a clean context or by another agent/harness.

## Level 1 — Knowledge and evidence

### `know-enough`
Use when task quality depends on organization-specific, historical, current, or otherwise missing knowledge and retrieval tools or knowledge bases are available.

### `find-precedent`
Use when prior cases, contracts, proposals, decisions, incidents, designs, or projects may provide a useful analogy.

### `ask-the-data`
Use when the answer lives in structured files such as Excel, CSV, JSON, or Parquet and should be queried reproducibly.

### `reconcile`
Use when multiple sources disagree, overlap, or use incompatible terminology.

### `what-changed`
Use when comparing versions, snapshots, policies, procedures, datasets, configurations, contracts, APIs, or other evolving artifacts.

## Level 2 — Process and automation

### `find-the-exceptions`
Use when rules or processes have a plausible happy path but hidden edge cases could break execution.

### `automate-this`
Use when a human activity or business process should be transformed into an executable automation design.

## Level 3 — Meta and orchestration

### `using-overpowered`
Use to select and sequence this suite without loading irrelevant skills.

### `skillify`
Use after a workflow has actually succeeded and the user wants to package the reusable method as a portable skill with evals.
