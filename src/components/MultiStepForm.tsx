import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import {
  useABVariant,
  trackExposure,
  trackConversion,
} from "@/lib/ab-helpers";

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
  projet: "",
  taille: "",
  dimension: "",
  delai: "",
  prenom: "",
  email: "",
  telephone: "",
  ville: "",
  message: "",
  rgpd: false,
  website: "",
};

const projets = [
  { id: "credence", label: "Crédence cuisine", icon: "" },
  { id: "sdb", label: "Salle de bain", icon: "" },
  { id: "facade", label: "Façade ou extérieur", icon: "" },
  { id: "autre", label: "Autre projet", icon: "" },
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

const priceByTaille: Record<string, string> = {
  Petit: "À partir de 1 000 €",
  Moyen: "2 500 € à 5 000 €",
  Grand: "Sur devis personnalisé",
};

const REDIRECT_URL =
  "https://www.ceramique-murale.com/merci-pour-votre-demande-de-projet/";
const ENDPOINT = "https://formsubmit.co/ceramiquemurale@gmail.com";

async function postToFormSubmit(data: Partial<FormData>) {
  const fd = new window.FormData();
  fd.append("_next", REDIRECT_URL);
  fd.append("_captcha", "false");
  fd.append("_subject", "Nouvelle demande Crédence");
  Object.entries(data).forEach(([k, v]) => {
    if (typeof v === "string") fd.append(k, v);
  });
  const res = await fetch(ENDPOINT, { method: "POST", body: fd });
  if (!res.ok) throw new Error("submit failed");
}

function persistAndRedirect(email: string, telephone: string) {
  try {
    sessionStorage.setItem("lcm_email", email);
    sessionStorage.setItem("lcm_phone", telephone);
  } catch {
    /* no-op */
  }
  const e64 = encodeURIComponent(email);
  const p64 = encodeURIComponent(telephone);
  window.location.href = `${REDIRECT_URL}?source=lovable&e=${e64}&p=${p64}`;
}

function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      aria-hidden="true"
    />
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = (step / total) * 100;
  return (
    <div className="mb-8">
      <div className="h-1 w-full bg-[var(--border)]">
        <div
          className="h-1 transition-all duration-300"
          style={{ width: `${progress}%`, background: "var(--gold)" }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--muted-text)]">
        Étape {step} sur {total}
      </p>
    </div>
  );
}

/* ============================================================
 * MultiStep4 — control (current behavior, 4 steps)
 * ============================================================ */
function MultiStep4({ variant }: { variant: string }) {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef<number>(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const goToStep = (s: Step, completed?: number) => {
    if (completed)
      trackConversion("form_step_completed", { variant, step: completed });
    setStep(s);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (data.website) return;
    if (Date.now() - mountedAt.current < 2000) return;
    if (!data.rgpd) {
      setError("Merci d'accepter d'être recontacté.");
      return;
    }
    setSubmitting(true);
    try {
      trackConversion("form_submitted", { variant, ...data });
      await postToFormSubmit(data);
      persistAndRedirect(data.email, data.telephone);
    } catch {
      setError(
        "Une erreur est survenue, merci de réessayer ou d'appeler Laurence au 06 70 02 51 33.",
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="card-soft mx-auto max-w-2xl p-6 sm:p-10">
      <Honeypot
        value={data.website}
        onChange={(v) => update("website", v)}
      />
      <ProgressBar step={step} total={4} />
      <div className="overflow-hidden">
        {step === 1 && (
          <div className="fade-up">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="h-display text-2xl sm:text-3xl outline-none"
            >
              Quel type de projet ?
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {projets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    update("projet", p.label);
                    goToStep(2, 1);
                  }}
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
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="h-display text-2xl sm:text-3xl outline-none"
            >
              Dimensions approximatives ?
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {tailles.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update("taille", t.label)}
                  className={`border p-5 text-left transition ${
                    data.taille === t.label
                      ? "border-[var(--gold)] bg-[var(--cream)]"
                      : "border-[var(--border)] bg-white hover:border-[var(--gold)]"
                  }`}
                >
                  <div className="font-medium">{t.label}</div>
                  <div className="text-sm text-[var(--muted-text)]">
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
            <label className="mt-6 block">
              <span className="text-sm text-[var(--muted-text)]">
                Dimension exacte (optionnel)
              </span>
              <input
                type="text"
                className="field-input mt-2"
                value={data.dimension}
                onChange={(e) => update("dimension", e.target.value)}
                placeholder="Ex : 1,80 m × 0,60 m"
              />
            </label>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm underline text-[var(--muted-text)]"
              >
                Retour
              </button>
              <button
                type="button"
                disabled={!data.taille}
                onClick={() => goToStep(3, 2)}
                className="btn-primary disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="h-display text-2xl sm:text-3xl outline-none"
            >
              Quand souhaitez-vous démarrer ?
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {delais.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    update("delai", d.label);
                    goToStep(4, 3);
                  }}
                  className="border border-[var(--border)] bg-white p-5 text-left font-medium transition hover:border-[var(--gold)]"
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-6 text-sm underline text-[var(--muted-text)]"
            >
              Retour
            </button>
          </div>
        )}

        {step === 4 && (
          <ContactFields
            data={data}
            update={update}
            error={error}
            submitting={submitting}
            onBack={() => setStep(3)}
            headingRef={headingRef}
          />
        )}
      </div>
    </form>
  );
}

/* ============================================================
 * MultiStep3 — variant A (no délai step)
 * ============================================================ */
function MultiStep3({ variant }: { variant: string }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<FormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef<number>(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const goToStep = (s: 1 | 2 | 3, completed?: number) => {
    if (completed)
      trackConversion("form_step_completed", { variant, step: completed });
    setStep(s);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (data.website) return;
    if (Date.now() - mountedAt.current < 2000) return;
    if (!data.rgpd) {
      setError("Merci d'accepter d'être recontacté.");
      return;
    }
    setSubmitting(true);
    try {
      trackConversion("form_submitted", { variant, ...data });
      await postToFormSubmit(data);
      persistAndRedirect(data.email, data.telephone);
    } catch {
      setError(
        "Une erreur est survenue, merci de réessayer ou d'appeler Laurence au 06 70 02 51 33.",
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="card-soft mx-auto max-w-2xl p-6 sm:p-10">
      <Honeypot
        value={data.website}
        onChange={(v) => update("website", v)}
      />
      <ProgressBar step={step} total={3} />
      <div className="overflow-hidden">
        {step === 1 && (
          <div className="fade-up">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="h-display text-2xl sm:text-3xl outline-none"
            >
              Quel type de projet ?
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {projets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    update("projet", p.label);
                    goToStep(2, 1);
                  }}
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
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="h-display text-2xl sm:text-3xl outline-none"
            >
              Dimensions approximatives ?
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {tailles.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update("taille", t.label)}
                  className={`border p-5 text-left transition ${
                    data.taille === t.label
                      ? "border-[var(--gold)] bg-[var(--cream)]"
                      : "border-[var(--border)] bg-white hover:border-[var(--gold)]"
                  }`}
                >
                  <div className="font-medium">{t.label}</div>
                  <div className="text-sm text-[var(--muted-text)]">
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
            <label className="mt-6 block">
              <span className="text-sm text-[var(--muted-text)]">
                Dimension exacte (optionnel)
              </span>
              <input
                type="text"
                className="field-input mt-2"
                value={data.dimension}
                onChange={(e) => update("dimension", e.target.value)}
                placeholder="Ex : 1,80 m × 0,60 m"
              />
            </label>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm underline text-[var(--muted-text)]"
              >
                Retour
              </button>
              <button
                type="button"
                disabled={!data.taille}
                onClick={() => goToStep(3, 2)}
                className="btn-primary disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <ContactFields
            data={data}
            update={update}
            error={error}
            submitting={submitting}
            onBack={() => setStep(2)}
            headingRef={headingRef}
          />
        )}
      </div>
    </form>
  );
}

/* ============================================================
 * MultiStep3WithEstimator — variant C
 * Step 1: choix de surface avec badge prix
 * Step 2: type de projet
 * Step 3: coordonnées avec récap prix
 * ============================================================ */
function MultiStep3WithEstimator({ variant }: { variant: string }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<FormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef<number>(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const goToStep = (s: 1 | 2 | 3, completed?: number) => {
    if (completed)
      trackConversion("form_step_completed", { variant, step: completed });
    setStep(s);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (data.website) return;
    if (Date.now() - mountedAt.current < 2000) return;
    if (!data.rgpd) {
      setError("Merci d'accepter d'être recontacté.");
      return;
    }
    setSubmitting(true);
    try {
      trackConversion("form_submitted", { variant, ...data });
      await postToFormSubmit(data);
      persistAndRedirect(data.email, data.telephone);
    } catch {
      setError(
        "Une erreur est survenue, merci de réessayer ou d'appeler Laurence au 06 70 02 51 33.",
      );
      setSubmitting(false);
    }
  };

  const estimatedPrice = data.taille ? priceByTaille[data.taille] : null;

  return (
    <form onSubmit={submit} className="card-soft mx-auto max-w-2xl p-6 sm:p-10">
      <Honeypot
        value={data.website}
        onChange={(v) => update("website", v)}
      />
      <ProgressBar step={step} total={3} />
      <div className="overflow-hidden">
        {step === 1 && (
          <div className="fade-up">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="h-display text-2xl sm:text-3xl outline-none"
            >
              Quelle surface pour votre projet ?
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-text)]">
              Estimation indicative immédiate
            </p>
            <div className="mt-6 grid gap-3">
              {tailles.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    update("taille", t.label);
                    goToStep(2, 1);
                  }}
                  className={`flex items-center justify-between gap-3 border p-5 text-left transition ${
                    data.taille === t.label
                      ? "border-[var(--gold)] bg-[var(--cream)]"
                      : "border-[var(--border)] bg-white hover:border-[var(--gold)]"
                  }`}
                >
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-sm text-[var(--muted-text)]">
                      {t.desc}
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {priceByTaille[t.label]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="h-display text-2xl sm:text-3xl outline-none"
            >
              Quel type de projet ?
            </h3>
            {estimatedPrice && (
              <div className="mt-3">
                <Badge variant="secondary">
                  Estimation : {estimatedPrice}
                </Badge>
              </div>
            )}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {projets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    update("projet", p.label);
                    goToStep(3, 2);
                  }}
                  className="flex items-center gap-3 border border-[var(--border)] bg-white p-5 text-left transition hover:border-[var(--gold)]"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-medium">{p.label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-6 text-sm underline text-[var(--muted-text)]"
            >
              Retour
            </button>
          </div>
        )}

        {step === 3 && (
          <ContactFields
            data={data}
            update={update}
            error={error}
            submitting={submitting}
            onBack={() => setStep(2)}
            headingRef={headingRef}
            estimateBanner={
              estimatedPrice ? (
                <div className="border border-[var(--gold)] bg-[var(--cream)] p-3">
                  <p className="text-sm">
                    <span className="text-[var(--muted-text)]">
                      Votre estimation :
                    </span>{" "}
                    <strong>{estimatedPrice}</strong>
                  </p>
                </div>
              ) : null
            }
          />
        )}
      </div>
    </form>
  );
}

/* ============================================================
 * SingleStep — variant B
 * ============================================================ */
const singleSchema = z.object({
  prenom: z.string().min(2, "Prénom requis"),
  telephone: z
    .string()
    .min(8, "Téléphone requis")
    .regex(/^[\d\s+().-]{8,}$/, "Téléphone invalide"),
  description: z.string().min(5, "Décrivez brièvement votre projet"),
  rgpd: z.boolean().refine((v) => v, "Merci d'accepter d'être recontacté."),
  website: z.string().optional(),
});
type SingleFields = z.infer<typeof singleSchema>;

function SingleStep({ variant }: { variant: string }) {
  const mountedAt = useRef<number>(Date.now());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SingleFields>({
    resolver: zodResolver(singleSchema),
    defaultValues: {
      prenom: "",
      telephone: "",
      description: "",
      rgpd: false,
      website: "",
    },
  });

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const onSubmit = async (values: SingleFields) => {
    setSubmitError(null);
    if (values.website) return;
    if (Date.now() - mountedAt.current < 2000) return;
    try {
      const payload = {
        prenom: values.prenom,
        telephone: values.telephone,
        message: values.description,
      };
      trackConversion("form_submitted", { variant, ...payload });
      await postToFormSubmit(payload);
      persistAndRedirect("", values.telephone);
    } catch {
      setSubmitError(
        "Une erreur est survenue, merci de réessayer ou d'appeler Laurence au 06 70 02 51 33.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-soft mx-auto max-w-2xl space-y-4 p-6 sm:p-10"
    >
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        aria-hidden="true"
      />
      <h3 className="h-display text-2xl sm:text-3xl">
        Parlez-nous de votre projet
      </h3>
      <p className="text-sm text-[var(--muted-text)]">
        Réponse de Laurence en moins de 20 minutes (heures ouvrées).
      </p>

      <label className="block">
        <span className="text-sm text-[var(--muted-text)]">Prénom</span>
        <input
          autoComplete="given-name"
          aria-required="true"
          aria-invalid={!!errors.prenom}
          className="field-input mt-1"
          {...register("prenom")}
        />
        {errors.prenom && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            {errors.prenom.message}
          </p>
        )}
      </label>

      <label className="block">
        <span className="text-sm text-[var(--muted-text)]">Téléphone</span>
        <input
          type="tel"
          autoComplete="tel"
          placeholder="06 12 34 56 78"
          aria-required="true"
          aria-invalid={!!errors.telephone}
          className="field-input mt-1"
          {...register("telephone")}
        />
        {errors.telephone && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            {errors.telephone.message}
          </p>
        )}
      </label>

      <label className="block">
        <span className="text-sm text-[var(--muted-text)]">Votre projet</span>
        <textarea
          rows={3}
          aria-required="true"
          aria-invalid={!!errors.description}
          className="field-input mt-1"
          placeholder="Crédence cuisine 1,80 m, style Art Nouveau..."
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            {errors.description.message}
          </p>
        )}
      </label>

      <label className="flex items-start gap-3 text-sm text-[var(--muted-text)]">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--gold)]"
          {...register("rgpd")}
        />
        <span>
          J'accepte d'être recontacté(e) par l'atelier au sujet de mon projet.
        </span>
      </label>
      {errors.rgpd && (
        <p className="text-xs text-[var(--destructive)]">
          {errors.rgpd.message}
        </p>
      )}
      {submitError && (
        <p className="text-sm text-[var(--destructive)]">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande →"}
      </button>
    </form>
  );
}

/* ============================================================
 * Shared contact fields (final step for 3 & 4-step variants)
 * ============================================================ */
function ContactFields({
  data,
  update,
  error,
  submitting,
  onBack,
  headingRef,
  estimateBanner,
}: {
  data: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  error: string | null;
  submitting: boolean;
  onBack: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  estimateBanner?: React.ReactNode;
}) {
  return (
    <div className="fade-up space-y-4">
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="h-display text-2xl sm:text-3xl outline-none"
      >
        Comment vous joindre ?
      </h3>
      {estimateBanner}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-[var(--muted-text)]">Prénom</span>
          <input
            required
            aria-required="true"
            autoComplete="given-name"
            className="field-input mt-1"
            value={data.prenom}
            onChange={(e) => update("prenom", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm text-[var(--muted-text)]">Email</span>
          <input
            required
            aria-required="true"
            type="email"
            autoComplete="email"
            className="field-input mt-1"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm text-[var(--muted-text)]">Téléphone</span>
          <input
            required
            aria-required="true"
            type="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            className="field-input mt-1"
            value={data.telephone}
            onChange={(e) => update("telephone", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm text-[var(--muted-text)]">
            Ville (optionnel)
          </span>
          <input
            autoComplete="address-level2"
            className="field-input mt-1"
            value={data.ville}
            onChange={(e) => update("ville", e.target.value)}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-[var(--muted-text)]">
          Message (optionnel)
        </span>
        <textarea
          rows={4}
          className="field-input mt-1"
          placeholder="Couleurs préférées, contraintes, photos à venir..."
          value={data.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-[var(--muted-text)]">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--gold)]"
          checked={data.rgpd}
          onChange={(e) => update("rgpd", e.target.checked)}
          required
          aria-required="true"
        />
        <span>
          J'accepte d'être recontacté(e) par l'atelier au sujet de mon projet.
          Mes données ne seront jamais transmises à des tiers.
        </span>
      </label>
      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full"
      >
        {submitting ? "Envoi en cours..." : "Envoyer ma demande →"}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="block text-sm underline text-[var(--muted-text)]"
      >
        Retour
      </button>
    </div>
  );
}

/* ============================================================
 * Default export — A/B router
 * ============================================================ */
export default function MultiStepForm() {
  const variant = useABVariant("contact_form_v1", [
    "control",
    "A",
    "B",
    "C",
  ]);

  useEffect(() => {
    trackExposure("contact_form_v1", variant);
  }, [variant]);

  let inner: React.ReactNode;
  switch (variant) {
    case "A":
      inner = <MultiStep3 variant={variant} />;
      break;
    case "B":
      inner = <SingleStep variant={variant} />;
      break;
    case "C":
      inner = <MultiStep3WithEstimator variant={variant} />;
      break;
    case "control":
    default:
      inner = <MultiStep4 variant={variant} />;
      break;
  }

  return (
    <section data-ab-experiment="contact_form_v1" data-ab-variant={variant}>
      {inner}
    </section>
  );
}
