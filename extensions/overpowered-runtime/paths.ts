import { lstat, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

export function isContained(root: string, candidate: string): boolean { const rel = relative(resolve(root), resolve(candidate)); return rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel)); }
export async function assertContained(root: string, candidate: string, mustExist = true): Promise<string> { const rootReal = await realpath(root); const absolute = resolve(candidate); if (!isContained(rootReal, absolute)) throw new Error(`Path escapes runtime root: ${candidate}`); if (!mustExist) return absolute; await lstat(absolute); const candidateReal = await realpath(absolute); if (!isContained(rootReal, candidateReal)) throw new Error(`Symlink escapes runtime root: ${candidate}`); return candidateReal; }
export function assertSafeId(id: string, label = "id"): string { if (!/^[a-z0-9][a-z0-9_-]{5,80}$/i.test(id)) throw new Error(`Invalid ${label}`); return id; }
