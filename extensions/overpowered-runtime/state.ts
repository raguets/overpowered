import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { ArtifactState, RuntimeArtifact, RuntimeRun, RuntimeSnapshot } from "./types.js";

const ALLOWED: Record<ArtifactState, ArtifactState[]> = { created: ["staged", "failed", "discarded"], staged: ["validated", "failed", "discarded"], validated: ["active", "inactive", "failed", "discarded", "candidate"], active: ["inactive", "failed", "candidate"], inactive: ["active", "discarded", "candidate"], failed: ["discarded"], discarded: [], candidate: ["inactive", "discarded"] };
export const emptySnapshot = (projectRoot: string): RuntimeSnapshot => ({ version: 1, projectRoot, runs: {}, artifacts: {}, updatedAt: new Date().toISOString() });
export function transition(artifact: RuntimeArtifact, next: ArtifactState): RuntimeArtifact { if (artifact.state !== next && !ALLOWED[artifact.state].includes(next)) throw new Error(`Invalid artifact transition ${artifact.state} -> ${next}`); return { ...artifact, state: next, updatedAt: new Date().toISOString() }; }
export class StateStore {
  snapshot: RuntimeSnapshot;
  constructor(readonly projectRoot: string, initial?: RuntimeSnapshot) { this.snapshot = initial ?? emptySnapshot(projectRoot); }
  get runtimeRoot() { return join(this.projectRoot, ".overpowered", "runtime"); }
  async load(): Promise<void> { try { this.snapshot = JSON.parse(await readFile(join(this.runtimeRoot, "state.json"), "utf8")); } catch (e: any) { if (e?.code !== "ENOENT") throw e; } }
  addRun(run: RuntimeRun) { this.snapshot.runs[run.runId] = run; this.touch(); }
  addArtifact(artifact: RuntimeArtifact) { const run = this.snapshot.runs[artifact.runId]; if (!run) throw new Error("Unknown run"); this.snapshot.artifacts[artifact.artifactId] = artifact; run.artifacts.push(artifact.artifactId); run.updatedAt = new Date().toISOString(); this.touch(); }
  setArtifact(artifact: RuntimeArtifact) { if (!this.snapshot.artifacts[artifact.artifactId]) throw new Error("Unknown artifact"); this.snapshot.artifacts[artifact.artifactId] = artifact; this.touch(); }
  touch() { this.snapshot.updatedAt = new Date().toISOString(); }
  async persist(): Promise<void> { const file = join(this.runtimeRoot, "state.json"); await mkdir(dirname(file), { recursive: true }); const temp = `${file}.${process.pid}.tmp`; await writeFile(temp, `${JSON.stringify(this.snapshot, null, 2)}\n`, "utf8"); await rename(temp, file); }
}
