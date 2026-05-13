import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/politique-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité · Atelier Le Vésinet" },
      { name: "description", content: "Politique de confidentialité et gestion des données personnelles de l'Atelier Le Vésinet." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  useEffect(() => {
    trackEvent("legal_page_view", { page: "privacy" });
  }, []);

  return (
    <main className="bg-[#fcfcfc]">
      <article className="max-w-3xl mx-auto px-6 py-20 text-[#2a2a2a]/80 font-body leading-relaxed">
        <h1 className="font-display text-4xl text-[#2a2a2a]">Politique de confidentialité</h1>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Données collectées</h2>
        <p className="mt-3">
          <strong>Via le formulaire de contact :</strong> nom, téléphone, description du projet.<br />
          <strong>Via les cookies analytics :</strong> adresse IP anonymisée, navigateur, pages visitées, événements d'interaction.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Finalité</h2>
        <p className="mt-3">Prise de contact commercial uniquement. Aucune cession à des tiers à des fins marketing.</p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Conservation</h2>
        <p className="mt-3">Vos données sont conservées 3 ans après le dernier contact, puis supprimées.</p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Vos droits</h2>
        <p className="mt-3">
          Conformément au RGPD, vous disposez des droits d'accès, de rectification, de suppression, d'opposition et de portabilité de vos données.<br />
          Pour les exercer : <a href="mailto:laurence@ceramique-murale.com" className="underline">laurence@ceramique-murale.com</a>
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Cookies</h2>
        <p className="mt-3">
          Nous utilisons les cookies suivants :
        </p>
        <ul className="mt-3 list-disc pl-6 space-y-1">
          <li>PostHog (analytics produit)</li>
          <li>Google Analytics (audience)</li>
          <li>Microsoft Clarity (UX, heatmaps)</li>
          <li>Bing UET (publicité)</li>
          <li>Google Ads (suivi de conversion)</li>
        </ul>
        <p className="mt-3">
          Vous pouvez accepter ou refuser ces cookies via le bandeau de consentement affiché à votre première visite, et modifier vos choix à tout moment depuis le pied de page.
        </p>

        <h2 className="font-display text-2xl mt-10 text-[#2a2a2a]">Réclamation</h2>
        <p className="mt-3">
          En cas de litige, vous pouvez saisir la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener" className="underline">cnil.fr</a>.
        </p>

        <p className="mt-12">
          <Link to="/" className="underline hover:text-[#b8860b]">← Retour à l'accueil</Link>
        </p>
      </article>
    </main>
  );
}
