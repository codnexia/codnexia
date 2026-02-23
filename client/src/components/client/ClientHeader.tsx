import clsx from "clsx";
import { SECTIONS } from "../../constants";
import { Btn } from "../ui/Btn";

interface ClientHeaderProps {
  headerOpacity: number;
  activeSection: string;
  scrollTo: (id: string) => void;
  onSwitchToAdmin: () => void;
}

export function ClientHeader({ headerOpacity, activeSection, scrollTo, onSwitchToAdmin }: ClientHeaderProps) {
  return (
    <header
      className="sticky top-0 z-100 px-10 h-16 flex items-center justify-between transition-[border-color] duration-300"
      style={{
        background: `rgba(6,11,24,${headerOpacity})`,
        backdropFilter: headerOpacity > 0.1 ? "blur(24px) saturate(1.2)" : "none",
        borderBottom: `1px solid ${headerOpacity > 0.3 ? "#162040" : "transparent"}`,
      }}
    >
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo("hero")}>
        <div className="w-8.5 h-8.5 rounded-lg bg-grad flex items-center justify-center text-[13px] font-extrabold text-main shadow-[0_0_20px_var(--color-primary-glow)]">{"</>"}</div>
        <span className="text-[17px] font-bold text-main -tracking-[0.5px]">
          Codnexia<span className="text-accent font-normal ml-1">Software</span>
        </span>
      </div>

      <nav className="flex gap-1.5">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)} className={clsx(
            "px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-all duration-250 font-sans",
            activeSection === s.id ? "bg-accent-dim text-accent" : "bg-transparent text-secondary",
          )}>{s.label}</button>
        ))}
      </nav>

      <div className="flex gap-2.5 items-center">
        <button onClick={onSwitchToAdmin} className="px-3.5 py-1.75 rounded-lg bg-transparent border border-border text-secondary text-xs font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-border-light">
          Admin
        </button>
        <Btn onClick={() => scrollTo("contact")} className="!px-5 !py-2 !text-[13px]">Start a Project</Btn>
      </div>
    </header>
  );
}
