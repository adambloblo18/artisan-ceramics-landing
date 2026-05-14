import { ArrowRight, Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: "light" | "dark";
  source?: string;
}

export default function InlineCta({
  eyebrow = "Votre projet",
  title,
  subtitle = "Réponse en 20 minutes pendant les heures ouvrées. Étude gratuite, sans engagement.",
  variant = "light",
  source = "inline_cta",
}: Props) {
  const isDark = variant === "dark";
  const onForm = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent("inline_cta_form_click", { source });
    document.getElementById("formulaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onPhone = () => trackEvent("inline_cta_phone_click", { source });

  return (
    <section
      className={`${isDark ? "bg-[#2a2a2a] text-[#f9f7f2]" : "bg-[#f9f7f2] text-[#2a2a2a]"} py-14 md:py-20 reveal-on-scroll`}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className={`h-px w-10 ${isDark ? "bg-[#d4a02a]/50" : "bg-[#b8860b]/40"}`} />
          <span className={`font-['DM_Sans'] text-[10px] tracking-[0.4em] uppercase font-medium ${isDark ? "text-[#d4a02a]" : "text-[#b8860b]"}`}>
            {eyebrow}
          </span>
          <div className={`h-px w-10 ${isDark ? "bg-[#d4a02a]/50" : "bg-[#b8860b]/40"}`} />
        </div>
        <h2 className={`font-['Cormorant_Garamond'] font-light text-2xl md:text-4xl leading-tight ${isDark ? "text-[#f9f7f2]" : "text-[#2a2a2a]"}`}>
          {title}
        </h2>
        <p className={`font-['DM_Sans'] text-sm md:text-base mt-4 max-w-2xl mx-auto ${isDark ? "text-[#f9f7f2]/75" : "text-[#2a2a2a]/70"}`}>
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <a
            href="#formulaire"
            onClick={onForm}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#b8860b] px-7 py-3.5 font-semibold text-[#f9f7f2] hover:bg-[#a87708] transition-colors"
          >
            Recevoir le prix de mon projet
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="tel:+33670025133"
            onClick={onPhone}
            className={`inline-flex items-center justify-center gap-2 rounded-md border px-7 py-3.5 font-semibold transition-colors ${
              isDark
                ? "border-[#f9f7f2]/40 text-[#f9f7f2] hover:bg-[#f9f7f2]/10"
                : "border-[#2a2a2a]/30 text-[#2a2a2a] hover:bg-[#2a2a2a]/5"
            }`}
          >
            <Phone className="h-4 w-4" aria-hidden />
            Appeler Laurence · 06 70 02 51 33
          </a>
        </div>
      </div>
    </section>
  );
}
