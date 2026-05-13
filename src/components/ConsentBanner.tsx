import { useEffect, useState } from "react";

const KEY = "lcm_consent_v1";

type Cats = { ad: boolean; analytics: boolean };

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  const [detail, setDetail] = useState(false);
  const [cats, setCats] = useState<Cats>({ ad: false, analytics: false });

  const hasCookie = () => {
    try { return document.cookie.includes(KEY + "="); } catch { return false; }
  };

  useEffect(() => {
    if (!hasCookie()) setShow(true);
    const open = () => {
      // Permet de rouvrir la bannière depuis le footer
      document.cookie = `${KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      setDetail(false);
      setShow(true);
    };
    window.addEventListener("lcm:open-consent", open);
    return () => window.removeEventListener("lcm:open-consent", open);
  }, []);

  const setCookie = (value: string) => {
    const d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `${KEY}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  };

  const apply = (ad: boolean, analytics: boolean) => {
    (window as any).gtag?.("consent", "update", {
      ad_storage: ad ? "granted" : "denied",
      ad_user_data: ad ? "granted" : "denied",
      ad_personalization: ad ? "granted" : "denied",
      analytics_storage: analytics ? "granted" : "denied",
    });
    setCookie(`ad=${ad ? 1 : 0};an=${analytics ? 1 : 0}`);
    setShow(false);
  };

  const acceptAll = () => apply(true, true);
  const refuseAll = () => apply(false, false);
  const saveCustom = () => apply(cats.ad, cats.analytics);

  // Scroll-as-consent : tout scroll = accepte implicitement
  useEffect(() => {
    if (!show) return;
    const onScroll = () => {
      if ((window.scrollY || document.documentElement.scrollTop) > 5) {
        acceptAll();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [show]);

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-3 z-[70] mx-auto w-[calc(100%-1.5rem)] max-w-[420px] border border-[var(--border)] bg-white p-3 text-xs shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
    >
      {!detail ? (
        <>
          <p className="text-xs leading-snug text-[var(--anthracite)]">
            Cookies pour mesurer l'audience. En naviguant, vous acceptez leur dépôt.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              onClick={refuseAll}
              className="border border-[var(--anthracite)] px-2 py-1.5 text-xs font-semibold text-[var(--anthracite)] transition hover:bg-[var(--anthracite)] hover:text-white"
            >
              Refuser
            </button>
            <button
              onClick={acceptAll}
              className="border px-2 py-1.5 text-xs font-semibold transition"
              style={{ borderColor: "var(--sage)", color: "var(--sage)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sage)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--sage)"; }}
            >
              Tout accepter
            </button>
          </div>
          <button onClick={() => setDetail(true)} className="mt-1.5 block w-full text-center text-[10px] text-[var(--muted-text)] underline">
            Personnaliser
          </button>
        </>
      ) : (
        <>
          <p className="h-display text-lg">Vos préférences</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3">
              <div>
                <p className="font-semibold text-[var(--anthracite)]">Strictement nécessaires</p>
                <p className="text-xs text-[var(--muted-text)]">Indispensables au fonctionnement du site.</p>
              </div>
              <span className="text-xs italic text-[var(--muted-text)]">Toujours actifs</span>
            </li>
            <li className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3">
              <div>
                <p className="font-semibold text-[var(--anthracite)]">Mesure d'audience</p>
                <p className="text-xs text-[var(--muted-text)]">Statistiques de visite anonymisées.</p>
              </div>
              <input type="checkbox" className="mt-1 h-5 w-5 accent-[var(--gold)]"
                checked={cats.analytics} onChange={(e) => setCats({ ...cats, analytics: e.target.checked })} />
            </li>
            <li className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-[var(--anthracite)]">Publicité et personnalisation</p>
                <p className="text-xs text-[var(--muted-text)]">Mesure des campagnes et contenus personnalisés.</p>
              </div>
              <input type="checkbox" className="mt-1 h-5 w-5 accent-[var(--gold)]"
                checked={cats.ad} onChange={(e) => setCats({ ...cats, ad: e.target.checked })} />
            </li>
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setDetail(false)}
              className="border-[1.5px] border-[var(--anthracite)] px-4 py-3 text-sm font-semibold text-[var(--anthracite)]"
            >
              Retour
            </button>
            <button
              onClick={saveCustom}
              className="border-[1.5px] px-4 py-3 text-sm font-semibold"
              style={{ borderColor: "var(--sage)", color: "var(--sage)" }}
            >
              Enregistrer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
