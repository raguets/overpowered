# Overpowered

> **The skills that make capable agents work like excellent professionals.**

Overpowered is a composable Agent Skills suite for **knowledge work, enterprise automation, evidence-driven decisions, and reliable agentic execution**. It encodes the habits that strong knowledge workers apply almost automatically: get the right context before acting, distinguish authority from precedent, surface contradictions, hunt for exceptions, choose the right automation mechanism, preserve human authority where it matters, and verify outcomes with evidence.

It is intentionally **not** a collection of role prompts and it does not try to replace harness features such as goals, subagents, memory, RAG, or tool calling. Overpowered sits above those capabilities and teaches agents **when and how to use them well**.

The design target is the kind of leverage that disciplined software-agent workflows provide, applied to **documents, data, business processes, organizational knowledge, policies, contracts, proposals, operations, and mixed human/agent workflows**.

## One-sentence philosophy

> **Know enough before you act, make uncertainty explicit, use the right evidence, model exceptions, preserve human authority where it matters, and prove the outcome.**

## Why “Overpowered”?

A capable model already knows how to summarize a document, query a tool, or draft an answer. The largest quality gains often come from a small number of disciplined behaviors that the model does **not** apply reliably by default. Overpowered packages those behaviors as reusable skills.

```text
capable agent
    + know-enough
    + what-changed
    + find-precedent
    + find-the-exceptions
    + automate-this
    + evidence / verification primitives
    = dramatically stronger real-work behavior
```

The goal is not to invoke every skill on every task. The goal is to make the **right professional move at the right time**.

---

## Why this suite exists

Modern harnesses increasingly provide excellent runtime capabilities: tool calling, delegation, goals, subagents, memory, retrieval, and self-improvement. Those capabilities do not by themselves tell an agent **how to work well**.

This suite lives one layer above the runtime:

```text
runtime / harness capabilities
        │
        │ tools, RAG, subagents, goals, filesystem, databases
        ▼
Overpowered
        │
        │ decision policies and reusable procedures
        ▼
contracts, proposals, datasets, policies, processes, operations...
```

A retrieval extension can answer a query. `know-enough` decides whether a query is needed, what information could change the outcome, which source is appropriate, whether the result is authoritative or merely precedent, and when to stop retrieving.

A database tool can execute SQL. `ask-the-data` turns a folder of structured data and dictionaries into an evidence-backed analytical workflow.

A harness can keep running until a goal is reached. `completion-audit` independently reconstructs what “done” means and checks the evidence behind the claim.

---

# Architecture

The suite has **five layers**. The first three encode professional working methods, Level 3 routes them, and Level 4 lets an agent acquire a missing capability without turning the harness into a junk drawer.

## Level 0 — Discipline primitives

Small, composable rules that improve other skills and workflows.

| Skill | Core rule | Typical use |
|---|---|---|
| `evidence-first` | Claims require proportionate evidence. | Research, analysis, decisions, reporting |
| `assumption-audit` | Separate known facts, inferences, assumptions, and unknowns. | Planning, analysis, architecture |
| `completion-audit` | Activity is not completion; reconstruct success criteria and verify them. | Before declaring work done |
| `human-gates` | Keep humans only where authority, ambiguity, risk, or accountability requires them. | Automation design and execution |
| `dry-run` | Simulate side effects before committing risky or broad changes. | Data updates, automation, migrations |
| `checkpoint` | Make work resumable by a fresh agent without relying on chat history. | Long tasks, cross-agent handoff |

These primitives may be invoked directly, but their main value is composition.

## Level 1 — Knowledge and evidence skills

| Skill | Promise |
|---|---|
| `know-enough` | Acquire exactly the knowledge that can materially improve the next decision; no less, no more. |
| `find-precedent` | Find comparable historical cases and extract reusable lessons without blindly copying them. |
| `ask-the-data` | Query structured files through a durable analytical layer and return traceable answers. |
| `reconcile` | Resolve or expose disagreement across sources without silently choosing one. |
| `what-changed` | Explain semantic changes between versions and why they matter. |

## Level 2 — Process and automation skills

| Skill | Promise |
|---|---|
| `find-the-exceptions` | Turn happy-path rules into an exception-aware decision model. |
| `automate-this` | Compile a human process into the right mix of deterministic automation, agents, systems, and human gates. |

## Level 3 — Orchestration

| Skill | Purpose |
|---|---|
| `using-overpowered` | Select and sequence the smallest useful set of skills, reuse existing capabilities first, and route to adaptive capability only for a proven execution gap. |

## Level 4 — Adaptive capability

| Skill / protocol | Purpose |
|---|---|
| `gear-up` | Create and activate the smallest temporary capability needed to close a real execution gap, then measure whether it helped. |
| **Skill Academy** | Evidence lifecycle for generated capabilities: ephemeral → candidate → qualified → graduated. See `ACADEMY.md`. |
| `skillify` | Generalize and package a qualified/proven workflow into a durable portable Agent Skill. |

The separation is deliberate: **`gear-up` optimizes for the task in front of you; the Academy decides what deserves to survive; `skillify` optimizes a proven method for durable reuse.**

---

# The core workflow

The suite does **not** prescribe one giant pipeline. `using-overpowered` chooses only what the task needs. A typical knowledge-work flow looks like this:

```text
request
  │
  ├─ material unknowns? ───────────────► know-enough
  │                                      ├─ historical analogy? → find-precedent
  │                                      └─ structured data?    → ask-the-data
  │
  ├─ sources disagree? ────────────────► reconcile
  │
  ├─ comparing versions? ──────────────► what-changed
  │
  ├─ hidden rules / edge cases? ───────► find-the-exceptions
  │
  ├─ process to automate? ─────────────► automate-this
  │                                      ├─ human-gates
  │                                      └─ dry-run when risky
  │
  ├─ material execution gap remains?
  │      ├─ missing knowledge? ────────► know-enough, not creation
  │      ├─ installed/Academy match? ─► reuse / evaluate
  │      └─ truly uncovered? ─────────► gear-up
  │                                      └─ validate → activate → measure
  │
  └─ claiming completion? ─────────────► completion-audit
```

The important property is **conditional composition**. Do not load every skill “just in case,” and do not generate a capability “just in case.” `gear-up` is the last-mile response to a proven execution gap, not a preparation ritual.

---

# Example 1 — Contract clause review

User request:

> Review this liability clause and tell me whether we can accept it.

A disciplined agent should not immediately answer from generic legal knowledge.

```text
using-overpowered
  ↓
know-enough
  ├─ Need current company legal position
  │    → authoritative legal-policy knowledge base
  └─ Need negotiation precedent
       → find-precedent over signed historical contracts
  ↓
reconcile, only if current policy and precedent appear inconsistent
  ↓
human-gates, because final legal approval may require delegated authority
  ↓
evidence-first response
```

Possible result:

```text
Current policy
  Standard liability cap: 100% of contract value.

Relevant precedent
  Three comparable signed agreements were found.
  One accepted 150%; two remained at 100%.

Interpretation
  150% is a historical precedent, not the current normative position.

Decision
  Do not auto-approve. Route to the authorized legal approver.

Evidence
  Policy: Legal Playbook §4.2
  Precedents: Contract A §12, Contract B §9, Contract C §14
```

The key distinction is:

```text
policy      = normative authority
precedent   = historical evidence
```

The suite must never collapse those concepts.

---

# Example 2 — Reusing previous proposal material

User request:

> Draft the maintenance section of this proposal. Reuse what we have done before where appropriate.

```text
know-enough
  ├─ What capabilities are currently approved?
  │    → product reference KB
  └─ Have we answered similar requirements before?
       → find-precedent over previous proposals

find-precedent
  → extract reusable structure, rationale and wording patterns
  → flag pricing, dates and customer-specific commitments as non-transferable

evidence-first
  → current product claims must come from authoritative current sources
```

This avoids the dangerous pattern “retrieve a similar proposal and copy it.”

---

# Example 3 — Automating a weekly supplier process

Human description:

> Every Friday, Sophie downloads the supplier export, checks anomalies, asks people to correct some of them, updates the master sheet and emails Finance.

A good agent should not jump directly to an “AI agent” architecture.

```text
find-the-exceptions
  ↓
clarify anomaly categories, missing files, duplicate suppliers,
late responses, urgent cases, approval limits, reprocessing rules
  ↓
automate-this
```

Possible compiled design:

| Step | Best implementation |
|---|---|
| Detect new export | deterministic event / schedule |
| Validate schema | deterministic code |
| Match supplier IDs | SQL / rules |
| Classify ambiguous anomaly | agentic reasoning |
| Approve financial exception | human gate |
| Update master dataset | deterministic transaction |
| Notify Finance | automation |

Before deployment:

```text
dry-run
  → run on a representative historical export with side effects disabled
completion-audit
  → prove all valid source records are accounted for and no duplicate IDs were introduced
```

---

# Example 4 — Policy update impact

User request:

> The purchasing policy was revised. Tell me what actually changed and what we need to update.

```text
what-changed
  → semantic diff, not line diff
  → identify threshold, role, SLA and obligation changes
  ↓
know-enough
  → retrieve the workflows, training material and automations governed by those rules
  ↓
reconcile
  → where dependent artifacts still encode the old rule
```

Example output:

```text
MATERIAL CHANGE
Approval threshold: €20,000 → €10,000

Likely impact
HIGH    purchasing workflow
HIGH    invoice approval automation
MEDIUM  buyer training guide
LOW     supplier onboarding

Evidence
Old policy §4.3
New policy §4.1
```

---

# Example 5 — Ask structured organizational data

Project layout:

```text
project/
├── data/
│   ├── test-facilities.xlsx
│   ├── organizations.csv
│   └── data-dictionary.md
└── TASK.md
```

User request:

> Which facilities can perform environmental tests above 80°C and are available in Q4?

```text
ask-the-data
  ↓
inspect files and dictionaries
  ↓
load useful relations into DuckDB through structured-data-duckdb when available
  ↓
inspect schema and samples
  ↓
query only the required relations
  ↓
return answer + query/evidence provenance
```

`data/` and `TASK.md` are conventions, not requirements.

---

# Example 6 — Cross-agent continuation

When a long task must move to another harness or a clean context:

```text
checkpoint
```

produces a state package containing:

```text
Goal
Current state
Authoritative inputs
Decisions made + rationale
Rejected paths + rationale
Artifacts produced
Evidence gathered
Known issues
Open questions
Next recommended action
Completion criteria
```

The receiver should be able to continue **without the original chat transcript**.

---

# Example 7 — Gear up during a live task

User request:

> Build a cross-document requirement matrix. Existing extraction works, but every available normalization path loses exact requirement IDs. Keep every source traceable.

A disciplined agent should **not** immediately write helpers. First prove the gap:

```text
using-overpowered
  ↓
existing skills/tools checked
  ↓
knowledge gap? no — documents and rules are already known
  ↓
Academy match? none
  ↓
material capability gap
  ↓
gear-up
```

`gear-up` states a value test before creation:

```text
Before
  sampled normalization loses or collides on source identity.

Smallest missing capability
  one deterministic provenance-preserving normalization tool.

Success
  100% of the validation sample preserves document + original ID,
  with zero collisions.
```

The generated tool is written to an ephemeral task workspace, validated, activated only when the runtime confirms it, and used on the sample first. If it closes the gap, the task proceeds.

After the task, the default is cleanup. If the capability created material value and plausibly generalizes, only its artifact/evidence package becomes a **Skill Academy candidate**. It is not installed globally.

See the complete walkthrough in `examples/07-adaptive-capability.md`.

---

# Example 8 — Skill Academy graduation

A temporary capability that worked once is **candidate evidence**, not a permanent skill. On a later distinct task, `gear-up` searches Academy metadata before generating again. If the candidate fits, it is staged and evaluated rather than reinvented.

```text
first real task
  → gear-up → useful ephemeral capability
  → Academy candidate

second distinct task
  → reuse candidate → succeeds again
  → clean-context eval vs baseline
  → qualified

qualified method
  → skillify
  → generalized, eval-backed portable skill
  → human/project graduation gate
  → durable installation/publication
```

See `ACADEMY.md` for the lifecycle and `examples/08-academy-graduation.md` for the full example.

---

# `gear-up`, runtime adapters, and Pi

`gear-up` deliberately separates **adaptive capability policy** from **hot-loading mechanics**.

```text
gear-up
   = prove gap / choose minimum artifact / budget / validate / measure / retain?

runtime adapter
   = create isolated workspace / activate / deactivate / reload / report runtime state
```

This keeps the skill portable. A harness that cannot hot-load a generated artifact must report it as **staged**, not active.

For Pi, this repository now includes the executable `@raguets/pi-overpowered` runtime extension. It uses Pi's resource discovery and reload lifecycle for temporary skills, injects explicitly lower-authority temporary context, and registers constrained generated tools behind a trusted subprocess wrapper. See `adapters/pi.md` for its lifecycle and security boundary.

## Overpowered Runtime for Pi

Install the skills and optional runtime companion directly from Git:

```bash
pi install git:github.com/raguets/overpowered
```

The extension exposes two model-facing tools, `overpowered_capabilities` and `overpowered_runtime`, plus `/overpowered:status`, `/overpowered:cleanup`, and `/overpowered:academy`. `gear-up` remains responsible for proving the gap and choosing the smallest artifact; the extension only stages, validates, activates, records, and cleans it.

Generated executable tools require interactive confirmation. They run in a subprocess with a sanitized environment, bounded time/output, controlled working directory, and no Pi `ExtensionAPI`, but v0.3 does not claim OS-level sandboxing. Review generated code and its declared effects before approval.

---

# Skill Academy

The Academy is a selection mechanism, not an ever-growing memory dump.

```text
EPHEMERAL  →  CANDIDATE  →  QUALIFIED  →  GRADUATED
     │             │              │
     └─ discard    └─ reject      └─ retire/supersede later
```

Key rules:

- **temporary by default**;
- one successful task can justify candidate status, not generality;
- qualification needs evidence beyond the originating task;
- search lightweight Academy metadata before loading candidate bodies;
- a candidate stays visibly experimental until graduated;
- `skillify` packages/generalizes only after adequate evidence;
- durable deployment remains an explicit authority decision.

The protocol is documented in `ACADEMY.md`; templates live in `academy/`.

---

# `know-enough` and RAG / pi-rag

`know-enough` deliberately separates **retrieval policy** from **retrieval capability**.

```text
know-enough
   = when / what / where / enough?

pi-rag, MCP retriever, RAG API, vector DB tool...
   = execute retrieval
```

This makes the skill portable while allowing `pi-rag` to be an excellent implementation backend in Pi.

A knowledge-source registry is recommended. See:

- `skills/know-enough/references/knowledge-source-registry.md`
- `skills/know-enough/references/knowledge-sources.example.yaml`
- `skills/know-enough/references/pi-rag-integration.md`

The registry should describe **meaning**, not tool plumbing: scope, authority, freshness, intended uses, and exclusions.

---

# `ask-the-data` and DuckDB

`ask-the-data` is the user-facing behavior. A lower-level skill such as `structured-data-duckdb` can remain the technical implementation layer.

```text
ask-the-data
      ↓
structured-data-duckdb
      ↓
DuckDB / Excel / CSV / JSON / Parquet
```

If `structured-data-duckdb` is present, `ask-the-data` should delegate workbook inspection, ingestion, schema inspection and database operations to it rather than duplicating those mechanics.

---

# Installation model

Each folder under `skills/` is a valid Agent Skill unit with a required `SKILL.md` plus optional `references/` and `evals/`.

Install only the skills you want, or make the entire `skills/` directory visible to a skills-compatible harness.

Typical layouts include:

```text
<project>/.agents/skills/<skill-name>/SKILL.md
```

or harness-specific skill directories. Consult your harness documentation for discovery paths.

`using-overpowered` provides the suite-level routing policy. It is useful when the harness can automatically invoke matching skills. Explicit invocation remains useful for interactive commands such as `what-changed`, `find-precedent`, `automate-this`, or `gear-up`. Hot activation of artifacts generated by `gear-up` additionally requires a compatible runtime adapter; see `adapters/`.

---

# Skill-writing principles used here

This suite follows the current Agent Skills format and intentionally applies these practices:

1. **Descriptions are routing interfaces.** They say both what the skill does and when it applies.
2. **Progressive disclosure.** Core behavior stays in `SKILL.md`; deep material lives in `references/`.
3. **Moderate detail.** Instructions focus on mistakes an otherwise capable agent is likely to make.
4. **Procedures over generic advice.** Every skill contains an execution loop or decision protocol.
5. **Defaults over menus.** Each skill chooses a preferred method and gives escape hatches only when needed.
6. **Concrete output contracts.** Short templates make expected results easy to follow and verify.
7. **Gotchas are first-class.** Each skill calls out tempting but incorrect shortcuts.
8. **Composable scope.** Skills are designed like functions: coherent enough to be useful alone, narrow enough to sequence.
9. **Eval-ready.** Every skill includes `evals/evals.json` with realistic prompts and assertions.
10. **Evidence before confidence.** Uncertainty and source authority are explicit.
11. **Reuse before creation.** Adaptive capability is a fallback after installed/runtime/Academy options.
12. **Ephemeral before durable.** Generated capability must earn persistence through evidence.

Primary design references:

- Agent Skills specification: https://agentskills.io/specification
- Agent Skills best practices: https://agentskills.io/skill-creation/best-practices
- Agent Skills evaluation guidance: https://agentskills.io/skill-creation/evaluating-skills
- Agent Skills description optimization: https://agentskills.io/skill-creation/optimizing-descriptions

The suite is also influenced by the broader pattern of strong process skills: a memorable rule, explicit trigger conditions, a short procedure, failure-mode guardrails, and a measurable stopping condition.

---

# Testing and validation

## Static validation

Run:

```bash
python scripts/validate_suite.py
```

It checks:

- every skill directory contains `SKILL.md`;
- frontmatter parses as YAML;
- directory and `name` match;
- names satisfy the Agent Skills naming constraints;
- descriptions are non-empty and within the 1024-character limit;
- every `SKILL.md` is under the recommended 500-line limit;
- referenced local Markdown/YAML/JSON files exist;
- every skill has `evals/evals.json`;
- every eval file names the correct skill and contains prompts, expected outputs, and assertions;
- the expected Overpowered skill set is present;
- the Skill Academy protocol/templates and runtime adapter docs required by the adaptive layer exist.

If `skills-ref` is installed, also run the official validator against each skill:

```bash
for d in skills/*; do skills-ref validate "$d"; done
```

## Behavioral evaluation

The included eval files are **test specifications**, not proof that every model/harness already passes them. For meaningful evaluation:

1. Run each eval once with the skill and once without it (or against the previous skill version).
2. Use clean contexts.
3. Grade the assertions with concrete evidence.
4. Inspect execution traces for wasted steps and instruction failures.
5. Tighten the skill only where the evals show a real gap.

This is important: static correctness proves the package is structurally valid; only runtime evals show whether a particular model/harness follows the skill reliably.

---

# Repository layout

```text
overpowered/
├── .github/workflows/validate.yml
├── .gitignore
├── LICENSE
├── README.md
├── ARCHITECTURE.md
├── ACADEMY.md
├── CATALOG.md
├── REFERENCES.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── RELEASE_CHECKLIST.md
├── VERSION
├── adapters/
│   ├── README.md
│   └── pi.md
├── academy/
│   ├── README.md
│   ├── candidate.template.yaml
│   └── index.template.yaml
├── examples/
│   ├── 01-contract-review.md
│   ├── 02-proposal-reuse.md
│   ├── 03-process-automation.md
│   ├── 04-policy-change-impact.md
│   ├── 05-data-question.md
│   ├── 06-cross-agent-checkpoint.md
│   ├── 07-adaptive-capability.md
│   └── 08-academy-graduation.md
├── scripts/
│   └── validate_suite.py
└── skills/
    ├── evidence-first/
    ├── assumption-audit/
    ├── completion-audit/
    ├── human-gates/
    ├── dry-run/
    ├── checkpoint/
    ├── know-enough/
    ├── find-precedent/
    ├── ask-the-data/
    ├── reconcile/
    ├── what-changed/
    ├── find-the-exceptions/
    ├── automate-this/
    ├── using-overpowered/
    ├── gear-up/
    └── skillify/
```

---

# GitHub readiness

The repository includes a GitHub Actions workflow that runs the static suite validator on every push and pull request. `CONTRIBUTING.md` documents the acceptance bar for new skills and `CHANGELOG.md` starts version history.

The repository includes the **MIT License**, matching the public GitHub repository.

---

# Suggested publication strategy

For public positioning, lead with a small memorable set rather than marketing all sixteen skills equally:

```text
know-enough
what-changed
find-precedent
find-the-exceptions
automate-this
ask-the-data
gear-up
```

Keep the primitives installed underneath as quality infrastructure. `using-overpowered` can later become the suite-level entry point once the individual skills have accumulated enough real-world eval evidence.

Before release, follow `RELEASE_CHECKLIST.md`: run the behavioral evals on the harnesses/models you want to support, verify any claimed runtime-adapter behavior, and keep release/version notes current.
