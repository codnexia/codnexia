import { AnimNum } from "../ui/AnimNum";
import { Pill } from "../ui/Pill";
import { Btn } from "../ui/Btn";
import { SectionReveal } from "../ui/SectionReveal";
import { HexGrid } from "../ui/HexGrid";
import { HERO_METRICS } from "../../assets/data";

interface HeroSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
  scrollTo: (id: string) => void;
}

export function HeroSection({ sectionRef, scrollTo }: HeroSectionProps) {
  return (
    <section ref={sectionRef} id="hero" className="px-4 pt-16 pb-14 md:px-10 md:pt-25 md:pb-22.5 text-center relative overflow-hidden">
      <HexGrid />
      <div 
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 md:w-175 md:h-175 blur-[100px] opacity-50 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(30,58,138,0.35) 0%, transparent 60%)" }} 
      />
      <div className="absolute top-[60%] left-[30%] w-50 h-50 md:w-100 md:h-100 blur-[80px] opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(45,212,168,0.22) 0%, transparent 60%)" }} />
      <SectionReveal className="relative z-1">
        <Pill color="#2DD4A8">Global Code &middot; African Excellence</Pill>
        <h1 className="text-[32px] md:text-[48px] lg:text-[64px] font-extrabold text-main leading-[1.05] -tracking-[1.5px] md:-tracking-[2px] lg:-tracking-[3px] mt-6.5 mb-5 mx-auto max-w-185">
          Engineering the<br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #2DD4A8, #4A9FF5)" }}>Next Generation</span> of Software
        </h1>
        <p className="text-[15px] md:text-[17px] text-secondary leading-[1.7] max-w-135 mx-auto mb-10">
          A global software development company built on African excellence. We design, build, and scale impactful technology products for startups and enterprises worldwide.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center">
          <Btn onClick={() => scrollTo("contact")}>Get a Quote &rarr;</Btn>
          <Btn variant="ghost" onClick={() => scrollTo("services")}>Our Services</Btn>
        </div>
        <div className="flex flex-wrap gap-6 md:gap-12 justify-center mt-16">
          {HERO_METRICS.map((m, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-[32px] font-extrabold text-accent -tracking-[1px]"><AnimNum value={m.v} suffix={m.s} /></div>
              <div className="text-xs text-muted mt-1 font-medium">{m.l}</div>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
