import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";

interface ProcessSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function ProcessSection({ sectionRef }: ProcessSectionProps) {
  return (
    <section ref={sectionRef} id="how" className="px-10 py-[90px] max-w-[1000px] mx-auto">
      <SectionReveal>
        <Pill>Our Process</Pill>
        <h2 className="text-[40px] font-bold text-main mt-4 mb-12 -tracking-[1.5px]">How we deliver results</h2>
      </SectionReveal>
      <div className="grid grid-cols-4 gap-4">
        {[
          { step: "01", title: "Discovery & Design", desc: "Understand your vision, define scope, wireframe solutions and plan the architecture.", icon: "\uD83D\uDD0D" },
          { step: "02", title: "Build & Develop", desc: "Agile sprints with clean, scalable code. REST APIs, WebSockets, mobile & web UIs.", icon: "\u2699\uFE0F" },
          { step: "03", title: "Test & Integrate", desc: "Comprehensive QA, security audits, CI/CD pipelines and system integrations.", icon: "\uD83E\uDDEA" },
          { step: "04", title: "Deploy & Scale", desc: "Containerized deployment, monitoring dashboards, and ongoing support for growth.", icon: "\uD83D\uDE80" },
        ].map((s, i) => (
          <SectionReveal key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <Card hoverable className="relative h-full !p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[34px] font-extrabold text-primary font-mono -tracking-[2px] opacity-50">{s.step}</span>
                <span className="text-[26px]">{s.icon}</span>
              </div>
              <div className="text-[15px] font-bold text-main mb-2">{s.title}</div>
              <div className="text-[13px] text-secondary leading-[1.7]">{s.desc}</div>
              {i < 3 && <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 text-lg text-muted z-[2]">&rarr;</div>}
            </Card>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
