import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { AcademyCandidate, RuntimeSnapshot } from "./types.js";

export interface SkillInfo { name: string; description?: string; path?: string; }
export function inventory(pi: ExtensionAPI, skills: SkillInfo[], snapshot: RuntimeSnapshot, academy: AcademyCandidate[], includeInactive = false) { const active = new Set(pi.getActiveTools()); const tools = pi.getAllTools().filter(t => includeInactive || active.has(t.name)).map(t => ({ name: t.name, description: t.description, source: t.sourceInfo?.source ?? "unknown", active: active.has(t.name) })); const artifacts = Object.values(snapshot.artifacts).filter(a => !["discarded"].includes(a.state)).map(a => ({ id: a.artifactId, type: a.type, name: a.name, state: a.state, runId: a.runId, purpose: a.description })); return { skills, tools, temporaryCapabilities: artifacts, academyHints: academy.map(x => ({ id: x.candidateId, name: x.name, type: x.artifactType, gap: x.capabilityGap })) };
}
