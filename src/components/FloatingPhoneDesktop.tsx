import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function FloatingPhoneDesktop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-30 hidden md:flex transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"
      }`}
    >
      <a
        href="tel:+33670025133"
        aria-label="Appeler Laurence au 06 70 02 51 33"
        onClick={() => trackEvent("floating_desktop_phone_click")}
        className="group relative h-16 w-16 rounded-full bg-[#b8860b] shadow-2xl shadow-[#b8860b]/30 flex items-center justify-center hover:scale-105 transition-transform animate-[subtle-pulse_3s_ease-in-out_infinite]"
      >
        <Phone className="h-7 w-7 text-[#2a2a2a]" />
        <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#2a2a2a] text-[#fcfcfc] text-sm px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Appeler Laurence · 06 70 02 51 33
        </span>
      </a>
    </div>
  );
}
