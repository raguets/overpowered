# Overpowered Runtime Extension for Pi
## Implementation Specification for Codex

**Status:** Implementation-ready specification  
**Target repository:** https://github.com/raguets/overpowered  
**Target harness:** Pi  
**Proposed extension name:** `Overpowered Runtime`  
**Proposed implementation folder:** `extensions/overpowered-runtime/`  
**Proposed package/distribution name (if later published separately):** `overpowered-pi-runtime`  
**Baseline date:** 2026-09-02

---

# 1. Purpose

Implement a Pi extension that turns Overpowered's `gear-up` policy into an operational runtime capability.

Overpowered skills define **how an agent should reason and work**. The extension must provide the Pi-specific mechanics required to:

1. inspect what capabilities are already available;
2. create an isolated temporary capability workspace;
3. validate temporary context, skills, and executable tools;
4. activate those capabilities during the current task;
5. preserve state across Pi reloads;
6. measure and record whether a generated capability actually helped;
7. discard temporary capabilities by default;
8. promote only useful artifacts into the Overpowered Skill Academy as **candidates**, never directly into permanent harness configuration;
9. cleanly deactivate and remove temporary capabilities.

The extension must implement the operational side of the existing Overpowered design, especially:

- `skills/gear-up/SKILL.md`
- `skills/gear-up/references/runtime-contract.md`
- `ACADEMY.md`
- `adapters/pi.md`

The repository currently defines the policy and reference adapter design, but intentionally does **not** contain an executable Pi runtime adapter. This specification fills that gap.

---

# 2. Product idea in one sentence

> Give an agent the ability to acquire the smallest missing capability when it needs it, use it immediately, prove whether it helped, and keep only the capabilities that earn their place.

---

# 3. Core separation of responsibilities

This separation is mandatory.

```text
Overpowered skills
    = reasoning policy
    = when to retrieve, compare, verify, gear up, etc.

gear-up
    = decides whether a capability gap really exists
    = decides the smallest artifact worth creating
    = defines the expected value test

Overpowered Runtime extension
    = trusted Pi-side lifecycle manager
    = inventories, stages, validates, activates, reloads, records, cleans up

Skill Academy
    = evidence-based retention and promotion pipeline

skillify
    = downstream generalization/packaging of a qualified procedural capability
```

The runtime extension must **not** make `gear-up`'s cognitive decision for the agent.

It must not spontaneously create capabilities.

It exposes reliable mechanics. The skill supplies the decision policy.

---

# 4. Existing Overpowered rules that are normative

The implementation must preserve these existing rules.

## 4.1 Reuse before creation

Before allowing a new capability to be created, the workflow should be able to inspect:

1. currently loaded Pi skills;
2. currently available Pi tools;
3. active Overpowered temporary capabilities;
4. Skill Academy metadata;
5. only then create something new.

The extension is not required to prove that the agent performed perfect semantic reuse analysis, but it must make the information available.

## 4.2 Knowledge gap is not a capability gap

Missing knowledge should normally be resolved by `know-enough` and retrieval capabilities such as `pi-rag`.

The extension must not duplicate RAG functionality.

`pi-rag` remains an independent knowledge retrieval capability.

## 4.3 Minimum viable artifact

The supported decision order is:

```text
missing knowledge                 -> no artifact; use retrieval
one-off generic operation         -> no artifact; use existing tools
task-wide instruction             -> temporary context fragment
reusable procedure for this task  -> temporary skill
missing deterministic operation   -> temporary generated tool
procedure + missing operation      -> skill + tool, only when justified
```

## 4.4 Keep nothing by default

An ephemeral capability must not become permanent simply because it worked once.

Default terminal outcome:

```text
EPHEMERAL -> discard
```

A useful artifact may become:

```text
EPHEMERAL -> CANDIDATE
```

It must **never** become `GRADUATED` automatically.

## 4.5 Runtime truthfulness

The extension must report explicit states:

- `staged`
- `validated`
- `active`
- `inactive`
- `failed`
- `discarded`
- `candidate`

Never report a skill/tool/context as loaded or active unless Pi/runtime state confirms it.

---

# 5. Goals

## G1 — Provide capability inventory

The agent must be able to ask what skills, tools, temporary capabilities, and Academy candidates are available.

## G2 — Provide isolated task-scoped runtime workspaces

All generated artifacts must live in a controlled `.overpowered/runtime/<run-id>/` workspace until promoted.

## G3 — Support hot temporary context

A generated task instruction/context fragment must be activatable without modifying the user's durable `AGENTS.md`.

## G4 — Support hot temporary skills

A generated skill must be staged in the runtime workspace and become discoverable by Pi through the supported Pi resource discovery/reload lifecycle.

## G5 — Support hot generated tools

A generated deterministic tool must be activatable in the current Pi session through a trusted runtime wrapper.

The generated artifact must **not** receive Pi's `ExtensionAPI`.

## G6 — Preserve state across Pi reloads

Staged and active capabilities must survive the runtime extension instance being torn down and reconstructed by `ctx.reload()`.

## G7 — Support evidence recording

The agent must be able to record:

- the capability gap;
- expected value test;
- validation evidence;
- observed result;
- success/failure;
- limitations;
- reuse hypothesis.

## G8 — Integrate with Skill Academy

Useful ephemeral capabilities may be copied to an Academy candidate store with metadata and evidence.

## G9 — Clean teardown

Ephemeral capabilities must be deactivatable and removable safely.

## G10 — Remain small in the model context

Expose a small number of runtime tools. Do not register one management tool per operation.

---

# 6. Non-goals for v0.1

The first implementation must explicitly **not** attempt the following:

1. autonomous generation of capabilities without `gear-up`/agent intent;
2. RAG or vector search — use `pi-rag` or other retrieval systems;
3. permanent skill installation;
4. automatic Academy graduation;
5. autonomous global Academy promotion;
6. arbitrary extension generation and loading;
7. arbitrary subagent/agent definition generation;
8. orchestration of multi-agent trees;
9. full OS-level sandboxing of untrusted code;
10. remote/shared Academy service;
11. semantic vector search over Academy content;
12. automatic npm publication;
13. replacing Pi permissions or existing security extensions.

Agent/subagent definitions may be explored in a later version only if Pi exposes an official and safe runtime mechanism.

---

# 7. Pi capabilities the implementation should use

Codex must re-check the **current official Pi documentation before coding** and adapt names if the API has changed.

As of the baseline date, the relevant official Pi mechanisms are:

## 7.1 Extension factory

Pi extensions are TypeScript modules receiving `ExtensionAPI`.

Current package naming in official Pi docs uses:

```ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
```

Do not copy obsolete package names from old examples without checking current Pi docs.

## 7.2 Dynamic tools

`pi.registerTool()` may be called after startup.

Newly registered tools become visible in the same session without `/reload`.

`pi.getAllTools()`, `pi.getActiveTools()`, and `pi.setActiveTools()` can inspect and control tool availability.

## 7.3 Resource discovery for temporary skills

Use:

```ts
pi.on("resources_discover", ...)
```

The extension may return extra `skillPaths`.

This is the preferred mechanism for temporary skill discovery.

Do **not** edit `.pi/settings.json` merely to add temporary skill paths.

## 7.4 Reload

`ctx.reload()` reloads Pi resources and recreates the extension runtime.

Important constraint:

> treat `await ctx.reload()` as terminal for the current command handler.

State required after reload must be persisted **before** the reload.

## 7.5 Runtime state persistence

Use `pi.appendEntry(customType, data)` for session state that must survive reload/session reconstruction.

The extension may also maintain an on-disk runtime manifest.

Both are useful:

```text
session custom entry  -> session/reload continuity
runtime manifest      -> filesystem truth / recovery / debugging
```

## 7.6 Context injection

Pi's `before_agent_start` event can inject an additional message and/or alter the system prompt.

For generated context, prefer an explicit Overpowered custom context message rather than modifying the user's durable project files.

Generated context is lower-authority task context and must be clearly marked as such.

## 7.7 Resource reload continuation

A tool execution context cannot directly use the command-only `ctx.reload()` API.

Implement an internal extension command, e.g.:

```text
/overpowered:reload
```

When a skill activation requires a reload:

1. persist pending activation state;
2. queue the internal reload command as a follow-up;
3. the command calls `await ctx.reload(); return;`;
4. the reloaded extension reconstructs state;
5. `resources_discover` contributes active temporary skill paths;
6. after successful reload, trigger a custom Overpowered continuation message so the agent can resume the interrupted task.

Use Pi's supported `sendMessage`/`sendUserMessage` behavior rather than assuming the old extension instance remains valid after reload.

---

# 8. Recommended repository changes

Implement inside the existing Overpowered repository.

Proposed additions:

```text
overpowered/
├── extensions/
│   └── overpowered-runtime/
│       ├── index.ts
│       ├── config.ts
│       ├── types.ts
│       ├── state.ts
│       ├── paths.ts
│       ├── inventory.ts
│       ├── workspace.ts
│       ├── context-manager.ts
│       ├── skill-manager.ts
│       ├── generated-tool-manager.ts
│       ├── generated-tool-runner.ts
│       ├── validator.ts
│       ├── academy.ts
│       ├── security.ts
│       ├── commands.ts
│       └── ui.ts
├── tests/
│   └── overpowered-runtime/
│       ├── paths.test.ts
│       ├── state.test.ts
│       ├── validators.test.ts
│       ├── academy.test.ts
│       ├── generated-tool-runner.test.ts
│       └── fixtures/
├── package.json                 # add if absent
├── README.md                    # update
├── ARCHITECTURE.md              # update
└── adapters/pi.md               # update from reference design to implemented adapter docs
```

The exact module split may change if Codex finds a simpler structure, but responsibilities must remain separated.

Do not rewrite unrelated skills.

---

# 9. Pi package/distribution design

The repository should become directly installable as a Pi package from Git.

Target user experience:

```bash
pi install git:github.com/raguets/overpowered
```

The root `package.json` should declare both the existing skills and the runtime extension.

Conceptual manifest:

```json
{
  "name": "@raguets/overpowered",
  "version": "0.3.0",
  "private": false,
  "license": "MIT",
  "pi": {
    "extensions": [
      "./extensions/overpowered-runtime/index.ts"
    ],
    "skills": [
      "./skills"
    ]
  },
  "peerDependencies": {
    "@earendil-works/pi-coding-agent": "*",
    "@earendil-works/pi-ai": "*",
    "typebox": "*"
  }
}
```

If YAML parsing is needed at runtime, add a small maintained YAML library to `dependencies`.

Do not require a build step merely to run the extension under Pi unless current Pi packaging rules require one.

The Git install path is the MVP acceptance path. npm publication is optional and out of scope.

---

# 10. Filesystem model

## 10.1 Runtime workspace

Default project-local root:

```text
<project>/.overpowered/runtime/
```

One run:

```text
.overpowered/runtime/<run-id>/
├── run.json
├── artifacts/
│   ├── <artifact-id>/
│   │   ├── artifact.json
│   │   ├── skill/...
│   │   ├── context/...
│   │   └── tool/...
│   └── ...
└── evidence/
    └── <artifact-id>/
```

Use JSON for runtime state because it is strict and easy to validate.

Existing Overpowered YAML examples remain documentation-compatible; runtime implementation does not need to use YAML internally.

## 10.2 Project Academy

Default candidate store:

```text
<project>/.overpowered/academy/
├── index.json
├── candidates/
│   └── <capability-id>/
│       ├── candidate.json
│       ├── artifact/
│       └── evidence/
├── qualified/
├── rejected/
└── retired/
```

## 10.3 User/global Academy

Optional user scope:

```text
~/.overpowered/academy/
```

It may be searched if enabled.

Promotion to the user/global Academy must require explicit confirmation by default because it can move project-derived artifacts outside the project boundary.

## 10.4 Git behavior

Add/recommend:

```gitignore
.overpowered/runtime/
```

Do **not** automatically add `.overpowered/academy/` to `.gitignore`, because some teams may intentionally version their Academy.

The extension must not modify `.gitignore` automatically without explicit user intent.

---

# 11. Core domain model

Use explicit typed records.

## 11.1 Artifact types

```ts
type ArtifactType =
  | "context"
  | "skill"
  | "tool";
```

No `"agent"` type in v0.1.

## 11.2 Artifact lifecycle

```ts
type ArtifactState =
  | "created"
  | "staged"
  | "validated"
  | "active"
  | "inactive"
  | "failed"
  | "discarded"
  | "candidate";
```

## 11.3 Outcome classification

```ts
type CapabilityOutcome =
  | "ineffective"
  | "useful_once"
  | "reusable_signal";
```

## 11.4 Run record

A run record should minimally contain:

```ts
interface RuntimeRun {
  runId: string;
  projectRoot: string;
  createdAt: string;
  updatedAt: string;
  capabilityGap: string;
  successTest: string;
  status: "open" | "closed";
  artifacts: string[];
}
```

## 11.5 Artifact record

```ts
interface RuntimeArtifact {
  artifactId: string;
  runId: string;
  type: ArtifactType;
  name: string;
  description: string;
  sourcePath: string;
  state: ArtifactState;

  capabilityGap: string;
  successTest: string;

  createdAt: string;
  updatedAt: string;

  validation?: ValidationResult;
  activation?: ActivationResult;
  outcome?: OutcomeRecord;

  sideEffects?: SideEffectDeclaration;
  dependencies?: string[];
  limitations?: string[];
}
```

---

# 12. Capability inventory

Expose enough information for `gear-up` to honor "reuse before creation".

The inventory should include:

## 12.1 Pi tools

Use:

```ts
pi.getAllTools()
pi.getActiveTools()
```

Return:

- name;
- description;
- source;
- active/inactive;
- parameter summary when useful.

Do not dump full huge JSON schemas unless explicitly requested.

## 12.2 Pi skills

During `before_agent_start`, capture the currently loaded skill metadata from Pi's structured system prompt options.

Maintain a lightweight session snapshot:

- name;
- description;
- file/source when available.

The inventory tool will normally be called after `before_agent_start`, so this snapshot should be populated.

## 12.3 Active Overpowered artifacts

Return:

- ID;
- type;
- name;
- state;
- run ID;
- short purpose.

## 12.4 Academy metadata

Search only metadata/index first.

Do not load every candidate artifact body into context.

---

# 13. Agent-facing tools

Keep the model-facing surface small.

Implement exactly two primary management tools unless a compelling Pi limitation requires otherwise.

---

## 13.1 `overpowered_capabilities`

Purpose:

> Inspect existing capabilities before creating new ones.

Suggested actions:

```text
inventory
search_academy
inspect_academy_candidate
```

Conceptual parameters:

```ts
{
  action: "inventory" | "search_academy" | "inspect_academy_candidate",
  query?: string,
  candidateId?: string,
  includeInactiveTools?: boolean
}
```

### inventory

Return concise sections:

```text
LOADED SKILLS
AVAILABLE TOOLS
ACTIVE TEMPORARY CAPABILITIES
ACADEMY HINTS
```

### search_academy

Search project Academy first, optional user Academy second.

MVP ranking can be deterministic text/token matching over:

- name;
- capability gap;
- tags;
- description;
- reuse hypothesis.

No embeddings required.

### inspect_academy_candidate

Load detailed metadata for one candidate.

Do not automatically activate it.

---

## 13.2 `overpowered_runtime`

Purpose:

> Manage a capability after `gear-up` has justified its creation.

Suggested actions:

```text
create_workspace
register_artifact
validate_artifact
activate_artifact
deactivate_artifact
record_outcome
nominate_candidate
cleanup
status
```

Conceptual parameters should use a discriminated union where practical.

The tool must validate all paths and IDs rather than trusting LLM-provided filesystem paths.

---

# 14. Human-facing commands

Register namespaced commands.

Required:

```text
/overpowered:status
/overpowered:cleanup
/overpowered:academy
```

Internal/support command:

```text
/overpowered:reload
```

Optional:

```text
/overpowered:config
```

Do not use generic command names such as `/status`, `/cleanup`, or `/reload`.

---

# 15. Workspace creation

`create_workspace` must accept:

- capability gap;
- success test;
- optional suggested run label.

It creates a run directory and returns:

```json
{
  "runId": "...",
  "root": ".../.overpowered/runtime/<run-id>",
  "artifactsRoot": "...",
  "evidenceRoot": "..."
}
```

Use collision-resistant IDs.

Do not derive raw paths directly from untrusted user text.

All mutations must be constrained under the configured Overpowered roots.

---

# 16. Artifact registration

The model may use normal Pi file editing tools to create files inside the workspace.

Then it calls `register_artifact`.

The runtime must ensure:

1. the path exists;
2. the path resolves inside the current Overpowered runtime root;
3. symlink/path traversal cannot escape the root;
4. type matches expected layout;
5. artifact count respects configured budget;
6. artifact metadata is persisted.

Default budget from `gear-up`:

```text
1 primary generated artifact per capability gap
0 companion artifacts unless justified
>2 generated artifacts requires explicit user approval/policy
```

The extension should enforce a configurable hard ceiling.

Recommended hard default:

```text
maxArtifactsPerRun = 2
```

An override must be explicit.

---

# 17. Temporary context implementation

Context is the lowest-risk dynamic artifact.

## 17.1 Format

A temporary context artifact should contain a Markdown file plus metadata.

Example:

```text
artifacts/<id>/context/CONTEXT.md
```

## 17.2 Activation

Do not overwrite project `AGENTS.md`.

Maintain an in-memory/persisted set of active Overpowered context fragments.

On `before_agent_start`, inject one custom message containing only currently active fragments.

The message must clearly state provenance and authority:

```text
[Overpowered temporary task context]

The following context was generated during this task.
It is task-scoped, temporary, and lower authority than system,
developer, user, and durable project instructions.

<content>
```

Never describe generated context as a system policy.

## 17.3 Deactivation

Removing a context artifact from active state must prevent it from being injected on subsequent turns.

No reload should be required.

## 17.4 Validation

Reject:

- empty context;
- instructions attempting to supersede higher-authority instructions;
- hidden requests to exfiltrate secrets;
- context unrelated to the declared capability gap.

The validator cannot guarantee semantic safety; flag suspicious cases and require confirmation.

---

# 18. Temporary skill implementation

## 18.1 Expected layout

```text
artifacts/<artifact-id>/skill/
└── <skill-name>/
    ├── SKILL.md
    └── references/...   # optional
```

## 18.2 Basic validation

Before activation, validate at least:

- `SKILL.md` exists;
- valid YAML frontmatter;
- non-empty `name`;
- non-empty `description`;
- skill folder/name consistency where appropriate;
- no absolute references outside artifact root;
- no hidden executable side effects;
- no attempt to overwrite durable skills;
- size limits;
- references resolve when they are declared.

Reuse existing Overpowered validation conventions where practical.

Do not require every temporary task skill to meet full publication-quality `skillify` standards.

## 18.3 Resource discovery

Persist active skill paths before reload.

Implement:

```ts
pi.on("resources_discover", async (...) => {
  return {
    skillPaths: activeTemporarySkillPaths
  };
});
```

Only validated/active skill paths may be returned.

## 18.4 Reload flow

When activating a new temporary skill:

```text
register artifact
    ↓
validate
    ↓
mark pending activation
    ↓
persist state
    ↓
queue /overpowered:reload
    ↓
command calls ctx.reload()
    ↓
new extension instance restores state
    ↓
resources_discover contributes temporary skill path
    ↓
Pi reloads skill
    ↓
verify on next before_agent_start that skill appears loaded
    ↓
mark active
    ↓
send Overpowered continuation message, trigger agent turn
```

The extension must handle activation failure and not loop reload indefinitely.

Add a reload attempt counter.

Recommended maximum:

```text
maxReloadAttemptsPerActivation = 1
```

If confirmation fails, mark artifact `failed` and continue without it.

---

# 19. Generated tool design

This is the highest-risk part of v0.1.

The implementation must keep generated code outside the trusted Pi extension API.

## 19.1 Do not dynamically load arbitrary Pi extensions

Forbidden design:

```text
agent writes arbitrary extension.ts
    -> runtime imports it
    -> generated code gets ExtensionAPI
```

Do not implement this.

## 19.2 Generated tool protocol

A generated tool is a constrained program behind a trusted Overpowered wrapper.

Suggested layout:

```text
artifacts/<artifact-id>/tool/
├── tool.json
└── src/
    └── main.mjs        # or main.py
```

`tool.json` example:

```json
{
  "name": "normalize_requirement",
  "description": "Normalize requirement identifiers into canonical form.",
  "runtime": "node",
  "entrypoint": "src/main.mjs",
  "inputSchema": {
    "type": "object",
    "properties": {
      "value": { "type": "string" }
    },
    "required": ["value"],
    "additionalProperties": false
  },
  "sideEffects": {
    "filesystemRead": "none",
    "filesystemWrite": "none",
    "network": false,
    "process": false
  },
  "timeoutMs": 5000
}
```

## 19.3 Process contract

The generated program must:

1. read one JSON value from stdin;
2. emit one JSON value to stdout;
3. write diagnostics only to stderr;
4. exit `0` on protocol success;
5. never depend on Pi APIs.

Suggested response:

```json
{
  "ok": true,
  "text": "REQ-0012",
  "data": {
    "normalized": "REQ-0012"
  }
}
```

## 19.4 Registration

The trusted extension parses `tool.json` and dynamically registers a Pi tool whose `execute()` function invokes the generated program through the trusted runner.

The Pi-facing wrapper owns:

- schema validation;
- timeout;
- cancellation;
- output size;
- execution;
- error formatting;
- telemetry/evidence;
- activation/deactivation.

## 19.5 Runtime support

MVP may support:

```text
node
python
```

If Python is not available, report that clearly.

Do not invoke through a shell string.

Use argument arrays and a controlled working directory.

## 19.6 Environment

Generated processes receive a sanitized environment.

Do not forward secrets/API keys by default.

Allow only a small environment allowlist such as:

- `PATH`
- platform-required variables
- explicitly configured non-secret variables.

If a tool requires a credential, do not silently expose the process environment. Require explicit user configuration/approval.

## 19.7 Side-effect declaration

The manifest must declare effects.

At minimum:

```ts
interface SideEffectDeclaration {
  filesystemRead: "none" | "workspace" | "project" | "custom";
  filesystemWrite: "none" | "workspace" | "project" | "custom";
  network: boolean;
  process: boolean;
}
```

The declaration is not proof.

Treat it as a contract to validate and gate.

## 19.8 Default confirmation policy

Recommended default:

```text
context activation  -> automatic after validation
skill activation    -> automatic after validation
generated tool      -> user confirmation before first activation
```

Allow configuration later for trusted read-only tools.

Never auto-approve a tool declaring:

- network access;
- project writes;
- external process execution;
- destructive behavior;
- secrets;
- financial/legal/production side effects.

Those must use `human-gates`.

## 19.9 Safety limitation

The MVP does **not** claim full OS sandboxing.

Document this clearly.

The trusted runner reduces exposure by:

- no Pi ExtensionAPI access;
- no shell string;
- controlled CWD;
- sanitized environment;
- timeout;
- output limit;
- path validation;
- confirmation gates.

A future strict sandbox/container runner may be added.

---

# 20. Dynamic tool activation

After validation/approval:

1. build Pi tool schema from the generated tool manifest;
2. `pi.registerTool(...)`;
3. ensure the tool appears in `pi.getAllTools()`;
4. add it to active tools with `pi.setActiveTools(...)`;
5. preserve existing active tools;
6. mark artifact active;
7. persist state.

Do not remove unrelated tools when activating a generated tool.

On reload/session reconstruction:

1. restore active generated tool records;
2. revalidate that files still exist;
3. re-register wrappers;
4. reactivate only those that were active.

If reconstruction fails, mark the artifact failed rather than silently dropping it.

---

# 21. Deactivation and cleanup

## 21.1 Context

Remove from active context list.

## 21.2 Skill

Remove from active skill paths and perform a controlled reload if required for Pi to stop advertising it.

## 21.3 Tool

Use `pi.setActiveTools()` to remove the generated tool from active tools.

If Pi cannot unregister a dynamically registered tool, it may remain registered-but-inactive for the session.

That is acceptable if status is explicit.

## 21.4 Files

Do not delete an artifact that has been nominated into the Academy until Academy copy integrity is verified.

## 21.5 Session shutdown

On ordinary session shutdown:

- persist state;
- clean ephemeral artifacts according to config;
- do not delete Academy candidates.

On `reason === "reload"`:

- do **not** perform normal destructive cleanup.

This distinction is critical.

---

# 22. Runtime state persistence

Use a small event-sourced/snapshot approach.

After each meaningful state transition:

```ts
pi.appendEntry("overpowered-runtime-state", snapshot)
```

On `session_start`, scan session entries and restore the latest snapshot.

Also persist run/artifact JSON under `.overpowered/runtime`.

The filesystem record is required for:

- recovery;
- debugging;
- Academy copying;
- reload safety.

Session custom entries are required for:

- Pi session continuity;
- reload reconstruction.

Do not store secrets in either.

---

# 23. Academy implementation

The extension implements only the operational candidate lifecycle.

The normative higher-level lifecycle remains in `ACADEMY.md`.

## 23.1 Search

Search lightweight metadata first.

Project scope should rank before user/global scope.

Return only a small shortlist.

## 23.2 Candidate nomination

`nominate_candidate` requires:

- artifact was validated;
- artifact was actually used;
- outcome exists;
- outcome is not `ineffective`;
- reuse hypothesis is non-empty.

Candidate record must include:

```text
capability gap
artifact type
artifact hash
origin run
validation evidence
observed task outcome
limitations
dependencies
side effects
reuse hypothesis
timestamps
```

## 23.3 Promotion rules

The runtime may create a **CANDIDATE**.

It must not create `QUALIFIED` or `GRADUATED` automatically.

Those states belong to later evaluation and `skillify`/human deployment workflows.

## 23.4 User/global promotion

Copying a project-derived candidate to `~/.overpowered/academy` requires confirmation by default.

This protects project confidentiality boundaries.

---

# 24. Evidence recording

`record_outcome` should accept:

```ts
{
  artifactId: string;
  classification: "ineffective" | "useful_once" | "reusable_signal";
  observedResult: string;
  evidence?: Array<{
    kind: string;
    description: string;
    path?: string;
  }>;
  limitations?: string[];
  reuseHypothesis?: string;
}
```

The extension does not decide whether the evidence is logically sufficient.

That remains an agent/skill responsibility, potentially using `completion-audit` or `evidence-first`.

The extension ensures the evidence is durably associated with the artifact.

---

# 25. Configuration

Support layered configuration:

```text
defaults
    ↓
~/.overpowered/config.json
    ↓
<project>/.overpowered/config.json
```

Project values override user values.

Suggested defaults:

```json
{
  "runtime": {
    "maxArtifactsPerRun": 2,
    "cleanup": "on-session-end",
    "maxReloadAttemptsPerActivation": 1
  },
  "academy": {
    "projectEnabled": true,
    "userEnabled": true,
    "globalCandidatePromotion": "confirm"
  },
  "context": {
    "autoActivateAfterValidation": true
  },
  "skills": {
    "autoActivateAfterValidation": true
  },
  "generatedTools": {
    "enabled": true,
    "activation": "confirm",
    "allowedRuntimes": ["node", "python"],
    "defaultTimeoutMs": 10000,
    "maxTimeoutMs": 60000,
    "maxStdoutBytes": 1048576
  }
}
```

Invalid config must fail safely and visibly.

Do not make the extension unusable when config is absent.

---

# 26. Security requirements

These are mandatory.

## SEC-001 — Project trust

Do not activate project-generated executable artifacts in an untrusted project.

Use Pi's project trust state/API where available.

## SEC-002 — Path containment

Every artifact path must be canonicalized and checked against the configured runtime root.

Reject traversal and symlink escape.

## SEC-003 — No secret inheritance

Generated tool processes must not inherit the full environment.

## SEC-004 — No generated Pi extension execution

Generated code must not receive `ExtensionAPI`.

## SEC-005 — No automatic permanent install

Never write generated artifacts into:

- global Pi skill directories;
- global extension directories;
- durable project `.pi` directories;

unless the user explicitly requests a permanent installation workflow outside `gear-up`.

## SEC-006 — Human gates

Require confirmation for generated executable capabilities by default.

Always gate elevated/destructive/external behavior.

## SEC-007 — Higher-authority instructions win

Temporary context must be labelled and treated as lower authority.

## SEC-008 — Output limits

Bound generated process stdout/stderr and runtime.

## SEC-009 — Atomic writes

Use temporary files + rename for important state/index writes where feasible.

## SEC-010 — No credential logging

Never serialize process environment or secrets into runtime manifests/evidence.

---

# 27. Failure handling

All operations should return structured, honest failure states.

Examples:

## Skill reload failed

```text
Temporary skill validated but Pi reload did not confirm it as loaded.
State: failed
Files retained for inspection.
No claim of activation was made.
```

## Generated tool failed validation

```text
Generated tool rejected:
- undeclared project write
- invalid input schema
```

## Academy copy failed

```text
Artifact remains ephemeral.
Candidate promotion failed.
Runtime source was not deleted.
```

## Cleanup partially failed

Report exact paths that remain.

Never hide partial failure.

---

# 28. UI / ergonomics

Keep UI useful but minimal.

Suggested notifications:

```text
Overpowered: temporary skill staged
Overpowered: reload complete; skill active
Overpowered: generated tool rejected by validation
Overpowered: capability recorded as Academy candidate
Overpowered: ephemeral runtime cleaned
```

`/overpowered:status` should show:

```text
OVERPOWERED RUNTIME

Run
  id: ...
  gap: ...

Active
  [skill] compare-clauses
  [tool] normalize_requirement
  [context] customer-format-rules

Pending
  none

Academy
  candidates created this session: 1
```

Do not spam notifications for every internal state write.

---

# 29. Example end-to-end workflow — temporary skill

User asks:

> Compare 80 contracts and normalize semantically equivalent liability clauses.

Agent invokes `gear-up`.

It concludes that existing capabilities cannot reliably apply the required repeated domain-specific normalization procedure.

```text
1. overpowered_capabilities.inventory
2. overpowered_capabilities.search_academy
3. no adequate existing capability
4. overpowered_runtime.create_workspace
5. agent writes temporary SKILL.md under returned workspace
6. overpowered_runtime.register_artifact(type=skill)
7. overpowered_runtime.validate_artifact
8. overpowered_runtime.activate_artifact
9. extension persists state and queues reload
10. resources_discover contributes skill path
11. skill appears in Pi after reload
12. extension triggers continuation
13. agent uses temporary skill
14. record_outcome(useful_once/reusable_signal)
15. nominate_candidate if justified
16. cleanup runtime copy
```

---

# 30. Example end-to-end workflow — temporary context

Agent discovers a project-specific convention:

> all equipment IDs in this task must be interpreted as 12-character canonical IDs.

The rule must remain salient for the task but does not deserve a skill.

```text
1. create workspace
2. write CONTEXT.md
3. register context artifact
4. validate
5. activate
6. no Pi reload
7. before_agent_start injects temporary context on later agent turns
8. task completes
9. record outcome
10. deactivate / cleanup
```

Do not modify `AGENTS.md`.

---

# 31. Example end-to-end workflow — generated deterministic tool

Agent must normalize thousands of repeated requirement IDs.

Existing shell/Python calls are becoming repetitive and fragile.

`gear-up` decides a narrow deterministic helper is justified.

```text
1. inventory
2. Academy search
3. create workspace
4. generate tool.json + main.mjs
5. register artifact
6. validate manifest/code/protocol
7. run smoke test
8. ask user for activation confirmation
9. trusted Overpowered wrapper calls pi.registerTool()
10. add tool using pi.setActiveTools()
11. confirm presence in pi.getAllTools()
12. agent calls normalize_requirement
13. record evidence
14. deactivate
15. nominate candidate only if reuse hypothesis is credible
```

The generated program never receives `ExtensionAPI`.

---

# 32. Required tests

Use automated tests where possible and add at least one real Pi smoke-test procedure.

## 32.1 Unit tests

### Paths

- reject `../` escape;
- reject symlink escape;
- accept path within run root;
- handle Windows paths correctly.

### Runtime state

- create run;
- register artifact;
- state transitions;
- persist/restore;
- reload snapshot reconstruction.

### Skill validator

- valid skill;
- missing frontmatter;
- broken reference;
- oversized skill;
- path escape.

### Context validator

- empty;
- valid;
- suspicious authority override warning.

### Tool manifest validator

- valid Node tool;
- invalid schema;
- missing entrypoint;
- undeclared/invalid runtime;
- excessive timeout;
- effect declaration validation.

### Academy

- index search;
- project scope outranks user scope;
- candidate creation;
- candidate requires outcome;
- failed copy does not delete source.

### Generated tool runner

- JSON stdin/stdout success;
- malformed stdout;
- timeout;
- cancellation;
- non-zero exit;
- stdout size cap;
- environment sanitization.

## 32.2 Integration tests

Where feasible, create a test harness around Pi extension APIs or Pi SDK.

Validate:

1. generated tool registration appears in `getAllTools`;
2. `setActiveTools` preserves existing tools;
3. active generated tool can execute;
4. active skill path is returned by `resources_discover`;
5. session snapshot can reconstruct after simulated reload.

## 32.3 Manual Pi smoke test

Document a reproducible manual test:

```text
A. Install Overpowered from local checkout.
B. Start Pi in a temporary project.
C. Verify Overpowered skills are visible.
D. Ask for /overpowered:status.
E. Activate a temporary context.
F. Activate a fixture temporary skill and force reload.
G. Verify the skill is loaded after reload.
H. Activate a deterministic fixture tool.
I. Verify tool is callable immediately.
J. Record outcome.
K. Nominate candidate.
L. Cleanup.
M. Verify runtime folder removed and candidate retained.
```

---

# 33. Acceptance criteria

The implementation is complete only when all of the following are true.

## AC-001 Installation

A clean user can install from the repository via Pi's Git package mechanism.

## AC-002 Existing suite still works

Existing Overpowered skills continue to validate with:

```bash
python scripts/validate_suite.py
```

or the repository's current equivalent.

## AC-003 Inventory

The agent can inspect:

- loaded skills;
- tools;
- active temporary capabilities;
- Academy candidates.

## AC-004 Context hot activation

Temporary context can affect subsequent agent turns without modifying durable `AGENTS.md`.

## AC-005 Skill hot activation

A temporary skill can be created, validated, staged, loaded through `resources_discover` + reload, and confirmed available.

## AC-006 Tool hot activation

A generated deterministic tool can be validated, registered, activated, and called in the same Pi session without reload.

## AC-007 Reload persistence

After skill-triggered Pi reload, Overpowered runtime state is restored.

## AC-008 No arbitrary extension execution

Generated code does not receive Pi `ExtensionAPI`.

## AC-009 Cleanup

Temporary artifacts can be removed without deleting Academy candidates.

## AC-010 Academy candidate

A successful artifact can be copied to the project Academy as `CANDIDATE` with evidence.

## AC-011 No auto-graduation

No execution path silently makes a candidate permanent or graduated.

## AC-012 Security

Path escape, secret environment inheritance, invalid tool manifests, and untrusted executable activation are blocked/gated.

## AC-013 Windows compatibility

Path logic and normal usage work on Windows/PowerShell as well as Unix-like systems.

## AC-014 Honest status

Activation failures are visible and never reported as success.

---

# 34. Implementation phases

Codex should implement in these increments rather than attempting everything at once.

## Phase 1 — Foundation

- package manifest;
- extension entrypoint;
- config;
- path-safe workspace manager;
- state persistence;
- `/overpowered:status`;
- `/overpowered:cleanup`.

**Exit condition:** extension loads and state survives a simulated reload.

## Phase 2 — Inventory + Academy metadata

- loaded tool inventory;
- loaded skill snapshot;
- Academy index/search;
- `overpowered_capabilities`.

**Exit condition:** `gear-up` can reliably inspect reuse options.

## Phase 3 — Temporary context

- context registration/validation;
- `before_agent_start` injection;
- activate/deactivate.

**Exit condition:** context works with no durable `AGENTS.md` modification.

## Phase 4 — Temporary skills

- skill validation;
- `resources_discover`;
- reload command;
- pending activation state;
- post-reload verification and continuation.

**Exit condition:** a fixture skill becomes available after controlled reload.

## Phase 5 — Generated tools

- tool manifest;
- runner;
- schema validation;
- confirmation gate;
- `registerTool`;
- `setActiveTools`;
- deactivation.

**Exit condition:** fixture tool becomes callable without reload.

## Phase 6 — Evidence + Academy candidate

- `record_outcome`;
- candidate creation;
- hashes;
- evidence copy;
- cleanup preservation.

**Exit condition:** a useful artifact survives only as candidate while runtime copy is cleaned.

## Phase 7 — Docs, integration tests, hardening

- README;
- adapters/pi.md;
- architecture update;
- test matrix;
- Windows paths;
- failure/recovery tests.

---

# 35. Expected documentation changes after implementation

Update:

## README.md

Add a short section:

```text
Overpowered Runtime for Pi
```

Explain:

- optional runtime companion;
- `gear-up` relationship;
- install from Git;
- commands;
- generated tool security warning.

## ARCHITECTURE.md

Change Pi adapter from reference-only concept to actual implemented runtime.

## adapters/pi.md

Keep the conceptual explanation, but add:

- installation;
- configuration;
- tool/command names;
- activation lifecycle;
- troubleshooting.

## ACADEMY.md

Only minimal changes should be needed.

Do not collapse Academy policy into extension docs.

---

# 36. Compatibility and graceful degradation

Overpowered skills must remain usable without the extension.

If the runtime extension is absent:

```text
gear-up policy still works
but hot activation may not be available
```

If generated tools are disabled:

```text
context + skill capabilities still work
```

If Python is unavailable:

```text
Node-generated tools can still work
Python runtime must report unsupported
```

If Academy is disabled:

```text
ephemeral capabilities work
candidate promotion is unavailable
```

Do not create all-or-nothing coupling.

---

# 37. Interaction with pi-rag

The extension must know that `pi-rag` may be present as a normal Pi tool/extension, but it must have **no hard dependency** on it.

Expected behavior:

```text
gear-up:
"Is this missing capability or missing knowledge?"

If knowledge:
    know-enough -> pi-rag or another retrieval mechanism

If capability:
    Overpowered Runtime may create/activate an artifact
```

`overpowered_capabilities.inventory` should naturally list `pi-rag` tools if Pi exposes them through `getAllTools()`.

Do not implement special-case RAG logic in the runtime.

---

# 38. Interaction with security/permission extensions

Do not attempt to replace Pi permission systems.

Generated tool activation should use Overpowered's own conservative confirmation logic, and external permission extensions may apply additional restrictions.

When in conflict:

> more restrictive policy wins.

Do not deliberately bypass `tool_call` gates or other installed security extensions.

---

# 39. Performance constraints

The runtime should remain lightweight.

Targets:

- no repository-wide scan on every tool call;
- no Academy body loading during startup;
- Academy metadata index cached per session;
- inventory summaries compact;
- active context fragments injected only when present;
- generated tool output capped;
- cleanup bounded to known run directories.

The extension must not materially inflate every agent prompt.

---

# 40. Logging and observability

Use concise structured internal logging if Pi exposes an appropriate mechanism.

Persist operational evidence in the runtime manifest, not verbose full transcripts.

Useful events:

```text
run_created
artifact_registered
artifact_validated
artifact_activation_requested
artifact_activated
artifact_activation_failed
artifact_deactivated
outcome_recorded
candidate_created
runtime_cleaned
```

Never log:

- secrets;
- full environment;
- unrelated document contents.

---

# 41. Recovery behavior

The extension must tolerate Pi or process interruption.

On startup/session restore:

1. load last session snapshot;
2. validate referenced runtime paths still exist;
3. restore context activation records;
4. re-register active generated tool wrappers;
5. provide active skill paths during resource discovery;
6. mark missing/corrupt artifacts failed;
7. never recreate missing generated code from memory.

If a stale runtime directory exists with no matching active session state, do not automatically execute anything from it.

A future cleanup command may remove stale runs.

---

# 42. Suggested status/result shape for model-facing tools

All management operations should return both human-readable text and structured details.

Conceptual result:

```ts
{
  content: [
    {
      type: "text",
      text: "Temporary skill 'compare-clauses' validated and reload queued."
    }
  ],
  details: {
    ok: true,
    runId: "...",
    artifactId: "...",
    type: "skill",
    state: "validated",
    next: "reload_queued"
  }
}
```

This makes behavior inspectable without forcing the model to parse prose.

---

# 43. Coding constraints for Codex

Codex should follow these implementation rules:

1. inspect the current repository before modifying it;
2. inspect current official Pi docs before using extension API names;
3. use TypeScript;
4. prefer standard library and Pi-bundled dependencies;
5. keep dependencies minimal;
6. preserve existing Overpowered skills and semantics;
7. do not invent unsupported Pi APIs;
8. isolate filesystem logic and test it thoroughly;
9. do not execute generated code in the extension process if a subprocess runner can isolate it better;
10. never give generated code `ExtensionAPI`;
11. make every lifecycle transition explicit;
12. write tests before considering a phase complete;
13. run existing Overpowered validation;
14. return a final changed-file list and test results.

---

# 44. Deliverables expected from Codex

At completion, Codex should provide:

1. executable Overpowered Pi runtime extension;
2. root Pi package configuration;
3. unit tests;
4. integration/smoke test instructions;
5. updated `README.md`;
6. updated `ARCHITECTURE.md`;
7. updated `adapters/pi.md`;
8. any minimal config documentation;
9. changelog/version update;
10. exact changed-file list;
11. test/validation output;
12. known limitations.

---

# 45. Required final verification by Codex

Before declaring the implementation complete, Codex must run and report:

```text
[ ] existing Overpowered skill validator passes
[ ] extension TypeScript loads without error
[ ] automated tests pass
[ ] context activation smoke test passes
[ ] temporary skill reload smoke test passes
[ ] generated tool activation smoke test passes
[ ] state survives reload
[ ] cleanup works
[ ] Academy candidate survives cleanup
[ ] path traversal tests pass
[ ] environment sanitization test passes
[ ] no unrelated files modified
```

If any item cannot be executed in Codex's environment, it must explicitly state which one and provide the exact command/manual procedure to run locally.

---

# 46. Recommended MVP boundary

Do not over-engineer v0.1.

The best first release is:

```text
inventory
+ isolated workspace
+ temporary context
+ temporary skill via resources_discover/reload
+ constrained generated deterministic tool
+ state persistence
+ project Academy candidate
+ cleanup
```

Do not delay MVP for:

```text
remote Academy
vector search
multi-agent generation
full sandbox VM
automatic global sharing
tool marketplace
automatic skill graduation
```

---

# 47. Future extensions

Potential future versions may add:

## 47.1 Strict sandbox backend

Container/VM/OS-specific runner for generated tools.

## 47.2 Remote Skill Academy

Shared enterprise Academy with approvals and provenance.

## 47.3 Semantic Academy search

Potentially backed by a RAG service.

## 47.4 Capability scoring

Evidence-based quality/reuse scores.

## 47.5 Cross-harness adapters

The same `gear-up` runtime contract implemented for other harnesses.

## 47.6 Agent definition support

Only after the target harness offers an official safe dynamic mechanism.

---

# 48. Architectural summary

```text
                         USER TASK
                             │
                             ▼
                    using-overpowered
                             │
                   existing skills/tools?
                     │               │
                    yes              no
                     │               │
                     │            gear-up
                     │               │
                     │     prove capability gap
                     │               │
                     │       reuse / academy?
                     │          │         │
                     │         yes        no
                     │          │         │
                     │          │   smallest artifact
                     │          │    context/skill/tool
                     │          │         │
                     │          │         ▼
                     │          │  OVERPOWERED RUNTIME
                     │          │         │
                     │          │   validate + activate
                     │          │         │
                     └──────────┴─────────┤
                                         ▼
                                      EXECUTE
                                         │
                                         ▼
                                observe value/evidence
                                   │            │
                               ineffective     useful
                                   │            │
                                 discard      candidate
                                                │
                                          Skill Academy
                                                │
                                          later evaluation
                                                │
                                             skillify
                                                │
                                            graduated
```

---

# 49. Upstream/source references

Codex should treat current upstream documentation as authoritative and re-check it before implementation.

## Overpowered

- Repository: https://github.com/raguets/overpowered
- Gear Up: https://github.com/raguets/overpowered/blob/main/skills/gear-up/SKILL.md
- Academy protocol: https://github.com/raguets/overpowered/blob/main/ACADEMY.md
- Existing Pi adapter design: https://github.com/raguets/overpowered/blob/main/adapters/pi.md

## Pi

- Extensions: https://pi.dev/docs/latest/extensions
- Skills: https://pi.dev/docs/latest/skills
- Packages: https://pi.dev/docs/latest/packages
- SDK: https://pi.dev/docs/latest/sdk

Relevant Pi features to verify:

- `pi.registerTool()`
- `pi.getAllTools()`
- `pi.getActiveTools()`
- `pi.setActiveTools()`
- `pi.appendEntry()`
- `pi.sendMessage()`
- `pi.sendUserMessage()`
- `pi.registerCommand()`
- `resources_discover`
- `before_agent_start`
- `session_start`
- `session_shutdown`
- `ctx.reload()`
- project trust API/state

---

# 50. Final implementation instruction to Codex

Implement this extension in the existing `raguets/overpowered` repository.

Start by reading the repository's current `README.md`, `ARCHITECTURE.md`, `ACADEMY.md`, `adapters/pi.md`, `skills/gear-up/SKILL.md`, and `skills/gear-up/references/runtime-contract.md`.

Then verify all Pi APIs against the current official Pi documentation.

Implement incrementally according to the phases in this specification.

Do not change unrelated Overpowered skills.

Prefer a small, reliable runtime over a large framework.

The defining product behavior is:

> **Reuse first. Create only the smallest capability that closes a proven gap. Activate it honestly and safely. Measure whether it helped. Keep nothing by default.**


Erratum 1 — Extension/package name

The official package name of the Pi extension is:

@raguets/pi-overpowered

Replace any provisional or previously suggested package/distribution name such as:

overpowered-pi-runtime
@raguets/overpowered when referring specifically to the Pi extension package

with:

@raguets/pi-overpowered

This package name applies to the Pi extension/runtime implementation.

The main Overpowered repository/project name remains:

overpowered