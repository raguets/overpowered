# Academy Templates

This directory contains templates for implementing the [Skill Academy protocol](../ACADEMY.md). It is **not** a catalog of bundled skills and should not be loaded into agent context by default.

Recommended runtime Academies maintain a lightweight searchable index and store full candidate artifacts/evidence separately.

Files here:

- `candidate.template.yaml` — minimal candidate/qualification metadata.
- `index.template.yaml` — lightweight metadata format suitable for search/routing.

Generated project-specific candidates should normally live outside the Overpowered source tree or in a separately managed Academy repository/service.
