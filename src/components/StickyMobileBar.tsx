import { useEffect, useState } from "react";
import { Phone, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  /** Kept for backward compat; unused. */
  onPhoneClick?: () => void;
}

const PHONE_HREF = "tel:+33670025133";

function isDesktop() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 768px)").matches;
}

export default function StickyMobileBar(_props: Props) {
  const [show, setShow] = useState(false);
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (desktop) return;
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [desktop]);

  if (desktop) return null;

  const onPhone = () => trackEvent("sticky_mobile_phone_click");

  const onDevis = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("contact-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("sticky_mobile_devis_click");
  };

  return (
    <nav
      role="navigation"
      aria-label="Actions rapides"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#2a2a2a]/95 backdrop-blur-md border-t border-[#b8860b]/30 px-3 py-3 flex flex-row gap-2 transition-transform duration-300 ease-out ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={PHONE_HREF}
        onClick={onPhone}
        aria-label="Appeler Laurence au 06 70 02 51 33"
        className="flex-[3] inline-flex items-center justify-center gap-2 rounded-md bg-[#b8860b] text-[#2a2a2a] font-semibold py-3"
      >
        <Phone className="h-4 w-4" aria-hidden />
        Appeler Laurence
      </a>
      <a
        href="#contact-form"
        onClick={onDevis}
        aria-label="Ouvrir le formulaire de contact"
        className="flex-[2] inline-flex items-center justify-center gap-2 rounded-md border border-[#f9f7f2] bg-transparent text-[#f9f7f2] font-semibold py-3"
      >
        <Mail className="h-4 w-4" aria-hidden />
        Devis
      </a>
    </nav>
  );
}
