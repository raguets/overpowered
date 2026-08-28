---
name: know-enough
description: >
  Acquire the minimum sufficient knowledge needed to make the next material decision: identify knowledge gaps, choose the right authoritative or contextual sources, retrieve selectively, assess sufficiency, and stop when more retrieval is unlikely to change the outcome. Use when organization-specific, historical, current, or otherwise missing knowledge could materially affect the task and retrieval/RAG/search tools are available.
compatibility: >
  Works with any Agent Skills-compatible harness. Retrieval is tool-agnostic; optional backends include Pi retrieval extensions such as pi-rag, MCP retrievers, RAG APIs, search tools, or vector/database tools.
metadata:
  suite: overpowered
  level: "1-knowledge"
  version: "0.1.0"
---

# Know Enough

## Core rule

**Know enough to act well — no less, no more. Retrieval must have an information objective.**

Before each search, be able to complete:

> I am looking for **[information]** because it could change **[decision/action]**.

If you cannot complete that sentence, do not retrieve yet.

## Procedure

1. **Define the next decision.** What are you trying to decide, produce, or verify now?
2. **Inventory current knowledge.** Separate known facts, assumptions, and material unknowns.
3. **Prioritize gaps.** Retrieve only gaps that can materially change the next decision.
4. **Choose the source by role.** Prefer an available knowledge-source registry. Distinguish:
   - authoritative / normative;
   - precedent / historical;
   - observational / operational;
   - reference / explanatory.
5. **Form focused queries.** Search for the missing fact or evidence, not the whole topic.
6. **Evaluate results.** Check relevance, authority, freshness, scope, and contradictions.
7. **Iterate only if needed.** Reformulate, search another source, or call `reconcile` when material evidence conflicts.
8. **Stop when sufficient.** Additional retrieval should be unlikely to change the next decision.

## Retrieval budget

Default to the smallest useful search sequence. Expand only when:

- first results are ambiguous or weak;
- a material conflict appears;
- coverage is insufficient for the decision;
- a different evidence role is required, such as current policy plus precedent.

## Output contract

Keep a compact knowledge state when the task is non-trivial:

```text
Decision to support
Known
Missing but material
Sources consulted + role
What was learned
Remaining uncertainty
Sufficiency: ENOUGH / NOT ENOUGH
```

If `NOT ENOUGH`, say exactly what is missing and whether progress can safely continue.

## Knowledge-source registry

Read `references/knowledge-source-registry.md` when multiple knowledge bases or retrieval tools exist.
Use `references/knowledge-sources.example.yaml` as a portable example.
If using Pi with a `pi-rag`-style retrieval extension, read `references/pi-rag-integration.md`.

## Gotchas

- Do not retrieve everything because retrieval is available.
- Do not ask the user for a fact that an available source can cheaply establish.
- Do not treat semantic similarity as authority.
- Do not treat precedent as current policy.
- Do not keep researching after the decision is already robust to additional information.
- If the task is purely transformative and all required content is present, do not retrieve.

## Composition

- Need historical analogs → `find-precedent`.
- Sources materially disagree → `reconcile`.
- Needed facts live in structured files → `ask-the-data`.
- Material claim must be supported → `evidence-first`.

## Stop condition

Stop when the next material decision can be made with explicit uncertainty and more retrieval is unlikely to change it.
