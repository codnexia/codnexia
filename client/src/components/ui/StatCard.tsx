import { useState, useEffect } from "react";
import clsx from "clsx";
import type { StatCardProps } from "../../types";
import { AnimNum } from "./AnimNum";
import { Sparkline } from "./Sparkline";

export function StatCard({ label, value, change, spark, icon, delay = 0, suffix = "", prefix = "" }: StatCardProps) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={clsx(
      "bg-card border border-border rounded-[14px] px-5.5 py-5 relative overflow-hidden transition-all duration-600 ease-[cubic-bezier(.22,1,.36,1)]",
      vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3.5",
    )}>
      <div className="absolute -top-1.5 right-1.5 opacity-[0.04] text-[48px] md:text-[72px] leading-none">{icon}</div>
      <div className="text-xs text-secondary mb-2 font-medium">{label}</div>
      <div className="text-[28px] font-bold text-main tracking-tight"><AnimNum value={value} suffix={suffix} prefix={prefix} /></div>
      <div className="flex items-center justify-between mt-2.5">
        {change != null && <span className={clsx("text-xs font-semibold", change >= 0 ? "text-accent" : "text-error")}>{change >= 0 ? "\u2191" : "\u2193"} {Math.abs(change)}%</span>}
        {spark && <Sparkline data={spark} />}
      </div>
    </div>
  );
}
