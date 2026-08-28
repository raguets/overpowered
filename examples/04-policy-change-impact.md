# Complete Example — Policy Change Impact

## User request

> Purchasing policy v2 replaces v1. Tell me what actually changed and what else we need to update.

## Skill chain

```text
what-changed
  → know-enough
  → reconcile
```

## 1. Semantic change analysis

Suppose v2 changes:

```text
Approval threshold: €20,000 → €10,000
Approver role: department director → budget owner
SLA: 5 business days → 3 business days
Formatting: major section reorganization
```

`what-changed` treats the first three as material and the reorganization as editorial unless it changes meaning.

## 2. Impact knowledge

The agent now needs to know which artifacts encode these rules. `know-enough` searches only the relevant process/automation/training sources.

Potential dependencies found:

```text
purchasing-workflow.md
invoice-approval automation
buyer-training-guide.pdf
```

## 3. Reconcile stale rules

If the automation still uses €20,000:

```text
Item: approval threshold
Policy v2: €10,000 (authoritative current)
Automation: €20,000
Status: CONFLICT / STALE IMPLEMENTATION
Action: update rule and regression-test boundary cases
```

## Final output

Prioritize action by materiality and cite both the changed rule and the stale dependent artifact.
