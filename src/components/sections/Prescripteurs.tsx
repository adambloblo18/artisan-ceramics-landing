import { Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const benefits = [
  "Échantillons techniques gratuits sous 5 jours ouvrés",
  "BDD motifs et coloris pour vos planches matériaux",
  "Tarification dégressive sur volumes 5 m² et plus",
  "Référent unique chez nous pour vos projets clients",
];

const segments = ["Architectes", "Décorateurs", "Promoteurs", "Hôteliers"];

const MAILTO =
  "mailto:laurence@ceramique-murale.com?subject=Demande%20book%20prescripteurs&body=Bonjour%20Laurence%2C%0A%0ANom%20du%20cabinet%20%3A%20%0ANature%20du%20projet%20%3A%20%0AVolume%20estim%C3%A9%20%3A%20%0A%0AMerci%20%21";

export default function Prescripteurs() {
  return (
    <section className="bg-[#2a2a2a] py-20 md:py-24 text-[#f9f7f2]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex rounded-full border border-[#b8860b]/40 bg-[#b8860b]/10 px-4 py-2 text-xs font-medium text-[#d4a02a]">
            Architectes &amp; Décorateurs
          </span>
          <h2 className="font-display text-3xl md:text-5xl text-[#f9f7f2] mt-4 leading-tight">
            Travaillons sur vos
            <br />
            projets clients
          </h2>
          <p className="font-body text-base md:text-lg text-[#f9f7f2]/85 mt-6 leading-relaxed">
            Nous accompagnons les architectes et décorateurs sur les projets résidentiels et
            hospitality. Échantillons techniques sous 5 jours, devis détaillé pour vos planches
            matériaux, livraison France entière et internationale, coordination avec votre
            carreleur.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-[#8a9d83] shrink-0 mt-0.5" aria-hidden />
                <span className="font-body text-sm md:text-base text-[#f9f7f2]/90">{b}</span>
              </li>
            ))}
          </ul>

          <a
            href={MAILTO}
            onClick={() => trackEvent("prescripteurs_cta_click")}
            className="inline-flex items-center justify-center mt-10 px-6 py-3 rounded-md border border-[#f9f7f2] text-[#f9f7f2] font-semibold hover:bg-[#f9f7f2] hover:text-[#2a2a2a] transition-colors"
          >
            Demander notre book prescripteurs
          </a>
        </div>

        {/* TODO: remplacer ces blocs par les logos réels des cabinets partenaires quand Laurence aura validé qui mettre */}
        <div className="grid grid-cols-2 gap-4">
          {segments.map((s) => (
            <div
              key={s}
              className="aspect-square border border-[#b8860b]/30 rounded-md flex items-center justify-center font-['Cormorant_Garamond'] text-xl md:text-2xl text-[#d4a02a]"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
