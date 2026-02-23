import { useState } from "react";
import type { ViewState } from "./types";
import { ToastProvider } from "./context/ToastContext";
import { LoginPage } from "./components/LoginPage";
import { ClientSite } from "./components/client/ClientSite";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminPanel } from "./components/admin/AdminPanel";

export default function App() {
  const [view, setView] = useState<ViewState>("landing");

  return (
    <ToastProvider>
      <div className="font-sans w-full h-screen flex flex-col bg-bg text-main overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {view === "landing" && <LoginPage onSelectRole={(role) => setView(role === "client" ? "client" : "login")} />}
          {view === "client" && <ClientSite />}
          {view === "login" && <AdminLogin onLogin={() => setView("admin")} onBack={() => setView("landing")} />}
          {view === "admin" && <AdminPanel onLogout={() => setView("login")} onBack={() => setView("landing")} />}
        </div>
      </div>
    </ToastProvider>
  );
}
