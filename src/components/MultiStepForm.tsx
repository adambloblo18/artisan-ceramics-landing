import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const REDIRECT_BASE =
  "https://www.ceramique-murale.com/merci-pour-votre-demande-de-projet/";
const ENDPOINT = "/api/public/contact";

function buildRedirectUrl(values: { nom: string; telephone: string }) {
  const parts = values.nom.trim().split(/\s+/);
  const fn = parts[0] ?? "";
  const ln = parts.slice(1).join(" ");
  const params = new URLSearchParams({
    phone: values.telephone,
    fn,
    ln,
    value: "500",
    tx: `LEAD-${Date.now()}`,
  });
  return `${REDIRECT_BASE}?${params.toString()}`;
}

const phoneRegex =
  /^(?:(?:\+|00)33[\s.-]?(?:\(0\)[\s.-]?)?|0)[1-9](?:(?:[\s.-]?\d{2}){4})$/;

const schema = z.object({
  nom: z.string().trim().min(2, "Au moins 2 caractères").max(80),
  telephone: z.string().trim().regex(phoneRegex, "Numéro français invalide"),
  projet: z
    .string()
    .trim()
    .min(5, "Décrivez votre projet en quelques mots")
    .max(500),
  type: z.enum(["particulier", "architecte"]),
  rgpd: z.literal(true, {
    errorMap: () => ({ message: "Merci d'accepter d'être recontacté(e)." }),
  }),
  website: z.string().max(0).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function MultiStepForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      telephone: "",
      projet: "",
      type: "particulier",
      rgpd: undefined as unknown as true,
      website: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    if (values.website) return;
    if (Date.now() - mountedAt.current < 2000) return;

    const subject =
      values.type === "architecte"
        ? "Nouveau lead [Architecte]"
        : "Nouveau lead [Particulier]";

    const redirectUrl = buildRedirectUrl(values);
    const payload = {
      _subject: subject,
      _captcha: "false",
      _template: "table",
      nom: values.nom,
      telephone: values.telephone,
      projet: values.projet,
      type: values.type,
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      trackEvent("form_submitted", { type: values.type });
      window.location.href = redirectUrl;
    } catch {
      setSubmitError(
        "Une erreur est survenue, merci de réessayer ou d'appeler Laurence au 06 70 02 51 33.",
      );
    }
  };

  if (submitted) {
    return (
      <div
        id="contact-form"
        className="max-w-xl mx-auto bg-[#8a9d83]/10 border border-[#8a9d83]/40 rounded-md p-6 text-center my-12"
      >
        <Check className="h-12 w-12 text-[#8a9d83] mx-auto" aria-hidden />
        <h3 className="font-['Cormorant_Garamond'] text-2xl mt-4 text-[#2a2a2a]">
          Merci !
        </h3>
        <p className="mt-2 text-[#2a2a2a]/80">
          Laurence vous rappelle dans 20 minutes pendant les heures ouvrées.
          Sinon, demain matin à la première heure.
        </p>
      </div>
    );
  }

  const onFieldFocus = (field: "nom" | "telephone" | "projet") =>
    trackEvent("form_field_focus", { field });

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 my-12"
    >
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        {...register("website")}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      <div className="space-y-5">
        {/* Nom */}
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-[#2a2a2a]"
          >
            Votre nom
          </label>
          <input
            id="nom"
            type="text"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.nom}
            aria-describedby={errors.nom ? "nom-err" : undefined}
            {...register("nom", {
              onBlur: () => undefined,
            })}
            onFocus={() => onFieldFocus("nom")}
            className="mt-2 w-full rounded-md border border-[#2a2a2a]/20 bg-white px-3 py-2.5 text-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
          />
          {errors.nom && (
            <p id="nom-err" className="mt-1 text-sm text-red-600">
              {errors.nom.message}
            </p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-[#2a2a2a]"
          >
            Votre téléphone
          </label>
          <input
            id="telephone"
            type="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            aria-required="true"
            aria-invalid={!!errors.telephone}
            aria-describedby={errors.telephone ? "tel-err" : undefined}
            {...register("telephone")}
            onFocus={() => onFieldFocus("telephone")}
            className="mt-2 w-full rounded-md border border-[#2a2a2a]/20 bg-white px-3 py-2.5 text-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
          />
          {errors.telephone && (
            <p id="tel-err" className="mt-1 text-sm text-red-600">
              {errors.telephone.message}
            </p>
          )}
        </div>

        {/* Projet */}
        <div>
          <label
            htmlFor="projet"
            className="block text-sm font-medium text-[#2a2a2a]"
          >
            En une phrase : que voulez-vous faire ?
          </label>
          <textarea
            id="projet"
            rows={2}
            placeholder="Ex. crédence sur mesure cuisine 2,5m, motif Art Nouveau"
            aria-required="true"
            aria-invalid={!!errors.projet}
            aria-describedby={errors.projet ? "projet-err" : undefined}
            {...register("projet")}
            onFocus={() => onFieldFocus("projet")}
            className="mt-2 w-full rounded-md border border-[#2a2a2a]/20 bg-white px-3 py-2.5 text-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
          />
          {errors.projet && (
            <p id="projet-err" className="mt-1 text-sm text-red-600">
              {errors.projet.message}
            </p>
          )}
        </div>

        {/* Type */}
        <fieldset>
          <legend className="text-sm font-medium text-[#2a2a2a]">
            Vous êtes :
          </legend>
          <div className="mt-2 flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-[#2a2a2a]">
              <input
                type="radio"
                value="particulier"
                {...register("type")}
                className="accent-[#b8860b]"
              />
              Particulier
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-[#2a2a2a]">
              <input
                type="radio"
                value="architecte"
                {...register("type")}
                className="accent-[#b8860b]"
              />
              Architecte ou prescripteur
            </label>
          </div>
        </fieldset>

        {/* RGPD */}
        <div>
          <label className="flex items-start gap-2 text-sm text-[#2a2a2a]">
            <input
              type="checkbox"
              aria-required="true"
              aria-invalid={!!errors.rgpd}
              aria-describedby={errors.rgpd ? "rgpd-err" : undefined}
              {...register("rgpd")}
              className="mt-1 accent-[#b8860b]"
            />
            <span>
              J'accepte d'être recontacté(e) par l'atelier au sujet de mon
              projet. Mes données ne seront jamais transmises à des tiers.
            </span>
          </label>
          {errors.rgpd && (
            <p id="rgpd-err" className="mt-1 text-sm text-red-600">
              {errors.rgpd.message as string}
            </p>
          )}
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-red-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#b8860b] px-6 py-3.5 font-semibold text-[#2a2a2a] hover:bg-[#a87708] transition-colors disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <>
              Recevoir mon étude personnalisée
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>

        <p className="text-xs text-[#2a2a2a]/60 text-center">
          Réponse en 20 minutes pendant les heures ouvrées. Aucun engagement,
          devis gratuit.
        </p>
      </div>
    </form>
  );
}
