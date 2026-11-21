import type { PostHog } from "posthog-js";

declare global {
  interface Window {
    posthog?: PostHog;
    __lcmConsent?: boolean;
    __lcmClarityQueue?: unknown[][];
    lcmChargeurs?: Array<() => void>;
    lcmChargerMesure?: () => void;
    lcmRefuserMesure?: () => void;
    UET?: new (options: { ti: string; q: unknown }) => { push: (...args: unknown[]) => void };
    uetq?: { push: (...args: unknown[]) => void };
  }
}

// Lightweight bridge: importing an event helper never downloads the SDK.
function activePostHog() {
  return typeof window !== "undefined" && window.__lcmConsent ? window.posthog : undefined;
}

export const posthog = {
  capture: (event: string, props?: Record<string, unknown>) => activePostHog()?.capture(event, props),
  getFeatureFlag: (key: string) => activePostHog()?.getFeatureFlag(key),
  onFeatureFlags: (callback: () => void) => activePostHog()?.onFeatureFlags(callback),
};
