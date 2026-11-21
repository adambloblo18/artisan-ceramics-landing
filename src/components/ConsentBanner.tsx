import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "cookie_consent";
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

type Stored = { status: "accepted" | "refused"; timestamp: number; method?: string };

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > SIX_MONTHS_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function applyGranted() {
  (window as any).lcmChargerMesure?.();
  (window as any).gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
  try {
    (window as any).posthog?.set_config?.({
      persistence: "localStorage+cookie",
      disable_session_recording: false,
    });
    (window as any).posthog?.startSessionRecording?.();
  } catch { /* noop */ }
}

function applyDenied() {
  (window as any).gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  try {
    (window as any).posthog?.set_config?.({
      persistence: "memory",
      disable_session_recording: true,
    });
    (window as any).posthog?.stopSessionRecording?.();
  } catch { /* noop */ }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const decidedRef = useRef(false);

  const close = () => {
    setLeaving(true);
    setTimeout(() => setVisible(false), 300);
  };

  const accept = (method: "click") => {
    if (decidedRef.current) return;
    decidedRef.current = true;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: "accepted", timestamp: Date.now(), method }),
      );
    } catch { /* noop */ }
    applyGranted();
    try { (window as any).gtag?.("event", "cookie_consent", { value: "accepted", method }); } catch { /* noop */ }
    try { (window as any).posthog?.capture?.("cookie_consent", { status: "accepted", method }); } catch { /* noop */ }
    close();
  };

  const refuse = () => {
    if (decidedRef.current) return;
    decidedRef.current = true;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: "refused", timestamp: Date.now() }),
      );
    } catch { /* noop */ }
    applyDenied();
    try { (window as any).posthog?.opt_out_capturing?.(); } catch { /* noop */ }
    try { (window as any).gtag?.("event", "cookie_consent", { value: "refused" }); } catch { /* noop */ }
    close();
  };

  // Mount: check stored consent, schedule show if needed
  useEffect(() => {
    const reopen = () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
      decidedRef.current = false;
      setLeaving(false);
      setVisible(true);
      requestAnimationFrame(() => setEntered(true));
    };
    window.addEventListener("lcm:open-consent", reopen);
    const cleanup = () => window.removeEventListener("lcm:open-consent", reopen);

    const stored = readStored();
    if (stored?.status === "accepted") { applyGranted(); return cleanup; }
    if (stored?.status === "refused") { applyDenied(); return cleanup; }
    const t = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setEntered(true));
    }, 1500);

    return () => {
      clearTimeout(t);
      cleanup();
    };
  }, []);

  // Escape = refuse
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") refuse(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  if (!visible) return null;

  const translate = leaving ? "translateY(20px)" : entered ? "translateY(0)" : "translateY(20px)";
  const opacity = leaving ? 0 : entered ? 1 : 0;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed z-[1000] font-[Inter] bottom-[calc(84px+env(safe-area-inset-bottom))] right-3 left-3 lg:left-auto lg:bottom-4 lg:right-4"
      style={{
        maxWidth: 280,
        width: "100%",
        padding: "10px 12px",
        background: "#FAF7F2",
        border: "1px solid #D4A89B",
        borderRadius: 4,
        boxShadow: "0 3px 12px rgba(74, 107, 124, 0.10)",
        transform: translate,
        opacity,
        transition: "all 400ms ease-out",
      }}
    >
      <p id="cookie-title" style={{ fontWeight: 500, fontSize: 13, color: "#4A6B7C", margin: 0 }}>
        Cookies et données
      </p>
      <p id="cookie-desc" style={{ fontWeight: 400, fontSize: 11, color: "#2A2A2A", lineHeight: 1.4, marginTop: 6 }}>
        Nous utilisons des cookies pour mesurer l'audience et améliorer votre expérience. Nous mesurons l'audience seulement si vous l'acceptez. Refuser ne change rien à votre visite.
      </p>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <button
          onClick={() => accept("click")}
          style={{
            background: "transparent", color: "#2A2A2A", padding: "7px 14px",
            fontWeight: 500, fontSize: 12, borderRadius: 2, flexGrow: 1, border: "1px solid #6B8E7F", cursor: "pointer",
          }}
                    className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B8E7F]"
        >
          Accepter
        </button>
        <button
          onClick={refuse}
          style={{
            background: "transparent", color: "#2A2A2A", padding: "7px 14px",
            fontWeight: 500, fontSize: 12, borderRadius: 2, flexGrow: 1,
            border: "1px solid #6B8E7F", cursor: "pointer",
          }}
                    className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B8E7F]"
        >
          Refuser
        </button>
      </div>
      <a
        href="https://www.ceramique-murale.com/mentions-legales/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", marginTop: 8, fontSize: 10, color: "#6B6B6B",
          opacity: 0.7, textDecoration: "none",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
      >
        En savoir plus sur nos cookies
      </a>
    </div>
  );
}
