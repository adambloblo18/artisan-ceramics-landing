import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/ceramiquemurale@gmail.com";

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

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = contactSchema.parse(await request.json());
          const response = await fetch(FORMSUBMIT_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            return jsonResponse({ success: false }, 502);
          }

          return jsonResponse({ success: true });
        } catch {
          return jsonResponse({ success: false }, 400);
        }
      },
    },
  },
});