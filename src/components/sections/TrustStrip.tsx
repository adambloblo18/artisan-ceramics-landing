import { trackEvent } from "@/lib/analytics";

// TODO Adam : remplacer les placeholders par les vrais logos (SVG ou PNG dans /public/images/logos/)
// et confirmer les affiliations réelles (Société des Beaux-Arts, Architectes du Patrimoine, presse).
const partners = [
  { name: "Ville de Versailles", note: "Premier Prix 2025" },
  { name: "Société des Beaux-Arts" },
  { name: "Architectes du Patrimoine" },
  { name: "Métiers d'Art de France" },
  { name: "Madame Figaro" },
];

export default function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-strip-title"
      className="bg-[#f9f7f2] py-8 border-t border-[#2a2a2a]/10"
    >
      <div className="max-w-6xl mx-auto px-6">
        <p
          id="trust-strip-title"
          className="text-center text-xs uppercase tracking-wider text-[#2a2a2a]/50"
        >
          Ils nous font confiance
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6 overflow-x-auto">
          {partners.map((p) => (
            <li
              key={p.name}
              className="h-12 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              {/* TODO Adam : remplacer par <img src="/images/logos/xxx.svg" alt={p.name} /> */}
              <button
                type="button"
                onClick={() => trackEvent("trust_strip_logo_click", { partner: p.name })}
                className="text-[#2a2a2a]/40 italic text-sm text-center"
                aria-label={`Partenaire : ${p.name}`}
              >
                [Logo {p.name}]
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-xs text-[#2a2a2a]/60">
          {/* TODO Adam : compléter le SIRET */}
          <span>SIRET : [À COMPLÉTER]</span>
          <span aria-hidden>·</span>
          <span>Atelier d'art depuis 1995</span>
          <span aria-hidden>·</span>
          <span>1er Prix Versailles 2025</span>
          <span aria-hidden>·</span>
          <span>TVA non applicable - art. 293 B du CGI</span>
        </div>
      </div>
    </section>
  );
}
