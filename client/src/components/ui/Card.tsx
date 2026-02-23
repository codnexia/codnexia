import clsx from "clsx";
import type { CardProps } from "../../types";

export function Card({ children, className = "", hoverable = false }: CardProps) {
  return (
    <div className={clsx(
      "bg-card border border-border rounded-[14px] p-4 md:p-6 transition-all duration-300",
      hoverable && "hover:border-accent/27 hover:-translate-y-1 cursor-default",
      className,
    )}>
      {children}
    </div>
  );
}
