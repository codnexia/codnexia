import clsx from "clsx";
import type { InputProps } from "../../types";

export function Input({ label, placeholder, value, onChange, type = "text", textarea = false, error }: InputProps) {
  const base = clsx(
    "w-full rounded-[10px] bg-surface border text-main text-sm font-sans outline-none transition-[border-color] duration-200 box-border",
    error ? "border-error" : "border-border focus:border-accent/40",
    textarea ? "px-4 py-3 resize-y min-h-[100px]" : "px-4 py-[11px]",
  );
  return (
    <div className="mb-[18px]">
      {label && <label className="text-xs text-secondary block mb-1.5 font-semibold">{label}</label>}
      {textarea ? (
        <textarea placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      ) : (
        <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
      {error && <span className="text-[11px] text-error mt-1 block">{error}</span>}
    </div>
  );
}
