import { useState } from "react";

const items = [
  {
    q: "Combien coûte une crédence en céramique sur mesure ?",
    a: "Les projets démarrent à partir de 1 000 € pour une petite réalisation. Pour une crédence sur mesure de 2 à 4 m², comptez entre 2 500 et 5 000 €. Au-delà, le budget dépend de la complexité du projet. Nous établissons une étude personnalisée gratuite après un premier échange.",
  },
  {
    q: "En combien de temps livrez-vous ?",
    a: "Comptez entre 6 et 10 semaines en moyenne, selon la taille et la complexité. Pour les projets urgents, nous pouvons accélérer : nous avons restauré 30 carreaux Art Nouveau à Maisons-Lafitte en moins de deux mois.",
  },
  {
    q: "À quoi servent les petites irrégularités visibles sur les carreaux ?",
    a: "La céramique peinte à la main porte la trace du geste : légères variations de couleur, reliefs d'émail, bordures jamais parfaitement rectilignes. Ces imperfections distinguent une œuvre artisanale d'un carreau industriel. Elles sont la signature de la main.",
  },
  {
    q: "Travaillez-vous avec des architectes et des décorateurs ?",
    a: "Bien sûr. De nombreux projets nous arrivent par des architectes et décorateurs qui apprécient la possibilité de créer du sur mesure pour leurs clients. Nous proposons des conditions adaptées et un accompagnement technique pour la pose.",
  },
  {
    q: "Peut-on visiter l'atelier ?",
    a: "Absolument. Laurence reçoit sur rendez-vous, du lundi au samedi, dans son atelier du Vésinet. C'est l'occasion de toucher la matière, voir les émaux, comprendre le geste. Nous sommes à 20 minutes de Paris en RER A, station Le Vésinet Centre.",
  },
  {
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
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-4 py-5 text-left"
            >
              <span className="h-display text-lg sm:text-xl">{it.q}</span>
              <span className="text-2xl text-[var(--gold)] leading-none" aria-hidden>
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
