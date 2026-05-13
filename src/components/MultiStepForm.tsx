import { useEffect, useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  projet: string;
  taille: string;
  dimension: string;
  delai: string;
  prenom: string;
  email: string;
  telephone: string;
  ville: string;
  message: string;
  rgpd: boolean;
  website: string; // honeypot
}

const initial: FormData = {
  projet: "", taille: "", dimension: "", delai: "",
  prenom: "", email: "", telephone: "", ville: "", message: "",
  rgpd: false, website: "",
};

const projets = [
  { id: "credence", label: "Crédence cuisine", icon: "🍳" },
  { id: "sdb", label: "Salle de bain", icon: "🛁" },
  { id: "facade", label: "Façade ou extérieur", icon: "🏛️" },
  { id: "autre", label: "Autre projet", icon: "✨" },
];
const tailles = [
  { id: "petit", label: "Petit", desc: "moins de 1 m²" },
  { id: "moyen", label: "Moyen", desc: "1 à 3 m²" },
  { id: "grand", label: "Grand", desc: "plus de 3 m²" },
];
const delais = [
  { id: "mois", label: "Dans le mois" },
  { id: "1-3", label: "1 à 3 mois" },
  { id: "3-6", label: "3 à 6 mois" },
  { id: "explore", label: "Pas pressé, j'explore" },
];

export default function MultiStepForm() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef<number>(Date.now());

  useEffect(() => { mountedAt.current = Date.now(); }, []);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (data.website) return; // honeypot
    if (Date.now() - mountedAt.current < 2000) return; // too fast
    if (!data.rgpd) { setError("Merci d'accepter d'être recontacté."); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("_next", "https://www.ceramique-murale.com/merci-pour-votre-demande-de-projet/");
      fd.append("_captcha", "false");
      fd.append("_subject", "Nouvelle demande Crédence");
      fd.append("projet", data.projet);
      fd.append("taille", data.taille);
      fd.append("dimension", data.dimension);
      fd.append("delai", data.delai);
      fd.append("prenom", data.prenom);
      fd.append("email", data.email);
      fd.append("telephone", data.telephone);
      fd.append("ville", data.ville);
      fd.append("message", data.message);
      const res = await fetch("https://formsubmit.co/ceramiquemurale@gmail.com", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("submit failed");
      try {
        sessionStorage.setItem("lcm_email", data.email);
        sessionStorage.setItem("lcm_phone", data.telephone);
      } catch { /* no-op */ }
      const e64 = encodeURIComponent(data.email);
      const p64 = encodeURIComponent(data.telephone);
      window.location.href = `https://www.ceramique-murale.com/merci-pour-votre-demande-de-projet/?source=lovable&e=${e64}&p=${p64}`;
    } catch {
      setError("Une erreur est survenue, merci de réessayer ou d'appeler Laurence au 06 70 02 51 33.");
      setSubmitting(false);
    }
  };

  const progress = step * 25;

  return (
    <form onSubmit={submit} className="card-soft mx-auto max-w-2xl p-6 sm:p-10">
      {/* Honeypot */}
      <input
        type="text" name="website" tabIndex={-1} autoComplete="off"
        value={data.website} onChange={(e) => update("website", e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        aria-hidden="true"
      />

      <div className="mb-8">
        <div className="h-1 w-full bg-[var(--border)]">
          <div className="h-1 transition-all duration-300" style={{ width: `${progress}%`, background: "var(--gold)" }} />
        </div>
        <p className="mt-2 text-xs text-[var(--muted-text)]">Étape {step} sur 4</p>
      </div>

      <div className="overflow-hidden">
        {step === 1 && (
          <div className="fade-up">
            <h3 className="h-display text-2xl sm:text-3xl">Quel type de projet ?</h3>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {projets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { update("projet", p.label); setStep(2); }}
                  className="flex items-center gap-3 border border-[var(--border)] bg-white p-5 text-left transition hover:border-[var(--gold)]"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <h3 className="h-display text-2xl sm:text-3xl">Dimensions approximatives ?</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {tailles.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update("taille", t.label)}
                  className={`border p-5 text-left transition ${data.taille === t.label ? "border-[var(--gold)] bg-[var(--cream)]" : "border-[var(--border)] bg-white hover:border-[var(--gold)]"}`}
                >
                  <div className="font-medium">{t.label}</div>
                  <div className="text-sm text-[var(--muted-text)]">{t.desc}</div>
                </button>
              ))}
            </div>
            <label className="mt-6 block">
              <span className="text-sm text-[var(--muted-text)]">Dimension exacte (optionnel)</span>
              <input
                type="text" className="field-input mt-2"
                value={data.dimension} onChange={(e) => update("dimension", e.target.value)}
                placeholder="Ex : 1,80 m × 0,60 m"
              />
            </label>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="text-sm underline text-[var(--muted-text)]">Retour</button>
              <button type="button" disabled={!data.taille} onClick={() => setStep(3)} className="btn-primary disabled:opacity-50">Suivant</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <h3 className="h-display text-2xl sm:text-3xl">Quand souhaitez-vous démarrer ?</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {delais.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => { update("delai", d.label); setStep(4); }}
                  className="border border-[var(--border)] bg-white p-5 text-left font-medium transition hover:border-[var(--gold)]"
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setStep(2)} className="mt-6 text-sm underline text-[var(--muted-text)]">Retour</button>
          </div>
        )}

        {step === 4 && (
          <div className="fade-up space-y-4">
            <h3 className="h-display text-2xl sm:text-3xl">Comment vous joindre ?</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-[var(--muted-text)]">Prénom</span>
                <input required autoComplete="given-name" className="field-input mt-1"
                  value={data.prenom} onChange={(e) => update("prenom", e.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm text-[var(--muted-text)]">Email</span>
                <input required type="email" autoComplete="email" className="field-input mt-1"
                  value={data.email} onChange={(e) => update("email", e.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm text-[var(--muted-text)]">Téléphone</span>
                <input required type="tel" autoComplete="tel" placeholder="06 12 34 56 78"
                  className="field-input mt-1"
                  value={data.telephone} onChange={(e) => update("telephone", e.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm text-[var(--muted-text)]">Ville (optionnel)</span>
                <input autoComplete="address-level2" className="field-input mt-1"
                  value={data.ville} onChange={(e) => update("ville", e.target.value)} />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-[var(--muted-text)]">Message (optionnel)</span>
              <textarea rows={4} className="field-input mt-1"
                placeholder="Couleurs préférées, contraintes, photos à venir..."
                value={data.message} onChange={(e) => update("message", e.target.value)} />
            </label>
            <label className="flex items-start gap-3 text-sm text-[var(--muted-text)]">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--gold)]"
                checked={data.rgpd} onChange={(e) => update("rgpd", e.target.checked)} required />
              <span>J'accepte d'être recontacté(e) par l'atelier au sujet de mon projet. Mes données ne seront jamais transmises à des tiers.</span>
            </label>
            {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Envoi en cours..." : "Envoyer ma demande →"}
            </button>
            <button type="button" onClick={() => setStep(3)} className="block text-sm underline text-[var(--muted-text)]">Retour</button>
          </div>
        )}
      </div>
    </form>
  );
}
