import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente · Atelier Le Vésinet" },
      { name: "description", content: "Conditions générales de vente de l'Atelier Le Vésinet, crédences céramiques sur mesure." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CGV,
});

function CGV() {
  useEffect(() => {
    trackEvent("legal_page_view", { page: "cgv" });
  }, []);

  return (
    <main className="bg-[#f9f7f2]">
      <article className="max-w-3xl mx-auto px-6 py-20 text-[#2a2a2a]/80 font-body leading-relaxed">
        <h1 className="font-display text-4xl text-[#2a2a2a]">Conditions générales de vente</h1>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Objet</h2>
        <p className="mt-3">
          Vente de crédences en céramique sur mesure, peintes à la main dans l'atelier du Vésinet par Laurence Brecher.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Commande et acompte</h2>
        <p className="mt-3">
          Un acompte de 40% est demandé à la signature du devis pour engager la production. Le solde est dû à la livraison, avant la pose.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Délais</h2>
        <p className="mt-3">
          Comptez 6 à 10 semaines de création artisanale, selon la taille et la complexité du projet.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Livraison</h2>
        <p className="mt-3">
          Les carreaux sont livrés numérotés avec une fiche technique de pose, ou en pose clé en main en Île-de-France sur demande.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Garantie</h2>
        <p className="mt-3">
          Conformité au devis signé. Les légères variations de couleur, reliefs d'émail et bordures non rectilignes sont inhérents au fait main et ne constituent pas un défaut.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Rétractation</h2>
        <p className="mt-3">
          S'agissant d'un produit personnalisé, le droit de rétractation ne s'applique pas, conformément à l'article L221-28 du Code de la consommation.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Litiges</h2>
        <p className="mt-3">
          Les parties s'efforceront de résoudre tout litige à l'amiable. À défaut, le tribunal de Versailles sera seul compétent.
        </p>

        <p className="mt-12">
          <Link to="/" className="underline hover:text-[#b8860b]">← Retour à l'accueil</Link>
        </p>
      </article>
    </main>
  );
}
