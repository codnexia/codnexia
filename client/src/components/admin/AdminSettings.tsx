import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import type { AdminSettingsProps, AdminProfile, InviteTokenResponse } from "../../types";
import { getProfile, updateProfile, generateInvite, getInvites } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { AdminLoadingState } from "../ui/AdminLoadingState";
import { SECURITY_SETTINGS } from "../../assets/data";

export function AdminSettings({ onLogout }: AdminSettingsProps) {
  const toast = useToast();
  const [profile, setProfile] = useState<AdminProfile>({ name: "", email: "", role: "Admin" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [invites, setInvites] = useState<InviteTokenResponse[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    return () => { clearTimeout(savedTimerRef.current); };
  }, []);

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

  // Fetch invite tokens on mount
  useEffect(() => {
    getInvites(1, 10)
      .then(res => setInvites(res.data))
      .catch(() => {});
  }, []);

  const handleGenerateInvite = async () => {
    setInviteLoading(true);
    try {
      await generateInvite();
      toast("Invite token generated!", "success");
      const res = await getInvites(1, 10);
      setInvites(res.data);
    } catch (err) {
      toast((err as Error).message || "Failed to generate invite", "error");
    } finally {
      setInviteLoading(false);
    }
  };

  const copyInviteUrl = (token: string) => {
    const url = `${window.location.origin}/admin-dashboard?invite=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    toast("Invite URL copied!", "success");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getTokenStatus = (t: InviteTokenResponse): { label: string; color: string } => {
    if (t.used) return { label: "Used", color: "text-muted" };
    if (new Date(t.expiresAt) < new Date()) return { label: "Expired", color: "text-warning" };
    return { label: "Active", color: "text-accent" };
  };

  // Save profile changes to the backend
  const save = async () => {
    try {
      const updated = await updateProfile({ name: profile.name, email: profile.email });
      setProfile({ name: updated.name, email: updated.email, role: "Admin" });
      setSaved(true);
      toast("Profile saved successfully!", "success");
      clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast((err as Error).message || "Failed to save profile", "error");
    }
  };

  if (loading) {
    return <AdminLoadingState label="Loading settings..." />;
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

      {/* Invite admins */}
      <Card className="p-5! md:p-8! mb-4">
        <h3 className="text-base font-bold text-main mb-2">Invite Admins</h3>
        <p className="text-[13px] text-secondary mb-5">
          Generate one-time invite links for new administrators. Links expire after 7 days.
        </p>

        <Btn onClick={handleGenerateInvite} disabled={inviteLoading} className="py-2.75! px-7! mb-5!">
          {inviteLoading ? "Generating..." : "Generate Invite Link"}
        </Btn>

        {invites.length > 0 && (
          <div className="space-y-2.5">
            {invites.map(t => {
              const status = getTokenStatus(t);
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-lg bg-surface border border-border"
                >
                  <div className="min-w-0 flex-1">
                    <code className="text-[11px] text-muted font-mono block truncate">
                      {t.token.slice(0, 16)}...
                    </code>
                    <div className="text-[11px] text-muted mt-0.5">
                      Expires {new Date(t.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={clsx("text-[12px] font-semibold", status.color)}>
                      {status.label}
                    </span>
                    {status.label === "Active" && (
                      <button
                        onClick={() => copyInviteUrl(t.token)}
                        className="text-[11px] text-accent bg-none border-none cursor-pointer font-sans font-semibold"
                      >
                        {copiedToken === t.token ? "Copied!" : "Copy URL"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Danger zone */}
      <Card className="p-5! md:p-8! border-error/20!">
        <h3 className="text-base font-bold text-error mb-2">Danger Zone</h3>
        <p className="text-[13px] text-secondary mb-4">
          Irreversible actions that affect your account.
        </p>
        <Btn
          variant="secondary"
          onClick={onLogout}
          className="border-error/27! text-error!"
        >
          Log Out
        </Btn>
      </Card>
    </div>
  );
}
