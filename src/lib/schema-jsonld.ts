export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Atelier Le Vésinet - Laurence Brecher",
  image: "https://credence-ceramique.lovable.app/images/portrait-laurence.jpg",
  "@id": "https://ceramique-murale.com/",
  url: "https://ceramique-murale.com/",
  telephone: "+33670025133",
  priceRange: "€€€",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Le Vésinet",
    postalCode: "78110",
    addressCountry: "FR",
    addressRegion: "Île-de-France",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.892,
    longitude: 2.1262,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  award: "1er Prix du Ravalement Versailles 2025, Catégorie Restitution de Décors",
  sameAs: [
    "https://www.instagram.com/ceramique_murale/",
    "https://www.facebook.com/ceramiquemurale/",
  ],
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Crédence en céramique sur mesure peinte à la main",
  provider: { "@type": "LocalBusiness", name: "Atelier Le Vésinet - Laurence Brecher" },
  areaServed: { "@type": "Country", name: "France" },
  description:
    "Crédence en céramique peinte à la main au Vésinet. Faïence émaillée Art Nouveau, créée sur mesure pour cuisines, salles de bain et façades.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "1000",
    highPrice: "5000",
    offerCount: "3",
  },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien coûte une crédence en céramique sur mesure ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les projets démarrent à partir de 1 000 € pour une petite réalisation. Pour une crédence sur mesure de 2 à 4 m², comptez entre 2 500 et 5 000 €. Au-delà, le budget dépend de la complexité du projet. Nous établissons une étude personnalisée gratuite après un premier échange.",
      },
    },
    {
      "@type": "Question",
      name: "En combien de temps livrez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comptez 6 à 10 semaines de création artisanale. Laurence prépare les terres, peint chaque carreau à la pince, le cuit deux fois à 1020°C, et personnalise selon votre projet.",
      },
    },
    {
      "@type": "Question",
      name: "À quoi servent les petites irrégularités visibles sur les carreaux ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La céramique peinte à la main porte la trace du geste : légères variations de couleur, reliefs d'émail, bordures jamais parfaitement rectilignes. Ces imperfections distinguent une œuvre artisanale d'un carreau industriel.",
      },
    },
    {
      "@type": "Question",
      name: "Travaillez-vous avec des architectes et des décorateurs ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolument. Nous accompagnons les architectes et décorateurs sur les projets résidentiels et hospitality avec échantillons techniques gratuits, BDD motifs et coloris, tarification dégressive sur volumes 5m² et plus.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on visiter l'atelier ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolument. Laurence reçoit sur rendez-vous, du lundi au samedi, dans son atelier du Vésinet.",
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
