import { useState, useEffect } from "react";
import clsx from "clsx";
import type { CareerApplication } from "../../types";
import { getCareerApplications, updateCareerStatus, deleteCareerApplication } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { AdminLoadingState } from "../ui/AdminLoadingState";
import { InlineConfirm } from "../ui/InlineConfirm";
import { AdminJobPositions } from "./AdminJobPositions";

const STATUS_COLORS: Record<string, string> = {
  new: "#4A9FF5",
  reviewed: "#F5A623",
  shortlisted: "#2DD4A8",
  interviewed: "#A78BFA",
  rejected: "#E84855",
  hired: "#2DD4A8",
};

const STATUS_OPTIONS = ["new", "reviewed", "shortlisted", "interviewed", "rejected", "hired"];

export function AdminCareers() {
  const [subTab, setSubTab] = useState<"applications" | "positions">("applications");

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { id: "applications" as const, label: "Applications" },
          { id: "positions" as const, label: "Open Positions" },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={clsx(
              "py-2 px-5 rounded-lg border-none cursor-pointer text-[13px] font-semibold font-sans transition-all duration-200",
              subTab === t.id
                ? "bg-accent-dim text-accent"
                : "bg-surface text-secondary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "applications" && <CareerApplicationsTab />}
      {subTab === "positions" && <AdminJobPositions />}
    </div>
  );
}

function CareerApplicationsTab() {
  const toast = useToast();
  const [items, setItems] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await getCareerApplications(1, 100);
      setItems(res.data);
    } catch {
      toast("Failed to load career applications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateCareerStatus(id, status);
      toast(`Status updated to ${status}`, "success");
      fetchItems();
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const confirmDelete = async (app: CareerApplication) => {
    try {
      await deleteCareerApplication(app.id);
      toast("Application deleted", "info");
      setDeleting(null);
      fetchItems();
    } catch {
      toast("Failed to delete application", "error");
    }
  };

  const filtered = filter === "all" ? items : items.filter(a => a.status === filter);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return <AdminLoadingState label="Loading career applications..." />;
  }

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Applications", value: items.length, color: "#4A9FF5" },
          { label: "New / Unreviewed", value: items.filter(a => a.status === "new").length, color: "#4A9FF5" },
          { label: "Shortlisted", value: items.filter(a => a.status === "shortlisted").length, color: "#2DD4A8" },
          { label: "Hired", value: items.filter(a => a.status === "hired").length, color: "#2DD4A8" },
        ].map((s, i) => (
          <Card key={i} className="p-5!">
            <div className="text-xs text-secondary mb-1.5 font-medium">{s.label}</div>
            <div className="text-2xl font-bold text-main">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-secondary m-0">
          Manage career applications &middot; <span className="text-main font-semibold">{filtered.length} shown</span>
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {["all", ...STATUS_OPTIONS].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "py-1.25 px-3.5 rounded-md border-none cursor-pointer text-xs font-semibold font-sans capitalize",
                filter === f ? "bg-accent-dim text-accent" : "bg-surface text-secondary",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          {/* Header */}
          <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_0.8fr_0.8fr_0.8fr_120px] min-w-200 px-5 py-3 border-b border-border text-[11px] text-muted font-semibold uppercase tracking-[0.8px]">
            <span>Applicant</span>
            <span>Position</span>
            <span>Experience</span>
            <span>Work Mode</span>
            <span>Status</span>
            <span>Applied</span>
            <span>Country</span>
            <span></span>
          </div>

          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-secondary text-sm">
              {filter === "all"
                ? "No career applications yet."
                : `No applications with status "${filter}".`}
            </div>
          )}

          {/* Rows */}
          {filtered.map((app, i) => (
            <div key={app.id}>
              <div
                className={clsx(
                  "grid grid-cols-[1.5fr_1.5fr_1fr_1fr_0.8fr_0.8fr_0.8fr_120px] min-w-200 px-5 py-3.5 items-center transition-colors duration-200",
                  i < filtered.length - 1 && deleting !== app.id && "border-b border-border",
                  "hover:bg-surface-hover",
                )}
              >
                {/* Applicant */}
                <div>
                  <div className="text-sm font-semibold text-main truncate">
                    {app.firstName} {app.lastName}
                  </div>
                  <div className="text-[11px] text-muted truncate">{app.email}</div>
                </div>

                {/* Position */}
                <span className="text-xs text-secondary truncate">{app.position}</span>

                {/* Experience */}
                <span className="text-xs text-secondary">{app.experience}</span>

                {/* Work Mode */}
                <span className="text-xs text-secondary">{app.workMode}</span>

                {/* Status */}
                <div>
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.id, e.target.value)}
                    className="bg-transparent border-none text-xs font-semibold cursor-pointer font-sans outline-none appearance-none"
                    style={{ color: STATUS_COLORS[app.status] || "#7A8DB5" }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} className="bg-[#0E1628] capitalize">{s}</option>
                    ))}
                  </select>
                </div>

                {/* Applied */}
                <span className="text-xs text-secondary">{timeAgo(app.createdAt)}</span>

                {/* Country */}
                <span className="text-xs text-secondary truncate">{app.country}</span>

                {/* Actions */}
                <div className="flex gap-1.5 justify-end">
                  <button
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                    className="py-1.25 px-3.5 rounded-md bg-surface border border-border text-secondary text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-accent/27 hover:text-accent"
                  >
                    {expanded === app.id ? "Hide" : "View"}
                  </button>
                  <button
                    onClick={() => setDeleting(deleting === app.id ? null : app.id)}
                    className="py-1.25 px-3 rounded-md bg-surface border border-border text-error text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-error/27"
                  >
                    Del
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === app.id && (
                <div className="px-5 py-5 bg-surface border-b border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Personal */}
                    <div>
                      <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-wide">Personal</h4>
                      <DetailRow label="Full Name" value={`${app.firstName} ${app.lastName}`} />
                      <DetailRow label="Email" value={app.email} />
                      <DetailRow label="Phone" value={`${app.countryCode || ""} ${app.phone}`} />
                      <DetailRow label="Location" value={[app.city, app.country].filter(Boolean).join(", ")} />
                      <DetailRow label="Nationality" value={app.nationality} />
                      {app.linkedin && <DetailRow label="LinkedIn" value={app.linkedin} />}
                      {app.github && <DetailRow label="GitHub" value={app.github} />}
                      {app.portfolio && <DetailRow label="Portfolio" value={app.portfolio} />}
                    </div>

                    {/* Professional */}
                    <div>
                      <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-wide">Professional</h4>
                      <DetailRow label="Current Role" value={app.currentRole} />
                      <DetailRow label="Company" value={app.company} />
                      <DetailRow label="Experience" value={app.experience} />
                      <DetailRow label="Notice Period" value={app.noticePeriod} />
                      <DetailRow label="Employment Type" value={app.employmentType} />
                      <DetailRow label="Work Mode" value={app.workMode} />
                      <DetailRow label="Salary" value={app.salaryExpectation ? `${app.salaryCurrency} ${app.salaryExpectation}` : ""} />
                      <DetailRow label="Availability" value={app.availability} />
                    </div>

                    {/* Skills & Education */}
                    <div>
                      <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-wide">Skills & Education</h4>
                      <div className="mb-2">
                        <span className="text-[11px] text-muted block mb-1">Tech Stack</span>
                        <div className="flex flex-wrap gap-1">
                          {(app.primaryStack || []).map(t => (
                            <Pill key={t} color="#4A9FF5">{t}</Pill>
                          ))}
                        </div>
                      </div>
                      <DetailRow label="Proficiency" value={app.proficiency} />
                      <DetailRow label="Languages" value={app.languages} />
                      <DetailRow label="Certifications" value={app.certifications} />
                      <DetailRow label="Degree" value={app.degree} />
                      <DetailRow label="Field" value={app.field} />
                      <DetailRow label="University" value={app.university} />
                      <DetailRow label="Grad Year" value={app.gradYear} />
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="mt-5">
                    <h4 className="text-xs font-bold text-main mb-2 uppercase tracking-wide">Cover Letter</h4>
                    <div className="text-sm text-secondary leading-[1.7] bg-card p-4 rounded-lg border border-border whitespace-pre-wrap">
                      {app.coverLetter}
                    </div>
                  </div>

                  {/* AI Call Details */}
                  {app.callDate && (
                    <div className="mt-5">
                      <h4 className="text-xs font-bold text-main mb-2 uppercase tracking-wide">AI Call Scheduled</h4>
                      <div className="flex gap-4 flex-wrap">
                        <DetailRow label="Date" value={app.callDate} />
                        <DetailRow label="Time" value={app.callTime} />
                        <DetailRow label="Timezone" value={app.timezone} />
                      </div>
                      {(app.callTopics || []).length > 0 && (
                        <div className="mt-2">
                          <span className="text-[11px] text-muted block mb-1">Topics</span>
                          <div className="flex flex-wrap gap-1">
                            {app.callTopics.map(t => <Pill key={t} color="#A78BFA">{t}</Pill>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <DetailRow label="Heard From" value={app.heardFrom} />
                </div>
              )}

              {/* Delete confirmation */}
              {deleting === app.id && (
                <InlineConfirm
                  message={`Delete application from \u201C${app.firstName} ${app.lastName}\u201D?`}
                  onCancel={() => setDeleting(null)}
                  onConfirm={() => confirmDelete(app)}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mb-1.5">
      <span className="text-[11px] text-muted">{label}: </span>
      <span className="text-xs text-secondary">{value}</span>
    </div>
  );
}
