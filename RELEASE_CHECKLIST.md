# Release Checklist

Use this before publishing the suite or an individual skill.

## Structural

- [ ] `python scripts/validate_suite.py` passes.
- [ ] If installed, `skills-ref validate <skill-dir>` passes for every published skill.
- [ ] Skill directory name matches frontmatter `name`.
- [ ] Description is specific enough to trigger, but narrow enough not to over-trigger.
- [ ] `SKILL.md` is concise; conditional detail is moved to one-level references.
- [ ] Every local reference is explicitly loaded only when needed.

## Behavioral

- [ ] Run each eval in a clean context **with** the skill.
- [ ] Run the same prompt **without** the skill or with the previous version.
- [ ] Grade assertions with concrete evidence.
- [ ] Inspect execution traces for wasted retrieval, excessive questioning, over-composition, or ignored instructions.
- [ ] Add a regression eval for every important real-world failure corrected during development.

## Cross-harness

- [ ] No accidental hard-coded tool names in portable skills.
- [ ] Harness-specific integration is isolated in references/adapters.
- [ ] Test at least one workflow in every harness claimed as supported.
- [ ] Verify explicit invocation and automatic triggering behavior.

## Product quality

- [ ] README examples still match actual skill behavior.
- [ ] The skill has a memorable one-sentence promise.
- [ ] The stopping condition is explicit.
- [ ] The skill changes behavior versus a capable baseline model.
- [ ] Choose and add an explicit license before public distribution.
- [ ] Add repository-specific install commands and versioning/release notes.
