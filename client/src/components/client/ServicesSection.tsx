import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";

interface ServicesSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function ServicesSection({ sectionRef }: ServicesSectionProps) {
  return (
    <section ref={sectionRef} id="services" className="px-10 py-22.5 max-w-250 mx-auto">
      <SectionReveal>
        <Pill>Services</Pill>
        <h2 className="text-[40px] font-bold text-main mt-4 mb-12 -tracking-[1.5px]">What we build</h2>
      </SectionReveal>
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { icon: "\uD83C\uDF10", title: "Web Applications", desc: "Modern, responsive web apps with React, NestJS, and scalable backends. From SPAs to full-stack platforms.", tag: "Frontend + Backend" },
          { icon: "\uD83D\uDCF1", title: "Mobile Apps", desc: "Native and cross-platform mobile apps for iOS and Android using React Native and Flutter.", tag: "iOS \u00B7 Android" },
          { icon: "\u2601\uFE0F", title: "SaaS Products", desc: "End-to-end SaaS platforms with multi-tenancy, subscription billing, dashboards, and analytics.", tag: "Cloud" },
          { icon: "\uD83D\uDD17", title: "API & Integrations", desc: "RESTful APIs, GraphQL, third-party integrations, webhooks, and data pipeline orchestration.", tag: "Backend" },
          { icon: "\u26A1", title: "No-Code / Low-Code", desc: "Rapid prototyping and business automation with Bubble, Retool, and custom low-code platforms.", tag: "Rapid" },
          { icon: "\uD83E\uDD16", title: "AI & Automation", desc: "AI-driven systems, LLM integrations, intelligent workflows, chatbots, and process automation.", tag: "AI/ML" },
          { icon: "\uD83D\uDCD0", title: "System Design & Consulting", desc: "Architecture consulting, tech audits, infrastructure planning, and team augmentation.", tag: "Consulting" },
        ].map((s, i) => (
          <SectionReveal key={i} style={{ transitionDelay: `${i * 0.06}s`, ...(i === 6 ? { gridColumn: "2 / 3" } : {}) }}>
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
