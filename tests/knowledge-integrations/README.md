# Verification of existing F1/F2 integrations

The production retrieval skill and SystemOne extension are external. These checks reuse them; no replacement implementation is shipped. The portable policy scenarios remain in `skills/know-enough/evals/evals.json` (especially cases 13–17). Those scenarios require model/harness execution to establish behavioral results.

## Repeatable SystemOne compatibility checks

Use Node.js 22.18+ (TypeScript stripping and module hooks) and a trusted source checkout of [iamaamir/system-one](https://github.com/iamaamir/system-one). The reviewed revision is `17be72d3595532a79ff68070dd69720a7631e108`, with `pi-system-one` 1.3.4 and `system-one-core` 0.2.1. Run from the Overpowered root:

```bash
SYSTEM_ONE_SOURCE=/path/to/system-one npm run test:knowledge-integrations
```

The test imports that checkout's configuration, provider selection, HTTP provider, validation, and rendering. A module hook resolves `system-one-core` to the same checkout; no dependency installation or changes to the external source are required. All HTTP calls receive synthetic responses through a stubbed `fetch`; no listening port, live service, user credentials, or model download is used. The synthetic keys in tests are not credentials.

Checks cover the custom Ollama route and configured model, independent Noul questions, Choice/Score distributions and legends, saved settings overriding environment settings, credential isolation, the non-local semantics of `auto`, HTTP failures, malformed answers, and timeout without automatic provider fallback. They fail explicitly if no source checkout is supplied. These opt-in checks do not run as part of the core runtime's `npm test`, and do not prove that Pi loaded the tool or that the deployed Ollama/model works.

## Smoke procedure in the deployed harness

Use the configuration in [the deployment note](../../adapters/knowledge-integrations.md). Carry out these steps where the integrations are already installed, within the existing authorization for those services. Do not install models, expose services, or transmit internal documents to another endpoint as a test side effect.

1. **Inventory.** Confirm that the installed `ask-rag-engine` skill and the `system_one` tool are actually discoverable. Record their installed versions where available. Read the external retrieval skill's contract. For classification, inspect `/so status`: the mode must be `custom`, the endpoint the approved Ollama instance, and the model the installed Clef-Flash tag. Verify the running Ollama version/model; do not infer compatibility from weights alone.
2. **Typed classification.** Invoke `system_one` with [system-one-request.json](system-one-request.json) as the tool arguments. It contains only synthetic context and four named questions exercising `noul`, `choice`, and `score`. The model belongs in extension configuration, not the tool arguments. Use `/so debug` to confirm provider `configured` and the intended `POST /v1/systemone` target.
3. **Inspect results.** Require all four matching question IDs and types. The two Noul values are independent probabilities in [0, 1]. Choice must select a declared option and retain its complete distribution. Score must remain on the supplied 0–2 rubric with probabilities and legend; preserve fractional values. Record returned model/provider and errors. Do not assert exact model probabilities or treat success as a quality/calibration benchmark. Missing/invalid answers must lead to a reasoned harness fallback.
4. **Retrieval.** Ask the existing retrieval skill for one known, authorized document reference using its documented request. Retain the answer and actual citations; verify a cited location against the original source when available. If only a generated synthesis is accessible, report that limit. A second narrow query outside the corpus should produce an explicit lack of supporting evidence, not an invented reference. Never assume unsupported hybrid/rerank parameters.
5. **Composition and fallback.** Use a request combining exact facility criteria with conceptual report evidence. Obtain exact records via the existing structured capability and passages via the existing retrieval skill, joining only on verified identifiers. Classification may help choose a plan but cannot establish evidence sufficiency. Repeat with classification deliberately unavailable for the task (omit it from the allowed capability set, without changing global configuration); the active model must still plan the searches. Review a captured error or ambiguous classification response and verify the same fallback without switching to an unapproved service.

Record each step as passed, failed, or not run, with the actual provider, source references, and missing evidence. Keep sensitive requests, credentials, and production responses in the deployment's normal evidence location, outside this repository. A synthetic compatibility pass, a live protocol pass, and a behavioral evaluation are separate results.
