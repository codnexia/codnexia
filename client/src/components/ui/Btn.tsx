import clsx from "clsx";
import type { BtnProps } from "../../types";

export function Btn({ children, variant = "primary", onClick, className = "", disabled = false }: BtnProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "px-7 py-3 rounded-[10px] text-sm font-bold font-sans transition-all duration-250",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:-translate-y-px",
        variant === "primary" && [
          "bg-grad text-main border-none",
          !disabled && "shadow-[0_2px_16px_var(--color-accent-glow)] hover:shadow-[0_6px_30px_var(--color-accent-glow)]",
        ],
        variant === "ghost" && "bg-transparent text-main border border-border hover:border-border-light",
        variant === "secondary" && "bg-card text-secondary border border-border",
        className,
      )}
    >
      {children}
    </button>
  );
}
