# Pi runtime representative smoke case

This small case exercises the useful runtime path rather than only checking that the extension loads:

```text
inventory -> prove gap -> workspace -> generated tool -> validate
          -> human activation -> execute -> evidence -> candidate -> cleanup
```

The task normalizes requirement identifiers coming from three documents while preserving provenance and detecting collisions. The input has eight rows and needs no external service.

## Files

- `input/requirements.csv`: source data.
- `expected/normalized.json`: expected semantic result.
- `fixture-tool/`: known-good generated tool, useful for a deterministic extension smoke test.
- `PROMPT.md`: prompt to paste into Pi.

## Start Pi

From the repository root:

```bash
pi -e ./extensions/overpowered-runtime/index.ts
```

Alternatively, install the package from Git and start Pi normally:

```bash
pi install git:github.com/raguets/overpowered
pi
```

The project must be trusted before executable project artifacts are activated.

## Run the case

1. Paste the contents of `examples/09-pi-runtime-smoke/PROMPT.md` into Pi.
2. Let the agent inspect existing capabilities and create a runtime workspace.
3. For a deterministic runtime test, tell it to copy the contents of `fixture-tool/` into the returned run's `artifacts/<chosen-id>/tool/` directory. For a generation test, let it write an equivalent narrow tool itself.
4. Review the generated `tool.json` and `src/main.mjs` when Pi requests activation confirmation, then approve it.
5. The agent should call `normalize_requirements` with the eight CSV records represented as JSON.
6. Compare its result with `expected/normalized.json`.
7. Ask the agent to record the outcome, nominate the artifact, and clean the runtime run.

## Pass criteria

- `overpowered_capabilities` is called before creation.
- Exactly one artifact is generated for the gap.
- Activation is not claimed before validation and confirmation.
- The generated tool becomes callable in the same session without reload.
- All eight source rows remain represented by `document` plus `originalId`.
- The canonical IDs match `expected/normalized.json`.
- `REQ-0012` reports a collision because two source rows normalize to it.
- The recorded outcome has a non-empty reuse hypothesis.
- The Academy record has status `CANDIDATE`, never `QUALIFIED` or `GRADUATED`.
- `/overpowered:cleanup` removes the runtime run while preserving the candidate.

## Useful checks

During the run:

```text
/overpowered:status
/overpowered:academy
```

After cleanup, inspect:

```text
.overpowered/academy/index.json
.overpowered/academy/candidates/
```

The candidate copy should remain. The corresponding `.overpowered/runtime/<run-id>/` directory should not.

## Negative checks

Two quick failure tests are also useful:

1. Change `timeoutMs` in `tool.json` to `999999`; validation must reject it.
2. Change `entrypoint` to `../../outside.mjs`; validation must reject the path escape.

Restore the fixture before continuing the positive flow.
