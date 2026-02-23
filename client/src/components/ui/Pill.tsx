import type { PillProps } from "../../types";

export function Pill({ children, color }: PillProps) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-[20px] text-[11px] font-semibold tracking-[0.6px] uppercase border"
      style={{
        background: color ? `${color}18` : undefined,
        color: color || undefined,
        borderColor: color ? `${color}30` : undefined,
      }}
    >
      {children}
    </span>
  );
}
