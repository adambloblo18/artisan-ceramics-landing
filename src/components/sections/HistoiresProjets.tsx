import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// TODO Laurence : valider les 3 histoires (lieu, métrage, motif, durée) avant publication.
// Histoires reconstruites à partir de projets réels — ne pas publier sans relecture.
const histoires = [
  {
    img: "/images/cuisine-credence-fleurs.png",
    webp: "/images/cuisine-credence-fleurs.png",
    titre: "Une cuisine de famille en Île-de-France",
    histoire:
      "Le couple voulait un motif qui rappelle les rideaux Liberty hérités de la grand-mère. Laurence a peint 28 carreaux sur tons verts pour habiller toute la crédence, en gardant la signature florale Art Nouveau.",
    meta: "Crédence cuisine · 2,8 m² · Livré en 9 semaines",
  },
  {
    img: "/images/galerie-3-frise-pivoines.jpg",
    webp: "/images/galerie-3-frise-pivoines.webp",
    titre: "Une salle de bain transformée en jardin",
    histoire:
      "Pour une maison ancienne à Maisons-Lafitte, nous avons restauré une frise pivoines bleues qui devait s'intégrer entre des moulures d'époque. 30 carreaux peints à la pince, cuits deux fois.",
    meta: "Frise salle de bain · 1,5 m² · Livré en 7 semaines",
  },
  {
    img: "/images/frise-vaucresson.jpg",
    webp: "/images/frise-vaucresson.jpg",
    titre: "Une frise florale pour une maison à Vaucresson",
    histoire:
      "Les propriétaires de « La Salvarina » voulaient habiller leur façade en pierre meulière avec des motifs floraux Art Nouveau. Sept carreaux peints à la main, plus le cartouche signé sous la fenêtre, posés dans l'esprit des villas du début du XXᵉ siècle.",
    meta: "Frise de façade · Vaucresson · Pose extérieure",
  },
];

export default function HistoiresProjets() {
  return (
    <section className="bg-[#f9f7f2] py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-5xl text-[#2a2a2a] text-center">
          Trois projets, trois histoires
        </h2>
        <p className="font-body text-base text-[#2a2a2a]/70 text-center max-w-2xl mx-auto mt-4">
          Chaque crédence raconte un lieu, un moment, une intention.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {histoires.map((h) => (
            <article
              key={h.titre}
              className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
            >
              <picture>
                <source type="image/webp" srcSet={h.webp} />
                <img
                  src={h.img}
                  alt={h.titre}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover"
                />
              </picture>
              <div className="p-6 flex flex-col">
                <h3 className="font-display text-xl text-[#2a2a2a]">{h.titre}</h3>
                <p className="font-display italic text-lg text-[#2a2a2a] mt-3">
                  « {h.histoire} »
                </p>
                <p className="font-body text-sm text-[#2a2a2a]/70 mt-3">{h.meta}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.ceramique-murale.com/realisation-carreau-ceramique-artisanal-art-nouveau/"
            target="_blank"
            rel="noopener"
            onClick={() => trackEvent("histoires_voir_plus_click")}
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
