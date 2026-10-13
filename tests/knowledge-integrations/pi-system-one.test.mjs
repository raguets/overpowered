// Opt-in tests of the actual external implementation. All HTTP is intercepted.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { resolve } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

const source = process.env.SYSTEM_ONE_SOURCE;
assert.ok(source, "Set SYSTEM_ONE_SOURCE to a trusted iamaamir/system-one source checkout (see README.md)");
const sourceUrl = (path) => pathToFileURL(resolve(source, path)).href;
const manifest = JSON.parse(readFileSync(resolve(source, "pi-system-one/package.json"), "utf8"));
assert.equal(manifest.name, "pi-system-one");

// Resolve the existing core directly from that checkout; no copy, build,
// package installation, or replacement of its implementation is needed.
const hook = registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier === "system-one-core"
      ? sourceUrl("system-one-core/src/index.ts") : specifier, context);
  },
});
const { createSessionConfig } = await import(sourceUrl("pi-system-one/src/config.ts"));
const { resolveSessionProvider } = await import(sourceUrl("pi-system-one/src/provider.ts"));
const { renderSystemOneResult } = await import(sourceUrl("pi-system-one/src/render.ts"));
hook.deregister();

const request = JSON.parse(readFileSync(new URL("./system-one-request.json", import.meta.url), "utf8"));
const env = {
  SYSTEM_ONE_BASE_URL: "http://127.0.0.1:11434",
  SYSTEM_ONE_MODEL: "clef-flash",
};
const context = {
  modelRegistry: {
    getApiKeyForProvider() { assert.fail("Custom mode must not request the Pi TypeSafe credential"); },
    findOfType() { assert.fail("Custom mode must not select Pi's native classifier"); },
  },
};

function response() {
  return {
    model: "clef-flash",
    answers: {
      has_structured_filters: { type: "noul", noul: 0.91 },
      needs_semantic_retrieval: { type: "noul", noul: 0.88 },
      first_step: {
        type: "choice", choice: "exact_filter", confidence: 0.6,
        probabilities: { exact_filter: 0.8, document_search: 0.1, clarify: 0.1 },
      },
      specificity: {
        type: "score", score: 1.5, confidence: 0.3,
        probabilities: { "0": 0.1, "1": 0.3, "2": 0.6 },
        legend: Object.fromEntries(request.questions.specificity.criteria.map((text, i) => [String(i), text])),
      },
    },
    usage: { input_tokens: 120, output_tokens: 4 },
  };
}

function intercept(t, body = response(), status = 200) {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, ...options, body: JSON.parse(options.body) });
    return new Response(JSON.stringify(body), {
      status, headers: { "Content-Type": "application/json", "X-Request-Id": "synthetic-request" },
    });
  });
  return calls;
}

test("custom mode sends the mixed retrieval judgment to the configured Ollama route", async (t) => {
  const calls = intercept(t);
  const session = createSessionConfig(env);
  assert.equal(session.mode, "custom");
  const provider = await resolveSessionProvider(session, context);
  const result = await provider.evaluate(request);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "http://127.0.0.1:11434/v1/systemone");
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].headers.Authorization, undefined);
  assert.deepEqual(calls[0].body, { ...request, model: "clef-flash" });
  assert.equal(result.metadata.provider, "configured");
  assert.equal(result.model, "clef-flash");
  assert.deepEqual(result.answers, response().answers);
  assert.deepEqual(result.usage, { inputTokens: 120, outputTokens: 4 });
  assert.equal(result.requestId, "synthetic-request");
  // Independent Noul probabilities can both be high; they are not one choice.
  assert.ok(result.answers.has_structured_filters.noul + result.answers.needs_semantic_retrieval.noul > 1);
  const rendered = renderSystemOneResult(result);
  assert.match(rendered, /score: 1\.5/);
  assert.match(rendered, /Specific enough for targeted lookup/);
});

test("saved mode wins over environment: an Ollama URL alone cannot override TypeSafe", () => {
  const session = createSessionConfig(env, { mode: "typesafe" });
  assert.equal(session.mode, "typesafe");
  assert.equal(session.modeSource, "saved");
  assert.equal(session.ignoredEnvironmentEndpoint, true);
  assert.notEqual(session.current.baseUrl, env.SYSTEM_ONE_BASE_URL);
  assert.notEqual(session.current.model, env.SYSTEM_ONE_MODEL);
});

test("saved custom endpoints do not inherit another endpoint's model or credential", async (t) => {
  const calls = intercept(t);
  const session = createSessionConfig({ ...env, SYSTEM_ONE_API_KEY: "synthetic-other-endpoint-key" }, {
    mode: "custom", baseUrl: "http://127.0.0.1:21434", model: "local-clef-alias", timeoutMs: 60000,
  });
  const provider = await resolveSessionProvider(session, context);
  await provider.evaluate(request);
  assert.equal(calls[0].url, "http://127.0.0.1:21434/v1/systemone");
  assert.equal(calls[0].body.model, "local-clef-alias");
  assert.equal(calls[0].headers.Authorization, undefined);
});

test("a matching custom endpoint can use its own environment key", async (t) => {
  const calls = intercept(t);
  const session = createSessionConfig({ ...env, SYSTEM_ONE_API_KEY: "synthetic-custom-key" }, {
    mode: "custom", baseUrl: env.SYSTEM_ONE_BASE_URL, model: "saved-model",
  });
  await (await resolveSessionProvider(session, context)).evaluate(request);
  assert.equal(calls[0].headers.Authorization, "Bearer synthetic-custom-key");
  assert.equal(calls[0].body.model, "clef-flash");
});

test("auto mode may use TypeSafe HTTP even when an Ollama environment URL exists", async (t) => {
  const calls = intercept(t);
  const session = createSessionConfig(env, { mode: "auto" });
  const provider = await resolveSessionProvider(session, {
    modelRegistry: { getApiKeyForProvider: async () => "synthetic-typesafe-key" },
  });
  const result = await provider.evaluate(request);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, session.current.baseUrl + "/v1/systemone");
  assert.notEqual(calls[0].url, env.SYSTEM_ONE_BASE_URL + "/v1/systemone");
  assert.equal(result.metadata.provider, "typesafe");
});

for (const status of [404, 422, 503]) {
  test(`HTTP ${status} rejects once without trying another provider`, async (t) => {
    const calls = intercept(t, { error: "Synthetic unavailable classification" }, status);
    const provider = await resolveSessionProvider(createSessionConfig(env), context);
    await assert.rejects(provider.evaluate(request), { name: "SystemOneHttpError" });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, env.SYSTEM_ONE_BASE_URL + "/v1/systemone");
  });
}

const invalidResponses = [
  ["missing answer", (data) => { delete data.answers.needs_semantic_retrieval; }],
  ["invalid Noul probability", (data) => { data.answers.has_structured_filters.noul = 1.2; }],
  ["wrong answer type", (data) => { data.answers.has_structured_filters.type = "choice"; }],
  ["incomplete Score legend", (data) => { delete data.answers.specificity.legend["2"]; }],
  ["missing Choice probability", (data) => { delete data.answers.first_step.probabilities.clarify; }],
];
for (const [label, corrupt] of invalidResponses) {
  test(`incompatible typed response (${label}) cannot become a successful judgment`, async (t) => {
    const data = response();
    corrupt(data);
    const calls = intercept(t, data);
    const provider = await resolveSessionProvider(createSessionConfig(env), context);
    await assert.rejects(provider.evaluate(request), { name: "SystemOneProtocolError" });
    assert.equal(calls.length, 1);
  });
}

test("timeout rejects without a remote retry", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", (_url, { signal }) => new Promise((_resolve, reject) => {
    calls++;
    const watchdog = setTimeout(() => reject(new Error("Timeout was not enforced")), 1000);
    signal.addEventListener("abort", () => {
      clearTimeout(watchdog);
      reject(new DOMException("Synthetic timeout", "AbortError"));
    }, { once: true });
  }));
  const session = createSessionConfig({ ...env, SYSTEM_ONE_TIMEOUT_MS: "10" });
  const provider = await resolveSessionProvider(session, context);
  await assert.rejects(provider.evaluate(request), { name: "SystemOneTimeoutError" });
  assert.equal(calls, 1);
});
