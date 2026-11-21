import { trackEvent } from "@/lib/analytics";

const partners = [
  { name: "Ville de Versailles, Premier Prix du Ravalement 2025" },
  { name: "Fédération française du bâtiment, article du 16 décembre 2024" },
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
          Ils ont parlé de l'atelier
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6 overflow-x-auto">
          {partners.map((p) => (
            <li
              key={p.name}
              className="h-12 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <button
                type="button"
                onClick={() => trackEvent("trust_strip_logo_click", { partner: p.name })}
                className="text-[#2a2a2a]/40 italic text-sm text-center"
                aria-label={`Partenaire : ${p.name}`}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-xs text-[#2a2a2a]/60">
          <span>1er Prix Versailles 2025</span>
          <span aria-hidden>·</span>
          <span>TVA non applicable - art. 293 B du CGI</span>
        </div>
      </div>
    </section>
  );
}
