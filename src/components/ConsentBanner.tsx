import { useEffect, useState } from "react";

const KEY = "lcm_consent_v1";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!document.cookie.includes(KEY + "=")) setShow(true);
    } catch { /* no-op */ }
  }, []);

  const setCookie = (value: string) => {
    const d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `${KEY}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  };

  const accept = () => {
    (window as any).gtag?.("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    setCookie("granted");
    setShow(false);
  };
  const refuse = () => { setCookie("denied"); setShow(false); };

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-[var(--border)] bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-[var(--muted-text)]">
          Nous utilisons des cookies pour mesurer l'audience et améliorer votre
          expérience. Vous pouvez accepter ou refuser. En savoir plus dans notre{" "}
          <a
            href="https://www.ceramique-murale.com/politique-de-confidentialite/"
            target="_blank"
            rel="noopener"
            className="underline"
          >
            politique de confidentialité
          </a>
          .
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={refuse}
            className="border border-[var(--anthracite)] px-5 py-3 text-sm font-semibold text-[var(--anthracite)] transition hover:bg-[var(--anthracite)] hover:text-white"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="px-5 py-3 text-sm font-semibold text-white transition"
            style={{ background: "var(--sage)" }}
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
