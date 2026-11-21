export const HOME_TITLE = "Crédence céramique sur mesure peinte à la main · Le Vésinet";

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien coûte une crédence en céramique sur mesure ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les projets démarrent à partir de 1 000 € pour une petite réalisation. Pour une crédence sur mesure de 2 à 4 m², comptez entre 2 500 et 5 000 €. Au-delà, le budget dépend de la complexité du projet. Nous établissons une étude personnalisée après un premier échange.",
      },
    },
    {
      "@type": "Question",
      name: "En combien de temps livrez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comptez 6 à 10 semaines de création artisanale. Laurence prépare les terres, peint chaque carreau à la pince, le cuit deux fois au grand feu, et personnalise selon votre projet.",
      },
    },
    {
      "@type": "Question",
      name: "À quoi servent les petites irrégularités visibles sur les carreaux ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La céramique peinte à la main porte la trace du geste : légères variations de couleur, reliefs d'émail, bordures jamais parfaitement rectilignes. Elles sont la signature de la main.",
      },
    },
    {
      "@type": "Question",
      name: "Travaillez-vous avec des architectes et des décorateurs ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolument. Nous accompagnons les architectes et décorateurs sur les projets résidentiels et hospitality avec échantillons techniques, BDD motifs et coloris, tarification dégressive sur volumes 5m² et plus.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on visiter l'atelier ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, Laurence reçoit sur rendez-vous dans son atelier du Vésinet.",
      },
    },
    {
      "@type": "Question",
      name: "Quel acompte demandez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un acompte de 40% à la signature du devis, le solde à la livraison avant la pose. Tous nos devis sont établis TTC et sans frais cachés.",
      },
    },
  ],
};


export const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://www.ceramique-murale.com/#organization",
      name: "Les Céramiques Murales du Vésinet",
      url: "https://www.ceramique-murale.com/",
      telephone: "+33670025133",
      foundingDate: "2008",
      address: {
        "@type": "PostalAddress",
        streetAddress: "14 rue Ernest André",
        postalCode: "78110",
        addressLocality: "Le Vésinet",
        addressRegion: "Île-de-France",
        addressCountry: "FR",
      },
      founder: { "@id": "https://www.ceramique-murale.com/#laurence-brecher" },
      award: "Prix du Ravalement de la ville de Versailles 2025, catégorie Restitution de Décors",
      sameAs: [
        "https://www.instagram.com/ceramiquesmurales/",
        "https://www.linkedin.com/company/les-ceramiques-murales/",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://www.ceramique-murale.com/#laurence-brecher",
      name: "Laurence Brecher",
      jobTitle: "Artiste céramiste",
      url: "https://www.ceramique-murale.com/laurence-brecher-creatrice-de-ceramique-murale-decorative/",
      worksFor: { "@id": "https://www.ceramique-murale.com/#organization" },
    },
    {
      "@type": "Service",
      "@id": "https://credence.ceramique-murale.com/#service",
      name: "Crédence en céramique peinte à la main, sur mesure",
      serviceType: "Crédence de cuisine en faïence émaillée",
      provider: { "@id": "https://www.ceramique-murale.com/#organization" },
      areaServed: "France",
      url: "https://credence.ceramique-murale.com/",
    },
    {
      "@type": "WebPage",
      "@id": "https://credence.ceramique-murale.com/#webpage",
      url: "https://credence.ceramique-murale.com/",
      name: HOME_TITLE,
      inLanguage: "fr-FR",
      about: { "@id": "https://credence.ceramique-murale.com/#service" },
      publisher: { "@id": "https://www.ceramique-murale.com/#organization" },
    },
    faqSchema,
  ],
};
