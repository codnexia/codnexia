import { useState, useEffect } from "react";
import type { BarChartProps } from "../../types";

export function BarChart({ data, labels, color = "#2DD4A8" }: BarChartProps) {
  const max = Math.max(...data);
  const [anim, setAnim] = useState(false);
  useEffect(() => { setTimeout(() => setAnim(true), 100); }, []);
  return (
    <div className="flex items-end gap-2 h-[100px]">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div className="text-[10px] text-secondary mb-1 font-semibold">{v}</div>
          <div
            className="w-full max-w-8 rounded-t-[6px] transition-[height] duration-800 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{
              height: anim ? `${(v / max) * 64}px` : "0px",
              background: `linear-gradient(180deg, ${color}, #2B4FAF)`,
              transitionDelay: `${i * 0.06}s`,
            }}
          />
          <span className="text-[10px] text-muted mt-1.5 font-medium">{labels?.[i]}</span>
        </div>
      ))}
    </div>
  );
}
