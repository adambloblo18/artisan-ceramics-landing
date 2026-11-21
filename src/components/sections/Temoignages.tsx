import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const projets = [
  {
    img: "/images/galerie-3-frise-pivoines.jpg",
    webp: "/images/galerie-3-frise-pivoines.webp",
    pill: "Cuisine",
    titre: "Une frise fleurie au-dessus d'un évier",
    recit:
      "Une frise de fleurs bleu-vert sur fond blanc, peinte à la main.",
    meta: "Mini-crédence",
  },
  {
    img: "/images/frise-vaucresson.jpg",
    webp: "/images/frise-vaucresson.webp",
    pill: "Façade",
    titre: "Une frise florale pour une maison à Vaucresson",
    recit:
      "Sept carreaux fleuris peints à la main au-dessus de la fenêtre, et la plaque « La Salvarina » en dessous, sur une façade de Vaucresson.",
    meta: "Vaucresson · Façade extérieure",
  },
];

export default function Temoignages() {
  return (
    <section className="bg-[#f9f7f2] py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-5xl text-[#2a2a2a] text-center">
          Projets de l'atelier
        </h2>
        <p className="font-body text-base text-[#2a2a2a]/70 text-center max-w-2xl mx-auto mt-4">
          Quelques pièces peintes par Laurence.
        </p>

        <div className="flex flex-col gap-16 md:gap-24 mt-16">
          {projets.map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={p.titre}
                className="md:grid md:grid-cols-2 md:gap-12 md:items-center"
              >
                <picture
                  className={`block ${reverse ? "md:order-2" : "md:order-1"}`}
                >
                  <source type="image/webp" srcSet={p.webp} />
                  <img
                    src={p.img}
                    alt={p.titre}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={1000}
                    className="aspect-[4/5] w-full object-cover rounded-md shadow-xl shadow-[#2a2a2a]/15 md:max-h-[500px]"
                  />
                </picture>
                <div
                  className={`mt-6 md:mt-0 flex flex-col ${reverse ? "md:order-1" : "md:order-2"}`}
                >
                  <span className="self-start inline-flex items-center rounded-full border border-[#b8860b]/40 bg-[#b8860b]/10 px-3 py-1 text-xs font-medium text-[#a07308]">
                    {p.pill}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-[#2a2a2a] mt-4">
                    {p.titre}
                  </h3>
                  <p className="font-body text-base md:text-lg text-[#2a2a2a]/80 mt-4 leading-relaxed max-w-md">
                    {p.recit}
                  </p>
                  <p className="font-body text-xs text-[#2a2a2a]/60 mt-6 uppercase tracking-wider">
                    {p.meta}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://www.ceramique-murale.com/realisation-carreau-ceramique-artisanal-art-nouveau/"
            target="_blank"
            rel="noopener"
            onClick={() => trackEvent("temoignages_voir_tout_click")}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-[#b8860b] text-[#a07308] font-semibold hover:bg-[#b8860b] hover:text-[#f9f7f2] transition-colors"
          >
            Voir toutes les réalisations
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
