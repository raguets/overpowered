# Task

Normalize the requirement identifiers in `examples/09-pi-runtime-smoke/input/requirements.csv`.

Requirements:

- preserve `document` and the exact `original_id` for every input row;
- normalize identifiers such as `REQ 12`, `req-0012`, and `Requirement_12` to `REQ-0012`;
- normalize identifiers such as `SEC.7` and `sec 0007` to `SEC-0007`;
- report canonical-ID collisions instead of silently deduplicating rows;
- compare the result with `examples/09-pi-runtime-smoke/expected/normalized.json`;
- do not modify the input file.

Use the Overpowered `gear-up` policy and runtime explicitly:

1. inspect current capabilities and Academy metadata before creating anything;
2. state whether this is a knowledge gap or a capability gap;
3. state the before/after success test;
4. if no adequate capability exists, create exactly one narrow deterministic temporary tool;
5. register, validate, and activate it through `overpowered_runtime`;
6. use it on all eight rows;
7. record the observed result and limitations;
8. if successful, nominate it only as an Academy candidate with a reuse hypothesis;
9. clean the ephemeral runtime run after confirming the candidate copy exists.

Do not install the generated tool permanently and do not claim OS-level sandboxing.
