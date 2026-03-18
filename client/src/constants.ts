import type { ToastType } from "./types";

export const SECTIONS = [
  { id: "hero", label: "Home", nav: false },
  { id: "about", label: "About", nav: true },
  { id: "how", label: "Process", nav: true },
  { id: "services", label: "Services", nav: true },
  { id: "portfolio", label: "Portfolio", nav: true },
  { id: "careers", label: "Careers", nav: true },
  { id: "contact", label: "Contact", nav: true },
];

export const TOAST_BORDER: Record<ToastType, string> = {
  success: "border-accent/27",
  error: "border-error/27",
  info: "border-info/27",
  warning: "border-warning/27",
};

export const TOAST_SHADOW: Record<ToastType, string> = {
  success: "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(45,212,168,0.13)]",
  error: "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(232,72,85,0.13)]",
  info: "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(74,159,245,0.13)]",
  warning: "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(245,166,35,0.13)]",
};

export const TOAST_DOT: Record<ToastType, string> = {
  success: "bg-accent",
  error: "bg-error",
  info: "bg-info",
  warning: "bg-warning",
};
