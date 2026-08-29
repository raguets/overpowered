# Example 7 — Acquire a missing capability during the task

## Situation

The agent must compare hundreds of requirements from several specifications. Existing extraction tools work, but repeated normalization loses exact requirement identifiers and source provenance.

User request:

> Build a cross-document requirement matrix. Keep every original requirement ID and source reference traceable.

## Route

```text
using-overpowered
  ↓
existing skills/tools inspected
  ↓
capability gap detected
  ↓
gear-up
```

`gear-up` does **not** immediately generate code. It first proves the gap:

```text
Objective at risk
  Cross-document normalization must preserve original IDs and provenance.

Knowledge gap?
  No. We already have the documents and rules.

Existing capability adequate?
  No. Sample runs lose stable source IDs.

Academy match?
  None.

Smallest missing capability
  Deterministic requirement-normalization tool.

Value test
  On a representative validation sample, every normalized requirement
  preserves exact source document + requirement ID with zero collisions.
```

## Ephemeral creation

Recommended runtime workspace:

```text
.overpowered/runtime/run-2026-001/
├── manifest.yaml
└── tools/
    └── normalize-requirement.ts
```

The agent validates the tool, performs a side-effect-free smoke test, and asks the runtime adapter to activate it. Writing the file is not enough: activation must be confirmed by the harness.

## Use and measurement

The agent runs the validation sample again:

```text
Before
  4/80 sampled requirements lost or collided on source identity.

After
  80/80 preserve document + original requirement ID.
  0 collisions.
```

Only then does the agent use the tool for the full matrix.

## After the task

The tool is not installed permanently.

Because it materially helped and the gap plausibly recurs, `gear-up` records it as an Academy **candidate** with the observed evidence. A later task can search the Academy metadata and reuse/evaluate the candidate before generating another normalizer.

```text
gear-up
  ↓
real task success
  ↓
Academy candidate
  ↓ (later distinct tasks + evals)
qualified
  ↓
skillify if a portable procedural skill is warranted
  ↓
graduated capability
```

The important behavior is **capability acquisition without capability sprawl**.
