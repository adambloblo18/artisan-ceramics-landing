# Architecture rules
- Keep event helpers free of analytics SDK imports; dynamically import measurement providers from the consent loader so refused visitors do not download them.
- Load the Google Ads tag independently after page load; defer restored measurement consent, but apply a new grant immediately on a loaded page, isolating each loader's errors.
- Hero video sources must be absent until page load plus the configured delay, and remain absent on mobile, reduced-motion and data-saving connections to prioritize the poster.
- Do not introduce manual chunk splitting in Vite; automatic splitting avoids circular vendor dependencies.
- Emit the homepage's single structured-data graph from its leaf head; centralize it and the page title in schema-jsonld so parent layouts cannot duplicate entities.
- Keep the explicitly requested one-page sitemap static in public; its lastmod is the owner's supplied page date, never a build-time fallback.