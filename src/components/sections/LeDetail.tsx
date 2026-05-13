import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// TODO Laurence : remplacer ces 3 photos par de vraies macros (texture, émail, geste).
const details = [
  {
    src: "/images/cuisine-credence-fleurs.png",
    alt: "Détail de l'émail vert d'une crédence céramique",
    phrase: "La transparence de l'émail vert, cuit à 1020°C.",
  },
  {
    src: "/images/galerie-3-frise-pivoines.jpg",
    alt: "Détail d'une frise pivoines bleues peinte à la pince",
    phrase: "Chaque pétale de pivoine, peint à la pince fine.",
  },
  {
    src: "/images/frise-vaucresson.jpg",
    alt: "Détail des courbes Art Nouveau d'une frise céramique",
    phrase: "Les courbes Art Nouveau, tracées d'une main sûre.",
  },
];

export default function LeDetail() {
  const onCta = () => {
    trackEvent("le_detail_galerie_click");
  };

  return (
    <section className="bg-[#f9f7f2] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center font-['Cormorant_Garamond'] text-3xl md:text-5xl text-[#2a2a2a]">
          Le détail qui change tout
        </h2>
        <p className="font-['DM_Sans'] text-base text-[#2a2a2a]/70 text-center max-w-2xl mx-auto mt-4">
          Ces irrégularités, ces variations d'émail, ces bordures jamais parfaitement rectilignes : c'est la signature de la main. Aucun carreau industriel ne peut imiter cela.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {details.map((d) => (
            <figure key={d.src} className="flex flex-col">
              <img
                src={d.src}
                alt={d.alt}
                loading="lazy"
                decoding="async"
                width={800}
                height={800}
                className="aspect-square w-full object-cover rounded-md shadow-md shadow-[#2a2a2a]/10"
                style={{ objectPosition: "center" }}
              />
              <figcaption className="font-['Cormorant_Garamond'] italic text-lg md:text-xl text-[#2a2a2a] mt-4 text-center">
                {d.phrase}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.ceramique-murale.com/realisation-carreau-ceramique-artisanal-art-nouveau/"
            target="_blank"
            rel="noopener"
            onClick={onCta}
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
