import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";
import { ABOUT_PILLARS, CORE_VALUES } from "../../assets/data";

interface AboutSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function AboutSection({ sectionRef }: AboutSectionProps) {
  return (
    <section
      ref={sectionRef}
      id="about"
      className="px-4 py-14 md:px-10 md:py-22.5 max-w-250 mx-auto"
    >
      <SectionReveal>
        <Pill>About Codnexia</Pill>
        <h2 className="text-[28px] md:text-[40px] font-bold text-main mt-4 mb-3.5 -tracking-[1.5px]">
          Transforming ideas into<br />
          <span className="text-accent">reliable software</span>
        </h2>
        <p className="text-base text-secondary leading-[1.8] max-w-160 mb-11">
          Codnexia Software is a global software development company delivering modern, scalable,
          and intelligent digital solutions. Built on African excellence and driven by innovation,
          we partner with startups, enterprises, and organizations worldwide to design, build, and
          scale impactful technology products.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-11">
        {ABOUT_PILLARS.map((f, i) => (
          <SectionReveal key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <Card hoverable className="relative overflow-hidden p-7 h-full">
              <div
                className="absolute -top-5 -right-5 w-20 h-20 rounded-full"
                style={{ background: `radial-gradient(circle, ${f.color}15, transparent)` }}
              />
              <div className="text-2xl mb-3.5" style={{ color: f.color }}>
                {f.icon}
              </div>
              <div className="text-base font-bold text-main mb-2">{f.title}</div>
              <div className="text-[13px] text-secondary leading-[1.7]">{f.desc}</div>
            </Card>
          </SectionReveal>
        ))}
      </div>

      <SectionReveal>
        <div className="flex gap-2.5 flex-wrap">
          {CORE_VALUES.map(v => (
            <span
              key={v}
              className="px-4 py-2 rounded-[20px] bg-surface border border-border text-xs text-secondary font-medium transition-all duration-200 cursor-default hover:border-accent/27 hover:text-accent"
            >
              {v}
            </span>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
