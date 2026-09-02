export type ArtifactType = "context" | "skill" | "tool";
export type ArtifactState = "created" | "staged" | "validated" | "active" | "inactive" | "failed" | "discarded" | "candidate";
export type CapabilityOutcome = "ineffective" | "useful_once" | "reusable_signal";

export interface ValidationResult { ok: boolean; checkedAt: string; errors: string[]; warnings: string[]; }
export interface ActivationResult { activatedAt?: string; deactivatedAt?: string; reloadAttempts?: number; message?: string; }
export interface SideEffectDeclaration { filesystemRead: "none" | "workspace" | "project" | "custom"; filesystemWrite: "none" | "workspace" | "project" | "custom"; network: boolean; process: boolean; }
export interface EvidenceItem { kind: string; description: string; path?: string; }
export interface OutcomeRecord { classification: CapabilityOutcome; observedResult: string; evidence: EvidenceItem[]; limitations: string[]; reuseHypothesis?: string; recordedAt: string; }
export interface RuntimeRun { runId: string; projectRoot: string; createdAt: string; updatedAt: string; capabilityGap: string; successTest: string; status: "open" | "closed"; artifacts: string[]; }
export interface RuntimeArtifact { artifactId: string; runId: string; type: ArtifactType; name: string; description: string; sourcePath: string; state: ArtifactState; capabilityGap: string; successTest: string; createdAt: string; updatedAt: string; validation?: ValidationResult; activation?: ActivationResult; outcome?: OutcomeRecord; sideEffects?: SideEffectDeclaration; dependencies?: string[]; limitations?: string[]; used?: boolean; }
export interface RuntimeSnapshot { version: 1; projectRoot: string; runs: Record<string, RuntimeRun>; artifacts: Record<string, RuntimeArtifact>; pendingSkillActivation?: string; pendingSkillDeactivation?: string; updatedAt: string; }
export interface ToolManifest { name: string; description: string; runtime: "node" | "python"; entrypoint: string; inputSchema: Record<string, unknown>; sideEffects: SideEffectDeclaration; timeoutMs: number; }
export interface AcademyCandidate { candidateId: string; status: "CANDIDATE"; name: string; description: string; artifactType: ArtifactType; artifactHash: string; capabilityGap: string; originRun: string; validation: ValidationResult; outcome: OutcomeRecord; limitations: string[]; dependencies: string[]; sideEffects?: SideEffectDeclaration; reuseHypothesis: string; createdAt: string; scope: "project" | "user"; }
