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
`;

const clarityScript = `(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "uhxdrmhaaf");`;

const uetScript = `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"343242701"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");`;

const posthogScript = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_oGmkuM4F5je7WmaLZpsF47paa8nv5V5vp58oh74Pwcwy', {
  api_host: 'https://eu.i.posthog.com',
  person_profiles: 'identified_only',
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
  disable_session_recording: false,
  respect_dnt: true,
  opt_out_capturing_by_default: true,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: '.ph-mask, input[type="email"], input[type="tel"]'
  }
});
if (typeof window !== 'undefined' && localStorage.getItem('lcm_consent') === 'accepted') {
  setTimeout(function(){ window.posthog && window.posthog.opt_in_capturing(); }, 500);
}`;

const googleAdsScript = `gtag('js', new Date()); gtag('config', 'AW-11400865534');`;

const telConversionScript = `document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
    el.addEventListener('click', function() {
      window.gtag && gtag('event', 'conversion', { 'send_to': 'AW-11400865534/LKHFCIKk4d8bEP7Nrbwq' });
    });
  });
});`;

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Store"],
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
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
          "Crédence céramique peinte à la main au Vésinet. Chaque pièce est unique, dessinée pour votre cuisine. 1er Prix Versailles 2025. Devis sous 20 minutes.",
      },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Crédence céramique sur mesure peinte main · Atelier Le Vésinet" },
      {
        property: "og:description",
        content:
          "Crédence céramique peinte à la main. 30 ans d'atelier, 1er Prix Versailles 2025. Devis gratuit sous 20 minutes.",
      },
      { property: "og:image", content: "https://credence-ceramique.lovable.app/images/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Crédence céramique peinte à la main, atelier Le Vésinet" },
      { property: "og:url", content: "https://credence-ceramique.lovable.app/" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "Atelier Le Vésinet" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Crédence céramique sur mesure peinte main · Atelier Le Vésinet" },
      {
        name: "twitter:description",
        content: "Crédence céramique peinte à la main. 30 ans d'atelier, 1er Prix Versailles 2025.",
      },
      { name: "twitter:image", content: "https://credence-ceramique.lovable.app/images/og-image.jpg" },
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://www.googletagmanager.com" },
      { rel: "preconnect", href: "https://www.clarity.ms" },
      { rel: "preconnect", href: "https://bat.bing.com" },
      { rel: "preload", as: "image", href: "/images/hero-credence.webp", type: "image/webp", fetchPriority: "high" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap",
      },
    ],
    scripts: [
      { children: consentScript },
      
      { children: clarityScript },
      { children: uetScript },
      { children: posthogScript },
      { src: "https://www.googletagmanager.com/gtag/js?id=AW-11400865534", async: true },
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
