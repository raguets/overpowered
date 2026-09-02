import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

export interface RuntimeConfig {
  runtime: { maxArtifactsPerRun: number; cleanup: "on-session-end" | "manual"; maxReloadAttemptsPerActivation: number };
  academy: { projectEnabled: boolean; userEnabled: boolean; globalCandidatePromotion: "confirm" | "disabled" };
  context: { autoActivateAfterValidation: boolean };
  skills: { autoActivateAfterValidation: boolean };
  generatedTools: { enabled: boolean; activation: "confirm" | "manual"; allowedRuntimes: ("node" | "python")[]; defaultTimeoutMs: number; maxTimeoutMs: number; maxStdoutBytes: number };
}
export const DEFAULT_CONFIG: RuntimeConfig = { runtime: { maxArtifactsPerRun: 2, cleanup: "on-session-end", maxReloadAttemptsPerActivation: 1 }, academy: { projectEnabled: true, userEnabled: true, globalCandidatePromotion: "confirm" }, context: { autoActivateAfterValidation: true }, skills: { autoActivateAfterValidation: true }, generatedTools: { enabled: true, activation: "confirm", allowedRuntimes: ["node", "python"], defaultTimeoutMs: 10000, maxTimeoutMs: 60000, maxStdoutBytes: 1048576 } };

async function readJson(path: string): Promise<Record<string, any>> { try { return JSON.parse(await readFile(path, "utf8")); } catch (error: any) { if (error?.code === "ENOENT") return {}; throw new Error(`Invalid Overpowered config at ${path}: ${error.message}`); } }
const merge = (base: any, next: any): any => Object.fromEntries([...new Set([...Object.keys(base), ...Object.keys(next)])].map(k => [k, base[k] && next[k] && typeof base[k] === "object" && !Array.isArray(base[k]) && typeof next[k] === "object" && !Array.isArray(next[k]) ? merge(base[k], next[k]) : next[k] ?? base[k]]));
export async function loadConfig(projectRoot: string): Promise<RuntimeConfig> { const user = await readJson(join(homedir(), ".overpowered", "config.json")); const project = await readJson(join(projectRoot, ".overpowered", "config.json")); const config = merge(merge(DEFAULT_CONFIG, user), project) as RuntimeConfig; if (!Number.isInteger(config.runtime.maxArtifactsPerRun) || config.runtime.maxArtifactsPerRun < 1) throw new Error("runtime.maxArtifactsPerRun must be a positive integer"); if (config.generatedTools.maxTimeoutMs < 1 || config.generatedTools.maxStdoutBytes < 1) throw new Error("generated tool limits must be positive"); return config; }
