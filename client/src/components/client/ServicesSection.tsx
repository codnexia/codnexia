import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";
import { SERVICES } from "../../assets/data";

interface ServicesSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function ServicesSection({ sectionRef }: ServicesSectionProps) {
  return (
    <section
      ref={sectionRef}
      id="services"
      className="px-4 py-14 md:px-10 md:py-22.5 max-w-250 mx-auto"
    >
      <SectionReveal>
        <h2 className="text-[28px] md:text-[40px] font-bold text-main mb-12 -tracking-[1.5px]">
          What we build
        </h2>
      </SectionReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {SERVICES.map((s, i) => (
          <SectionReveal
            key={i}
            style={{ transitionDelay: `${i * 0.06}s` }}
            className={i === 6 ? "lg:col-[2/3]" : ""}
          >
            <Card hoverable className="h-full">
              <div className="flex justify-between items-start mb-3.5">
                <span className="text-[30px]">{s.icon}</span>
                <Pill color="#4A9FF5">{s.tag}</Pill>
              </div>
              <div className="text-base font-bold text-main mb-1.5">{s.title}</div>
              <div className="text-[13px] text-secondary leading-[1.7]">{s.desc}</div>
            </Card>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
