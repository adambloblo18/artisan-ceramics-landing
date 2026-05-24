# Plan d'optimisation — 6 étapes, validation après chaque

Aucune modification du design, des textes, des photos (sauf format), ni de la structure. J'attends ton "go étape 1" avant toute exécution, puis "go étape 2", etc.

## Étape 1 — Performance JS (`vite.config.ts`)

- Ajouter `build.target: 'es2020'` pour supprimer les polyfills (~31 Kio).
- Ajouter `build.rollupOptions.output.manualChunks` : `vendor-react` (react, react-dom), `vendor-router` (@tanstack/*), `vendor-ui` (radix-ui, lucide-react), `vendor-utils` (zod, react-hook-form, clsx, tailwind-merge).
- `build.minify: 'esbuild'`, `build.sourcemap: false`.
- Note : le fichier actuel utilise `defineConfig` de `@lovable.dev/vite-tanstack-config`. Je passerai ces options via la clé `vite: { build: {...} }` sans toucher au reste.

## Étape 2 — Lazy loading below-the-fold

Cibles à lazy-loader dans `src/routes/index.tsx` (via `React.lazy` + `Suspense` avec skeleton à hauteur fixe pour éviter le CLS) :
- `HistoiresProjets`, `LeDetail`, `Temoignages`, `Prescripteurs`, `VisualiseurSection`, `Faq`, `MultiStepForm`, `ConsentBanner`.
- Restent en import statique : Hero, `TrustStrip`, `StickyMobileBar`, premier CTA (above-the-fold).
- Je te confirmerai la liste finale avant exécution selon l'ordre réel des sections.

## Étape 3 — `index.html`, images, polices

- Preload de l'image hero (`fetchpriority="high"`) + sur `<img>` hero : `fetchpriority="high"`, `loading="eager"`, `decoding="async"`, `width`/`height`.
- Autres images : `loading="lazy"`, `decoding="async"`, dimensions explicites (audit fichier par fichier).
- Conversion WebP qualité 85 (hero) / 80 (reste) avec `cwebp`. Je te fournis tableau avant/après en Kio. Photos identiques.
- Preload `woff2` de la police principale (Cormorant Garamond display) + `font-display: swap` sur toutes les `@font-face`.
- À confirmer : si les polices viennent de Google Fonts via `<link>`, je passerai en self-host woff2 pour pouvoir les preload — dis-moi si OK ou si tu préfères garder Google Fonts.

## Étape 4 — Cache HTTP (`public/_headers`)

Ajouter aux règles existantes :
```
/*.webp
  Cache-Control: public, max-age=31536000, immutable
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
```
(Le bloc `/assets/*` existe déjà.)

## Étape 5 — Quality Score (sémantique uniquement)

- Audit `<title>` et meta description dans `src/routes/index.tsx` → ajustement minimal pour contenir les mots-clés requis (sans toucher au contenu visible).
- Vérif H1 : si les mots "crédence céramique" n'y sont pas, je te le signale et j'attends ta décision (pas de modif auto).
- Ajout du JSON-LD `ProfessionalService` fourni, dans le `head()` de la route index.

## Étape 6 — Frictions conversion (CSS global)

Dans `src/styles.css` + classes utilitaires sur boutons CTA :
- CTA principaux : `min-height: 48px`, padding horizontal ≥ 24px.
- Liens `tel:` cliquables : `min-height: 48px` mobile.
- Body : `font-size: 18px` minimum, `line-height: 1.6`.
- Contraste CTA : audit ratio actuel doré `#b8860b` sur fond foncé → alerte si < 7:1, je te laisse décider.
- Formulaire (`MultiStepForm.tsx`) : ajout `autocomplete` (`given-name`, `family-name`, `email`, `tel`, etc.) + `type="tel"` `inputmode="tel"` sur téléphone. Aucune autre modif (labels, ordre, nombre de champs inchangés).

---

**Questions ouvertes avant exécution :**
1. Étape 3 — OK pour self-host la police principale en woff2 (nécessaire pour le preload) ?
2. Sinon je n'applique que `font-display: swap` côté Google Fonts.

Dis-moi "go étape 1" pour démarrer.