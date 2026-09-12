# Overpowered — Skills Expansion Addendum
## `make-the-call`, `map-the-work`, and `using-overpowered` routing refinements

**Status:** Implementation-ready addendum for Codex  
**Repository:** `https://github.com/raguets/overpowered`  
**Scope:** Add two high-value skills, refine suite routing, update documentation/evals/validation, and prepare ClawHub publication metadata.  
**Important:** This document is an addendum to the current repository. Codex must inspect the current branch before changing anything and must not overwrite unrelated work.

---

# 1. Objective

Extend Overpowered with exactly two new skills:

1. `make-the-call`
2. `map-the-work`

Also refine `using-overpowered` with two rules that deliberately replace two rejected skill ideas:

- **Framing rule:** do not add a separate `nail-the-brief` skill. Before routing, establish only the minimum objective/outcome/constraint clarity needed to act.
- **Pressure-test composition rule:** do not add a separate `break-it` skill. Pressure-test work by composing existing Overpowered primitives.

Do **not** add:

- `nail-the-brief`
- `break-it`
- `hand-it-over`

`hand-it-over` is already substantially covered by `checkpoint`.

The suite should remain compact and follow its own principle:

> Reuse first. Create only to close a real gap.

---

# 2. Architectural placement

Do not create a new architectural level.

Update the existing layers as follows.

## Level 1 — Knowledge, evidence, and decision

Existing:

- `know-enough`
- `find-precedent`
- `ask-the-data`
- `reconcile`
- `what-changed`

Add:

- `make-the-call`

Rename the documentation heading from **Knowledge and evidence** to **Knowledge, evidence, and decision** where appropriate.

## Level 2 — Process and automation

Existing:

- `find-the-exceptions`
- `automate-this`

Add:

- `map-the-work`

Recommended conceptual order:

```text
map-the-work
    ↓
find-the-exceptions
    ↓
automate-this
```

but only when each step is materially useful.

`map-the-work` must not become a mandatory precondition for every automation task.

---

# 3. New skill: `make-the-call`

## 3.1 Product promise

> Turn sufficient evidence into a decision — or prove that the decision should be tested or deferred instead of hiding behind “it depends.”

This skill is **not** merely an option-comparison table.

Its differentiator is disciplined decision closure.

It should answer:

```text
DECIDE
or
TEST
or
DEFER
```

rather than endlessly analyze.

---

## 3.2 When to use

Use when:

- two or more viable options remain;
- a real choice must be made;
- trade-offs matter;
- evidence exists or can be obtained;
- the user expects a recommendation/decision rather than a neutral catalogue of options.

Examples:

- choose between two architectures;
- choose a vendor/tool/process;
- choose whether to build, buy, reuse, defer, or experiment;
- select among policy/process alternatives;
- decide whether evidence is sufficient to commit.

Do not use when:

- the task is only to list options;
- the decision has already been made;
- the real problem is missing knowledge that `know-enough` should retrieve first;
- the real problem is conflicting evidence that `reconcile` must resolve first;
- the choice is trivial and reversible enough to make directly without a formal decision workflow.

---

## 3.3 Required frontmatter

Follow current repository conventions and the Agent Skills specification.

Conceptual frontmatter:

```yaml
---
name: make-the-call
description: >
  Part of the Overpowered skill suite. Turn sufficient evidence into a clear
  decision when multiple viable options remain. Use when trade-offs matter and
  the agent must decide, recommend a cheap discriminating test, or explicitly
  defer because unresolved uncertainty makes commitment unsafe.
metadata:
  suite: overpowered
  suite_url: https://github.com/raguets/overpowered
  level: "1-knowledge-evidence-decision"
  version: "<current suite version>"
---
```

If the current repository uses a different exact metadata convention, preserve that convention consistently.

---

## 3.4 Decision protocol

The skill should implement approximately this protocol.

### Step 1 — State the decision

Write the actual choice in one sentence.

Bad:

```text
We need to analyze the available solutions.
```

Good:

```text
Choose whether the POC should use Open WebUI as the RAG façade or integrate Qdrant directly.
```

### Step 2 — Establish the options

Include only genuinely viable options.

Do not manufacture alternatives to satisfy a template.

If there is only one viable option, say so.

### Step 3 — Derive decision criteria from the objective

Criteria must come from the goal, constraints, risks, and actual success conditions.

For each material criterion:

```text
criterion
why it matters
evidence
how strongly it discriminates between options
```

Do not invent weights for cosmetic precision.

### Step 4 — Resolve material unknowns

Use existing Overpowered skills when needed:

```text
missing material knowledge
    → know-enough

historical comparison relevant
    → find-precedent

structured evidence
    → ask-the-data

sources disagree
    → reconcile

decision rests on hidden premises
    → assumption-audit
```

Do not duplicate those skills inside `make-the-call`.

### Step 5 — Account for reversibility and cost of delay

Ask:

- How expensive is being wrong?
- How reversible is the decision?
- How expensive is additional analysis?
- What is the cost of delaying the decision?

A cheap, reversible choice should not receive the same analysis burden as a high-impact irreversible choice.

### Step 6 — Test sensitivity

Identify the assumptions or criteria that actually drive the winner.

If a small plausible change reverses the recommendation, label the decision as fragile.

Do not hide fragile decisions behind fake numeric precision.

### Step 7 — Evaluate value of information

Before deferring, ask:

> Is there one realistic piece of information or one cheap experiment that could change the choice?

If yes and it is cheaper than committing under uncertainty, output `TEST`.

### Step 8 — Choose exactly one disposition

#### `DECIDE`

Use when evidence discriminates enough to commit.

#### `TEST`

Use when a cheap, bounded experiment can resolve the decision-driving uncertainty.

The test must state:

- hypothesis;
- what to measure;
- threshold/result that would favor each option;
- time/cost boundary.

#### `DEFER`

Use when:

- a material uncertainty remains;
- it cannot be resolved cheaply now;
- the downside of guessing is too high.

State exactly what would make the decision ready later.

Do not use `DEFER` as a polite substitute for making a call.

---

## 3.5 Output contract

Recommended concise format:

```text
Decision
<one sentence>

Disposition
DECIDE | TEST | DEFER

Why
- <decisive criterion + evidence>
- <decisive criterion + evidence>

Trade-offs accepted
- ...

Uncertainty
- <remaining uncertainty and whether it could flip the result>

Reversibility
<high / medium / low + consequence>

Next action
<commit, run test, or obtain specific missing input>
```

Do not require all sections when the answer is trivial.

---

## 3.6 Hard rules / gotchas

The skill must explicitly guard against:

1. **“It depends” without closure.**
2. **Fake weighted matrices.** Do not invent arbitrary weights/scores.
3. **Equal-detail option dumping.** Spend effort on discriminating evidence.
4. **Premature decision under missing material knowledge.**
5. **Analysis paralysis for cheap reversible decisions.**
6. **False confidence when sensitivity is high.**
7. **Deferring when a cheap discriminating test exists.**
8. **Treating precedent as normative authority.**
9. **Inventing criteria not grounded in the objective.**

---

## 3.7 Composition behavior

Typical chains:

```text
know-enough
    ↓
make-the-call
```

```text
assumption-audit
    ↓
know-enough
    ↓
make-the-call
```

```text
ask-the-data
    ↓
make-the-call
```

```text
reconcile
    ↓
make-the-call
```

`make-the-call` should consume evidence from other skills rather than recreate their mechanics.

---

## 3.8 Required evals

Create `skills/make-the-call/evals/evals.json` following the current repository schema.

Include at least these cases.

### Eval 1 — Sufficient evidence, make a decision

Prompt contains multiple viable options, explicit constraints, and enough evidence.

Assertions:

- chooses one option;
- identifies the criteria that actually discriminate;
- does not hide behind “it depends”;
- reports relevant trade-offs;
- does not invent numerical weights.

### Eval 2 — Cheap experiment dominates guessing

Two options remain and one uncertainty drives the decision.

Assertions:

- outputs `TEST`;
- defines a bounded discriminating experiment;
- gives an observable threshold/outcome;
- does not prematurely choose.

### Eval 3 — High-risk unresolved decision

Material information is unavailable and downside of guessing is high.

Assertions:

- outputs `DEFER`;
- states exactly what is missing;
- explains why guessing is unsafe;
- does not perform endless generic research.

### Eval 4 — Reversible low-cost choice

A decision is cheap and easy to reverse.

Assertions:

- decides with proportionate analysis;
- explicitly recognizes reversibility;
- avoids unnecessary research/committee-style analysis.

### Eval 5 — Fragile recommendation

Small plausible changes in a key assumption could reverse the result.

Assertions:

- identifies decision sensitivity;
- marks recommendation as fragile;
- does not disguise fragility with a scoring matrix.

---

# 4. New skill: `map-the-work`

## 4.1 Product promise

> Build an evidence-aware map of how work actually happens before redesigning or automating it.

The skill exists because:

```text
documented process
    ≠
actual process
```

and:

```text
understand the work
    ≠
automate the work
```

`automate-this` intentionally targets automation. `map-the-work` targets current-state understanding.

---

## 4.2 When to use

Use when the user needs to understand:

- how a business process actually operates;
- who does what and when;
- handoffs between people/teams/systems;
- decisions and tacit judgment;
- current inputs/outputs;
- process variants;
- rework;
- hidden manual work;
- operational pain points;
- differences between documented procedure and actual practice.

Typical triggers:

- “Help me understand how this process really works.”
- “Map this workflow before we automate it.”
- “Turn these interviews/procedures/tickets into a current-state process.”
- “Where are the handoffs and hidden decisions?”
- “Why does this process behave differently in practice?”

Do not use when:

- the current process is already sufficiently understood and the user directly wants automation — use `automate-this`;
- the primary task is only exception modeling — use `find-the-exceptions`;
- the request is merely to draw a flowchart from an already-complete specification;
- the goal is a future-state redesign rather than understanding current state.

---

## 4.3 Required frontmatter

Conceptual frontmatter:

```yaml
---
name: map-the-work
description: >
  Part of the Overpowered skill suite. Build an evidence-aware current-state
  map of how work actually happens across people, systems, decisions, handoffs,
  exceptions, and tacit rules. Use when a business process must be understood
  before improvement, redesign, or automation.
metadata:
  suite: overpowered
  suite_url: https://github.com/raguets/overpowered
  level: "2-process-automation"
  version: "<current suite version>"
---
```

Preserve current repository metadata conventions.

---

## 4.4 Mapping protocol

### Step 1 — State the process boundary

Identify:

- trigger/start;
- intended outcome/end;
- scope;
- actors/systems in scope.

Do not silently expand to the whole organization.

### Step 2 — Gather evidence before interviewing unnecessarily

Inspect available:

- procedures;
- documents;
- forms;
- spreadsheets;
- tickets;
- logs;
- messages;
- screenshots;
- examples;
- data dictionaries;
- prior mappings.

If a fact is discoverable from supplied tools/artifacts, do not ask the human for it.

### Step 3 — Separate three views

Maintain an explicit distinction between:

```text
DOCUMENTED
what procedures/policies say should happen

OBSERVED / EVIDENCED
what artifacts/data/examples show actually happens

REPORTED / TACIT
what people say they really do or decide
```

When they disagree, do not silently collapse them.

Use `reconcile` if the disagreement is material and must be resolved.

### Step 4 — Map the current flow

Capture at least:

```text
trigger
inputs
activities
decisions
handoffs
actors
systems
data/artifacts
outputs
```

Do not optimize yet.

### Step 5 — Find work that normal flowcharts miss

Explicitly look for:

- queues/wait states;
- handoffs;
- re-entry/rework;
- duplicate entry;
- manual reconciliation;
- copy/paste;
- shadow spreadsheets;
- out-of-band email/chat;
- escalation;
- tacit expert judgment;
- approval;
- missing/late inputs;
- system boundaries;
- local workarounds.

### Step 6 — Map variants and exceptions proportionately

Identify common variants and material exception families.

If exception behavior is complex enough to require a real decision model, route to:

```text
find-the-exceptions
```

Do not duplicate that skill in full.

### Step 7 — Mark evidence and uncertainty

Each important process claim should be classifiable as:

```text
confirmed
inferred
reported
unknown
```

Avoid presenting an interviewee's description as established process truth when no corroboration exists.

### Step 8 — Identify friction without redesigning

Capture pain points such as:

- delays;
- rework;
- ambiguity;
- duplicate handling;
- error-prone transfer;
- poor traceability;
- bottlenecks;
- unnecessary human intervention.

But separate:

```text
current-state observation
```

from:

```text
future-state recommendation
```

Do not redesign the process unless explicitly asked.

### Step 9 — Determine whether the map is sufficient

Stop when the map is sufficient for the user's next decision.

Do not continue process discovery indefinitely.

If the user's next goal is automation:

```text
map-the-work
    ↓
find-the-exceptions, if needed
    ↓
automate-this
```

---

## 4.5 Output contract

Recommended structure:

```text
Process
<name + boundary>

Trigger
...

Outcome
...

Current-state flow
1. ...
2. ...
3. ...

Decisions
- decision / actor / input / rule or judgment

Handoffs
- from → to / artifact / failure risk

Systems & data
- ...

Variants / exceptions
- ...

Tacit work
- ...

Friction
- ...

Evidence status
- confirmed:
- reported:
- inferred:
- unknown:

Material gaps
- ...

Ready for next step?
YES / NO
If yes: <e.g. find-the-exceptions / automate-this / make-the-call>
```

Keep the representation proportional to process complexity.

---

## 4.6 Hard rules / gotchas

The skill must guard against:

1. **Mapping the documented process as if it were actual practice.**
2. **Redesigning while supposedly mapping current state.**
3. **Ignoring tacit work and unofficial artifacts.**
4. **Treating one person's account as universal truth.**
5. **Missing handoffs, queues, and rework.**
6. **Inventing precision not supported by evidence.**
7. **Running a long interview for facts already discoverable in artifacts.**
8. **Automatically routing every process map into automation.**
9. **Duplicating `find-the-exceptions`.**
10. **Calling `map-the-work` when `automate-this` already has a sufficiently clear current-state model.**

---

## 4.7 Composition behavior

Typical chains:

```text
map-the-work
    ↓
find-the-exceptions
    ↓
automate-this
```

```text
map-the-work
    ↓
reconcile
```

when documented/reported/evidenced process descriptions materially disagree.

```text
map-the-work
    ↓
make-the-call
```

when the map exists to support a business decision rather than automation.

```text
map-the-work
    ↓
checkpoint
```

when discovery continues across sessions/agents.

---

## 4.8 Required evals

Create `skills/map-the-work/evals/evals.json`.

Include at least:

### Eval 1 — Documented vs actual process

Input includes a formal procedure plus examples/interview evidence showing workarounds.

Assertions:

- distinguishes documented from actual/reported behavior;
- maps the current flow;
- surfaces discrepancies without silently reconciling them;
- preserves evidence status.

### Eval 2 — Hidden handoffs and tacit work

Input contains a seemingly simple process with email, spreadsheet, approval, and expert judgment.

Assertions:

- identifies handoffs;
- captures shadow/manual work;
- identifies decision points and tacit judgment;
- does not jump straight to an AI-agent architecture.

### Eval 3 — Do not redesign

User asks only for a current-state map.

Assertions:

- maps current state;
- may list friction;
- does not silently propose a future-state redesign.

### Eval 4 — Automation handoff

User ultimately wants automation, but the current flow is unclear.

Assertions:

- uses `map-the-work` conceptually first;
- identifies whether exception discovery is needed;
- hands the resulting map to `automate-this`;
- does not duplicate the full automation design inside `map-the-work`.

### Eval 5 — Skip unnecessary mapping

The prompt already contains an authoritative, complete current-state flow and asks to automate it.

Assertions:

- does not insist on `map-the-work`;
- routes directly to `automate-this` unless material ambiguity remains.

---

# 5. `using-overpowered` changes

Modify:

```text
skills/using-overpowered/SKILL.md
skills/using-overpowered/evals/evals.json
```

Preserve all existing adaptive-capability behavior (`gear-up`, Academy reuse, etc.) already present in the current repository.

Do not regress the current routing rules.

---

# 6. New routing entries

Add routing conditions for the two new skills.

Conceptually:

| Condition | Use |
|---|---|
| Multiple viable options remain and a consequential choice must be made | `make-the-call` |
| Need to understand how work actually happens before improvement/automation | `map-the-work` |

Refine the automation routing distinction:

```text
Current work/process is not sufficiently understood
    → map-the-work

Current flow is understood but non-happy paths are underspecified
    → find-the-exceptions

Current flow + material exception behavior are sufficiently understood and the goal is automation
    → automate-this
```

Do not require all three on every task.

---

# 7. New rule 1 in `using-overpowered`: minimal framing before routing

Do **not** create `nail-the-brief`.

Add a small framing gate before substantial routing.

Recommended wording/logic:

```text
Before routing, determine whether the objective, desired outcome,
and material constraints are clear enough to act.

If yes:
    route normally.

If no:
    1. resolve facts that are discoverable from available tools/artifacts;
    2. use assumption-audit when the plan depends on material assumptions;
    3. ask the human only for intent, tacit knowledge, authority, or
       decision-changing information that cannot be discovered;
    4. ask the smallest number of questions needed to make progress.

Do not turn routine work into an interview.
Do not ask for information that can be discovered.
Do not demand perfect specification before starting reversible work.
```

This rule should reinforce the existing interaction rule, not duplicate it.

---

# 8. New rule 2 in `using-overpowered`: pressure-test by composition

Do **not** create `break-it`.

Add a composition rule for requests such as:

- “stress-test this”
- “try to break this”
- “red-team this plan”
- “what could go wrong?”
- “pressure-test this workflow”

Recommended logic:

```text
Need to pressure-test a proposed solution?

→ assumption-audit
    when hidden premises could invalidate the design

→ find-the-exceptions
    when rules/processes/non-happy paths matter

→ dry-run
    when the next step has material side effects and simulation can reduce risk

→ completion-audit
    after execution or before accepting a strong completion claim
```

Apply only the subset that materially improves the task.

Do not route to all four mechanically.

The rule should explicitly state:

> Pressure-testing is a composition pattern, not a separate Overpowered skill.

---

# 9. `using-overpowered` priority refinements

Add or refine priority rules without creating contradictory ordering.

Recommended concepts:

## Clarify only what changes the work

```text
Discover first; ask only for unresolved information that can materially change the next action.
```

## Understand actual work before automating when needed

```text
If the current process is materially unclear, use map-the-work before automate-this.
If it is already clear, do not remap it.
```

## Decide when evidence is sufficient

```text
When several viable options remain after relevant evidence work,
use make-the-call rather than ending with an uncommitted pros/cons list.
```

## Pressure-test by composition

Use existing primitives rather than inventing a wrapper skill.

---

# 10. `using-overpowered` eval additions

Update its eval file with at least four new cases.

## Eval A — Vague request, minimal framing

Prompt is ambiguous enough that one missing decision changes the work, while other facts are discoverable from supplied artifacts.

Assertions:

- discovers available facts rather than asking for them;
- asks only the material unresolved question;
- does not demand a full brief;
- does not create/invoke `nail-the-brief`.

## Eval B — Pressure-test a workflow

Prompt asks to stress-test a proposed business workflow.

Assertions:

- composes the relevant existing primitives;
- uses `assumption-audit` and/or `find-the-exceptions` as appropriate;
- uses `dry-run` only if side effects warrant it;
- does not invent/invoke `break-it`.

## Eval C — Decision routing

Prompt contains several viable options with a real decision required.

Assertions:

- routes to `make-the-call`;
- uses `know-enough`, `reconcile`, etc. first only if materially necessary.

## Eval D — Process discovery routing

Prompt asks to understand how a process really works before automating it.

Assertions:

- routes to `map-the-work`;
- then `find-the-exceptions` / `automate-this` only if the user goal requires them.

Add an additional negative case if the current eval schema/practice supports it:

## Eval E — Don't over-map

Prompt already gives a complete current-state process and asks to automate it.

Assertions:

- routes to `automate-this` directly;
- does not invoke `map-the-work` merely because a process exists.

---

# 11. README.md changes

README update is mandatory.

Do not rewrite unrelated sections.

At minimum:

## 11.1 Architecture count

Change references from 16 skills to 18 where present.

## 11.2 Level 1

Rename:

```text
Knowledge and evidence skills
```

to:

```text
Knowledge, evidence, and decision skills
```

Add:

```text
make-the-call
Turn sufficient evidence into DECIDE, TEST, or DEFER instead of hiding behind “it depends.”
```

## 11.3 Level 2

Add:

```text
map-the-work
Build an evidence-aware current-state map of how work actually happens before redesign or automation.
```

## 11.4 Core workflow

Extend the routing diagram conceptually with:

```text
objective unclear?
    → discover what can be discovered
    → assumption-audit if material
    → ask minimum decision-changing question

need to understand actual process?
    → map-the-work

multiple viable options require a choice?
    → make-the-call

process to automate?
    → map-the-work only if needed
    → find-the-exceptions only if needed
    → automate-this
```

## 11.5 Explain the rejected wrapper-skills principle

Add a short note, preferably near composition guidance:

```text
Overpowered prefers composition over wrapper proliferation.
For example, pressure-testing is composed from assumption-audit,
find-the-exceptions, dry-run, and completion-audit as needed rather than
being packaged as a separate break-it skill.
```

Do not mention rejected brainstorming history unless it improves the public README.

## 11.6 Examples

Add short examples for:

### Decision

```text
know-enough → make-the-call
```

or:

```text
assumption-audit → know-enough → make-the-call
```

### Business process understanding

```text
map-the-work → find-the-exceptions → automate-this
```

with clear note that the latter two are conditional.

## 11.7 Repository layout / installation

Ensure both new skill folders appear if the README enumerates skill files/directories.

Do not change the documented Pi runtime package identity `@raguets/pi-overpowered`.

If the README currently contains an outdated package name for the runtime extension, fix it only if the current repository/package metadata confirms the mismatch.

---

# 12. Other repository documentation changes

Codex should update the minimum coherent documentation set, not only README.

Required:

```text
README.md
ARCHITECTURE.md
CATALOG.md
CHANGELOG.md
VERSION
RELEASE_CHECKLIST.md           # only if skill-count/release checks require it
scripts/validate_suite.py      # or current suite validator
examples/README.md             # if it indexes all examples
```

Update other files only when current repository references make it necessary.

---

# 13. Architecture documentation

Update `ARCHITECTURE.md` so:

```text
Level 1
Knowledge, evidence, and decision
    + make-the-call

Level 2
Process and automation
    + map-the-work
```

Add the distinction:

```text
map-the-work = current-state understanding
find-the-exceptions = non-happy-path/decision-model enrichment
automate-this = compile understood work into executable automation
```

Add the decision distinction:

```text
know-enough = determine/acquire sufficient evidence
make-the-call = close the decision once evidence is sufficient
```

Keep the adaptive layer unchanged.

---

# 14. CATALOG.md

Add both skills with concise public promises and trigger conditions.

Recommended promises:

```text
make-the-call
Turn sufficient evidence into a clear decision, a discriminating test,
or an explicit justified defer.

map-the-work
Map how work actually happens across actors, handoffs, systems, data,
decisions, exceptions, and tacit rules before redesign or automation.
```

Update skill counts.

---

# 15. Versioning

Codex must inspect the current `VERSION` and `CHANGELOG.md`.

This is a feature addition, not merely a patch.

Recommended SemVer behavior:

- if current version is `0.3.x`, target `0.4.0`;
- otherwise increment the current minor version according to the repository's established release policy.

Update each changed/new skill's metadata version consistently if the suite currently versions skill metadata with suite releases.

Do not blindly force `0.4.0` if the repository has moved beyond that version.

---

# 16. Validation changes

Update the suite validator's expected skill set from 16 to 18.

The validator must expect:

```text
make-the-call
map-the-work
```

Ensure both have:

```text
SKILL.md
evals/evals.json
```

Run:

```bash
python scripts/validate_suite.py
```

Also run any existing tests for the Pi extension/runtime because changes to `using-overpowered` must not break runtime integration assumptions.

---

# 17. New examples

Recommended, but keep concise.

Add:

```text
examples/09-make-the-call.md
examples/10-map-the-work.md
```

### Example 09

A real option decision where:

```text
assumption-audit
    ↓
know-enough
    ↓
make-the-call
    ↓
DECIDE
```

Include a contrasting mini-case ending in `TEST`.

### Example 10

A real business-process discovery:

```text
procedure + interviews + examples
    ↓
map-the-work
    ↓
documented vs actual behavior
    ↓
handoffs / tacit rules / rework
    ↓
find-the-exceptions
    ↓
automate-this
```

Clearly mark `find-the-exceptions` and `automate-this` as conditional next steps.

Update `examples/README.md`.

---

# 18. Files expected to be added

At minimum:

```text
skills/make-the-call/SKILL.md
skills/make-the-call/evals/evals.json

skills/map-the-work/SKILL.md
skills/map-the-work/evals/evals.json
```

Recommended:

```text
examples/09-make-the-call.md
examples/10-map-the-work.md
```

Do not add reference files unless the core `SKILL.md` would otherwise become too long or repetitive.

---

# 19. Files expected to be modified

Expected minimum:

```text
skills/using-overpowered/SKILL.md
skills/using-overpowered/evals/evals.json

README.md
ARCHITECTURE.md
CATALOG.md
CHANGELOG.md
VERSION
scripts/validate_suite.py
```

Possibly:

```text
RELEASE_CHECKLIST.md
examples/README.md
MANIFEST.sha256
package metadata
```

only when required by current repository conventions.

Codex must report the actual changed-file list at completion.

---

# 20. Required quality gate for the two new skills

Before finalizing each new skill, apply the same anti-proliferation test used to justify this addendum:

## Internal overlap

Does an existing Overpowered skill already cover most of the behavior?

Expected answer:

```text
make-the-call:
No. Existing skills prepare/validate evidence but do not own decision closure.

map-the-work:
No. automate-this explicitly targets automation; map-the-work owns current-state understanding.
```

## Composition test

Could the behavior be represented more cleanly as composition only?

Expected answer:

```text
make-the-call:
No. DECIDE / TEST / DEFER is a coherent reusable contract.

map-the-work:
No. Current-state process discovery is independently useful even without automation.
```

## Ecosystem differentiation

The public skill description must make the Overpowered-specific contract visible.

## Narrow scope

Do not expand either skill until it starts absorbing neighboring skills.

---

# 21. ClawHub publication metadata

Use `overpowered` as a common topic for all suite skills.

For the three skills affected by this addendum, use:

## `using-overpowered`

Categories:

```text
agents
```

Topics:

```text
overpowered
orchestration
skill-routing
agent-workflows
```

## `make-the-call`

Categories:

```text
agents
productivity
knowledge
```

Topics:

```text
overpowered
decision-making
trade-offs
evidence
reversibility
```

## `map-the-work`

Categories:

```text
productivity
automation
knowledge
```

Topics:

```text
overpowered
process-mapping
workflow-analysis
business-processes
process-discovery
```

These stay within ClawHub's current limits of at most 3 categories and 5 topics per skill.

---

# 22. ClawHub PowerShell commands

Run from the root of the Overpowered repository after implementation, tests, commit, and Git push.

First verify identity:

```powershell
clawhub whoami
```

## 22.1 Dry-run — modified `using-overpowered`

```powershell
clawhub skill publish ./skills/using-overpowered `
  --owner raguets `
  --slug using-overpowered `
  --name "Using Overpowered" `
  --categories "agents" `
  --topics "overpowered,orchestration,skill-routing,agent-workflows" `
  --dry-run
```

## 22.2 Dry-run — new `make-the-call`

```powershell
clawhub skill publish ./skills/make-the-call `
  --owner raguets `
  --slug make-the-call `
  --name "Make the Call" `
  --categories "agents,productivity,knowledge" `
  --topics "overpowered,decision-making,trade-offs,evidence,reversibility" `
  --dry-run
```

## 22.3 Dry-run — new `map-the-work`

```powershell
clawhub skill publish ./skills/map-the-work `
  --owner raguets `
  --slug map-the-work `
  --name "Map the Work" `
  --categories "productivity,automation,knowledge" `
  --topics "overpowered,process-mapping,workflow-analysis,business-processes,process-discovery" `
  --dry-run
```

If all previews are correct, publish.

## 22.4 Publish — modified `using-overpowered`

```powershell
clawhub skill publish ./skills/using-overpowered `
  --owner raguets `
  --slug using-overpowered `
  --name "Using Overpowered" `
  --categories "agents" `
  --topics "overpowered,orchestration,skill-routing,agent-workflows"
```

Because its files changed, ClawHub should publish the next patch version by default.

## 22.5 Publish — new `make-the-call`

```powershell
clawhub skill publish ./skills/make-the-call `
  --owner raguets `
  --slug make-the-call `
  --name "Make the Call" `
  --categories "agents,productivity,knowledge" `
  --topics "overpowered,decision-making,trade-offs,evidence,reversibility"
```

A new skill should start at `1.0.0` unless an explicit version is supplied.

## 22.6 Publish — new `map-the-work`

```powershell
clawhub skill publish ./skills/map-the-work `
  --owner raguets `
  --slug map-the-work `
  --name "Map the Work" `
  --categories "productivity,automation,knowledge" `
  --topics "overpowered,process-mapping,workflow-analysis,business-processes,process-discovery"
```

A new skill should start at `1.0.0` unless an explicit version is supplied.

---

# 23. Why individual `skill publish` commands are preferred here

Do not use:

```powershell
clawhub sync --root ./skills --all
```

for this metadata-sensitive release unless you intentionally want metadata handled separately.

Reason:

- `sync` can publish new/changed skills;
- but current ClawHub `sync` does not accept per-skill `--categories` or `--topics`;
- these three skills require different catalog metadata.

Individual `skill publish` commands are clearer and safer for this release.

---

# 24. Codex completion checklist

Codex must not declare completion until it reports:

```text
[ ] make-the-call/SKILL.md created
[ ] make-the-call evals created and valid
[ ] map-the-work/SKILL.md created
[ ] map-the-work evals created and valid

[ ] using-overpowered routes decisions to make-the-call
[ ] using-overpowered routes current-state process discovery to map-the-work
[ ] using-overpowered contains minimal framing rule
[ ] using-overpowered contains pressure-test composition rule
[ ] no nail-the-brief skill added
[ ] no break-it skill added
[ ] no hand-it-over skill added

[ ] README updated
[ ] ARCHITECTURE updated
[ ] CATALOG updated
[ ] CHANGELOG/VERSION updated consistently
[ ] validator expects 18 skills
[ ] examples/docs updated where required

[ ] existing suite validator passes
[ ] all relevant tests pass
[ ] no unrelated skill behavior regressed
[ ] no unrelated files overwritten

[ ] exact added/modified/deleted file list reported
[ ] final suite version reported
```

---

# 25. Final instruction to Codex

Implement this addendum in the current Overpowered repository.

First inspect the live repository and current versions of:

```text
README.md
ARCHITECTURE.md
CATALOG.md
CHANGELOG.md
VERSION
skills/using-overpowered/SKILL.md
skills/using-overpowered/evals/evals.json
skills/automate-this/SKILL.md
skills/find-the-exceptions/SKILL.md
skills/know-enough/SKILL.md
skills/assumption-audit/SKILL.md
skills/checkpoint/SKILL.md
scripts/validate_suite.py
```

Preserve existing work, especially the adaptive capability layer and `@raguets/pi-overpowered` runtime integration.

Then implement only the smallest coherent change set described here.

The desired result is an 18-skill suite in which:

> `make-the-call` closes decisions, `map-the-work` understands real work, and `using-overpowered` handles ambiguous framing and pressure-testing through disciplined composition rather than unnecessary new wrapper skills.
