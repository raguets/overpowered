# Contributing to Overpowered

Overpowered is a suite of compact, composable Agent Skills for reliable knowledge work, enterprise automation, and evidence-gated adaptive capability.

## Contribution principles

A proposed skill should:

1. solve a recurring agent failure mode rather than a one-off domain task;
2. have a crisp, memorable promise;
3. define clear trigger conditions and a stopping condition;
4. prefer a short procedure over generic advice;
5. remain tool- and harness-agnostic unless integration details are isolated in references/adapters;
6. include realistic evals that demonstrate behavior beyond a capable baseline model;
7. compose cleanly with existing Overpowered primitives and skills;
8. explain why the behavior belongs in a portable skill rather than a harness/runtime feature.

For adaptive capability contributions, additionally preserve these invariants:

- reuse before creation;
- knowledge gaps are not capability gaps;
- create the weakest sufficient artifact;
- generated artifacts are ephemeral by default;
- executable generated artifacts are untrusted until validated;
- staged is not active;
- Academy promotion is evidence-based, not automatic.

## Local validation

```bash
python -m pip install pyyaml
python scripts/validate_suite.py
```

If `skills-ref` is available, also validate each skill with the official Agent Skills validator.

## Adding a skill

Create:

```text
skills/<skill-name>/
├── SKILL.md
└── evals/
    └── evals.json
```

Use `references/` only for conditional detail that should not consume context on every invocation.

Update `CATALOG.md`, `ARCHITECTURE.md`, and the README when the new skill changes suite-level routing or composition.

## Adding a runtime adapter

Portable skills must not hard-code the adapter's implementation details. Document the adapter under `adapters/`, preserve the conceptual contract in `skills/gear-up/references/runtime-contract.md`, and include evidence for every hot-load behavior claimed as supported.

An adapter that writes a file but cannot confirm runtime activation must return **staged**, not active.

## Academy changes

Changes to qualification/graduation policy belong in `ACADEMY.md` and should preserve lightweight metadata search: never require loading all candidate artifacts into startup context.

## Pull requests

Describe:

- the failure mode the change addresses;
- why this is not better implemented as a harness/runtime feature;
- the intended trigger conditions;
- the expected behavior change;
- the eval evidence available so far;
- for adaptive/runtime changes, permissions, activation semantics, cleanup, and Academy lifecycle impact.
