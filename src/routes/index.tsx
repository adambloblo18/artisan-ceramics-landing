import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PhoneModal from "@/components/PhoneModal";
import ConsentBanner from "@/components/ConsentBanner";
import StickyMobileBar from "@/components/StickyMobileBar";
import MultiStepForm from "@/components/MultiStepForm";
import Faq from "@/components/Faq";

export const Route = createFileRoute("/")({ component: Index });

const HERO_IMG = "/images/hero.jpg";
const PRIX_BG = "/images/prix.jpg";
const LAURENCE_IMG = "/images/laurence.jpeg";

const projets = [
  { src: "/images/gal1.jpg", alt: "Motifs floraux sur tons verts, crédence cuisine", caption: "Motifs floraux sur tons verts · Île-de-France" },
  { src: "/images/gal2.jpg", alt: "Crédence céramique dessin floral peint à la main", caption: "Composition florale unique · Maison de famille" },
  { src: "/images/gal3.jpg", alt: "Crédence autour d'un lavabo, frise pivoines bleues", caption: "Frise pivoines bleues · Salle de bain" },
  { src: "/images/gal4.jpg", alt: "Frise large céramique émaillée Art Nouveau", caption: "Frise Art Nouveau · Atelier d'artiste" },
];

const reass = [
  { icon: "🏆", label: "Prix du Ravalement 2025" },
  { icon: "✋", label: "Peinte à la main" },
  { icon: "🏛️", label: "30 ans d'expérience" },
  { icon: "📍", label: "Atelier Le Vésinet (78)" },
  { icon: "🚚", label: "Livraison France entière" },
];

const process = [
  { n: 1, t: "Premier échange", d: "Vous nous décrivez votre projet. Réponse en 20 minutes pendant les heures ouvrées." },
  { n: 2, t: "Visite et mesures", d: "Laurence se déplace à votre domicile en Île-de-France, ou vous nous envoyez photos et cotes." },
  { n: 3, t: "Maquettes", d: "Nous vous proposons deux ou trois maquettes peintes à l'aquarelle, ajustables jusqu'à votre satisfaction." },
  { n: 4, t: "Fabrication", d: "Vos carreaux sont peints, émaillés et cuits à grand feu dans l'atelier. Comptez 6 à 10 semaines." },
  { n: 5, t: "Livraison ou pose", d: "Carreaux livrés numérotés avec fiche technique, ou pose clé en main en Île-de-France." },
];

function Index() {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  const onPhoneDesktop = (e: React.MouseEvent) => {
    if (!isMobile) { e.preventDefault(); setPhoneOpen(true); }
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
      <section className="relative h-[100vh] md:h-[85vh] w-full overflow-hidden">
        <img
          src={HERO_IMG} alt="Crédence en céramique peinte à la main, atelier Le Vésinet"
          loading="eager" fetchPriority="high" decoding="async"
          width={2560} height={1707}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-6 pb-16 sm:pb-24">
          <p className="eyebrow text-[var(--gold)]">Atelier d'art au Vésinet · Prix du Ravalement Versailles 2025</p>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] leading-[1.05] text-white sm:text-6xl">
            Crédences en céramique, peintes à la main.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] text-white/90 sm:text-[20px]">
            Faïence émaillée Art Nouveau, créée sur mesure dans notre atelier du Vésinet. Sur rendez-vous, livraison France entière.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#formulaire" className="btn-primary">Recevoir mon étude personnalisée</a>
            <a href="tel:+33670025133" onClick={onPhoneDesktop} className="btn-secondary-light">
              📞 Appeler Laurence
            </a>
          </div>
          <p className="mt-4 text-sm italic text-white/80">Réponse en 20 minutes pendant les heures ouvrées.</p>
        </div>
      </section>

      {/* RÉASSURANCE */}
      <section className="bg-[var(--cream)] py-8">
        <div className="mx-auto max-w-6xl px-4">
          <ul className="flex snap-x gap-6 overflow-x-auto md:grid md:grid-cols-5 md:gap-0 md:overflow-visible md:divide-x md:divide-[var(--border)]">
            {reass.map((r) => (
              <li key={r.label} className="flex min-w-[220px] snap-start flex-col items-center gap-2 px-4 text-center md:min-w-0">
                <span className="text-2xl text-[var(--gold)]" aria-hidden>{r.icon}</span>
                <span className="text-sm font-medium text-[var(--anthracite)]">{r.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROBLÈME / PROMESSE */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-3xl italic sm:text-[44px] leading-tight">
            Une cuisine qui vous ressemble vraiment.
          </h2>
          <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-[var(--anthracite)]">
            <p>Le carrelage industriel se choisit dans un catalogue. Une céramique murale Brecher se rêve d'abord, puis se peint, carreau après carreau, dans notre atelier du Vésinet.</p>
            <p>Chaque crédence raconte votre histoire : vos couleurs, votre architecture, votre rapport à la matière. Roses, coquelicots, iris ou motifs géométriques Art Nouveau, nous composons avec vous une pièce unique, qui traversera les générations.</p>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section className="bg-[var(--cream)] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl italic sm:text-[44px]">Quelques crédences réalisées.</h2>
          <div className="mt-12 grid grid-cols-1 gap-6 min-[380px]:grid-cols-2">
            {projets.map((p, i) => (
              <figure key={i} className="overflow-hidden bg-white">
                <div className="overflow-hidden">
                  <img
                    src={p.src} alt={p.alt}
                    width={1024} height={768}
                    loading={i === 0 ? "eager" : "lazy"} decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[400ms] ease-out hover:scale-[1.05]"
                  />
                </div>
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
      <section
        className="relative h-[400px] md:h-[500px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${PRIX_BG})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center text-white">
          <p className="eyebrow text-[var(--gold)]">Reconnaissance officielle</p>
          <h2 className="mt-3 font-display text-3xl sm:text-[44px] leading-tight">
            Premier Prix du Ravalement de la Ville de Versailles 2025
          </h2>
          <p className="mt-4 text-base text-white/90 sm:text-lg">
            Catégorie Restitution de Décors, pour une façade florale qui a rendu à une maison son caractère d'origine.
          </p>
          <a
            href="https://www.ceramique-murale.com/frise-ceramique-versailles-prix-ravalement/"
            target="_blank" rel="noopener"
            className="mt-6 text-sm text-white underline underline-offset-4"
          >
            Découvrir la réalisation primée →
          </a>
        </div>
      </section>

      {/* L'ARTISTE */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
          <img
            src={LAURENCE_IMG}
            alt="Portrait de Laurence Brecher dans son atelier"
            width={600} height={900} loading="lazy" decoding="async"
            className="h-auto w-full object-cover"
          />
          <div>
            <h2 className="font-display text-3xl italic sm:text-[44px]">Laurence Brecher, céramiste.</h2>
            <p className="mt-6 text-[17px] leading-[1.7] text-[var(--anthracite)]">
              Formée aux Beaux-Arts puis à l'Académie de Port-Royal, Laurence Brecher fait vivre depuis trente ans l'héritage de Guimard, de Gallé et de l'École de Nancy dans son atelier du Vésinet. Ses créations habillent des façades primées, des restaurants parisiens, des hôtels particuliers et des maisons 1900 dans toute la France.
            </p>
            <p className="mt-4 text-[17px] leading-[1.7] text-[var(--anthracite)]">
              Elle reçoit sur rendez-vous, du lundi au samedi, dans son atelier du 14 rue Ernest André, à 20 minutes de Paris en RER A, station Le Vésinet Centre.
            </p>
            <a href="#formulaire" className="btn-secondary mt-8">Visiter l'atelier</a>
          </div>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section id="formulaire" className="bg-[var(--cream)] py-20 sm:py-28">
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
          </p>
        </div>
      </footer>

      <StickyMobileBar onPhoneClick={() => setPhoneOpen(true)} />
      <PhoneModal open={phoneOpen} onClose={() => setPhoneOpen(false)} />
      <ConsentBanner />
    </div>
  );
}
