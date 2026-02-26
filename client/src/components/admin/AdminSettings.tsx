import { useState, useEffect } from "react";
import clsx from "clsx";
import type { AdminSettingsProps, AdminProfile } from "../../types";
import { getProfile, updateProfile } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Btn } from "../ui/Btn";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { SECURITY_SETTINGS } from "../../assets/data";

export function AdminSettings({ onLogout }: AdminSettingsProps) {
  const toast = useToast();
  const [profile, setProfile] = useState<AdminProfile>({ name: "", email: "", role: "Admin" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the current admin profile from the backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({ name: data.name, email: data.email, role: "Admin" });
      } catch {
        toast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Save profile changes to the backend
  const save = async () => {
    try {
      const updated = await updateProfile({ name: profile.name, email: profile.email });
      setProfile({ name: updated.name, email: updated.email, role: "Admin" });
      setSaved(true);
      toast("Profile saved successfully!", "success");
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast((err as Error).message || "Failed to save profile", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60 text-secondary text-sm">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-155">
      {/* Profile card */}
      <Card className="p-5! md:p-8! mb-4">
        <h3 className="text-base font-bold text-main mb-6">Admin Profile</h3>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-7">
          <div className="w-15 h-15 rounded-2xl bg-grad flex items-center justify-center text-2xl font-bold text-main shrink-0">
            {profile.name.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="text-center sm:text-left">
            <div className="text-[17px] font-bold text-main">{profile.name}</div>
            <div className="text-[13px] text-secondary">
              {profile.email} &middot; {profile.role}
            </div>
          </div>
        </div>

        <Input
          label="Full Name"
          value={profile.name}
          onChange={v => setProfile({ ...profile, name: v })}
        />
        <Input
          label="Email Address"
          value={profile.email}
          onChange={v => setProfile({ ...profile, email: v })}
          type="email"
        />

        <div className="mb-4.5">
          <label id="role-label" className="text-xs text-secondary block mb-1.5 font-semibold">Role</label>
          <div className="px-4 py-2.75 rounded-[10px] bg-surface border border-border text-muted text-sm" aria-labelledby="role-label">
            {profile.role} <span className="text-[11px] opacity-50">(managed by system)</span>
          </div>
        </div>

        <Btn onClick={save} className="py-2.75! px-7!">
          {saved ? "\u2713 Saved!" : "Save Changes"}
        </Btn>
      </Card>

      {/* Security card */}
      <Card className="p-5! md:p-8! mb-4">
        <h3 className="text-base font-bold text-main mb-5">Security</h3>
        {SECURITY_SETTINGS.map((s, i) => (
          <div
            key={i}
            className={clsx(
              "flex justify-between items-center py-3.5",
              i < 3 && "border-b border-border",
            )}
          >
            <div>
              <div className="text-[13px] text-main font-semibold">{s.label}</div>
              <div className="text-[11px] text-muted mt-0.5">{s.desc}</div>
            </div>
            <span
              className={clsx(
                "text-[13px] font-semibold font-mono",
                s.value === "Disabled" ? "text-warning" : "text-accent",
              )}
            >
              {s.value}
            </span>
          </div>
        ))}
      </Card>

      {/* Danger zone */}
      <Card className="p-5! md:p-8! border-error/20!">
        <h3 className="text-base font-bold text-error mb-2">Danger Zone</h3>
        <p className="text-[13px] text-secondary mb-4">
          Irreversible actions that affect your account.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Btn
            variant="secondary"
            onClick={onLogout}
            className="border-error/27! text-error!"
          >
            Log Out
          </Btn>
          <Btn
            variant="secondary"
            onClick={() => toast("This would delete the account", "warning")}
            className="border-error/13! text-muted!"
          >
            Delete Account
          </Btn>
        </div>
      </Card>
    </div>
  );
}
