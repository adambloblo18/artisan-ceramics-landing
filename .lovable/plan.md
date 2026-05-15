## Problème

L'endpoint `https://formsubmit.co/ajax/...` renvoie les en-têtes CORS **uniquement** quand la requête est en `application/json`. Actuellement on envoie un `FormData` (multipart), donc pas de header `Access-Control-Allow-Origin` → bloqué par le navigateur.

De plus, FormSubmit AJAX **ne suit pas** `_next` (pas de redirection serveur). Il faut faire la redirection côté client après succès (déjà en place via `window.location.href = redirectUrl`).

## Changements dans `src/components/MultiStepForm.tsx`

Dans `onSubmit`, remplacer le bloc `FormData` + `fetch` par un POST JSON :

```ts
const payload = {
  _subject: subject,
  _captcha: "false",
  _template: "table",
  nom: values.nom,
  telephone: values.telephone,
  projet: values.projet,
  type: values.type,
};

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify(payload),
});
if (!res.ok) throw new Error("submit failed");
trackEvent("form_submitted", { type: values.type });
window.location.href = redirectUrl;
```

(`_next` retiré — inutile en mode AJAX, la redirection est faite côté client.)

Tout le reste (validation Zod, honeypot, anti-bot 2s, gestion d'erreur, UI) reste identique.
