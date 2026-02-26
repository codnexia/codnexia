import { useState, useEffect, useRef } from "react";
import { SECTIONS } from "../../constants";
import { trackPageView } from "../../lib/api";
import { ClientHeader } from "./ClientHeader";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { ProcessSection } from "./ProcessSection";
import { ServicesSection } from "./ServicesSection";
import { ContactSection } from "./ContactSection";
import { ClientFooter } from "./ClientFooter";
import { TestimonialPopup } from "./TestimonialPopup";

// Generate or retrieve a unique session ID for analytics tracking
function getSessionId(): string {
  let sid = localStorage.getItem("codnexia_vid");
  if (!sid) {
    sid = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("codnexia_vid", sid);
  }
  return sid;
}

// Detect device type from user agent
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Tablet|iPad/i.test(ua)) return "Tablet";
  if (/Mobile|iPhone|Android.*Mobile/i.test(ua)) return "Mobile";
  return "Desktop";
}

export function ClientSite() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const lastTrackedSection = useRef(""); // avoid duplicate track calls

  // Track page view on mount (initial load)
  useEffect(() => {
    trackPageView("/home", getSessionId(), getDeviceType()).catch((err) => {
      console.warn("Analytics tracking failed:", (err as Error).message);
    });
  }, []);

  // Track section changes as the user scrolls
  useEffect(() => {
    if (activeSection && activeSection !== lastTrackedSection.current) {
      lastTrackedSection.current = activeSection;
      trackPageView(`/${activeSection}`, getSessionId(), getDeviceType()).catch((err) => {
        console.warn("Analytics tracking failed:", (err as Error).message);
      });
    }
  }, [activeSection]);

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
      <ClientHeader headerOpacity={headerOpacity} activeSection={activeSection} scrollTo={scrollTo} />
      <HeroSection sectionRef={setSectionRef("hero")} scrollTo={scrollTo} />
      <AboutSection sectionRef={setSectionRef("about")} />
      <ProcessSection sectionRef={setSectionRef("how")} />
      <ServicesSection sectionRef={setSectionRef("services")} />
      <ContactSection sectionRef={setSectionRef("contact")} />
      <ClientFooter />
      <TestimonialPopup />
    </div>
  );
}
