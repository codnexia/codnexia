import { SectionReveal } from "../ui/SectionReveal";
import { TRUST_BADGES } from "../../assets/data";

interface TrustStripSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function TrustStripSection({ sectionRef }: TrustStripSectionProps) {
  return (
    <section
      ref={sectionRef}
      id="trust"
      className="px-4 py-8 md:px-10 md:py-12 max-w-250 mx-auto"
    >
      <SectionReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {TRUST_BADGES.map((b, i) => (
            <div key={i} className="flex items-center gap-3 text-center md:text-left">
              <span className="text-xl md:text-2xl">{b.icon}</span>
              <span className="text-xs md:text-sm text-secondary font-medium leading-snug">{b.text}</span>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
