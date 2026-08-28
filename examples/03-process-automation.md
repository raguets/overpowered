# Complete Example — Weekly Supplier Process Automation

## Situation

> Every Friday Sophie downloads a supplier export, checks anomalies, asks owners for corrections, updates the master sheet, and emails Finance.

## Skill chain

```text
find-the-exceptions
  → automate-this
  → human-gates
  → dry-run
  → completion-audit
```

## 1. Find the exceptions

Happy path is insufficient. Material questions include:

```text
- What if the file does not arrive?
- What if schema changes?
- What is an anomaly?
- Can one supplier match multiple IDs?
- What happens if an owner does not respond?
- Can updates be partial?
- Which anomalies require financial approval?
- What if the master update succeeds but notification fails?
```

Unknown policy is left `UNKNOWN`; it is not invented.

## 2. Compile the automation

| Step | Implementation | Why |
|---|---|---|
| Detect/download export | deterministic | exact source/action |
| Validate schema | deterministic | explicit expected columns/types |
| Match supplier IDs | database/rules | exact structured logic |
| Detect known anomaly classes | deterministic/query | stable rules |
| Interpret ambiguous anomaly | agentic | unstructured/contextual judgment |
| Approve high-impact exception | human gate | delegated authority |
| Update master | transaction | deterministic side effect |
| Send Finance summary | workflow automation | deterministic notification |

## 3. Human gate

```text
Trigger: anomaly classified high-impact or outside known rules
Evidence: supplier row, anomaly reason, relevant policy, proposed action
Owner: designated approver role
Outcomes: approve / reject / request correction
```

## 4. Dry run

Use historical Friday files. Disable writes and external email.

Check:

```text
- matched / unmatched supplier counts
- duplicate matches
- anomaly classifications
- gates that would fire
- predicted master changes
- predicted Finance recipients
```

## 5. Completion audit

For a live run, “email sent” is not enough.

Completion criteria might be:

```text
- required export was processed
- every valid input row is accounted for
- no invalid duplicate master IDs were created
- all required human-gated cases are resolved or explicitly pending
- master update transaction committed
- Finance notification references the correct run
```
