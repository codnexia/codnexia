import { useState } from "react";
import type { ViewState } from "./types";
import { clearAuth, isAuthenticated } from "./lib/api";
import { ToastProvider } from "./context/ToastContext";
import { ClientSite } from "./components/client/ClientSite";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminPanel } from "./components/admin/AdminPanel";

// Check if user is on admin route and has a valid token
function getInitialView(): ViewState {
  if (window.location.pathname === "/admin-dashboard") {
    return isAuthenticated() ? "admin" : "login";
  }
  return "client";
}

function navigate(path: string) {
  window.history.pushState(null, "", path);
}

export default function App() {
  const [view, setView] = useState<ViewState>(getInitialView);

  const goToClient = () => { navigate("/"); setView("client"); };
  const goToAdminLogin = () => { clearAuth(); navigate("/admin-dashboard"); setView("login"); };
  // Token is already stored by the login API call, just switch view
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
