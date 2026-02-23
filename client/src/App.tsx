import { useState } from "react";
import clsx from "clsx";
import type { ViewState } from "./types";
import { ToastProvider } from "./context/ToastContext";
import { ClientSite } from "./components/client/ClientSite";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminPanel } from "./components/admin/AdminPanel";

export default function App() {
  const [view, setView] = useState<ViewState>("client");

  return (
    <ToastProvider>
      <div className="font-sans w-full h-screen flex flex-col bg-bg text-main overflow-hidden">

        {view !== "login" && (
          <div className="flex items-center justify-center gap-1 py-3 border-b border-border bg-surface shrink-0">
            <div className="w-5 h-5 rounded-[5px] mr-2 bg-grad flex items-center justify-center text-[7px] font-extrabold text-main">{"</>"}</div>
            <span className="text-[11px] text-muted mr-3 font-semibold tracking-[0.8px]">CODNEXIA</span>
            {(["client", "admin"] as const).map(v => {
              const isActive = v === view;
              return (
                <button key={v} onClick={() => setView(v === "admin" ? (view === "admin" ? "admin" : "login") : v)} className={clsx(
                  "px-5.5 py-1.75 rounded-lg border-none text-xs font-bold cursor-pointer capitalize transition-all duration-250 font-sans",
                  isActive
                    ? "bg-grad text-main shadow-[0_2px_12px_var(--color-accent-glow)]"
                    : "bg-card text-secondary",
                )}>{v === "client" ? "Client Site" : "Admin Panel"}</button>
              );
            })}
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {view === "client" && <ClientSite onSwitchToAdmin={() => setView("login")} />}
          {view === "login" && <AdminLogin onLogin={() => setView("admin")} onBack={() => setView("client")} />}
          {view === "admin" && <AdminPanel onLogout={() => setView("login")} onBack={() => setView("client")} />}
        </div>
      </div>
    </ToastProvider>
  );
}
