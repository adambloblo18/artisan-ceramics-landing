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
    <main className="bg-[#f9f7f2]">
      <article className="max-w-3xl mx-auto px-6 py-20 text-[#2a2a2a]/80 font-body leading-relaxed">
        <h1 className="font-display text-4xl text-[#2a2a2a]">Mentions légales</h1>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Éditeur du site</h2>
        <p className="mt-3">
          Laurence Bloch (Brecher), entrepreneur individuel<br />
          Nom commercial : « Atelier de Laurence »<br />
          SIRET : 517 776 720 00032<br />
          Adresse : 14 rue Ernest André, 78110 Le Vésinet, France<br />
          Téléphone : <a href="tel:+33670025133" className="underline">06 70 02 51 33</a><br />
          E-mail : <a href="mailto:ceramiquemurale@gmail.com" className="underline">ceramiquemurale@gmail.com</a><br />
          TVA non applicable, article 293 B du CGI.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Directrice de la publication</h2>
        <p className="mt-3">Laurence Brecher</p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Hébergeur</h2>
        <p className="mt-3">
          Lovable Labs Sweden AB<br />
          Regeringsgatan 25, 111 53 Stockholm, Suède
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
