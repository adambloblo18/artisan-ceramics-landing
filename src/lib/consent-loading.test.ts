import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

function bootstrap(stored: { status: string; timestamp: number } | null = null) {
  const source = readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
  const script = source.match(/const consentScript = `([\s\S]*?)`;/)?.[1];
  assert.ok(script, "Consent bootstrap must be present");
  let imports = 0;
  const scope = {
    window: {} as {
      __lcmConsent?: boolean;
      lcmChargerMesure?: () => void;
      lcmRefuserMesure?: () => void;
      lcmChargeurs?: Array<() => void>;
    },
    localStorage: { getItem: () => JSON.stringify(stored) },
    dataLayer: [] as unknown[],
  };
  runInNewContext(script, scope);
  scope.window.lcmChargeurs?.push(() => { imports++; });
  return { window: scope.window, imports: () => imports };
}

test("measurement loader stays idle before acceptance", () => {
  const state = bootstrap();
  assert.equal(state.window.__lcmConsent, false);
  assert.equal(state.imports(), 0);
});

test("acceptance calls the loader once", () => {
  const state = bootstrap();
  state.window.lcmChargerMesure?.();
  state.window.lcmChargerMesure?.();
  assert.equal(state.window.__lcmConsent, true);
  assert.equal(state.imports(), 1);
});

test("refusal never calls the loader", () => {
  const state = bootstrap();
  state.window.lcmRefuserMesure?.();
  assert.equal(state.window.__lcmConsent, false);
  assert.equal(state.imports(), 0);
});

test("accepting again after refusal reactivates the loader", () => {
  const state = bootstrap();
  state.window.lcmChargerMesure?.();
  state.window.lcmRefuserMesure?.();
  assert.equal(state.window.__lcmConsent, false);
  state.window.lcmChargerMesure?.();
  assert.equal(state.window.__lcmConsent, true);
  assert.equal(state.imports(), 2);
});

test("stored refusal does not permit measurement", () => {
  assert.equal(bootstrap({ status: "refused", timestamp: Date.now() }).window.__lcmConsent, false);
});

test("only an unexpired stored acceptance permits measurement", () => {
  assert.equal(bootstrap({ status: "accepted", timestamp: Date.now() }).window.__lcmConsent, true);
  assert.equal(bootstrap({ status: "accepted", timestamp: Date.now() - 15552000000 }).window.__lcmConsent, false);
});