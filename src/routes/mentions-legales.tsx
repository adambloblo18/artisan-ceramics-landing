import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales · Atelier Le Vésinet" },
      { name: "description", content: "Mentions légales de l'Atelier Le Vésinet, Laurence Brecher, céramiste." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MentionsLegales,
});

function MentionsLegales() {
  useEffect(() => {
    trackEvent("legal_page_view", { page: "mentions" });
  }, []);

  return (
    <main className="bg-[#fcfcfc]">
      <article className="max-w-3xl mx-auto px-6 py-20 text-[#2a2a2a]/80 font-body leading-relaxed">
        <h1 className="font-display text-4xl text-[#2a2a2a]">Mentions légales</h1>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Éditeur du site</h2>
        <p className="mt-3">
          Nom : Laurence Brecher<br />
          {/* TODO: à confirmer par Adam (auto-entrepreneur, EI ou EURL) */}
          Statut : <strong>[À compléter]</strong> (auto-entrepreneur / EI / EURL)<br />
          Adresse : <strong>[À compléter]</strong><br />
          SIRET : <strong>[À compléter]</strong><br />
          Email : <a href="mailto:laurence@ceramique-murale.com" className="underline">laurence@ceramique-murale.com</a><br />
          Téléphone : <a href="tel:+33670025133" className="underline">06 70 02 51 33</a>
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Directeur de publication</h2>
        <p className="mt-3">Laurence Brecher</p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Hébergeur</h2>
        <p className="mt-3">
          Cloudflare Inc.<br />
          101 Townsend St, San Francisco, CA 94107, USA
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Crédits photos</h2>
        <p className="mt-3">Atelier Le Vésinet, tous droits réservés.</p>

        <p className="mt-12">
          <Link to="/" className="underline hover:text-[#b8860b]">← Retour à l'accueil</Link>
        </p>
      </article>
    </main>
  );
}
