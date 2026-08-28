# Design References

This suite was authored against the current open Agent Skills guidance and informed by successful process-skill patterns.

## Agent Skills

- Specification — https://agentskills.io/specification
  - `SKILL.md` with YAML frontmatter
  - lowercase hyphenated names
  - progressive disclosure
  - concise main instructions with on-demand references
- Best practices — https://agentskills.io/skill-creation/best-practices
  - coherent skill scope
  - procedures over generic declarations
  - defaults over menus
  - gotchas for non-obvious failure modes
  - spend context only on what the model is likely to get wrong
- Optimizing descriptions — https://agentskills.io/skill-creation/optimizing-descriptions
  - descriptions are the activation/routing interface
  - include both capability and trigger language
- Evaluating skills — https://agentskills.io/skill-creation/evaluating-skills
  - realistic prompts
  - with-skill versus baseline comparisons
  - assertions grounded in observable output
  - clean-context evaluation

## Process-skill patterns

The suite is inspired by the general pattern demonstrated by strong reusable agent workflows such as Superpowers: compact process rules, explicit triggers, high-signal guardrails, and stopping/verification conditions.

- Superpowers `using-superpowers` pattern — https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md
- Superpowers `systematic-debugging` pattern — https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md
- Superpowers `verification-before-completion` pattern — https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md

`grill-me` is a useful reference for a memorable, behaviorally specific skill with a clear interaction model. This suite does not copy its interrogation behavior; it adopts the broader lesson that a good skill should have a crisp promise and a strong stopping condition.

- Example description/documentation — https://github.com/qiagenpims/mattpocock-skills/blob/main/docs/productivity/grill-me.md

## Important limitation

The included static validator proves internal package consistency. The included eval specifications make behavioral testing possible, but model/harness-level pass rates must be measured by actually running the evals in those target environments.
