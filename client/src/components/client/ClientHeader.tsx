import { useState, useEffect } from "react";
import clsx from "clsx";
import { SECTIONS } from "../../constants";
import { Btn } from "../ui/Btn";
import { MobileSidebar } from "./MobileSidebar";

interface ClientHeaderProps {
  headerOpacity: number;
  activeSection: string;
  scrollTo: (id: string) => void;
  onOpenCareers?: () => void;
}

export function ClientHeader({ headerOpacity, activeSection, scrollTo, onOpenCareers }: ClientHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-100 px-4 md:px-10 h-16 flex items-center justify-between transition-[border-color] duration-300"
        style={{
          background: menuOpen ? "#060B18" : `rgba(6,11,24,${headerOpacity})`,
          backdropFilter: menuOpen || headerOpacity > 0.1 ? "blur(24px) saturate(1.2)" : "none",
          borderBottom: `1px solid ${menuOpen || headerOpacity > 0.3 ? "#162040" : "transparent"}`,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => scrollTo("hero")}
          role="button"
          aria-label="Scroll to top"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") scrollTo("hero"); }}
        >
          <img src="/codnexialogo.png" alt="Codnexia Software" className="h-12 w-auto" />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1.5" aria-label="Main navigation">
          {SECTIONS.filter(s => s.nav).map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={clsx(
                "px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-all duration-250 font-sans",
                activeSection === s.id
                  ? "bg-accent-dim text-accent"
                  : "bg-transparent text-secondary",
              )}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={onOpenCareers}
            className="px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-all duration-250 font-sans bg-transparent text-secondary"
          >
            Careers
          </button>
        </nav>

        {/* Desktop CTA */}
        <Btn
          onClick={() => scrollTo("contact")}
          className="hidden md:inline-flex px-5! py-2! text-[13px]!"
        >
          Start a Project
        </Btn>

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-transparent border border-border text-main cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </>
            )}
          </svg>
        </button>
      </header>

      {/* Full-screen overlay menu - mobile only, rendered outside header to escape stacking context */}
      {menuOpen && (
        <MobileSidebar
          activeSection={activeSection}
          scrollTo={scrollTo}
          onClose={() => setMenuOpen(false)}
          onOpenCareers={onOpenCareers}
        />
      )}
    </>
  );
}
