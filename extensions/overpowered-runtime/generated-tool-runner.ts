import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import type { ToolManifest } from "./types.js";

export interface RunnerOptions { maxStdoutBytes: number; signal?: AbortSignal; platform?: NodeJS.Platform; env?: NodeJS.ProcessEnv; }
export function sanitizedEnvironment(source: NodeJS.ProcessEnv = process.env, platform: NodeJS.Platform = process.platform): NodeJS.ProcessEnv { const keys = platform === "win32" ? ["PATH", "Path", "SystemRoot", "WINDIR", "COMSPEC", "PATHEXT", "TEMP", "TMP"] : ["PATH", "HOME", "LANG", "LC_ALL", "TMPDIR"]; return Object.fromEntries(keys.filter(k => source[k] !== undefined).map(k => [k, source[k]])); }
export async function runGeneratedTool(toolRoot: string, manifest: ToolManifest, input: unknown, options: RunnerOptions): Promise<unknown> {
  if (options.signal?.aborted) throw new Error("Generated tool cancelled");
  const entry = resolve(toolRoot, manifest.entrypoint);
  const command = manifest.runtime === "node" ? process.execPath : process.platform === "win32" ? "python" : "python3";
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, [entry], { cwd: dirname(entry), env: sanitizedEnvironment(options.env, options.platform), stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
    let stdout = Buffer.alloc(0), stderr = Buffer.alloc(0), settled = false;
    const finish = (error?: Error, value?: unknown) => { if (settled) return; settled = true; clearTimeout(timer); options.signal?.removeEventListener("abort", abort); error ? reject(error) : resolvePromise(value); };
    const abort = () => { child.kill(); finish(new Error("Generated tool cancelled")); };
    options.signal?.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(() => { child.kill(); finish(new Error(`Generated tool timed out after ${manifest.timeoutMs}ms`)); }, manifest.timeoutMs);
    child.stdout.on("data", chunk => { stdout = Buffer.concat([stdout, chunk]); if (stdout.length > options.maxStdoutBytes) { child.kill(); finish(new Error("Generated tool stdout limit exceeded")); } });
    child.stderr.on("data", chunk => { if (stderr.length < 64 * 1024) stderr = Buffer.concat([stderr, chunk]); });
    child.on("error", error => finish(error));
    child.on("close", code => { if (settled) return; if (code !== 0) return finish(new Error(`Generated tool exited ${code}: ${stderr.toString("utf8").trim()}`)); try { finish(undefined, JSON.parse(stdout.toString("utf8"))); } catch { finish(new Error("Generated tool emitted malformed JSON")); } });
    child.stdin.end(JSON.stringify(input));
  });
}
