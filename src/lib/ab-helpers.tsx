import { useEffect, useState } from "react";
import { posthog } from "./posthog";

export type VariantKey = "control" | "A" | "B" | "C" | "D";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function pickRandom(variants: VariantKey[]): VariantKey {
  return variants[Math.floor(Math.random() * variants.length)];
}

function readOrAssignLocal(
  experimentKey: string,
  variants: VariantKey[],
): VariantKey {
  if (typeof window === "undefined") return variants[0];
  const storageKey = `ab_${experimentKey}`;
  const existing = window.localStorage.getItem(storageKey) as VariantKey | null;
  if (existing && variants.includes(existing)) return existing;
  const chosen = pickRandom(variants);
  try {
    window.localStorage.setItem(storageKey, chosen);
  } catch {
    /* ignore quota / private mode */
  }
  return chosen;
}

export function useABVariant(
  experimentKey: string,
  variants: VariantKey[],
): VariantKey {
  // Always start with variants[0] so SSR and first client render match.
  const [variant, setVariant] = useState<VariantKey>(variants[0]);

  useEffect(() => {
    // Resolve the real variant on the client (localStorage / random).
    const local = readOrAssignLocal(experimentKey, variants);
    setVariant((prev) => (prev === local ? prev : local));

    let cancelled = false;

    const resolve = () => {
      try {
        const flag = posthog.getFeatureFlag?.(experimentKey);
        if (
          typeof flag === "string" &&
          (variants as string[]).includes(flag) &&
          !cancelled
        ) {
          setVariant(flag as VariantKey);
          return true;
        }
      } catch {
        /* ignore */
      }
      return false;
    };

    if (!resolve()) {
      // Wait for flags to load, then resolve again.
      try {
        posthog.onFeatureFlags?.(() => resolve());
      } catch {
        /* ignore */
      }
    }

    return () => {
      cancelled = true;
    };
  }, [experimentKey, variants]);

  return variant;
}

export function trackConversion(
  eventName: string,
  properties?: Record<string, any>,
) {
  try {
    posthog.capture?.(eventName, properties);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, properties ?? {});
  }
}

export function trackExposure(experimentKey: string, variant: VariantKey) {
  try {
    posthog.capture?.("$feature_flag_called", {
      $feature_flag: experimentKey,
      $feature_flag_response: variant,
    });
  } catch {
    /* ignore */
  }
}
