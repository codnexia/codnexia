import { SectionReveal } from "../ui/SectionReveal";
import { Btn } from "../ui/Btn";
import { HexGrid } from "../ui/HexGrid";

interface FinalCtaSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
  scrollTo: (id: string) => void;
}

export function FinalCtaSection({ sectionRef, scrollTo }: FinalCtaSectionProps) {
  return (
    <section
      ref={sectionRef}
      id="cta"
      className="px-4 py-14 md:px-10 md:py-22.5 text-center relative overflow-hidden"
    >
      <HexGrid />
      <SectionReveal className="relative z-1">
        <h2 className="text-[28px] md:text-[40px] font-bold text-main mb-4 -tracking-[1.5px]">
          Ready to Build Something{" "}
          <span className="text-accent">Scalable</span>?
        </h2>
        <p className="text-base text-secondary leading-[1.8] max-w-135 mx-auto mb-8">
          Let's turn your idea into a production-ready system. Talk to our engineering team today.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center">
          <Btn onClick={() => scrollTo("contact")}>Start Your Project &rarr;</Btn>
          <Btn variant="ghost" onClick={() => scrollTo("contact")}>Contact Us</Btn>
        </div>
      </SectionReveal>
    </section>
  );
}
