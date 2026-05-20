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
  (window as any).gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
  try { (window as any).posthog?.opt_in_capturing?.(); } catch { /* noop */ }
}

function applyDenied() {
  (window as any).gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  try { (window as any).posthog?.opt_out_capturing?.(); } catch { /* noop */ }
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

  const accept = (method: "click" | "scroll") => {
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
    try { (window as any).gtag?.("event", "cookie_consent", { value: "refused" }); } catch { /* noop */ }
    close();
  };

  // Mount: check stored consent, schedule show if needed
  useEffect(() => {
    const stored = readStored();
    if (stored?.status === "accepted") { applyGranted(); return; }
    if (stored?.status === "refused") { applyDenied(); return; }
    const t = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setEntered(true));
    }, 1500);

    const reopen = () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
      decidedRef.current = false;
      setLeaving(false);
      setVisible(true);
      requestAnimationFrame(() => setEntered(true));
    };
    window.addEventListener("lcm:open-consent", reopen);
    return () => {
      clearTimeout(t);
      window.removeEventListener("lcm:open-consent", reopen);
    };
  }, []);

  // Scroll-to-accept (40% of page)
  useEffect(() => {
    if (!visible) return;
    let throttled = false;
    const onScroll = () => {
      if (throttled) return;
      throttled = true;
      setTimeout(() => { throttled = false; }, 200);
      const docH = document.documentElement.scrollHeight;
      if (docH <= 0) return;
      const pct = (window.scrollY + window.innerHeight) / docH;
      if (pct > 0.05) {
        window.removeEventListener("scroll", onScroll);
        accept("scroll");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

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
      className="fixed z-[1000] font-[Inter] bottom-[80px] right-4 left-4 lg:left-auto lg:bottom-6 lg:right-6"
      style={{
        maxWidth: 340,
        width: "100%",
        padding: 20,
        background: "#FAF7F2",
        border: "1px solid #D4A89B",
        borderRadius: 4,
        boxShadow: "0 4px 16px rgba(74, 107, 124, 0.12)",
        transform: translate,
        opacity,
        transition: "all 400ms ease-out",
      }}
    >
      <p id="cookie-title" style={{ fontWeight: 500, fontSize: 15, color: "#4A6B7C", margin: 0 }}>
        Cookies et données
      </p>
      <p id="cookie-desc" style={{ fontWeight: 400, fontSize: 13, color: "#2A2A2A", lineHeight: 1.5, marginTop: 8 }}>
        Nous utilisons des cookies pour mesurer l'audience et améliorer votre expérience. En poursuivant votre navigation, vous acceptez leur dépôt.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          onClick={() => accept("click")}
          style={{
            background: "#6B8E7F", color: "#FAF7F2", padding: "10px 18px",
            fontWeight: 500, fontSize: 14, borderRadius: 2, flexGrow: 2, border: "none", cursor: "pointer",
          }}
          onMouseEnter={(e) => { (e.currentTarget.style.background = "#5a7a6f"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.background = "#6B8E7F"); }}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B8E7F]"
        >
          Accepter
        </button>
        <button
          onClick={refuse}
          style={{
            background: "transparent", color: "rgba(42,42,42,0.7)", padding: "10px 18px",
            fontWeight: 400, fontSize: 14, borderRadius: 2, flexGrow: 1,
            border: "1px solid rgba(42,42,42,0.2)", cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#2A2A2A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(42,42,42,0.7)"; }}
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
          display: "block", marginTop: 12, fontSize: 11, color: "#6B6B6B",
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
