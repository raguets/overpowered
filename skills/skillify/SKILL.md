---
name: skillify
description: >
  Package a proven, repeatable workflow into a portable Agent Skill with concise instructions, progressive disclosure, trigger-focused metadata, gotchas, and evals. Use after the workflow has succeeded in practice and the user wants to distribute/reuse the method across compatible harnesses; do not use merely to save a conversation or replace harness-native self-learning.
compatibility: >
  Portable Agent Skills packaging workflow. Behavioral eval execution depends on the host harness or external eval runner.
metadata:
  suite: overpowered
  level: "3-meta-experimental"
  version: "0.1.0"
---

# Skillify

## Positioning

This skill is for **productizing a proven workflow**, not merely remembering it. Harness-native self-learning may already capture local procedures; `skillify` focuses on portability, minimality, trigger quality, and testability.

## Core rule

**Extract the invariant method, remove accidental project context, and prove the skill adds value with realistic evals.**

## Procedure

1. Require evidence that the workflow actually worked at least once. If not, treat it as a draft experiment, not a proven skill.
2. Extract:
   - reusable sequence;
   - corrections that mattered;
   - non-obvious gotchas;
   - required capabilities/tools;
   - stopping condition;
   - output contract.
3. Remove project-specific names, paths, values, and assumptions unless they are intentionally part of a domain skill.
4. Define one coherent responsibility. Split only when parts can usefully stand alone.
5. Write a precise `description` that covers both capability and trigger conditions.
6. Keep `SKILL.md` concise; move deep details to one-level `references/` files.
7. Add 2–3 realistic evals, including a boundary/should-not-overtrigger case.
8. Validate Agent Skills structure and naming.
9. Test with a clean context against a no-skill or prior-version baseline when the environment permits.
10. Refactor away instructions that do not measurably improve behavior.

## Output package

```text
skill-name/
├── SKILL.md
├── references/       # only when needed
└── evals/
    └── evals.json
```

## Gotchas

- A conversation summary is not a skill.
- Generic advice the model already knows is context tax.
- Do not encode one successful answer; encode the reusable procedure.
- Do not copy runtime-specific tool names unless the skill intentionally targets that runtime.
- Do not claim the skill is “tested” unless behavioral evals actually ran.

## Stop condition

Stop when the package is structurally valid, its scope is coherent, trigger metadata is precise, and evals can distinguish the desired behavior from a baseline.
