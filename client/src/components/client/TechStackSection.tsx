import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";
import { Pill } from "../ui/Pill";
import { TECH_CATEGORIES, AUTOMATION_ITEMS, AI_ITEMS, WHY_THIS_STACK } from "../../assets/data";

interface TechStackSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

/* ── TechCategory: items layout (grouped tools by area) ── */
function TechCategoryItems({ icon, title, subtitle, description, color, items }: {
  icon: string; title: string; subtitle: string; description: string; color: string;
  items: { area: string; tools: { name: string; desc: string; icon: string }[] }[];
}) {
  return (
    <div
      className="bg-card border border-border rounded-[18px] p-8 mb-5 relative overflow-hidden"
    >
      {/* Glow */}
      <div
        className="absolute -top-7.5 -right-7.5 w-30 h-30 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}12, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-center gap-3.5 mb-1.5 relative z-1">
        <div
          className="w-10.5 h-10.5 rounded-xl flex items-center justify-center text-xl"
          style={{ background: color + "18", border: `1px solid ${color}28` }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-[19px] font-extrabold text-main -tracking-[0.5px]">{title}</h3>
          <span className="text-xs font-semibold" style={{ color }}>{subtitle}</span>
        </div>
      </div>

      <p className="text-[13px] text-secondary leading-relaxed mb-5.5 max-w-[560px] relative z-1">
        {description}
      </p>

      {/* Tool groups */}
      <div className="flex gap-3 flex-wrap relative z-1">
        {items.map((group) => (
          <div key={group.area} className="flex-1 min-w-[180px]">
            <div
              className="text-[11px] font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
              style={{ color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              {group.area}
            </div>
            <div className="flex flex-col gap-2">
              {group.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-3 py-2.5 px-3.5 rounded-[10px] bg-surface border border-border transition-all duration-200 cursor-default hover:translate-x-1"
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color + "44"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = ""; }}
                >
                  <span className="text-lg w-6 text-center shrink-0">{tool.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-main">{tool.name}</div>
                    <div className="text-[11px] text-muted">{tool.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TechCategory: capabilities layout (2-column grid) ── */
function TechCategoryCapabilities({ icon, title, subtitle, description, color, capabilities }: {
  icon: string; title: string; subtitle: string; description: string; color: string;
  capabilities: { name: string; desc: string }[];
}) {
  return (
    <div
      className="bg-card border border-border rounded-[18px] p-8 mb-5 relative overflow-hidden"
    >
      <div
        className="absolute -top-7.5 -right-7.5 w-30 h-30 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}12, transparent)` }}
      />

      <div className="flex items-center gap-3.5 mb-1.5 relative z-1">
        <div
          className="w-10.5 h-10.5 rounded-xl flex items-center justify-center text-xl"
          style={{ background: color + "18", border: `1px solid ${color}28` }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-[19px] font-extrabold text-main -tracking-[0.5px]">{title}</h3>
          <span className="text-xs font-semibold" style={{ color }}>{subtitle}</span>
        </div>
      </div>

      <p className="text-[13px] text-secondary leading-relaxed mb-5.5 max-w-[560px] relative z-1">
        {description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-1">
        {capabilities.map((cap) => (
          <div
            key={cap.name}
            className="p-4 rounded-xl bg-surface border border-border transition-all duration-200 cursor-default"
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color + "44"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = ""; }}
          >
            <div className="text-sm font-bold text-main mb-1">{cap.name}</div>
            <div className="text-xs text-secondary leading-relaxed">{cap.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── AI & Automation: special highlighted section ── */
function AiAutomationSection() {
  return (
    <div className="bg-card border border-border rounded-[18px] overflow-hidden mb-5 relative">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(45,212,168,0.25), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(74,159,245,0.19), transparent 60%)",
        }}
      />

      {/* Header */}
      <div className="p-8 pb-0 relative z-1">
        <div className="flex items-center gap-3.5 mb-1.5">
          <div className="w-11 h-11 rounded-xl bg-grad flex items-center justify-center text-[22px]">
            🤖
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-main -tracking-[0.5px]">Automation & AI</h3>
            <span className="text-xs font-semibold text-accent">THIS IS OUR ADVANTAGE</span>
          </div>
          <div className="ml-auto">
            <Pill color="#2DD4A8">Differentiator</Pill>
          </div>
        </div>
        <p className="text-sm text-secondary leading-relaxed mb-6 max-w-[560px]">
          This is where Codnexia stands out globally. We design, build, and deploy intelligent systems that automate workflows and augment decision-making.
        </p>
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 relative z-1">
        {/* Automation column */}
        <div className="p-6 pt-6 border-t border-border sm:border-r">
          <div className="text-[13px] font-bold text-accent mb-4 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Automation
          </div>
          {AUTOMATION_ITEMS.map((item) => (
            <div key={item.name} className="mb-4 last:mb-0">
              <div className="text-sm font-bold text-main mb-0.5">{item.name}</div>
              <div className="text-xs text-secondary leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* AI column */}
        <div className="p-6 pt-6 border-t border-border">
          <div className="text-[13px] font-bold text-info mb-4 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-info" />
            AI Integration
          </div>
          {AI_ITEMS.map((item) => (
            <div key={item.name} className="mb-4 last:mb-0">
              <div className="text-sm font-bold text-main mb-0.5">{item.name}</div>
              <div className="text-xs text-secondary leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export function TechStackSection({ sectionRef }: TechStackSectionProps) {
  return (
    <section
      ref={sectionRef}
      id="tech"
      className="px-4 py-14 md:px-10 md:py-22.5 max-w-250 mx-auto"
    >
      {/* Section header */}
      <SectionReveal>
        <Pill color="#4A9FF5">Technology</Pill>
        <h2 className="text-[28px] md:text-[40px] font-bold text-main mt-4 mb-3 -tracking-[1.5px]">
          Our Technology Stack
        </h2>
        <p className="text-secondary text-sm md:text-base mb-13 max-w-[620px] leading-relaxed">
          We use a focused, modern, and AI-ready stack — engineered for performance, scalability, and rapid delivery.
        </p>
      </SectionReveal>

      {/* Tech categories */}
      {TECH_CATEGORIES.map((cat, i) => (
        <SectionReveal key={cat.title} style={{ transitionDelay: `${i * 0.08}s` }}>
          {cat.type === "capabilities" && "capabilities" in cat ? (
            <TechCategoryCapabilities
              icon={cat.icon}
              title={cat.title}
              subtitle={cat.subtitle}
              description={cat.description}
              color={cat.color}
              capabilities={cat.capabilities}
            />
          ) : cat.type === "items" && "items" in cat ? (
            <TechCategoryItems
              icon={cat.icon}
              title={cat.title}
              subtitle={cat.subtitle}
              description={cat.description}
              color={cat.color}
              items={cat.items}
            />
          ) : null}
        </SectionReveal>
      ))}

      {/* AI & Automation special section */}
      <SectionReveal style={{ transitionDelay: "0.2s" }}>
        <AiAutomationSection />
      </SectionReveal>

      {/* Why This Stack */}
      <SectionReveal style={{ transitionDelay: "0.24s" }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {WHY_THIS_STACK.map((item) => (
            <Card key={item.title} hoverable className="p-5.5 text-center">
              <div className="text-[28px] mb-3">{item.icon}</div>
              <div className="text-sm font-bold text-main mb-1.5">{item.title}</div>
              <div className="text-xs text-secondary leading-relaxed">{item.desc}</div>
            </Card>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
