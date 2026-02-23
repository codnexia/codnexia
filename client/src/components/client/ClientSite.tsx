import { useState, useEffect, useRef } from "react";
import type { ClientSiteProps } from "../../types";
import { SECTIONS } from "../../constants";
import { ClientHeader } from "./ClientHeader";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { ProcessSection } from "./ProcessSection";
import { ServicesSection } from "./ServicesSection";
import { ContactSection } from "./ContactSection";
import { ClientFooter } from "./ClientFooter";

export function ClientSite({ onSwitchToAdmin }: ClientSiteProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const handler = () => {
      setScrollY(el.scrollTop);
      const offsets = SECTIONS.map(s => {
        const ref = sectionRefs.current[s.id];
        return ref ? { id: s.id, top: ref.offsetTop - 100 } : null;
      }).filter(Boolean) as { id: string; top: number }[];
      const current = offsets.reverse().find(o => el.scrollTop >= o.top);
      if (current) setActiveSection(current.id);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const headerOpacity = Math.min(scrollY / 80, 0.96);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div ref={containerRef} className="h-full overflow-auto bg-bg relative scroll-smooth">
      <ClientHeader headerOpacity={headerOpacity} activeSection={activeSection} scrollTo={scrollTo} onSwitchToAdmin={onSwitchToAdmin} />
      <HeroSection sectionRef={setSectionRef("hero")} scrollTo={scrollTo} />
      <AboutSection sectionRef={setSectionRef("about")} />
      <ProcessSection sectionRef={setSectionRef("how")} />
      <ServicesSection sectionRef={setSectionRef("services")} />
      <ContactSection sectionRef={setSectionRef("contact")} />
      <ClientFooter />
    </div>
  );
}
