import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";
import { WHY_CODNEXIA } from "../../assets/data";

interface WhyCodnexiaSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function WhyCodnexiaSection({ sectionRef }: WhyCodnexiaSectionProps) {
  return (
    <section ref={sectionRef} id="why" className="px-4 py-14 md:px-10 md:py-22.5 max-w-250 mx-auto">
      <SectionReveal>
        <h2 className="text-[28px] md:text-[40px] font-bold text-main mb-3.5 -tracking-[1.5px]">
          Why <span className="text-accent">Codnexia</span>
        </h2>
        <p className="text-base text-secondary leading-[1.8] max-w-160 mb-11">
          What sets us apart as your engineering partner.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WHY_CODNEXIA.map((f, i) => (
          <SectionReveal key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <Card hoverable className="relative overflow-hidden p-7 h-full">
              <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full"
                style={{ background: `radial-gradient(circle, ${f.color}15, transparent)` }} />
              <div className="text-2xl mb-3.5" style={{ color: f.color }}>{f.icon}</div>
              <div className="text-base font-bold text-main mb-2">{f.title}</div>
              <div className="text-[13px] text-secondary leading-[1.7]">{f.desc}</div>
            </Card>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
