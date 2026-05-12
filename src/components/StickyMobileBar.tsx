import { useEffect, useState } from "react";

interface Props { onPhoneClick: () => void; }

export default function StickyMobileBar({ onPhoneClick }: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-[var(--border)] bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)] transition-opacity duration-200 md:hidden ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {isMobile ? (
        <a href="tel:+33670025133" className="flex flex-1 items-center justify-center gap-2 border-r border-[var(--border)] text-sm font-semibold text-[var(--anthracite)]">
          📞 Appeler
        </a>
      ) : (
        <button onClick={onPhoneClick} className="flex flex-1 items-center justify-center gap-2 border-r border-[var(--border)] text-sm font-semibold text-[var(--anthracite)]">
          📞 Appeler
        </button>
      )}
      <a href="#formulaire" className="flex flex-1 items-center justify-center gap-2 text-sm font-semibold text-white" style={{ background: "var(--gold)" }}>
        ✉️ Écrire
      </a>
    </div>
  );
}
