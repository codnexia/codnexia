import { useState } from "react";
import type { ViewState } from "./types";
import { ToastProvider } from "./context/ToastContext";
import { ClientSite } from "./components/client/ClientSite";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminPanel } from "./components/admin/AdminPanel";

function getInitialView(): ViewState {
  return window.location.pathname === "/admin-dashboard" ? "login" : "client";
}

function navigate(path: string) {
  window.history.pushState(null, "", path);
}

export default function App() {
  const [view, setView] = useState<ViewState>(getInitialView);

  const goToClient = () => { navigate("/"); setView("client"); };
  const goToAdminLogin = () => { navigate("/admin-dashboard"); setView("login"); };
  const goToAdmin = () => { setView("admin"); };

  return (
    <ToastProvider>
      <div className="font-sans w-full h-screen flex flex-col bg-bg text-main overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {view === "client" && <ClientSite />}
          {view === "login" && <AdminLogin onLogin={goToAdmin} onBack={goToClient} />}
          {view === "admin" && <AdminPanel onLogout={goToAdminLogin} onBack={goToClient} />}
        </div>
      </div>
    </ToastProvider>
  );
}
