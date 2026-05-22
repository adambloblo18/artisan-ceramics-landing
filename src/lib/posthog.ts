// Neutralisé : PostHog est initialisé uniquement via le script inline
// dans src/routes/__root.tsx (source unique de vérité).
// On ré-exporte l'instance globale posthog-js pour les consommateurs
// (analytics, ab-helpers) sans appeler init ici.
import posthog from "posthog-js";

export { posthog };
