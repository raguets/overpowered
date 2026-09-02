import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { StateStore, transition } from "../../extensions/overpowered-runtime/state.js";
import { createWorkspace } from "../../extensions/overpowered-runtime/workspace.js";
import type { RuntimeArtifact } from "../../extensions/overpowered-runtime/types.js";

test("state creates a run and survives restore", async () => { const root = await mkdtemp(join(tmpdir(), "op-state-")); const store = new StateStore(root); const run = await createWorkspace(store, "missing deterministic operation", "sample passes"); const restored = new StateStore(root); await restored.load(); assert.equal(restored.snapshot.runs[run.runId].capabilityGap, "missing deterministic operation"); });
test("state transitions are explicit", () => { const artifact = { artifactId: "artifact-123456", state: "staged", updatedAt: "" } as RuntimeArtifact; assert.equal(transition(artifact, "validated").state, "validated"); assert.throws(() => transition(artifact, "active"), /Invalid artifact transition/); });
