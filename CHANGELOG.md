# Changelog

All notable changes to Overpowered will be documented here.

## 0.3.0 — Pi runtime extension

- Added the installable `@raguets/pi-overpowered` Pi package and executable Overpowered Runtime extension.
- Added capability inventory, isolated workspaces, temporary context and skill activation, constrained generated tools, reload-safe state, evidence, Academy candidates, and cleanup.
- Added path, state, validator, Academy, and subprocess-runner tests, including Windows and environment-sanitization coverage.
- Replaced the Pi reference-only adapter documentation with installation, lifecycle, configuration, and smoke-test guidance.

## 0.2.0 — Adaptive capability layer

- Added `gear-up` for evidence-gated, minimal, temporary capability creation during task execution.
- Added the Skill Academy protocol: ephemeral → candidate → qualified → graduated, with rejected/retired paths.
- Moved `skillify` downstream of qualification/proven reuse evidence; it now focuses on durable portable packaging rather than hot creation.
- Updated `using-overpowered` with reuse-before-create routing and an explicit capability-gap gate.
- Added runtime adapter architecture and a Pi reference design for dynamic tools, reloadable skills/context, validation, cleanup, and Academy evidence.
- Added complete adaptive-capability and Academy-graduation examples.
- Added Academy metadata templates and validator checks for the new architecture.
- Synchronized the package with the repository's MIT license.

## 0.1.0 — Initial public-ready package

- Introduced the Overpowered brand and suite architecture.
- Added 15 composable Agent Skills across discipline, knowledge/evidence, process/automation, and orchestration layers.
- Added `using-overpowered` as the suite-level routing skill.
- Added `know-enough` integration guidance for `pi-rag` and other retrieval backends.
- Added complete usage examples and eval specifications.
- Added static validation and GitHub Actions CI.
