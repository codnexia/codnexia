import type { SparklineProps } from "../../types";

export function Sparkline({ data, color = "#2DD4A8", w = 120, h = 36 }: SparklineProps) {
  const max = Math.max(...data), min = Math.min(...data), r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / r) * (h - 4) - 2}`).join(" ");
  const uid = `sp-${color.replace('#', '')}-${w}`;
  return (
    <svg width={w} height={h} className="block">
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.3} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" points={pts} />
      <polygon fill={`url(#${uid})`} points={`0,${h} ${pts} ${w},${h}`} />
    </svg>
  );
}
