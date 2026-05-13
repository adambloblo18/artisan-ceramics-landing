import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const projets = [
  {
    img: "/images/galerie-1-cuisine-verte.jpg",
    webp: "/images/galerie-1-cuisine-verte.webp",
    pill: "Cuisine",
    titre: "Une crédence verte pour une famille en Île-de-France",
    recit:
      "Un couple voulait une cuisine vivante, qui sortait du blanc et du gris. Laurence a dessiné une composition florale sur tons verts, peinte à la pince sur 2,8 m². 8 semaines de travail, 6 cuissons, livraison sans casse.",
    meta: "Île-de-France · 2025",
  },
  {
    img: "/images/galerie-3-frise-pivoines.jpg",
    webp: "/images/galerie-3-frise-pivoines.webp",
    pill: "Salle de bain",
    titre: "Une frise pivoines pour une salle de bain de caractère",
    recit:
      "Une frise large de pivoines bleues autour du lavabo, dans une salle de bain à la décoration affirmée. Le défi : un motif qui dialogue avec la robinetterie ancienne sans saturer l'espace. 5 maquettes aquarelle avant la version finale.",
    meta: "Île-de-France · 2024",
  },
  {
    img: "/images/galerie-4-frise-art-nouveau.jpeg",
    webp: "/images/galerie-4-frise-art-nouveau.webp",
    pill: "Atelier",
    titre: "Une frise Art Nouveau pour un atelier d'artiste",
    recit:
      "Un peintre voulait honorer ses inspirations Art Nouveau dans son propre atelier. Laurence a créé une frise large émaillée, jouant sur les motifs végétaux stylisés caractéristiques du mouvement. Une pièce unique, sortie de l'atelier au Vésinet en 2024.",
    meta: "Île-de-France · 2024",
  },
];

export default function Temoignages() {
  return (
    <section className="bg-[#fcfcfc] py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-5xl text-[#2a2a2a] text-center">
          Trois projets, trois histoires
        </h2>
        <p className="font-body text-base text-[#2a2a2a]/70 text-center max-w-2xl mx-auto mt-4">
          Chaque crédence raconte une rencontre entre un lieu, une intention et la main de Laurence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {projets.map((p) => (
            <article
              key={p.titre}
              className="bg-white rounded-md shadow-md overflow-hidden flex flex-col"
            >
              <picture>
                <source type="image/webp" srcSet={p.webp} />
                <img
                  src={p.img}
                  alt={p.titre}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              </picture>
              <div className="p-6 flex flex-col">
                <span className="self-start inline-flex items-center rounded-full border border-[#b8860b]/40 bg-[#b8860b]/10 px-3 py-1 text-xs font-medium text-[#a07308]">
                  {p.pill}
                </span>
                <h3 className="font-display text-xl text-[#2a2a2a] mt-3">{p.titre}</h3>
                <p className="font-body text-sm text-[#2a2a2a]/80 mt-2 leading-relaxed">
                  {p.recit}
                </p>
                <p className="font-body text-xs text-[#2a2a2a]/60 mt-4">{p.meta}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://ceramique-murale.com/realisations/"
            target="_blank"
            rel="noopener"
            onClick={() => trackEvent("temoignages_voir_tout_click")}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-[#b8860b] text-[#a07308] font-semibold hover:bg-[#b8860b] hover:text-[#fcfcfc] transition-colors"
          >
            Voir toutes les réalisations
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
