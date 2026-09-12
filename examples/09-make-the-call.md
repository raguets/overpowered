# Make an evidence-backed call

## Decision case

Choose whether a support team should reuse its current search platform or buy a specialist product. Security approval and connector coverage are mandatory; current evidence is incomplete.

```text
assumption-audit
  → expose the assumed migration volume and switching cost
know-enough
  → obtain authoritative security status and connector evidence
make-the-call
  → DECIDE: reuse the current platform
```

The call is driven by mandatory controls and total switching cost, not an arbitrary weighted matrix. It records the specialist product's better interface as an accepted trade-off and notes that the decision is reversible at the next annual renewal.

## Contrasting test case

Two parsers meet the mandatory controls, but invoice-table fidelity is unknown and drives the choice.

```text
make-the-call
  → TEST
```

Hypothesis: parser B preserves tables more reliably. Run both against 100 representative invoices for one day; choose B if at least 98% of tables retain correct row/column structure and it beats A by at least two percentage points, otherwise choose A. This bounded test is cheaper than guessing before migration.
