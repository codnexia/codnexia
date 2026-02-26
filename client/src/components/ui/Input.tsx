import { useId } from "react";
import clsx from "clsx";
import type { InputProps } from "../../types";

export function Input({ label, placeholder, value, onChange, type = "text", textarea = false, error }: InputProps) {
  const id = useId();
  const base = clsx(
    "w-full rounded-[10px] bg-surface border text-main text-sm font-sans outline-none transition-[border-color] duration-200 box-border",
    error ? "border-error" : "border-border focus:border-accent/40",
    textarea ? "px-4 py-3 resize-y min-h-25" : "px-4 py-2.75",
  );
  return (
    <div className="mb-4.5">
      {label && <label htmlFor={id} className="text-xs text-secondary block mb-1.5 font-semibold">{label}</label>}
      {textarea ? (
        <textarea id={id} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={base} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      ) : (
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={base} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      )}
      {error && <span id={`${id}-error`} className="text-[11px] text-error mt-1 block" role="alert">{error}</span>}
    </div>
  );
}
