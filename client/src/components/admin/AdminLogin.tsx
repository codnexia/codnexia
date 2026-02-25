import { useState } from "react";
import type { AdminLoginProps } from "../../types";
import { login } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Btn } from "../ui/Btn";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { HexGrid } from "../ui/HexGrid";

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Fixed admin email — only one admin account
  const adminEmail = "admin@codnexia.com";

  const handleLogin = async () => {
    if (!password) {
      toast("Please enter your password", "warning");
      return;
    }
    setLoading(true);
    try {
      const data = await login(adminEmail, password);
      toast(`Welcome back, ${data.user.name}!`, "success");
      onLogin();
    } catch (err: any) {
      toast(err.message || "Invalid credentials", "error");
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-bg relative overflow-hidden">
      <HexGrid />

      {/* Gradient blobs */}
      <div
        className="absolute top-[30%] left-[40%] w-60 h-60 md:w-125 md:h-125 blur-[120px] opacity-40"
        style={{ background: "radial-gradient(circle, rgba(30,58,138,0.35), transparent)" }}
      />
      <div
        className="absolute bottom-[20%] right-[30%] w-40 h-40 md:w-75 md:h-75 blur-[80px] opacity-30"
        style={{ background: "radial-gradient(circle, rgba(45,212,168,0.22), transparent)" }}
      />

      <div className="w-full max-w-105 px-4 md:px-0 relative z-1">
        {/* Logo & heading */}
        <div className="text-center mb-8">
          <div className="w-13 h-13 rounded-[14px] bg-grad inline-flex items-center justify-center text-xl font-extrabold text-main mb-4 shadow-[0_4px_30px_var(--color-accent-glow)]">
            {"</>"}
          </div>
          <h1 className="text-[26px] font-bold text-main mb-1">Welcome Back</h1>
          <p className="text-sm text-secondary">Sign in to Codnexia Admin Panel</p>
        </div>

        {/* Login form */}
        <Card className="p-5! md:p-8!">
          {/* Email is fixed — display only */}
          <div className="mb-4.5">
            <label className="text-xs text-secondary block mb-1.5 font-semibold">Email Address</label>
            <div className="px-4 py-2.75 rounded-[10px] bg-surface border border-border text-main text-sm">
              {adminEmail}
            </div>
          </div>

          <div className="relative">
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              type={showPass ? "text" : "password"}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-7.5 bg-none border-none text-muted text-xs cursor-pointer font-sans"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex justify-between items-center mb-5">
            <label className="flex items-center gap-2 text-[13px] text-secondary cursor-pointer">
              <input type="checkbox" className="accent-accent" /> Remember me
            </label>
            <span className="text-[13px] text-accent cursor-pointer font-semibold">
              Forgot password?
            </span>
          </div>

          <Btn onClick={handleLogin} disabled={loading} className="w-full! py-3.5! px-0!">
            {loading ? "Signing in..." : "Sign In \u2192"}
          </Btn>

          <div className="text-center mt-4">
            <span className="text-xs text-muted">Secured with JWT + HTTP-only Cookies</span>
          </div>
        </Card>

        {/* Back link */}
        <div className="text-center mt-5">
          <button
            onClick={onBack}
            className="bg-none border-none text-secondary text-[13px] cursor-pointer font-sans font-medium"
          >
            &larr; Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}
