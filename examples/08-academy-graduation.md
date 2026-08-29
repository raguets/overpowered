# Example 8 — From temporary capability to graduated skill

## First task: ephemeral

During a proposal review, `gear-up` creates a temporary procedure for mapping customer requirement wording to an internal compliance matrix while preserving evidence links.

The procedure materially improves the task, so it becomes an Academy **candidate**. It is not installed in the harness.

## Second task: reuse before creation

Weeks later, a different proposal requires the same kind of mapping.

```text
using-overpowered
  ↓
installed capabilities insufficient
  ↓
gear-up
  ↓
search Academy metadata
  ↓
existing candidate looks applicable
```

Instead of generating a new skill, the agent stages the candidate experimentally, validates it in the current context, and runs the task.

The second task succeeds with different document structure and customer terminology. The Academy record now contains evidence from two distinct contexts.

## Qualification

A clean-context eval is added:

```text
Prompt
  Map these requirements to the compliance matrix while preserving exact evidence.

Baseline failure
  Produces useful mapping but drops some source anchors.

Candidate behavior
  Preserves every source anchor and marks ambiguous mappings instead of guessing.
```

With the eval passing and no critical open issue, the candidate becomes **qualified**.

## Graduation with `skillify`

Now `skillify` is appropriate:

1. remove customer names and temporary paths;
2. extract the invariant mapping method;
3. define precise trigger metadata;
4. move deep mapping rules into focused references if needed;
5. add boundary and regression evals;
6. validate the Agent Skill structure;
7. obtain the required human/project approval;
8. install or publish the resulting durable skill.

```text
hot task optimization        durable reusable capability
---------------------        ---------------------------
gear-up                  →   Skill Academy   →   skillify
smallest thing now            evidence            productize
```

This separation prevents the harness from accumulating one-off skills simply because they worked once.
