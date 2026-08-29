# Release Checklist

Use this before publishing the suite or an individual skill.

## Structural

- [ ] `python scripts/validate_suite.py` passes.
- [ ] If installed, `skills-ref validate <skill-dir>` passes for every published skill.
- [ ] Skill directory name matches frontmatter `name`.
- [ ] Description is specific enough to trigger, but narrow enough not to over-trigger.
- [ ] `SKILL.md` is concise; conditional detail is moved to one-level references.
- [ ] Every local reference is explicitly loaded only when needed.
- [ ] Root `VERSION`, `CHANGELOG.md`, architecture/catalog, and skill versions are consistent with the release.

## Behavioral

- [ ] Run each eval in a clean context **with** the skill.
- [ ] Run the same prompt **without** the skill or with the previous version.
- [ ] Grade assertions with concrete evidence.
- [ ] Inspect execution traces for wasted retrieval, excessive questioning, over-composition, ignored instructions, or capability proliferation.
- [ ] Add a regression eval for every important real-world failure corrected during development.

## Adaptive capability / Academy

- [ ] `gear-up` evals include a true capability gap, a knowledge-gap rejection, and an over-generation rejection.
- [ ] Runtime adapters never report staged files as active capabilities.
- [ ] Generated executable artifacts are validated and least-privileged before activation.
- [ ] Academy candidates are not silently treated as graduated/trusted.
- [ ] Graduation requires evidence beyond a single originating task unless an explicit project policy justifies otherwise.
- [ ] `skillify` preserves the separation between hot generation and durable packaging.

## Cross-harness

- [ ] No accidental hard-coded tool names in portable skills.
- [ ] Harness-specific integration is isolated in references/adapters.
- [ ] Test at least one workflow in every harness claimed as supported.
- [ ] Verify explicit invocation and automatic triggering behavior.
- [ ] Verify the claimed hot-load behavior for every runtime adapter; document unsupported artifact types honestly.

## Product quality

- [ ] README examples still match actual skill behavior.
- [ ] The skill has a memorable one-sentence promise.
- [ ] The stopping condition is explicit.
- [ ] The skill changes behavior versus a capable baseline model.
- [ ] Repository license is present and appropriate for the release.
- [ ] Repository-specific install commands and release notes are current.
