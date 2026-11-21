import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { trackEvent } from "./analytics";

function bootstrap(stored: { status: string; timestamp: number } | null = null, complete = true) {
  const source = readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
  const consent = source.match(/const consentScript = `([\s\S]*?)`;/)?.[1];
  const google = source.match(/const googleAdsScript = `([\s\S]*?)`;/)?.[1];
  assert.ok(consent);
  assert.ok(google);
  let imports = 0;
  let clock = 0;
  let nextId = 0;
  const timers = new Map<number, { at: number; fn: () => void }>();
  const listeners = new Set<() => void>();
  const scripts: Array<{ src?: string; onload?: () => void; setAttribute: () => void }> = [];
  const document = {
    readyState: complete ? "complete" : "loading",
    querySelector: () => scripts.length ? scripts[0] : null,
    createElement: () => ({ setAttribute: () => {} }),
    head: { appendChild: (script: typeof scripts[number]) => scripts.push(script) },
  };
  const scope = {
    window: {
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    } as {
      addEventListener: (name: string, fn: () => void) => void;
      removeEventListener: (name: string, fn: () => void) => void;
      __lcmConsent?: boolean;
      lcmChargerMesure?: (restored?: boolean) => void;
      lcmRefuserMesure?: () => void;
      lcmChargeurs?: Array<() => void>;
    },
    document,
    localStorage: { getItem: () => JSON.stringify(stored) },
    dataLayer: [] as unknown[],
    setTimeout: (fn: () => void, delay: number) => { const id = ++nextId; timers.set(id, { at: clock + delay, fn }); return id; },
    clearTimeout: (id: number) => timers.delete(id),
  };
  runInNewContext(consent + google, scope);
  scope.window.lcmChargeurs?.push(() => { imports++; });
  const advance = (ms: number) => {
    clock += ms;
    for (const [id, timer] of timers) if (timer.at <= clock) { timers.delete(id); timer.fn(); }
  };
  return { window: scope.window, imports: () => imports, scripts, advance, load: () => {
    document.readyState = "complete";
    for (const listener of [...listeners]) listener();
    listeners.clear();
  }, dataLayer: scope.dataLayer };
}

test("no answer leaves measurement idle but loads Google at load + 1000 ms", () => {
  const state = bootstrap(null, false);
  state.advance(5000);
  assert.equal(state.scripts.length, 0);
  state.load();
  state.advance(999);
  assert.equal(state.scripts.length, 0);
  state.advance(1);
  assert.equal(state.scripts[0]?.src, "https://www.googletagmanager.com/gtag/js?id=AW-11400865534");
  assert.equal(state.imports(), 0);
  state.scripts[0]?.onload?.();
  assert.equal((state.dataLayer[1] as ArrayLike<unknown>)[0], "js");
  assert.equal((state.dataLayer[2] as ArrayLike<unknown>)[1], "AW-11400865534");
});

test("a loaded-page acceptance starts measurement immediately only once", () => {
  const state = bootstrap();
  state.window.lcmChargerMesure?.();
  state.window.lcmChargerMesure?.();
  assert.equal(state.imports(), 1);
});

test("stored acceptance waits until load + 1500 ms despite hydration restore", () => {
  const state = bootstrap({ status: "accepted", timestamp: Date.now() }, false);
  state.window.lcmChargerMesure?.(true);
  state.advance(5000);
  assert.equal(state.imports(), 0);
  state.load();
  state.advance(1499);
  assert.equal(state.imports(), 0);
  state.advance(1);
  assert.equal(state.imports(), 1);
});

test("restoration after load waits 1500 ms, but a fresh click starts immediately", () => {
  const state = bootstrap({ status: "accepted", timestamp: Date.now() });
  state.advance(1000);
  assert.equal(state.imports(), 0);
  state.window.lcmChargerMesure?.();
  assert.equal(state.imports(), 1);
  state.advance(500);
  assert.equal(state.imports(), 1);
});

test("refusal cancels pending restoration but still allows the Google tag", () => {
  const state = bootstrap({ status: "accepted", timestamp: Date.now() }, false);
  state.window.lcmRefuserMesure?.();
  state.load();
  state.advance(2000);
  assert.equal(state.imports(), 0);
  assert.equal(state.scripts.length, 1);
});

test("acceptance after withdrawal reactivates measurement", () => {
  const state = bootstrap();
  state.window.lcmChargerMesure?.();
  state.window.lcmRefuserMesure?.();
  state.window.lcmChargerMesure?.();
  assert.equal(state.imports(), 2);
});

test("an individual loader error does not stop later loaders", () => {
  const state = bootstrap();
  let later = 0;
  state.window.lcmChargeurs?.push(() => { throw new Error("loader failed"); });
  state.window.lcmChargeurs?.push(() => { later++; });
  assert.doesNotThrow(() => state.window.lcmChargerMesure?.());
  assert.equal(later, 1);
});

test("refused and expired stored choices never activate measurement", () => {
  for (const stored of [{ status: "refused", timestamp: Date.now() }, { status: "accepted", timestamp: Date.now() - 15552000000 }]) {
    const state = bootstrap(stored);
    state.advance(2000);
    assert.equal(state.imports(), 0);
  }
});

test("events reach Google without consent, but not PostHog or Clarity", () => {
  const calls: unknown[][] = [];
  let clarityCalls = 0;
  let posthogCalls = 0;
  const original = globalThis.window;
  Object.assign(globalThis, { window: { __lcmConsent: false, gtag: (...args: unknown[]) => calls.push(args), clarity: () => { clarityCalls++; }, posthog: { capture: () => { posthogCalls++; } } } });
  try {
    trackEvent("test_event", { value: 1 });
    assert.deepEqual(calls, [["event", "test_event", { value: 1 }]]);
    assert.equal(clarityCalls, 0);
    assert.equal(posthogCalls, 0);
  } finally {
    if (original) Object.assign(globalThis, { window: original });
    else Reflect.deleteProperty(globalThis, "window");
  }
});
