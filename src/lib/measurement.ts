import posthog from "posthog-js";

let initialized = false;
const sessionRecording = { sampleRate: 1, minimumDurationMilliseconds: 0, maskAllInputs: true };

/** Imported only by the cookie-approved loader, never by event helpers. */
export function startMeasurement() {
  if (!window.__lcmConsent) return;
  if (initialized) {
    posthog.opt_in_capturing();
    posthog.set_config({ persistence: "localStorage+cookie", disable_session_recording: false });
    posthog.startSessionRecording();
    window.clarity?.("consentv2", { analytics_Storage: "granted", ad_Storage: "granted" });
    window.uetq?.push("consent", "update", { ad_storage: "granted" });
    return;
  }
  initialized = true;
  window.posthog = posthog;
  posthog.init("phc_oGmkuM4F5je7WmaLZpsF47paa8nv5V5vp58oh74Pwcwy", {
    api_host: "https://eu.i.posthog.com",
    person_profiles: "identified_only",
    opt_out_capturing_by_default: false,
    respect_dnt: false,
    persistence: "localStorage+cookie",
    cross_subdomain_cookie: true,
    disable_session_recording: false,
    autocapture: true,
    capture_pageview: "history_change",
    capture_pageleave: true,
    rate_limiting: { events_per_second: 50, events_burst_limit: 500 },
    session_recording: sessionRecording,
    loaded: (instance) => {
      if (window.__lcmConsent) instance.opt_in_capturing();
      else {
        instance.opt_out_capturing();
        instance.stopSessionRecording();
      }
    },
  });

  const google = document.createElement("script");
  google.async = true;
  google.src = "https://www.googletagmanager.com/gtag/js?id=AW-11400865534";
  google.onload = () => {
    if (!window.__lcmConsent) return;
    window.gtag?.("js", new Date());
    window.gtag?.("config", "AW-11400865534");
  };
  document.head.appendChild(google);

  window.__lcmClarityQueue ??= [];
  window.clarity = window.clarity || ((...args: unknown[]) => {
    window.__lcmClarityQueue?.push(args);
  });
  Object.assign(window.clarity, { q: window.__lcmClarityQueue });
  const clarity = document.createElement("script");
  clarity.async = true;
  clarity.src = "https://www.clarity.ms/tag/uhxdrmhaaf";
  document.head.appendChild(clarity);

  const bing = document.createElement("script");
  bing.async = true;
  bing.src = "https://bat.bing.com/bat.js";
  bing.onload = () => {
    if (!window.__lcmConsent || !window.UET) return;
    window.uetq = new window.UET({ ti: "343242701", q: window.uetq ?? [] });
    window.uetq.push("pageLoad");
  };
  document.head.appendChild(bing);
}