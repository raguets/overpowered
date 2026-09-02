# Manual Pi smoke test

For a ready-to-run representative dataset and a known-good generated tool, use `examples/09-pi-runtime-smoke/README.md`. The procedure below is the lower-level lifecycle checklist.

1. From this checkout, run `pi -e ./extensions/overpowered-runtime/index.ts` in a temporary trusted project (or install with `pi install git:github.com/raguets/overpowered`).
2. Confirm Overpowered skills are listed in Pi and run `/overpowered:status`.
3. Ask the agent to use `overpowered_runtime` to create a workspace for a test gap.
4. Under the returned artifacts root, create `context/CONTEXT.md`, register, validate, and activate it. On the next prompt, confirm the labelled temporary context is present and no `AGENTS.md` changed.
5. Create `skill/sample/SKILL.md` with valid `name` and `description` frontmatter, register, validate, and activate it. Confirm the queued reload completes and status reports the skill active.
6. Create `tool/tool.json` plus `tool/src/main.mjs` implementing the one-JSON-in/one-JSON-out protocol. Declare no side effects, register and validate it, approve the activation prompt, and call it in the same session.
7. Record a `useful_once` or `reusable_signal` outcome with a non-empty reuse hypothesis, then nominate it. Confirm `.overpowered/academy/index.json` contains only `CANDIDATE` status.
8. Run `/overpowered:cleanup`. Confirm the runtime run is removed and the Academy candidate remains.
9. Restart/reload during an active run and confirm `/overpowered:status` reconstructs the persisted state.

Fixture generated tool entrypoint:

```js
let input = "";
for await (const chunk of process.stdin) input += chunk;
process.stdout.write(JSON.stringify({ ok: true, data: JSON.parse(input) }));
```
