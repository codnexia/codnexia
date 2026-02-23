import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";

interface AboutSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function AboutSection({ sectionRef }: AboutSectionProps) {
  return (
    <section ref={sectionRef} id="about" className="px-10 py-[90px] max-w-[1000px] mx-auto">
      <SectionReveal>
        <Pill>About Codnexia</Pill>
        <h2 className="text-[40px] font-bold text-main mt-4 mb-3.5 -tracking-[1.5px]">
          Transforming ideas into<br /><span className="text-accent">reliable software</span>
        </h2>
        <p className="text-base text-secondary leading-[1.8] max-w-[640px] mb-11">
          Codnexia Software is a global software development company delivering modern, scalable, and intelligent digital solutions. Built on African excellence and driven by innovation, we partner with startups, enterprises, and organizations worldwide to design, build, and scale impactful technology products.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-3 gap-4 mb-11">
        {[
          { icon: "\u25CE", title: "Mission", desc: "To build high-quality, scalable, and innovative software solutions that empower businesses globally while showcasing African engineering excellence.", color: "#2DD4A8" },
          { icon: "\u25C8", title: "Vision", desc: "To become a globally trusted technology company originating from Africa, shaping the future of digital innovation and software development.", color: "#4A9FF5" },
          { icon: "\u2726", title: "Values", desc: "Innovation First \u00B7 Engineering Excellence \u00B7 Integrity & Trust \u00B7 Global Mindset \u00B7 African Excellence", color: "#F5A623" },
        ].map((f, i) => (
          <SectionReveal key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <Card hoverable className="relative overflow-hidden p-7 h-full">
              <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full" style={{ background: `radial-gradient(circle, ${f.color}15, transparent)` }} />
              <div className="text-2xl mb-3.5" style={{ color: f.color }}>{f.icon}</div>
              <div className="text-base font-bold text-main mb-2">{f.title}</div>
              <div className="text-[13px] text-secondary leading-[1.7]">{f.desc}</div>
            </Card>
          </SectionReveal>
        ))}
      </div>

      <SectionReveal>
        <div className="flex gap-2.5 flex-wrap">
          {["Innovation First", "Engineering Excellence", "Integrity & Trust", "Global Mindset", "African Excellence"].map(v => (
            <span key={v} className="px-4 py-2 rounded-[20px] bg-surface border border-border text-xs text-secondary font-medium transition-all duration-200 cursor-default hover:border-accent/27 hover:text-accent">
              {v}
            </span>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
