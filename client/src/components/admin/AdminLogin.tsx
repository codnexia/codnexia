import { useState } from "react";
import type { AdminLoginProps } from "../../types";
import { useToast } from "../../context/ToastContext";
import { Btn } from "../ui/Btn";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { HexGrid } from "../ui/HexGrid";

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const toast = useToast();
  const [email, setEmail] = useState("admin@codnexia.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (!email || !password) { toast("Please fill in all fields", "warning"); return; }
    setLoading(true);
    setTimeout(() => {
      if (password.length >= 3) {
        toast("Welcome back, Admin!", "success");
        onLogin();
      } else {
        toast("Invalid credentials. Try any password (3+ chars).", "error");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="h-full flex items-center justify-center bg-bg relative overflow-hidden">
      <HexGrid />
      <div className="absolute top-[30%] left-[40%] w-125 h-125 blur-[120px] opacity-40" style={{ background: "radial-gradient(circle, rgba(30,58,138,0.35), transparent)" }} />
      <div className="absolute bottom-[20%] right-[30%] w-75 h-75 blur-[80px] opacity-30" style={{ background: "radial-gradient(circle, rgba(45,212,168,0.22), transparent)" }} />

      <div className="w-full max-w-105 px-4 md:px-0 relative z-1">
        <div className="text-center mb-8">
          <div className="w-13 h-13 rounded-[14px] bg-grad inline-flex items-center justify-center text-xl font-extrabold text-main mb-4 shadow-[0_4px_30px_var(--color-accent-glow)]">{"</>"}</div>
          <h1 className="text-[26px] font-bold text-main mb-1">Welcome Back</h1>
          <p className="text-sm text-secondary">Sign in to Codnexia Admin Panel</p>
        </div>

        <Card className="p-5! md:p-8!">
          <Input label="Email Address" placeholder="admin@codnexia.com" value={email} onChange={setEmail} type="email" />
          <div className="relative">
            <Input label="Password" placeholder="Enter your password" value={password} onChange={setPassword} type={showPass ? "text" : "password"} />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-7.5 bg-none border-none text-muted text-xs cursor-pointer font-sans">
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex justify-between items-center mb-5">
            <label className="flex items-center gap-2 text-[13px] text-secondary cursor-pointer">
              <input type="checkbox" className="accent-accent" /> Remember me
            </label>
            <span className="text-[13px] text-accent cursor-pointer font-semibold">Forgot password?</span>
          </div>

          <Btn onClick={handleLogin} disabled={loading} className="w-full! py-3.5! px-0!">
            {loading ? "Signing in..." : "Sign In \u2192"}
          </Btn>

          <div className="text-center mt-4">
            <span className="text-xs text-muted">Secured with JWT + HTTP-only Cookies</span>
          </div>
        </Card>

        <div className="text-center mt-5">
          <button onClick={onBack} className="bg-none border-none text-secondary text-[13px] cursor-pointer font-sans font-medium">
            &larr; Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}
