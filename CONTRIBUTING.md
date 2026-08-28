# Contributing to Overpowered

Overpowered is a suite of compact, composable Agent Skills for reliable knowledge work and enterprise automation.

## Contribution principles

A proposed skill should:

1. solve a recurring agent failure mode rather than a one-off domain task;
2. have a crisp, memorable promise;
3. define clear trigger conditions and a stopping condition;
4. prefer a short procedure over generic advice;
5. remain tool- and harness-agnostic unless integration details are isolated in references;
6. include realistic evals that demonstrate behavior beyond a capable baseline model;
7. compose cleanly with existing Overpowered primitives and skills.

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

## Pull requests

Describe:

- the failure mode the skill addresses;
- why this is not better implemented as a harness/runtime feature;
- the intended trigger conditions;
- the expected behavior change;
- the eval evidence available so far.
