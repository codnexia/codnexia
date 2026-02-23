import { Card } from "./ui/Card";
import { HexGrid } from "./ui/HexGrid";

interface LoginPageProps {
  onSelectRole: (role: "client" | "admin") => void;
}

export function LoginPage({ onSelectRole }: LoginPageProps) {
  return (
    <div className="h-full flex items-center justify-center bg-bg relative overflow-hidden">
      <HexGrid />
      <div className="absolute top-[30%] left-[40%] w-125 h-125 blur-[120px] opacity-40" style={{ background: "radial-gradient(circle, rgba(30,58,138,0.35), transparent)" }} />
      <div className="absolute bottom-[20%] right-[30%] w-75 h-75 blur-[80px] opacity-30" style={{ background: "radial-gradient(circle, rgba(45,212,168,0.22), transparent)" }} />

      <div className="relative z-1 text-center">
        <div className="w-16 h-16 rounded-2xl bg-grad inline-flex items-center justify-center text-2xl font-extrabold text-main mb-6 shadow-[0_4px_30px_var(--color-accent-glow)]">{"</>"}</div>
        <h1 className="text-3xl font-bold text-main mb-2 -tracking-[1px]">Welcome to Codnexia</h1>
        <p className="text-sm text-secondary mb-10">Choose how you'd like to continue</p>

        <div className="flex gap-5">
          <button onClick={() => onSelectRole("client")} className="group cursor-pointer bg-transparent border-none p-0">
            <Card hoverable className="p-8! w-60 text-left">
              <div className="text-3xl mb-4">&#x1F310;</div>
              <h3 className="text-base font-bold text-main mb-1.5">Browse Website</h3>
              <p className="text-[13px] text-secondary leading-[1.7] mb-5">Explore our services, process, and get in touch with us.</p>
              <span className="text-sm font-semibold text-accent">Continue &rarr;</span>
            </Card>
          </button>

          <button onClick={() => onSelectRole("admin")} className="group cursor-pointer bg-transparent border-none p-0">
            <Card hoverable className="p-8! w-60 text-left">
              <div className="text-3xl mb-4">&#x1F512;</div>
              <h3 className="text-base font-bold text-main mb-1.5">Admin Panel</h3>
              <p className="text-[13px] text-secondary leading-[1.7] mb-5">Sign in to manage content, media, analytics, and settings.</p>
              <span className="text-sm font-semibold text-accent">Sign In &rarr;</span>
            </Card>
          </button>
        </div>
      </div>
    </div>
  );
}
