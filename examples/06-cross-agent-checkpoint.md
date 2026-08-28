# Complete Example — Cross-Agent Checkpoint

## Situation

A long analysis started in one harness must continue in another. The original chat will not be available.

## Skill chain

```text
checkpoint
```

## Example `CHECKPOINT.md`

```markdown
# Checkpoint

## Goal
Reconcile the customer master from CRM and billing and produce a trusted mapping.

## Completion criteria
- every active CRM customer has zero or one justified billing entity mapping;
- ambiguous mappings are explicitly unresolved;
- no mapping relies only on fuzzy name similarity.

## Current state
- CRM and billing loaded into `work.duckdb`.
- 8,431 exact tax-ID mappings completed.
- 217 records remain unresolved.

## Authoritative inputs
- `data/crm-2026-08-28.csv`
- `data/billing-2026-08-28.csv`
- `data/customer-identity-rules.md`

## Decisions
- Tax ID is primary exact key when present and valid.
- Normalized company name is candidate generation only.

## Rejected path
- Pure fuzzy-name auto-merge was tested and produced false positives; do not retry as an automatic decision rule.

## Artifacts
- `work.duckdb`: loaded source tables and mapping table.
- `queries/unresolved.sql`: current unresolved-candidate query.

## Evidence
- exact mappings: 8,431
- duplicate CRM tax IDs found: 14, quarantined

## Open issues
- 217 unresolved mappings
- 14 duplicate tax-ID source records require data-owner review

## Next action
Run `queries/unresolved.sql`, cluster candidates by normalized address + registration number, and keep ambiguous cases unresolved.
```

A fresh receiving agent should be able to continue from this file and the referenced artifacts alone.
