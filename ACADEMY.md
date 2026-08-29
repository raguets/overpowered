# Skill Academy Protocol

The **Skill Academy** is Overpowered's evidence-based path from a one-task temporary capability to a durable capability worth deploying in a harness.

It is deliberately not an automatic "save everything" memory. Its job is to prevent capability sprawl while preserving the rare generated artifacts that repeatedly create real value.

## Lifecycle

```text
EPHEMERAL
created for one task by gear-up
    │
    │ task success + observed value
    ▼
CANDIDATE
worth retaining for evaluation
    │
    │ reuse on distinct tasks + eval evidence
    ▼
QUALIFIED
reusable value demonstrated
    │
    │ generalize + package + human/project approval
    ▼
GRADUATED
installed/distributed as a durable capability
```

At any stage a capability may become **REJECTED** (not useful, unsafe, too narrow, redundant) or **RETIRED** (superseded or no longer valid).

## Stage rules

### Ephemeral

- Exists only in a task-scoped runtime workspace.
- May be a skill, tool, context fragment, or supported agent definition.
- Is not part of the permanent harness configuration.
- Must have a stated capability gap and value test.

Default outcome after the task: **delete it**.

### Candidate

Create a candidate record only when the artifact materially improved a real task and there is a plausible reuse hypothesis.

A candidate record should include:

- the capability gap it solved;
- artifact type and location/hash;
- task outcome and evidence;
- dependencies and permissions;
- known limitations/failures;
- reuse hypothesis;
- security/side-effect notes;
- status and timestamps.

One success is evidence for *candidate status*, not evidence of generality.

### Qualified

Qualification requires evidence beyond the originating task. Recommended default bar:

1. successful use on at least **two distinct task instances or contexts**;
2. no unresolved critical safety/correctness failure;
3. at least one clean-context behavioral eval against an appropriate baseline when the artifact is a reasoning skill;
4. stable input/output or behavior contract;
5. no adequate installed or Academy capability that makes it redundant.

These are defaults, not immutable law. High-risk capabilities may require stronger evidence; trivial deterministic helpers may require less behavioral testing but still need correctness tests.

### Graduated

Graduation means intentional deployment, not merely copying files.

Before graduation:

1. generalize accidental task-specific names, paths, values, and assumptions;
2. reduce privileges and dependencies;
3. run `skillify` for Agent Skills packaging when the artifact is or contains a reusable skill;
4. validate on a clean context/runtime;
5. add regression evals for known failure modes;
6. obtain the human/project approval required by the deployment policy;
7. install into the target harness or publish into the durable skill/tool catalog.

## Academy storage model

The Academy can live locally, in a repository, or in a service. The logical structure is more important than the physical path.

Recommended layout:

```text
academy/
├── index.yaml                  # lightweight searchable metadata
├── candidates/
│   └── <capability-id>/
│       ├── candidate.yaml
│       ├── artifact/           # retained generated files
│       └── evidence/           # task/eval evidence
├── qualified/
├── rejected/
└── retired/
```

**Do not put all candidate bodies into the agent's startup context.** Search `index.yaml` or equivalent metadata first, then load only a promising candidate.

This repository includes templates under `academy/`; they document the protocol but contain no user-generated capabilities.

## Reuse before creation

`gear-up` should consult Academy metadata after installed capabilities and generic runtime tools, but before generating a new artifact.

```text
installed capability adequate?  → use it
Academy candidate adequate?     → evaluate/reuse it
nothing adequate?               → gear-up may create
```

A Candidate may be used experimentally, but its status must remain visible. A candidate is not silently treated as trusted/graduated.

## Evidence, not popularity

Promotion is based on observed value and bounded risk, not on invocation count alone. Repeating the same narrow task ten times is weaker evidence of generality than succeeding on two meaningfully different contexts.

Useful evidence includes:

- completion criteria met only after the capability was introduced;
- error rate or manual steps reduced;
- provenance/correctness improved;
- deterministic tests passed;
- successful reuse outside the originating project;
- clean-context eval improvement over baseline.

## Relationship to `gear-up` and `skillify`

```text
gear-up
  = acquire the smallest missing capability now

Skill Academy
  = decide whether that capability deserves to survive

skillify
  = generalize/package a qualified procedural capability for durable reuse
```

Keeping these responsibilities separate is intentional. Hot generation optimizes for the current task; durable skills optimize for portability, precision, maintainability, and reliable triggering.
