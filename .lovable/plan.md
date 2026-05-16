## Plan

1. Remplacer l’appel Resend direct par l’appel via le connecteur sécurisé Lovable, avec `LOVABLE_API_KEY` + `RESEND_API_KEY`, car les deux secrets sont bien présents.
2. Ajouter un log serveur minimal quand le fournisseur email refuse l’envoi, pour voir le vrai statut sans exposer d’information au visiteur.
3. Conserver le formulaire et la redirection tels quels côté visiteur.
4. Tester `/api/public/contact` avec un payload valide pour confirmer que la route ne renvoie plus l’erreur générique.

## Détail technique

- Modifier uniquement `src/routes/api/public/contact.ts`.
- Utiliser `https://connector-gateway.lovable.dev/resend/emails` au lieu de `https://api.resend.com/emails`.
- Envoyer les headers requis : `Authorization: Bearer ${LOVABLE_API_KEY}` et `X-Connection-Api-Key: ${RESEND_API_KEY}`.
- Garder `from: "Atelier Céramique Murale <onboarding@resend.dev>"` tant que le domaine d’envoi n’est pas vérifié dans Resend.