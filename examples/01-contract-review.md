# Complete Example — Contract Clause Review

## Situation

A customer proposes a liability cap of 150% of contract value. Available knowledge bases:

- `legal-playbook` — current approved legal positions (`authoritative`)
- `signed-contracts` — executed historical agreements (`precedent`)

## User request

> Review this clause. Can we accept it, and have we done something similar before?

## Skill chain

```text
using-overpowered
  → know-enough
  → find-precedent
  → human-gates
  → evidence-first
```

### 1. `know-enough`

Next decision: whether 150% is within current delegated/standard position.

Knowledge gaps:

```text
Missing and material
- Current approved liability cap
- Approval path for deviations
- Comparable historical outcomes
```

Retrieval plan:

```text
legal-playbook
  objective: establish current normative rule and approval boundary

signed-contracts
  objective: find comparable negotiated deviations
```

### 2. `find-precedent`

Suppose three comparable contracts are found:

```text
A: 150%, strategic customer, legal director approval
B: 100%, standard customer
C: 200%, regulated program, executive exception
```

The reusable lesson is not “150% is allowed.” It is:

```text
150% has been accepted before under explicit exception approval.
```

### 3. `human-gates`

If the legal playbook states 100% standard and deviations require legal approval:

```text
Gate: non-standard liability approval
Trigger: cap > 100%
Owner: authorized legal approver
Evidence presented:
- proposed clause
- current policy
- relevant precedents
Outcomes: approve / reject / propose alternative
```

### 4. `evidence-first`

Final answer shape:

```text
Current position
100% standard cap. Source: Legal Playbook §4.2.

Precedent
150% has been accepted in at least one comparable signed agreement,
but under explicit exception approval.

Recommendation
Do not auto-approve. Route through the non-standard liability gate.

Uncertainty
Historical similarity does not itself establish current authority.
```

## Failure modes avoided

- answering from generic legal knowledge;
- searching every knowledge base;
- treating precedent as policy;
- copying a prior decision without checking material differences;
- hiding the approval boundary.
