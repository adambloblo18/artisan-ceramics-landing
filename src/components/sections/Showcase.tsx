import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function Showcase() {
  const onCta = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent("showcase_voir_detail_click");
    const el = document.getElementById("galerie");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-lightbox", { detail: { index: 1 } }));
    }
  };

  return (
    <section className="relative w-full">
      <div className="relative">
        <picture>
          <source type="image/webp" srcSet="/images/galerie-2-dessin-floral.webp" />
          <img
            src="/images/galerie-2-dessin-floral.jpg"
            alt="Crédence céramique dessin floral peint à la main au Vésinet"
            loading="lazy"
            decoding="async"
            width={1920}
            height={1280}
            className="w-full h-[70vh] md:h-[85vh] object-cover"
          />
        </picture>
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#2a2a2a]/60 via-transparent to-transparent" aria-hidden />
        <div className="hidden md:flex absolute inset-y-0 left-0 flex-col justify-center px-6 md:px-16 max-w-2xl">
          <ShowcaseContent onCta={onCta} />
        </div>
      </div>
      <div className="md:hidden bg-[#2a2a2a] px-6 py-10">
        <ShowcaseContent onCta={onCta} />
      </div>
    </section>
  );
}

function ShowcaseContent({ onCta }: { onCta: (e: React.MouseEvent) => void }) {
  return (
    <>
      <span className="inline-flex w-fit items-center px-3 py-1 rounded-full border border-[#b8860b]/50 text-[#d4a02a] text-xs uppercase tracking-wider font-['DM_Sans']">
        Œuvre récente
      </span>
      <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl text-[#fcfcfc] mt-4 leading-tight">
        Chaque trait,<br />par la même main.
      </h2>
      <p className="font-['DM_Sans'] text-base md:text-lg text-[#fcfcfc]/90 mt-4 leading-relaxed">
        Laurence dessine sur la terre crue, puis peint chaque pétale à la pince. Aucune impression numérique, aucun pochoir industriel. Le geste, mille fois répété, jusqu'à la cuisson finale.
      </p>
      <a
        href="#galerie"
        onClick={onCta}
        className="mt-6 inline-flex items-center justify-center w-fit px-6 py-3 rounded-md border border-[#fcfcfc] text-[#fcfcfc] font-semibold hover:bg-[#fcfcfc] hover:text-[#2a2a2a] transition-colors"
      >
        Voir le détail
        <ArrowRight className="h-4 w-4 ml-2" aria-hidden />
      </a>
    </>
  );
}
