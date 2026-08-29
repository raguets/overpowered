# Pi Runtime Adapter for `gear-up`

This document is a **reference design**, not a bundled executable extension. It describes how a Pi integration can implement `gear-up` hot capability activation while keeping the portable skill free of Pi-specific APIs.

## What Pi provides

Pi can discover project/global skills and context files, reload extensions/skills/prompts/context, and extensions can register custom tools. Current Pi extension documentation also states that tools registered after startup are refreshed immediately in the same session.

Relevant upstream documentation:

- Pi skills/context: https://pi.dev/docs/latest/skills
- Pi extensions: https://pi.dev/docs/latest/extensions
- Dynamic tools example: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/dynamic-tools.ts
- Reload example: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/reload-runtime.ts

Treat upstream docs as authoritative for API names because Pi evolves independently of Overpowered.

## Recommended architecture

```text
gear-up (portable policy)
        │
        ▼
overpowered-pi-runtime (extension/adaptor)
        │
        ├─ inspect Pi skills/tools/context support
        ├─ create isolated runtime workspace
        ├─ validate generated artifacts
        ├─ register dynamic tools immediately when possible
        ├─ stage skill/context files + trigger supported reload
        ├─ report explicit active/staged/failed status
        ├─ record Academy evidence
        └─ clean up ephemeral artifacts
```

## Artifact handling

### Temporary tool

Preferred path when a genuinely missing deterministic operation is required:

1. generate a narrow TypeScript tool implementation in the ephemeral workspace;
2. syntax/type/smoke-test it using available local checks;
3. inspect permissions and side effects;
4. register the resulting tool through a trusted Overpowered Pi runtime extension;
5. verify it appears in the runtime's available/active tool set;
6. call it only for the declared capability gap.

The runtime extension, not arbitrary generated code, should own registration and lifecycle control.

### Temporary skill

A Pi adapter can stage a valid Agent Skill under a project-scoped temporary/discoverable location and use Pi's supported reload path. After reload, verify the skill is actually discoverable before continuing.

Because a reload replaces parts of runtime state, follow Pi's current extension guidance and do not assume pre-reload in-memory extension context remains valid.

### Temporary context / AGENTS.md-equivalent

Never overwrite the project's durable `AGENTS.md` just to support one task. Prefer a project-scoped temporary context mechanism exposed by the adapter, or stage a lower-authority context file in a way Pi officially supports and reload. Preserve provenance so the agent can distinguish durable project instructions from ephemeral Gear Up context.

### Agent/subagent definition

Only support this artifact type if the installed Pi ecosystem/runtime actually exposes a safe dynamic agent-definition mechanism. If not, report the type unsupported rather than emulating it with hidden prompts.

## Suggested adapter operations

The exact tool names are implementation details, but the adapter should expose semantics equivalent to:

```text
inspect_capabilities()
search_academy(query)
create_workspace(run_id)
validate_artifact(path, type)
activate_artifact(path, type)
deactivate_artifact(id)
record_outcome(id, evidence)
cleanup_workspace(run_id)
```

## Security boundary

Pi extensions execute with the user's process permissions. Generated executable code therefore deserves the same scrutiny as any code the agent proposes to run:

- prefer read-only tools;
- minimize filesystem/network scope;
- never embed secrets in generated files;
- apply `dry-run` where meaningful;
- apply `human-gates` before elevated, destructive, external, financial, legal, or production-changing actions;
- do not auto-graduate generated tools into global extension directories.

## Academy integration

The adapter should search Academy metadata before allowing creation. After use, it should record the outcome and normally delete the ephemeral workspace. If `gear-up` nominates the artifact, copy it and its evidence into the Academy candidate store; do not copy it into the installed skill/tool directories.
