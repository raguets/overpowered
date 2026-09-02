import type { ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { searchAcademy } from "./academy.js";
import { StateStore } from "./state.js";
import { formatStatus } from "./ui.js";
import { cleanupRun } from "./workspace.js";
import type { RuntimeSnapshot } from "./types.js";

export const statusCommand = (snapshot: RuntimeSnapshot) => formatStatus(snapshot);
export async function cleanupCommand(store: StateStore, args: string, ctx: ExtensionCommandContext) { const ids = args.trim() ? [args.trim()] : Object.values(store.snapshot.runs).filter(r => r.status === "open").map(r => r.runId); if (!ids.length) return ctx.ui.notify("Overpowered: nothing to clean", "info"); if (ctx.hasUI && !await ctx.ui.confirm("Clean ephemeral runtime?", ids.join("\n"))) return; const failures: string[] = []; for (const id of ids) try { await cleanupRun(store, id); } catch (e: any) { failures.push(`${id}: ${e.message}`); } ctx.ui.notify(failures.length ? `Partial cleanup failure:\n${failures.join("\n")}` : `Overpowered: cleaned ${ids.length} runtime run(s)`, failures.length ? "warning" : "info"); }
export async function academyCommand(projectRoot: string, ctx: ExtensionCommandContext) { const candidates = await searchAcademy(projectRoot, undefined); ctx.ui.notify(candidates.length ? candidates.map(c => `${c.candidateId}  ${c.name}  ${c.status}`).join("\n") : "Overpowered Academy: no project candidates", "info"); }
export async function reloadCommand(store: StateStore, ctx: ExtensionCommandContext) { if (!store.snapshot.pendingSkillActivation) return ctx.ui.notify("Overpowered: no pending skill activation", "warning"); await store.persist(); await ctx.reload(); return; }
