## Objectif
Corriger définitivement l’envoi du formulaire : l’appel arrive bien sur `/api/public/contact`, mais cette route renvoie `502` car FormSubmit refuse encore le relais côté serveur.

## Plan
1. Remplacer FormSubmit dans la route interne par un envoi email serveur via l’API HTTP Resend.
2. Ajouter une vérification claire côté serveur : validation des champs, anti-spam simple, et réponse JSON `{ success: true }` uniquement si l’email est accepté.
3. Garder le formulaire frontend inchangé : mêmes champs, même bouton, même redirection vers la page merci après succès.
4. Vérifier l’endpoint `/api/public/contact` avec un test serveur pour confirmer qu’il ne renvoie plus `502`.

## À prévoir
Il faudra une clé `RESEND_API_KEY` en secret pour que l’envoi email fonctionne en production.