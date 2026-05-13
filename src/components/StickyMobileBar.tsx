import { useEffect, useState } from "react";
import {
  useABVariant,
  trackExposure,
  trackConversion,
} from "@/lib/ab-helpers";

interface Props {
  /** Kept for backward compat (desktop phone modal); not used by variants A/B. */
  onPhoneClick?: () => void;
}

const SCROLL_TARGET_ID = "formulaire";
const PHONE_HREF = "tel:+33670025133";

export default function StickyMobileBar(_props: Props) {
  const variant = useABVariant("sticky_mobile_cta_v1", [
    "control",
    "A",
    "B",
  ]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    trackExposure("sticky_mobile_cta_v1", variant);
  }, [variant]);

  useEffect(() => {
    if (variant === "control") return;
    const onScroll = () =>
      setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  if (variant === "control") return null;

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    trackConversion("sticky_mobile_form_click", { variant });
    const el = document.getElementById(SCROLL_TARGET_ID);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onPhoneClick = () => {
    trackConversion("sticky_mobile_phone_click", { variant });
  };

  const wrapperBase = `fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)] transition-opacity duration-200 md:hidden ${
    show ? "opacity-100" : "pointer-events-none opacity-0"
  }`;

  if (variant === "A") {
    return (
      <div
        data-ab-experiment="sticky_mobile_cta_v1"
        data-ab-variant={variant}
        className={`${wrapperBase} flex h-16`}
      >
        <a
          href={PHONE_HREF}
          onClick={onPhoneClick}
          className="flex flex-1 items-center justify-center gap-2 border-r border-[var(--border)] bg-white text-sm font-semibold text-[var(--anthracite)]"
        >
          📞 Appeler
        </a>
        <a
          href={`#${SCROLL_TARGET_ID}`}
          onClick={scrollToForm}
          className="flex flex-1 items-center justify-center gap-2 text-sm font-semibold text-white"
          style={{ background: "#b8860b" }}
        >
          Devis gratuit
        </a>
      </div>
    );
  }

  // variant B
  return (
    <div
      data-ab-experiment="sticky_mobile_cta_v1"
      data-ab-variant={variant}
      className={`${wrapperBase} p-2`}
    >
      <a
        href={`#${SCROLL_TARGET_ID}`}
        onClick={scrollToForm}
        className="flex h-12 w-full items-center justify-center gap-2 text-sm font-semibold text-white"
        style={{ background: "#b8860b" }}
      >
        Mon devis en 30 secondes →
      </a>
    </div>
  );
}
