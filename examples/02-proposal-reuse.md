# Complete Example — Reusing Previous Proposal Knowledge

## Situation

A new customer requests a predictive-maintenance capability. The organization has:

- current approved product reference;
- previous proposals;
- signed contracts.

## User request

> Draft the maintenance section and reuse prior work where appropriate.

## Skill chain

```text
know-enough
  → find-precedent
  → evidence-first
```

## Knowledge decomposition

```text
Question 1: What can we currently claim?
Source role: authoritative
Source: product-reference

Question 2: How have similar needs been answered before?
Source role: precedent
Source: previous-offers

Question 3: Which claims became contractual commitments?
Source role: precedent / signed record
Source: signed-contracts
```

## Precedent extraction

For each similar proposal:

```text
Reusable
- section structure
- problem framing
- architecture rationale
- generic service concept

Do not copy blindly
- customer names
- dates
- staffing
- prices
- delivery commitments
- features no longer supported
```

## Final writing rule

Every current product capability must be grounded in the current authoritative product source. Historical proposals can provide patterns and wording but must not override current capability truth.

## Why this works

The agent uses organizational memory without turning the RAG corpus into a copy machine.
