# Complete Example — Asking Structured Data

## Project

```text
data/
├── facilities.xlsx
├── organizations.csv
└── data-dictionary.md
TASK.md
```

## Question

> Which facilities can test above 80°C and are available in Q4?

## Skill chain

```text
ask-the-data
  → evidence-first
  → completion-audit if the result is used as a formal deliverable
```

## Workflow

1. Read `data-dictionary.md` to learn the business meanings of temperature capability and availability status.
2. Inspect workbook sheets; identify the facilities relation rather than loading decorative/report tabs.
3. Load relevant relations through `structured-data-duckdb` when available.
4. Inspect schema and a small sample.
5. Join availability if it is a separate relation.
6. Filter using the defined units and Q4 interpretation.
7. Validate count, nulls in key fields, and duplicate facility IDs.
8. Return facilities plus source/query provenance.

## Example result shape

```text
Answer
12 facilities match the criteria.

Evidence
- facilities.xlsx / facilities
- facilities.xlsx / availability
- temperature interpreted in °C per data-dictionary.md
- Q4 = Oct 1–Dec 31 per TASK.md
- duplicate facility IDs: 0
```

If Q4 is not defined and the calendar matters, the agent should surface that assumption rather than invent a fiscal calendar.
