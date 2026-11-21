# Architecture rules
- Keep event helpers free of analytics SDK imports; dynamically import measurement providers from the consent loader so refused visitors do not download them.
- Hero video sources must be absent until page load plus the configured delay, and remain absent on mobile, reduced-motion and data-saving connections to prioritize the poster.
- Do not introduce manual chunk splitting in Vite; automatic splitting avoids circular vendor dependencies.