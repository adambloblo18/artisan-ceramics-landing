import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { localBusinessSchema, serviceSchema, faqSchema } from "@/lib/schema-jsonld";


const consentScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});
window.lcmChargeurs=window.lcmChargeurs||[];
window.__lcmConsent=false;
var lcmTimer=null;
var lcmPending=false;
var lcmAfterLoad=function(){lcmTimer=setTimeout(lcmStart,1500);};
var lcmCancel=function(){
  clearTimeout(lcmTimer);
  window.removeEventListener('load',lcmAfterLoad);
  lcmPending=false;
};
var lcmStart=function(){
  lcmCancel();
  if(window.__lcmConsent)return;
  window.__lcmConsent=true;
  window.lcmChargeurs.forEach(function(f){try{f()}catch(e){}});
};
window.lcmChargerMesure=function(restored){
  if(window.__lcmConsent)return;
  if(restored||document.readyState!=='complete'){
    if(lcmPending)return;
    lcmPending=true;
    if(document.readyState==='complete')lcmAfterLoad();
    else window.addEventListener('load',lcmAfterLoad,{once:true});
  }else lcmStart();
};
window.lcmRefuserMesure=function(){lcmCancel();window.__lcmConsent=false;};
try{var c=JSON.parse(localStorage.getItem('cookie_consent')||'null');if(c&&c.status==='accepted'&&Date.now()-c.timestamp<15552000000){
  gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
  window.lcmChargerMesure(true);
}}catch(e){}
`;

const googleAdsScript = `
var lcmGoogleAfterLoad=function(){setTimeout(function(){
  if(document.querySelector('script[data-lcm-google-ads]'))return;
  var script=document.createElement('script');
  script.async=true;
  script.setAttribute('data-lcm-google-ads','');
  script.src='https://www.googletagmanager.com/gtag/js?id=AW-11400865534';
  script.onload=function(){
    window.gtag('js',new Date());
    window.gtag('config','AW-11400865534');
  };
  document.head.appendChild(script);
},1000);};
if(document.readyState==='complete')lcmGoogleAfterLoad();
else window.addEventListener('load',lcmGoogleAfterLoad,{once:true});
`;

const telConversionScript = `document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
    el.addEventListener('click', function() {
      window.gtag && gtag('event', 'conversion', { 'send_to': 'AW-11400865534/LKHFCIKk4d8bEP7Nrbwq' });
    });
  });
});`;

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Les Céramiques Murales du Vésinet",
  image:
    "https://www.ceramique-murale.com/wp-content/uploads/2023/10/ceramique-murale-cuisine-credence22-1024x921.jpg",
  url: "https://www.ceramique-murale.com/",
  telephone: "+33670025133",
  priceRange: "€€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 rue Ernest André",
    addressLocality: "Le Vésinet",
    postalCode: "78110",
    addressCountry: "FR",
  },
  founder: { "@type": "Person", name: "Laurence Brecher" },
  award:
    "Premier Prix du Ravalement de la Ville de Versailles 2025, catégorie Restitution de Décors",
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl">404</h1>
        <p className="mt-4 text-muted-foreground">Cette page n'existe pas.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Retour à l'accueil</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">Une erreur est survenue.</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="btn-primary mt-6"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { title: "Crédence céramique sur mesure peinte main, Atelier Le Vésinet · 1er Prix Versailles 2025" },
      { name: "theme-color", content: "#2a2a2a" },
      {
        name: "description",
        content:
          "Crédence céramique peinte à la main au Vésinet. Chaque pièce est unique, dessinée pour votre cuisine. 1er Prix Versailles 2025. Réponse sous 20 minutes.",
      },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Crédence céramique sur mesure peinte main · Atelier Le Vésinet" },
      {
        property: "og:description",
        content:
          "Crédence céramique peinte à la main. 30 ans de métier, 1er Prix Versailles 2025. Réponse sous 20 minutes.",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Crédence céramique peinte à la main, atelier Le Vésinet" },
      { property: "og:url", content: "https://credence.ceramique-murale.com/" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "Atelier Le Vésinet" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Crédence céramique sur mesure peinte main · Atelier Le Vésinet" },
      {
        name: "twitter:description",
        content: "Crédence céramique peinte à la main. 30 ans de métier, 1er Prix Versailles 2025.",
      },
      // Robots & language
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { httpEquiv: "content-language", content: "fr-FR" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },

      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      // React emits the single hero image preload from its fetchPriority="high".
      { rel: "preload", as: "font", href: "/fonts/cormorant-garamond-400-latin.woff2", type: "font/woff2", crossOrigin: "anonymous" },
    ],
    scripts: [
      { children: consentScript },
      { children: googleAdsScript },
      { children: telConversionScript },
      { type: "application/ld+json", children: jsonLd },
      { type: "application/ld+json", children: JSON.stringify(localBusinessSchema) },
      { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />

      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const loadMeasurement = () => {
      if (!window.__lcmConsent) return;
      void import("@/lib/measurement").then((module) => {
        if (window.__lcmConsent) module.startMeasurement();
      }).catch(() => {});
    };
    const queue = window.lcmChargeurs ??= [];
    queue.push(loadMeasurement);
    if (window.__lcmConsent) loadMeasurement();
    return () => {
      const index = queue.indexOf(loadMeasurement);
      if (index >= 0) queue.splice(index, 1);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    const scan = () =>
      document
        .querySelectorAll(".reveal-on-scroll:not(.is-visible)")
        .forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#b8860b] focus:text-[#2a2a2a] focus:px-4 focus:py-2 focus:rounded"
      >
        Aller au contenu principal
      </a>
      <Outlet />
    </QueryClientProvider>
  );
}
