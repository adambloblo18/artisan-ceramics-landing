import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import PhoneModal from "@/components/PhoneModal";
import ConsentBanner from "@/components/ConsentBanner";
import StickyMobileBar from "@/components/StickyMobileBar";
import MultiStepForm from "@/components/MultiStepForm";
import Faq from "@/components/Faq";
import VisualiseurSection from "@/components/sections/VisualiseurSection";
import { trackEvent } from "@/lib/analytics";
import { Trophy, ArrowRight, Phone, Hand, Landmark, MapPin, Truck } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const TrophyIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const HERO_IMG = "/images/cuisine-verte.jpg";
const PRIX_BG = "/images/prix.jpg";
const LAURENCE_IMG = "/images/portrait-laurence.jpg";

const projets = [
  { src: "/images/galerie-1-cuisine-verte.jpg", alt: "Motifs floraux sur tons verts, crédence cuisine", caption: "Motifs floraux sur tons verts · Île-de-France" },
  { src: "/images/galerie-2-dessin-floral.jpg", alt: "Crédence céramique dessin floral peint à la main", caption: "Composition florale unique · Maison de famille" },
  { src: "/images/galerie-3-frise-pivoines.jpg", alt: "Crédence autour d'un lavabo, frise pivoines bleues", caption: "Frise pivoines bleues · Salle de bain" },
  { src: "/images/galerie-4-frise-art-nouveau.jpeg", alt: "Frise large céramique émaillée Art Nouveau", caption: "Frise Art Nouveau · Atelier d'artiste" },
];

const reassPillars = [
  { Icon: Trophy, title: "1er Prix Versailles 2025", subtitle: "Ravalement décor céramique" },
  { Icon: Hand, title: "100% peinte à la main", subtitle: "À la pince, au pinceau" },
  { Icon: Landmark, title: "30 ans d'atelier", subtitle: "Au Vésinet, Île-de-France" },
  { Icon: MapPin, title: "Visite sur RDV", subtitle: "Atelier Le Vésinet (78)" },
  { Icon: Truck, title: "France et international", subtitle: "Livraison sécurisée" },
];


const process = [
  { n: 1, t: "Premier échange", d: "Vous nous décrivez votre projet. Réponse en 20 minutes pendant les heures ouvrées." },
  { n: 2, t: "Visite et mesures", d: "Laurence se déplace à votre domicile en Île-de-France, ou vous nous envoyez photos et cotes." },
  { n: 3, t: "Maquettes", d: "Nous vous proposons deux ou trois maquettes peintes à l'aquarelle, ajustables jusqu'à votre satisfaction." },
  { n: 4, t: "Le temps de la main", d: "Vos carreaux sont peints, émaillés et cuits à grand feu dans l'atelier. Comptez 6 à 10 semaines de création : c'est ce qui distingue notre travail d'un carreau industriel." },
  { n: 5, t: "Livraison ou pose", d: "Carreaux livrés numérotés avec fiche technique, ou pose clé en main en Île-de-France." },
];

function Index() {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightbox = lightboxIndex !== null ? projets[lightboxIndex] : null;
  const closeLightbox = () => setLightboxIndex(null);
  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    trackEvent("gallery_image_open", { src: projets[i].src, caption: projets[i].caption });
  };
  const nextLightbox = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % projets.length));
  const prevLightbox = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + projets.length) % projets.length));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextLightbox();
      else if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);
  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  const onPhoneDesktop = (e: React.MouseEvent) => {
    if (!isMobile) { e.preventDefault(); setPhoneOpen(true); }
  };



  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onPrimaryCta = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent("hero_cta_primary_click");
    scrollToId("formulaire");
  };

  const onPhoneCta = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent("hero_cta_phone_click");
    if (isMobile) {
      window.location.href = "tel:+33670025133";
    } else {
      setPhoneOpen(true);
    }
  };

  return (
    <div id="main" className="min-h-screen bg-[var(--cream)]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 h-14 md:h-16 border-b border-[var(--border)] bg-[#fcfcfc]/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#main" className="h-display text-[15px] sm:text-xl leading-tight text-[var(--anthracite)]">
            Les Céramiques Murales du Vésinet
          </a>
          <a
            href="tel:+33670025133"
            onClick={onPhoneDesktop}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--anthracite)] transition-colors"
            aria-label="Appeler Laurence"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
            </svg>
            <span className="hidden sm:inline">06 70 02 51 33</span>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[95vh] md:min-h-[100vh] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-credence.jpg"
          width="1920"
          height="1080"
          aria-label="Crédence en céramique peinte à la main, atelier Le Vésinet"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/header.webm" type="video/webm" />
          <source src="/video/header.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a]/85 via-[#2a2a2a]/40 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[95vh] md:min-h-[100vh] max-w-5xl flex-col justify-end items-center pb-20 md:pb-32 px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#b8860b]/40 bg-[#b8860b]/10 px-4 py-2 text-xs md:text-sm font-medium text-[#b8860b] mb-6">
            <Trophy className="h-4 w-4" aria-hidden />
            1er Prix du Ravalement Versailles 2025
          </span>

          <h1 className={`font-["Cormorant_Garamond"] text-4xl md:text-6xl lg:text-7xl leading-tight text-center text-[#fcfcfc]`}>
            Votre crédence céramique,<br />peinte à la main au Vésinet.
          </h1>

          <p className="text-base md:text-lg text-[#fcfcfc]/90 mt-6 max-w-2xl text-center leading-relaxed">
            Chaque pièce est dessinée, peinte et cuite à la main pour s'adapter à votre cuisine. 30 ans d'atelier, expédition France entière.
          </p>

          <div className="flex flex-col md:flex-row gap-3 mt-8">
            <a
              href="#formulaire"
              onClick={onPrimaryCta}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#b8860b] px-8 py-4 font-semibold text-[#2a2a2a] hover:bg-[#a87708] transition-colors"
            >
              Recevoir mon étude personnalisée
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="tel:+33670025133"
              onClick={onPhoneCta}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#fcfcfc] bg-transparent px-8 py-4 font-semibold text-[#fcfcfc] hover:bg-[#fcfcfc]/10 transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden />
              06 70 02 51 33
            </a>
          </div>

          <p className="text-xs md:text-sm text-stone-300 mt-4 text-center">
            Réponse en 20 minutes pendant les heures ouvrées.
          </p>
        </div>
      </section>

      {/* RÉASSURANCE */}
      <section className="bg-[#fcfcfc]">
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 max-w-6xl mx-auto px-6 py-12 md:py-16">
          {reassPillars.map(({ Icon, title, subtitle }) => (
            <li key={title} className="flex flex-col items-center text-center">
              <Icon className="h-7 w-7 text-[#b8860b]" aria-hidden />
              <h3 className="font-['Cormorant_Garamond'] text-lg md:text-xl text-[#2a2a2a] mt-3">{title}</h3>
              <p className="font-['DM_Sans'] text-sm text-[#2a2a2a]/70 mt-1">{subtitle}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* L'ARTISTE */}
      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto px-6 py-20 md:py-24">
          <picture>
            <source type="image/webp" srcSet="/images/portrait-laurence.webp" />
            <img
              src={LAURENCE_IMG}
              alt="Laurence Brecher, céramiste, dans son atelier du Vésinet"
              loading="lazy"
              decoding="async"
              width={600}
              height={800}
              className="w-full max-h-[600px] object-cover rounded-md shadow-lg"
            />
          </picture>
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-[#2a2a2a] leading-tight">
              Laurence Brecher,<br />30 ans à la pince
            </h2>
            <p className="mt-6 text-[17px] leading-[1.7] text-[var(--anthracite)]">
              Laurence dessine, peint et cuit chaque pièce à la main dans son atelier du Vésinet. Diplômée des Beaux Arts, elle s'est spécialisée dans la céramique murale d'intérieur et de façade. Son 1er Prix du Ravalement Versailles 2025 récompense 30 ans de travail patient.
            </p>
            <p className="mt-4 text-[17px] leading-[1.7] text-[var(--anthracite)]">
              Quand vous commandez une crédence, c'est elle qui prépare la terre, peint chaque carreau à la pince, cuit deux fois à 1020°C. Aucun intermédiaire, aucune machine, juste sa main.
            </p>
            <a
              href="https://ceramique-murale.com/latelier/"
              target="_blank"
              rel="noopener"
              onClick={() => trackEvent("artiste_atelier_click")}
              className="inline-flex items-center justify-center mt-8 px-6 py-3 rounded-md border border-[#b8860b] text-[#b8860b] font-semibold hover:bg-[#b8860b] hover:text-[#fcfcfc] transition-colors"
            >
              Découvrir mon atelier
            </a>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section id="galerie" className="bg-[var(--cream)] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl italic sm:text-[44px]">Quelques crédences réalisées.</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {projets.map((p, i) => (
              <figure key={i} className="overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => openLightbox(i)}
                  className="block w-full overflow-hidden cursor-zoom-in"
                  aria-label={`Agrandir : ${p.alt}`}
                >
                  <img
                    src={p.src} alt={p.alt}
                    width={800} height={1000}
                    loading={i === 0 ? "eager" : "lazy"} decoding="async"
                    style={{ filter: "brightness(1.12) saturate(1.05)" }}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[400ms] ease-out hover:scale-[1.05]"
                  />
                </button>
                <figcaption className="p-4 text-sm italic text-[var(--muted-text)]">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl italic sm:text-[44px]">De l'esquisse à la pose, en 5 étapes.</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-5 md:gap-6">
            {process.map((s) => (
              <li key={s.n} className="relative flex flex-col items-start md:items-center md:text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-white font-display text-lg" style={{ background: "var(--gold)" }}>{s.n}</div>
                <h3 className="mt-4 h-display text-lg">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <VisualiseurSection />

      {/* PRIX */}
      <section className="bg-[var(--cream)] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl italic sm:text-[44px]">Un investissement durable.</h2>
          <p className="mt-3 text-center italic text-[var(--muted-text)]">Trois ordres de grandeur pour situer votre projet.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="border border-[var(--border)] bg-[var(--cream)] p-8">
              <h3 className="h-display text-xl">Crédence simple</h3>
              <p className="mt-2 text-sm text-[var(--muted-text)]">Jusqu'à 2 m², motifs floraux ou frise.</p>
              <p className="mt-6 font-display text-3xl text-[var(--gold)]">À partir de 1 000 €</p>
            </div>
            <div className="relative border border-[var(--border)] bg-[#f7f7f7] p-8">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-white tracking-wide uppercase">Le plus demandé</span>
              <h3 className="h-display text-xl">Crédence sur mesure</h3>
              <p className="mt-2 text-sm text-[var(--muted-text)]">2 à 4 m², composition originale.</p>
              <p className="mt-6 font-display text-3xl text-[var(--gold)]">2 500 à 5 000 €</p>
            </div>
            <div className="border border-[var(--border)] bg-[var(--cream)] p-8">
              <h3 className="h-display text-xl">Crédence d'exception</h3>
              <p className="mt-2 text-sm text-[var(--muted-text)]">Au-delà de 4 m², projet architectural complet.</p>
              <p className="mt-6 font-display text-3xl text-[var(--gold)]">Devis personnalisé</p>
            </div>
          </div>
          <p className="mt-8 text-center italic text-[var(--muted-text)]">Tarifs indicatifs. Étude personnalisée gratuite et sans engagement.</p>
        </div>
      </section>

      {/* BANDEAU PRIX */}
      <section id="award-section" className="relative w-full overflow-hidden">
        {/* TODO: remplacer bandeau-versailles.jpg par la vraie photo de la façade primée à Versailles dès que Laurence l'a */}
        <picture>
          <source type="image/webp" srcSet="/images/bandeau-versailles.webp" />
          <img
            src="/images/bandeau-versailles.jpg"
            alt="Façade primée au Ravalement Versailles 2025"
            loading="lazy"
            decoding="async"
            width={1600}
            height={900}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-[#2a2a2a]/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-24 md:py-32 text-[#fcfcfc]">
          <Trophy className="h-12 w-12 text-[#b8860b] mx-auto mb-4" aria-hidden />
          <p className="eyebrow text-[#b8860b]">Reconnaissance officielle</p>
          <h2 className="mt-3 font-display text-3xl sm:text-[44px] leading-tight">
            Premier Prix du Ravalement de la Ville de Versailles 2025
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#fcfcfc]/90">
            Catégorie Restitution de Décors, pour une façade florale qui a rendu à une maison son caractère d'origine.
          </p>
          <a
            href="https://www.ceramique-murale.com/frise-ceramique-versailles-prix-ravalement/"
            target="_blank" rel="noopener"
            onClick={() => trackEvent("award_realization_click")}
            className="mt-6 inline-block text-sm text-[#fcfcfc] underline underline-offset-4"
          >
            Découvrir la réalisation primée →
          </a>
        </div>
      </section>

      {/* (L'ARTISTE déplacé après la réassurance) */}

      {/* FORMULAIRE */}
      <section id="formulaire" className="bg-[var(--cream)] py-20 sm:py-28 pb-24 md:pb-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl italic sm:text-[44px]">Parlons de votre projet.</h2>
          <p className="mt-3 text-center text-[var(--muted-text)]">
            Décrivez-nous votre envie en quelques clics. Laurence vous rappelle personnellement en moins de 20 minutes.
          </p>
          <div className="mt-10">
            <MultiStepForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl italic sm:text-[44px]">Vos questions.</h2>
          <div className="mt-12">
            <Faq />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--anthracite)] px-4 py-12 text-white/70 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg text-white">Les Céramiques Murales du Vésinet</p>
            <p className="mt-3 text-sm">14 rue Ernest André, 78110 Le Vésinet</p>
            <p className="mt-2 text-sm">
              <a href="tel:+33670025133" className="hover:text-white">06 70 02 51 33</a>
            </p>
            <p className="mt-1 text-sm">
              <a href="https://wa.me/33670025133" target="_blank" rel="noopener" className="hover:text-white">WhatsApp</a>
            </p>
          </div>
          <div>
            <p className="font-display text-lg text-white">Découvrir</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://www.ceramique-murale.com/realisation-carreau-ceramique-artisanal-art-nouveau/" target="_blank" rel="noopener" className="hover:text-white">Réalisations</a></li>
              <li><a href="https://www.ceramique-murale.com/motifs-en-ceramique-architecturale/" target="_blank" rel="noopener" className="hover:text-white">Motifs</a></li>
              <li><a href="https://www.ceramique-murale.com/laurence-brecher-creatrice-de-ceramique-murale-decorative/" target="_blank" rel="noopener" className="hover:text-white">La créatrice</a></li>
              <li><a href="https://www.ceramique-murale.com/contact-ben-2/" target="_blank" rel="noopener" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="font-display text-lg text-white">Suivez l'atelier</p>
            <p className="mt-3 text-sm">
              <a href="https://instagram.com/ceramiquesmurales" target="_blank" rel="noopener" className="hover:text-white">Instagram</a>
            </p>
            <p className="mt-4 text-sm italic">Réponse en 20 minutes pendant les heures ouvrées.</p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-white/50">
          <p>© 2026 Les Céramiques Murales du Vésinet · Atelier du Vésinet</p>
          <p className="mt-2">
            <a href="https://www.ceramique-murale.com/politique-de-confidentialite/" target="_blank" rel="noopener" className="hover:text-white/80">
              Politique de confidentialité
            </a>
            <span className="mx-2 opacity-50">·</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("lcm:open-consent"))}
              className="underline-offset-2 hover:text-white/80 hover:underline"
            >
              Modifier mes choix cookies
            </button>
          </p>
        </div>
      </footer>

      <StickyMobileBar onPhoneClick={() => setPhoneOpen(true)} />
      <PhoneModal open={phoneOpen} onClose={() => setPhoneOpen(false)} />
      <ConsentBanner />

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label="Fermer"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
            aria-label="Précédent"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
            aria-label="Suivant"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20"
          >
            ›
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-[92vw] object-contain"
          />
          <p
            onClick={(e) => e.stopPropagation()}
            className="font-['Cormorant_Garamond'] text-xl text-white mt-4 text-center px-4"
          >
            {lightbox.caption}
          </p>
        </div>
      )}
    </div>
  );
}
