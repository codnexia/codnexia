import { Pill } from "../ui/Pill";
import { HexGrid } from "../ui/HexGrid";
import { SectionReveal } from "../ui/SectionReveal";

interface CareersSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
  onOpenCareers: () => void;
}

export function CareersSection({ sectionRef, onOpenCareers }: CareersSectionProps) {
  return (
    <section ref={sectionRef} id="careers" className="py-16 md:py-22 px-4 md:px-10 max-w-250 mx-auto">
      <SectionReveal>
        <div className="bg-card border border-border rounded-2xl p-8 md:p-14 relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <HexGrid />
          <div className="absolute -top-15 -right-15 w-60 h-60 bg-[radial-gradient(circle,rgba(74,159,245,0.13),transparent)] blur-[60px]" />
          <div className="absolute -bottom-10 -left-10 w-45 h-45 bg-[radial-gradient(circle,rgba(45,212,168,0.22),transparent)] blur-[50px]" />

          <div className="relative z-1">
            <Pill color="#4A9FF5">We're Hiring</Pill>
            <h2 className="text-2xl md:text-[34px] font-bold text-main mt-3.5 mb-3 -tracking-[1px] leading-tight">
              Join the <span className="text-accent">Codnexia</span> Team
            </h2>
            <p className="text-[15px] text-secondary leading-[1.7] mb-6">
              We're looking for talented engineers, designers, and problem-solvers who share our passion
              for building world-class software from Africa.
            </p>
          </div>

          <div className="relative z-1">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "\uD83C\uDF0D", title: "Remote-First", desc: "Work from anywhere in the world" },
                { icon: "\uD83D\uDCC8", title: "Career Growth", desc: "Clear paths for advancement" },
                { icon: "\uD83E\uDD1D", title: "Great Culture", desc: "Collaborative, diverse team" },
                { icon: "\uD83D\uDCA1", title: "Innovation", desc: "Work on cutting-edge projects" },
              ].map((p, i) => (
                <div key={i} className="p-3.5 md:p-4 rounded-xl bg-surface border border-border">
                  <div className="text-[22px] mb-2">{p.icon}</div>
                  <div className="text-[13px] font-bold text-main mb-0.5">{p.title}</div>
                  <div className="text-[11px] text-muted leading-[1.5]">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
