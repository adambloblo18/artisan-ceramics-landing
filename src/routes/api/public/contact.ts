import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const RESEND_ENDPOINT = "https://connector-gateway.lovable.dev/resend/emails";
const TO_EMAIL = "ceramiquemurale@gmail.com";
const FROM_EMAIL = "Atelier Céramique Murale <onboarding@resend.dev>";

const contactSchema = z.object({
  _subject: z.string().min(1).max(120),
  _captcha: z.literal("false"),
  _template: z.literal("table"),
  nom: z.string().trim().min(2).max(80),
  telephone: z.string().trim().min(8).max(30),
  projet: z.string().trim().min(5).max(500),
  type: z.enum(["particulier", "architecte"]),
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildEmailHtml(payload: z.infer<typeof contactSchema>) {
  return `
    <h2>${payload._subject}</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif">
      <tr><td><strong>Nom</strong></td><td>${payload.nom}</td></tr>
      <tr><td><strong>Téléphone</strong></td><td>${payload.telephone}</td></tr>
      <tr><td><strong>Type</strong></td><td>${payload.type}</td></tr>
      <tr><td><strong>Projet</strong></td><td>${payload.projet}</td></tr>
    </table>
  `;
}

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = contactSchema.parse(await request.json());
          const resendKey = process.env.RESEND_API_KEY;
          const lovableKey = process.env.LOVABLE_API_KEY;

          if (!resendKey || !lovableKey) {
            console.error("[contact] missing email keys", {
              hasResend: !!resendKey,
              hasLovable: !!lovableKey,
            });
            return jsonResponse({ success: false, error: "missing_email_key" }, 503);
          }

          const response = await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lovableKey}`,
              "X-Connection-Api-Key": resendKey,
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [TO_EMAIL],
              subject: payload._subject,
              html: buildEmailHtml(payload),
            }),
          });

          if (!response.ok) {
            const body = await response.text().catch(() => "");
            console.error("[contact] resend failed", response.status, body);
            return jsonResponse({ success: false }, 502);
          }

          return jsonResponse({ success: true });
        } catch (err) {
          console.error("[contact] handler error", err);
          return jsonResponse({ success: false }, 400);
        }
      },
    },
  },
});