import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, symlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdtemp } from "node:fs/promises";
import { assertContained, isContained } from "../../extensions/overpowered-runtime/paths.js";

test("path containment accepts children and rejects traversal", async () => { const root = await mkdtemp(join(tmpdir(), "op-path-")); const child = join(root, "run", "artifact"); await mkdir(child, { recursive: true }); assert.equal(isContained(root, child), true); assert.equal(isContained(root, join(root, "..", "escape")), false); await assert.rejects(assertContained(root, join(root, "..", "escape"))); });
test("path containment rejects symlink escape", async t => { const root = await mkdtemp(join(tmpdir(), "op-link-root-")); const outside = await mkdtemp(join(tmpdir(), "op-link-out-")); const link = join(root, "link"); try { await symlink(outside, link, process.platform === "win32" ? "junction" : "dir"); } catch (e: any) { return t.skip(`symlink unavailable: ${e.message}`); } await assert.rejects(assertContained(root, link), /Symlink escapes/); });
test("Windows path comparison is case-insensitive through resolved platform paths", () => { if (process.platform !== "win32") return; assert.equal(isContained("C:\\Work\\Root", "c:\\work\\root\\child"), true); });
