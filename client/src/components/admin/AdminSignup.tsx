import { useState } from "react";
import type { AdminSignupProps } from "../../types";
import { register } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Btn } from "../ui/Btn";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { HexGrid } from "../ui/HexGrid";

export function AdminSignup({ onSuccess, onBack, inviteToken }: AdminSignupProps) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) { toast("Please enter your name", "warning"); return; }
    if (!email.trim()) { toast("Please enter your email", "warning"); return; }
    if (password.length < 8) { toast("Password must be at least 8 characters", "warning"); return; }
    if (password !== confirmPassword) { toast("Passwords do not match", "warning"); return; }

    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, inviteToken });
      toast("Account created! Please sign in.", "success");
      onSuccess();
    } catch (err) {
      toast((err as Error).message || "Registration failed", "error");
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-bg relative overflow-hidden">
      <HexGrid />

      <div
        className="absolute top-[30%] left-[40%] w-60 h-60 md:w-125 md:h-125 blur-[120px] opacity-40"
        style={{ background: "radial-gradient(circle, rgba(30,58,138,0.35), transparent)" }}
      />
      <div
        className="absolute bottom-[20%] right-[30%] w-40 h-40 md:w-75 md:h-75 blur-[80px] opacity-30"
        style={{ background: "radial-gradient(circle, rgba(45,212,168,0.22), transparent)" }}
      />

      <div className="w-full max-w-105 px-4 md:px-0 relative z-1">
        <div className="text-center mb-8">
          <img src="/codnexiafav.png" alt="Codnexia" className="w-13 h-13 mb-4 mx-auto" />
          <h1 className="text-[26px] font-bold text-main mb-1">Create Account</h1>
          <p className="text-sm text-secondary">You've been invited to join Codnexia Admin</p>
        </div>

        <Card className="p-5! md:p-8!">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={setName}
          />
          <Input
            label="Email Address"
            placeholder="admin@example.com"
            value={email}
            onChange={setEmail}
            type="email"
          />

          <div className="relative">
            <Input
              label="Password"
              placeholder="At least 8 characters"
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

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            type={showPass ? "text" : "password"}
          />

          <Btn onClick={handleRegister} disabled={loading} className="w-full! py-3.5! px-0!">
            {loading ? "Creating account..." : "Create Account"}
          </Btn>

          <div className="text-center mt-4">
            <span className="text-xs text-muted">Invite-only registration</span>
          </div>
        </Card>

        <div className="text-center mt-5">
          <button
            onClick={onBack}
            className="bg-none border-none text-secondary text-[13px] cursor-pointer font-sans font-medium"
          >
            &larr; Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
