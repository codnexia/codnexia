import { useState, useEffect } from "react";
import clsx from "clsx";
import { SECTIONS } from "../../constants";
import { Btn } from "../ui/Btn";

interface ClientHeaderProps {
  headerOpacity: number;
  activeSection: string;
  scrollTo: (id: string) => void;
}

export function ClientHeader({ headerOpacity, activeSection, scrollTo }: ClientHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
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
    <header
      className="sticky top-0 z-100 px-4 md:px-10 h-16 flex items-center justify-between transition-[border-color] duration-300"
      style={{
        background: `rgba(6,11,24,${headerOpacity})`,
        backdropFilter: headerOpacity > 0.1 ? "blur(24px) saturate(1.2)" : "none",
        borderBottom: `1px solid ${headerOpacity > 0.3 ? "#162040" : "transparent"}`,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() => scrollTo("hero")}
      >
        <div className="w-8.5 h-8.5 rounded-lg bg-grad flex items-center justify-center text-[13px] font-extrabold text-main shadow-[0_0_20px_var(--color-primary-glow)]">
          {"</>"}
        </div>
        <span className="text-[17px] font-bold text-main -tracking-[0.5px]">
          Codnexia<span className="text-accent font-normal ml-1">Software</span>
        </span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-1.5">
        {SECTIONS.map(s => (
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

      {/* Full-screen overlay menu - mobile only */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-99 bg-bg/95 backdrop-blur-xl flex flex-col items-center pt-12 gap-2 md:hidden">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                scrollTo(s.id);
                setMenuOpen(false);
              }}
              className={clsx(
                "px-6 py-3 rounded-lg border-none cursor-pointer text-base font-semibold transition-all duration-200 font-sans w-60 text-center",
                activeSection === s.id
                  ? "bg-accent-dim text-accent"
                  : "bg-transparent text-secondary",
              )}
            >
              {s.label}
            </button>
          ))}
          <Btn
            onClick={() => {
              scrollTo("contact");
              setMenuOpen(false);
            }}
            className="mt-4 px-8! py-3!"
          >
            Start a Project
          </Btn>
        </div>
      )}
    </header>
  );
}
