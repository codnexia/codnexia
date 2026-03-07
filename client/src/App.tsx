import { useState, useEffect, lazy, Suspense } from "react";
import type { ViewState } from "./types";
import { clearAuth, isAuthenticated } from "./lib/api";
import { ToastProvider } from "./context/ToastContext";
import { ClientSite } from "./components/client/ClientSite";

const AdminLogin = lazy(() =>
  import("./components/admin/AdminLogin").then(m => ({ default: m.AdminLogin }))
);
const AdminPanel = lazy(() =>
  import("./components/admin/AdminPanel").then(m => ({ default: m.AdminPanel }))
);
const AdminSignup = lazy(() =>
  import("./components/admin/AdminSignup").then(m => ({ default: m.AdminSignup }))
);

const KNOWN_PATHS = ["/", "/admin-dashboard"];

function getInviteToken(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("invite");
}

function getInitialView(): ViewState {
  const path = window.location.pathname;

  if (path === "/admin-dashboard") {
    if (getInviteToken()) return "signup";
    return isAuthenticated() ? "admin" : "login";
  }

  if (path === "/" || KNOWN_PATHS.includes(path)) {
    return "client";
  }

  // Unknown route — show client (acts as soft 404)
  return "client";
}

function navigate(path: string) {
  window.history.pushState(null, "", path);
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-bg text-secondary text-sm">
      Loading...
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bg text-main text-center px-4">
      <img src="/codnexiafav.png" alt="Codnexia" className="w-13 h-13 mb-6" />
      <h1 className="text-[48px] font-extrabold text-accent mb-2">404</h1>
      <p className="text-lg font-semibold mb-2">Page Not Found</p>
      <p className="text-sm text-secondary mb-8 max-w-80">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
        className="px-6 py-3 rounded-xl border-none bg-grad text-main text-sm font-semibold cursor-pointer font-sans"
      >
        Back to Home
      </button>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<ViewState>(getInitialView);
  const [is404, setIs404] = useState(() => {
    const path = window.location.pathname;
    return path !== "/" && !KNOWN_PATHS.includes(path);
  });

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (KNOWN_PATHS.includes(path)) {
        setIs404(false);
        if (path === "/admin-dashboard") {
          if (getInviteToken()) setView("signup");
          else setView(isAuthenticated() ? "admin" : "login");
        } else {
          setView("client");
        }
      } else {
        setIs404(true);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const goToClient = () => { navigate("/"); setView("client"); };
  const goToAdminLogin = () => { clearAuth(); navigate("/admin-dashboard"); setView("login"); };
  const goToAdmin = () => { setView("admin"); };
  const goToLoginFromSignup = () => { navigate("/admin-dashboard"); setView("login"); };

  if (is404) {
    return (
      <ToastProvider>
        <NotFound />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="font-sans w-full h-screen flex flex-col bg-bg text-main overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {view === "client" && <ClientSite />}
          <Suspense fallback={<LoadingFallback />}>
            {view === "login" && <AdminLogin onLogin={goToAdmin} onBack={goToClient} />}
            {view === "signup" && (
              <AdminSignup
                onSuccess={goToLoginFromSignup}
                onBack={goToLoginFromSignup}
                inviteToken={getInviteToken() || ""}
              />
            )}
            {view === "admin" && <AdminPanel onLogout={goToAdminLogin} onBack={goToClient} />}
          </Suspense>
        </div>
      </div>
    </ToastProvider>
  );
}
