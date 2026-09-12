// Temporary gear-up tool: normalize heterogeneous requirement/section
// identifiers to canonical PREFIX-NNNN form and report canonical-ID collisions.
// Contract: JSON on stdin -> JSON on stdout. No file I/O, no network, no child processes.
let source = "";
for await (const chunk of process.stdin) source += chunk;

const input = JSON.parse(source);
if (!Array.isArray(input?.records)) throw new Error("input.records must be an array");

const PREFIXES = [
  { match: "REQUIREMENT", canonical: "REQ" },
  { match: "REQ", canonical: "REQ" },
  { match: "SECTION", canonical: "SEC" },
  { match: "SEC", canonical: "SEC" },
  { match: "R", canonical: "R" },
  { match: "S", canonical: "S" },
];

const normalizeId = (raw) => {
  const compact = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  for (const p of PREFIXES) {
    if (compact.startsWith(p.match)) {
      const rest = compact.slice(p.match.length);
      if (/^\d+$/.test(rest)) return `${p.canonical}-${rest.padStart(4, "0")}`;
    }
  }
  throw new Error(`Unsupported requirement identifier: ${raw}`);
};

const records = input.records.map(({ document, originalId }) => ({
  document,
  originalId,
  canonicalId: normalizeId(originalId),
}));

const groups = new Map();
for (const record of records) {
  const sources = groups.get(record.canonicalId) ?? [];
  sources.push({ document: record.document, originalId: record.originalId });
  groups.set(record.canonicalId, sources);
}

// Report collisions; never silently deduplicate rows.
const collisions = [...groups.entries()]
  .filter(([, sources]) => sources.length > 1)
  .map(([canonicalId, sources]) => ({ canonicalId, sources }));

process.stdout.write(JSON.stringify({ records, collisions }));
