import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import type { SectionRevealProps } from "../../types";

export function SectionReveal({ children, className = "", style }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={clsx(
        "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
        vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7.5",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
