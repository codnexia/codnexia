import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";
import { PROCESS_STEPS } from "../../assets/data";

interface ProcessSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function ProcessSection({ sectionRef }: ProcessSectionProps) {
  return (
    <section
      ref={sectionRef}
      id="how"
      className="px-4 py-14 md:px-10 md:py-22.5 max-w-250 mx-auto"
    >
      <SectionReveal>
        <h2 className="text-[28px] md:text-[40px] font-bold text-main mb-12 -tracking-[1.5px]">
          How we build
        </h2>
      </SectionReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PROCESS_STEPS.map((s, i) => (
          <SectionReveal key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <Card hoverable className="relative h-full p-6!">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[34px] font-extrabold text-primary font-mono -tracking-[2px] opacity-50">
                  {s.step}
                </span>
                <span className="text-[26px]">{s.icon}</span>
              </div>
              <div className="text-[15px] font-bold text-main mb-2">{s.title}</div>
              <div className="text-[13px] text-secondary leading-[1.7]">{s.desc}</div>
              {i < 4 && (
                <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 text-lg text-muted z-2 hidden lg:block">
                  &rarr;
                </div>
              )}
            </Card>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
