---
name: reconcile
description: >
  Compare overlapping or conflicting sources, datasets, policies, documents, definitions, or records and resolve what can be resolved while surfacing irreducible disagreement. Use when sources disagree, duplicate concepts differently, or must be merged into a trustworthy view; never silently pick a favorite source.
metadata:
  suite: overpowered
  level: "1-knowledge"
  version: "0.1.0"
---

# Reconcile

## Core rule

**Agreement, conflict, absence, and semantic mismatch are different states. Preserve the distinction.**

## Procedure

1. Define the object being reconciled and the decision it must support.
2. Identify source roles and authority. Use `know-enough` if source authority is unclear.
3. Normalize comparable concepts without erasing meaningful differences in scope, units, time, or terminology.
4. Classify each material item as:
   - **AGREED** — sources materially align;
   - **CONFLICT** — sources make incompatible claims;
   - **MISSING** — expected information is absent from one or more sources;
   - **SEMANTIC MISMATCH** — same/similar term has different meaning or scope;
   - **STALE** — a source is superseded for this decision.
5. Resolve deterministically when authority, recency, or explicit rules establish the answer.
6. Otherwise preserve the conflict and identify the smallest human or evidence need required to resolve it.

## Output contract

```text
Item | Source A | Source B | Status | Resolution / next step | Evidence
```

End with:

- reconciled facts safe to use;
- unresolved conflicts that can change the outcome;
- sources that should no longer drive the decision.

## Gotchas

- Do not average incompatible policies or thresholds.
- Newer is not automatically more authoritative.
- Identical labels can hide different definitions.
- Silence in one source is not necessarily disagreement.
- Historical precedent cannot override a current authoritative policy unless a governing rule says so.

## Stop condition

Stop when every material discrepancy is either resolved by a defensible rule or explicitly bounded as unresolved.
