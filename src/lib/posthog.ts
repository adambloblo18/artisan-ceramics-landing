import posthog from "posthog-js";

export { posthog };

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (initialized) return;

  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host =
    (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ??
    "https://eu.posthog.com";

  if (!key) {
    console.warn("[posthog] VITE_POSTHOG_KEY missing — PostHog not initialized.");
    return;
  }

  posthog.init(key, {
    api_host: host,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    persistence: "localStorage+cookie",
  });

  if (import.meta.env.DEV) {
    posthog.debug();
  }

  initialized = true;
}
