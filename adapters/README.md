# Runtime Adapters

Overpowered skills define **working policy**. A runtime adapter supplies harness-specific mechanics when a policy needs capabilities such as hot-loading a generated skill/tool/context artifact.

`gear-up` is the first Overpowered skill that explicitly depends on this boundary.

## Portable contract

A runtime adapter should preserve the semantics defined in:

- `skills/gear-up/references/runtime-contract.md`

The portable skill should not hard-code harness tool names.

## Reference adapters

- `pi.md` — reference design for Pi, using its skill/context reload and dynamic extension/tool capabilities.

An adapter document is not itself a bundled executable extension unless explicitly stated.
