import { useEffect, useState } from "react";

interface Props { open: boolean; onClose: () => void; }

export default function PhoneModal({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const phone = "06 70 02 51 33";
  const copy = async () => {
    await navigator.clipboard.writeText("+33670025133");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 fade-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Contacter Laurence"
    >
      <div
        className="card-soft w-full max-w-md p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow">Atelier Le Vésinet</p>
        <h3 className="h-display mt-3 text-2xl">Appelez Laurence</h3>
        <a
          href="tel:+33670025133"
          className="mt-6 block font-display text-4xl text-[var(--gold-text-light)]"
        >
          {phone}
        </a>
        <p className="mt-2 text-sm italic text-[var(--muted-text)]">
          Réponse en 20 minutes pendant les heures ouvrées.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="https://wa.me/33670025133"
            target="_blank"
            rel="noopener"
            className="btn-primary"
          >
            Écrire sur WhatsApp
          </a>
          <button onClick={copy} className="btn-secondary">
            {copied ? "Numéro copié" : "Copier le numéro"}
          </button>
          <button
            onClick={onClose}
            className="text-sm text-[var(--muted-text)] underline"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
