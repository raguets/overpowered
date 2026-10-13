import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, realpath, rm, symlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdtemp } from "node:fs/promises";
import { assertContained, isContained } from "../../extensions/overpowered-runtime/paths.js";

test("path containment accepts children and rejects traversal", async () => { const root = await mkdtemp(join(tmpdir(), "op-path-")); const child = join(root, "run", "artifact"); await mkdir(child, { recursive: true }); assert.equal(isContained(root, child), true); assert.equal(isContained(root, join(root, "..", "escape")), false); await assert.rejects(assertContained(root, join(root, "..", "escape"))); });
test("path containment rejects symlink escape", async t => { const root = await mkdtemp(join(tmpdir(), "op-link-root-")); const outside = await mkdtemp(join(tmpdir(), "op-link-out-")); const link = join(root, "link"); try { await symlink(outside, link, process.platform === "win32" ? "junction" : "dir"); } catch (e: any) { return t.skip(`symlink unavailable: ${e.message}`); } await assert.rejects(assertContained(root, link), /Symlink escapes/); });
test("Windows path comparison is case-insensitive through resolved platform paths", () => { if (process.platform !== "win32") return; assert.equal(isContained("C:\\Work\\Root", "c:\\work\\root\\child"), true); });

test("path containment accepts a symlinked parent while rejecting escapes", async t => {
  const base = await mkdtemp(join(tmpdir(), "op-parent-link-"));
  t.after(() => rm(base, { recursive: true, force: true }));
  const parent = join(base, "real");
  const root = join(parent, "runtime");
  const child = join(root, "artifact");
  const outside = join(parent, "outside");
  await mkdir(child, { recursive: true });
  await mkdir(outside);
  const alias = join(base, "alias");
  try {
    await symlink(parent, alias, process.platform === "win32" ? "junction" : "dir");
  } catch (e: any) {
    return t.skip(`symlink unavailable: ${e.message}`);
  }
  const aliasedRoot = join(alias, "runtime");
  assert.equal(await assertContained(aliasedRoot, join(aliasedRoot, "artifact")), await realpath(child));
  assert.equal(await assertContained(aliasedRoot, await realpath(child)), await realpath(child));
  assert.equal(await assertContained(aliasedRoot, aliasedRoot), await realpath(root));
  await assert.rejects(assertContained(aliasedRoot, outside), /Path escapes/);
  const escape = join(aliasedRoot, "escape");
  await symlink(outside, escape, process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(assertContained(aliasedRoot, escape), /Symlink escapes/);
});
