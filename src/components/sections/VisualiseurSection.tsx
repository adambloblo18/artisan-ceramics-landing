import { Sparkles, Upload, Palette, Calculator, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const bullets = [
  { Icon: Upload, label: "Upload votre photo en 1 clic" },
  { Icon: Palette, label: "200+ motifs disponibles" },
  { Icon: Calculator, label: "Estimation budget instantanée" },
];

export default function VisualiseurSection() {
  return (
    <section className="bg-[#2a2a2a] py-20 md:py-24 text-[#fcfcfc]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#b8860b]/40 bg-[#b8860b]/10 px-4 py-2 text-xs md:text-sm font-medium text-[#d4a02a]">
          <Sparkles className="h-4 w-4" aria-hidden />
          Outil exclusif
        </div>

        <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-[#fcfcfc] mt-6 leading-tight">
          Visualisez votre crédence<br />avant même de la commander
        </h2>

        <p className="font-['DM_Sans'] text-base md:text-lg text-[#fcfcfc]/85 max-w-2xl mx-auto mt-6">
          Uploadez la photo de votre cuisine ou salle de bain. Choisissez un motif. Ajustez la taille. Voyez le rendu en quelques secondes. C'est gratuit et sans inscription.
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          {bullets.map(({ Icon, label }) => (
            <li key={label} className="flex flex-col items-center text-center">
              <Icon className="h-8 w-8 text-[#8a9d83]" aria-hidden />
              <span className="font-['DM_Sans'] text-base mt-3 text-[#fcfcfc]">{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <a
            href="https://ceramique-murale.com/visualiseur-ceramique/"
            target="_blank"
            rel="noopener"
            onClick={() => trackEvent("visualiseur_banner_click")}
            className="inline-flex items-center justify-center bg-[#b8860b] text-[#2a2a2a] font-semibold px-8 py-4 rounded-md hover:bg-[#a87708] transition-colors"
          >
            Essayer le visualiseur
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden />
          </a>
          <p className="text-sm text-[#fcfcfc]/60 mt-3">Sans inscription. Sans engagement.</p>
        </div>
      </div>
    </section>
  );
}
