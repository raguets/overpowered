---
name: using-overpowered
description: >
  Route knowledge-work and enterprise-automation tasks through the smallest relevant combination of Overpowered skills. Use when multiple suite skills may apply or when starting a non-trivial task involving organizational knowledge, conflicting evidence, evolving artifacts, business rules, process automation, risky side effects, or verifiable completion.
metadata:
  suite: overpowered
  level: "3-orchestration"
  version: "0.1.0"
---

# Using Overpowered

## Purpose

Apply the smallest set of **Overpowered** working methods that materially improves the task. Select process skills before implementation mechanics; never load the suite by default.

## Routing protocol

Before substantial action, scan these conditions:

| Condition | Use |
|---|---|
| Material organization-specific/current/historical knowledge is missing | `know-enough` |
| Prior cases may help | `find-precedent` |
| Answer lives in structured files | `ask-the-data` |
| Sources materially disagree | `reconcile` |
| Versions/snapshots must be compared | `what-changed` |
| Plan depends on hidden premises | `assumption-audit` |
| Rules/process have likely non-happy paths | `find-the-exceptions` |
| Human process should become executable automation | `automate-this` |
| Human authority/risk boundary must be designed | `human-gates` |
| Side effects are broad/irreversible/costly | `dry-run` |
| Material claims need traceability | `evidence-first` |
| Work is about to be declared complete | `completion-audit` |
| Work must survive a context/harness boundary | `checkpoint` |
| A proven workflow should become a portable skill | `skillify` |

## Priority rules

1. **Understand before automating.** If a process is underspecified, use `find-the-exceptions` before `automate-this` finalizes the design.
2. **Know before guessing.** Use `know-enough` when retrieval can resolve a material uncertainty.
3. **Authority before analogy.** Current authoritative knowledge outranks precedent for normative questions.
4. **Conflict before synthesis.** Reconcile material disagreement before producing a single “truth.”
5. **Simulation before risky side effects.** Use `dry-run` when a preview meaningfully reduces risk.
6. **Evidence before completion.** Use `completion-audit` before strong done/fixed/migrated/reconciled claims.

## Do not over-compose

Do not invoke the whole suite. Typical chains are 1–4 skills.

Examples:

```text
contract clause
→ know-enough → find-precedent → human-gates

policy revision
→ what-changed → know-enough

business process automation
→ find-the-exceptions → automate-this → dry-run

data question
→ ask-the-data → completion-audit only if a strong completion claim matters
```

## Interaction rule

If a skill can discover a fact from tools or artifacts, do not ask the user for that fact. Ask humans for intent, decisions, unavailable tacit knowledge, or authority.

## Stop condition

Stop routing once the active skill set covers the material failure modes of the current task. Then execute those skills rather than continuing meta-analysis.
