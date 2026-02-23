import { useState, useEffect } from "react";
import clsx from "clsx";
import type { AdminPanelProps } from "../../types";
import { useToast } from "../../context/ToastContext";
import { AdminDashboard } from "./AdminDashboard";
import { AdminContent } from "./AdminContent";
import { AdminMedia } from "./AdminMedia";
import { AdminVisitors } from "./AdminVisitors";
import { AdminSettings } from "./AdminSettings";

export function AdminPanel({ onLogout, onBack }: AdminPanelProps) {
  const toast = useToast();
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const tabs = [
    { id: "dashboard", icon: "\u25D0", label: "Dashboard" },
    { id: "content", icon: "\u270E", label: "Content" },
    { id: "media", icon: "\u25C8", label: "Media" },
    { id: "visitors", icon: "\u25C9", label: "Visitors" },
    { id: "settings", icon: "\u2699", label: "Settings" },
  ];

  return (
    <div className="flex h-full bg-bg">
      {/* Sidebar */}
      <aside
        className="bg-surface border-r border-border flex flex-col transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)] overflow-hidden shrink-0"
        style={{ width: collapsed ? 68 : 240 }}
      >
        <div className={clsx("flex items-center gap-2.5 border-b border-border h-16 box-border", collapsed ? "px-4.5 py-5" : "p-5")}>
          <div className="w-8 h-8 rounded-lg shrink-0 bg-grad flex items-center justify-center text-[11px] font-extrabold text-main">{"</>"}</div>
          {!collapsed && <span className="text-sm font-bold text-main whitespace-nowrap">Codnexia <span className="text-accent font-normal">Admin</span></span>}
        </div>

        <nav className="px-2 py-3 flex-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={clsx(
              "w-full flex items-center gap-3 rounded-[10px] border-none cursor-pointer text-[13px] font-semibold mb-0.5 transition-all duration-200 font-sans border-l-2",
              collapsed ? "py-2.75 px-0 justify-center" : "py-2.75 px-3.5 justify-start",
              tab === t.id ? "bg-accent-dim text-accent border-l-accent" : "bg-transparent text-secondary border-l-transparent",
            )}>
              <span className="text-[17px] w-5.5 text-center">{t.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{t.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <button onClick={onBack} className="w-full py-2.25 px-3 rounded-lg bg-transparent border border-border text-secondary text-xs cursor-pointer font-sans mb-1 flex items-center justify-center gap-1.5">
            {collapsed ? "\u2190" : "\u2190 Back to Site"}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full py-2.25 px-3 rounded-lg bg-card border border-border text-muted text-xs cursor-pointer flex items-center justify-center font-sans">
            {collapsed ? "\u2192" : "Collapse \u2190"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-border bg-surface shrink-0">
          <h1 className="text-lg font-bold text-main m-0 -tracking-[0.5px]">
            {tabs.find(t => t.id === tab)?.label}
          </h1>
          <div className="flex items-center gap-3.5">
            <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs flex items-center gap-1.5">
              <span className="text-accent text-[8px] animate-pulse-dot">{"\u25CF"}</span>
              <span className="text-secondary">3 live</span>
            </div>
            <button onClick={() => toast("No new notifications", "info")} className="w-9 h-9 rounded-[10px] bg-card border border-border flex items-center justify-center cursor-pointer text-base text-secondary">
              {"\uD83D\uDD14"}
            </button>
            <div onClick={() => { if (window.confirm("Log out?")) { toast("Logged out", "info"); onLogout(); } }} className="w-9 h-9 rounded-[10px] bg-grad flex items-center justify-center text-sm font-bold text-main cursor-pointer">
              C
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          {tab === "dashboard" && <AdminDashboard />}
          {tab === "content" && <AdminContent />}
          {tab === "media" && <AdminMedia />}
          {tab === "visitors" && <AdminVisitors />}
          {tab === "settings" && <AdminSettings onLogout={onLogout} />}
        </div>
      </main>
    </div>
  );
}
