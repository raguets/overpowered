---
name: using-overpowered
description: >
  Part of the Overpowered skill suite.
  Route knowledge-work and enterprise-automation tasks through the smallest relevant combination of Overpowered skills, and invoke gear-up only when a material execution capability is genuinely missing. Use when multiple suite skills may apply or when starting a non-trivial task involving organizational knowledge, conflicting evidence, evolving artifacts, business rules, process automation, risky side effects, verifiable completion, or an uncovered capability gap.
metadata:
  suite: overpowered
  suite_url: https://github.com/raguets/overpowered
  level: "3-orchestration"
  version: "0.2.0"
---

# Overpowered / Using Overpowered

## Purpose

Apply the smallest set of **Overpowered** working methods that materially improves the task. Select process/knowledge skills before implementation mechanics; never load the suite by default and never create a new capability merely because creation is possible.

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
| A material execution gap remains after reuse/knowledge/Academy checks | `gear-up` |
| A qualified/proven workflow should become a durable portable skill | `skillify` |

## Priority rules

1. **Understand before automating.** If a process is underspecified, use `find-the-exceptions` before `automate-this` finalizes the design.
2. **Know before guessing.** Use `know-enough` when retrieval can resolve a material uncertainty.
3. **Authority before analogy.** Current authoritative knowledge outranks precedent for normative questions.
4. **Conflict before synthesis.** Reconcile material disagreement before producing a single “truth.”
5. **Reuse before creation.** Installed skills/tools, generic runtime capabilities, and relevant Academy candidates outrank `gear-up` generation.
6. **Create only for a proven capability gap.** Missing knowledge, convenience, token pressure, or a long prompt are not capability gaps.
7. **Simulation before risky side effects.** Use `dry-run` when a preview meaningfully reduces risk.
8. **Evidence before completion.** Use `completion-audit` before strong done/fixed/migrated/reconciled claims.

## Do not over-compose

Do not invoke the whole suite. Typical chains are 1–4 skills. `gear-up` is a last-mile fallback, not a default member of a chain.

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

missing deterministic operation during a real task
→ reuse/search → gear-up → validate/use → Academy candidate only if valuable
```

## Interaction rule

If a skill can discover a fact from tools or artifacts, do not ask the user for that fact. Ask humans for intent, decisions, unavailable tacit knowledge, authority, or approval required by risk policy.

## Adaptive capability rule

Before `gear-up`, be able to state all of the following in one short block:

```text
Material objective at risk: ...
Why existing capabilities are insufficient: ...
Why this is not a knowledge gap: ...
Academy reuse result: ...
Smallest missing capability: ...
Observable value test: ...
```

If that block cannot be completed credibly, do not generate a new capability.

## Stop condition

Stop routing once the active skill set and existing runtime capabilities cover the material failure modes of the current task. Then execute. If a proven execution gap remains, route once through `gear-up`; do not continue meta-analysis or capability generation after the task can proceed reliably.
