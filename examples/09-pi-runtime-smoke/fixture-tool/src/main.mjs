let source = "";
for await (const chunk of process.stdin) source += chunk;

const input = JSON.parse(source);
const canonicalize = (value) => {
  const compact = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = /^(REQUIREMENT|REQ|SEC|R)(\d+)$/.exec(compact);
  if (!match) throw new Error(`Unsupported requirement identifier: ${value}`);
  const prefix = match[1] === "REQUIREMENT" ? "REQ" : match[1];
  return `${prefix}-${match[2].padStart(4, "0")}`;
};

const records = input.records.map(({ document, originalId }) => ({
  document,
  originalId,
  canonicalId: canonicalize(originalId)
}));

const groups = new Map();
for (const record of records) {
  const sources = groups.get(record.canonicalId) ?? [];
  sources.push({ document: record.document, originalId: record.originalId });
  groups.set(record.canonicalId, sources);
}

const collisions = [...groups.entries()]
  .filter(([, sources]) => sources.length > 1)
  .map(([canonicalId, sources]) => ({ canonicalId, sources }));

process.stdout.write(JSON.stringify({ records, collisions }));
