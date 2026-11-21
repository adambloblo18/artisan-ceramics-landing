import { posthog } from "./posthog";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.__lcmConsent) return;
  try {
    posthog.capture?.(name, props as Record<string, unknown> | undefined);
  } catch {
    /* ignore */
  }
  try {
    window.gtag?.("event", name, props);
  } catch {
    /* ignore */
  }
  try {
    window.clarity?.("event", name);
  } catch {
    /* ignore */
  }
}
