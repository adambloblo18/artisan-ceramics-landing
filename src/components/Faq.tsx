import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

const items = [
  {
    id: "Q1",
    q: "Combien coûte une crédence en céramique sur mesure ?",
    a: "Les projets démarrent à partir de 1 500 € pour une petite réalisation. Pour une crédence sur mesure de 2 à 4 m², comptez entre 4 000 et 8 000 €. Au-delà, le budget dépend de la complexité du projet. Nous établissons une étude personnalisée après un premier échange.",
  },
  {
    id: "Q2",
    q: "En combien de temps livrez-vous ?",
    a: "Comptez 6 à 10 semaines de création artisanale. Laurence prépare les terres, peint chaque carreau à la pince, le cuit deux fois au grand feu, et personnalise selon votre projet. Pour les projets urgents, nous pouvons accélérer.",
  },
  {
    id: "Q3",
    q: "À quoi servent les petites irrégularités visibles sur les carreaux ?",
    a: "La céramique peinte à la main porte la trace du geste : légères variations de couleur, reliefs d'émail, bordures jamais parfaitement rectilignes. Elles sont la signature de la main.",
  },
  {
    id: "Q4",
    q: "Travaillez-vous avec des architectes et des décorateurs ?",
    a: "Absolument. Nous accompagnons les architectes et décorateurs sur les projets résidentiels et hospitality avec : échantillons techniques sous 5 jours, BDD motifs et coloris pour vos planches matériaux, tarification dégressive sur volumes 5m² et plus, et un référent unique chez nous pour vos projets clients. Contactez-nous directement à laurence@ceramique-murale.com avec mention 'Prescripteur' en objet.",
  },
  {
    id: "Q5",
    q: "Peut-on visiter l'atelier ?",
    a: "Oui, Laurence reçoit sur rendez-vous dans son atelier du Vésinet. C'est l'occasion de toucher la matière, voir les émaux, comprendre le geste. Nous sommes à 20 minutes de Paris en RER A, station Le Vésinet Centre.",
  },
  {
    id: "Q6",
    q: "Quel acompte demandez-vous ?",
    a: "Un acompte de 40% à la signature du devis, le solde à la livraison avant la pose. Tous nos devis sont établis TTC et sans frais cachés.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[var(--border)] border-y border-[var(--border)]">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.id}>
            <button
              type="button"
              onClick={() => {
                const next = isOpen ? null : i;
                setOpen(next);
                if (next !== null) trackEvent("faq_question_open", { question_id: it.id });
              }}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-4 py-5 text-left"
            >
              <span className="h-display text-lg sm:text-xl">{it.q}</span>
              <span className="text-2xl text-[var(--gold-text-light)] leading-none" aria-hidden>
                {isOpen ? "×" : "+"}
              </span>
            </button>
            {isOpen && <p className="pb-6 text-[var(--muted-text)] leading-relaxed">{it.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
