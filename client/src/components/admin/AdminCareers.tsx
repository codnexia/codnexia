import { useState, useEffect } from "react";
import clsx from "clsx";
import type { CareerApplication, AiInterview } from "../../types";
import { getCareerApplications, updateCareerStatus, deleteCareerApplication, rescreenApplication, inviteInterview, getInterviewAdmin, getCandidateRankings } from "../../lib/api";
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

const RECOMMENDATION_COLORS: Record<string, string> = {
  strong_hire: "#2DD4A8",
  hire: "#4A9FF5",
  maybe: "#F5A623",
  no_hire: "#E84855",
};

const RECOMMENDATION_LABELS: Record<string, string> = {
  strong_hire: "Strong Hire",
  hire: "Hire",
  maybe: "Maybe",
  no_hire: "No Hire",
};

function scoreColor(score: number | null): string {
  if (score === null) return "#7A8DB5";
  if (score >= 70) return "#2DD4A8";
  if (score >= 40) return "#F5A623";
  return "#E84855";
}

export function AdminCareers() {
  const [subTab, setSubTab] = useState<"applications" | "positions" | "rankings">("applications");

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { id: "applications" as const, label: "Applications" },
          { id: "positions" as const, label: "Open Positions" },
          { id: "rankings" as const, label: "Rankings" },
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
      {subTab === "rankings" && <RankingsTab />}
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
  const [sort, setSort] = useState<"newest" | "highest" | "lowest">("newest");
  const [interviewData, setInterviewData] = useState<Record<string, AiInterview>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const handleRescreen = async (id: string) => {
    setActionLoading(id);
    try {
      const result = await rescreenApplication(id);
      toast(`Re-screened: score ${result.score}/100`, "success");
      fetchItems();
    } catch {
      toast("Screening failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleInviteInterview = async (id: string) => {
    setActionLoading(id);
    try {
      await inviteInterview(id);
      toast("Interview invitation sent!", "success");
      fetchItems();
    } catch {
      toast("Failed to send interview invite", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const loadInterviewData = async (applicationId: string) => {
    try {
      const data = await getInterviewAdmin(applicationId);
      setInterviewData(prev => ({ ...prev, [applicationId]: data }));
    } catch {
      // No interview exists
    }
  };

  const handleExpand = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      loadInterviewData(id);
    }
  };

  let filtered = filter === "all" ? items : items.filter(a => a.status === filter);
  if (sort === "highest") {
    filtered = [...filtered].sort((a, b) => (b.screeningScore ?? -1) - (a.screeningScore ?? -1));
  } else if (sort === "lowest") {
    filtered = [...filtered].sort((a, b) => (a.screeningScore ?? 999) - (b.screeningScore ?? 999));
  }

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
        <div className="flex items-center gap-3">
          <p className="text-sm text-secondary m-0">
            Manage career applications &middot; <span className="text-main font-semibold">{filtered.length} shown</span>
          </p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            className="bg-surface border border-border rounded-md px-2 py-1 text-xs text-secondary font-sans outline-none appearance-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>
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
          <div className="grid grid-cols-[1.5fr_1.5fr_0.8fr_0.7fr_0.8fr_0.8fr_0.6fr_120px] min-w-200 px-5 py-3 border-b border-border text-[11px] text-muted font-semibold uppercase tracking-[0.8px]">
            <span>Applicant</span>
            <span>Position</span>
            <span>Experience</span>
            <span>Score</span>
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
                  "grid grid-cols-[1.5fr_1.5fr_0.8fr_0.7fr_0.8fr_0.8fr_0.6fr_120px] min-w-200 px-5 py-3.5 items-center transition-colors duration-200",
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

                {/* Score */}
                <div>
                  {app.screeningScore !== null ? (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{
                        color: scoreColor(app.screeningScore),
                        backgroundColor: scoreColor(app.screeningScore) + "18",
                      }}
                    >
                      {app.screeningScore}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted">
                      {app.screeningStatus === "pending" ? "Pending" : app.screeningStatus === "failed" ? "Failed" : "—"}
                    </span>
                  )}
                </div>

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
                    onClick={() => handleExpand(app.id)}
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
                  {/* AI Actions Bar */}
                  <div className="flex gap-2 mb-5 flex-wrap">
                    <button
                      onClick={() => handleRescreen(app.id)}
                      disabled={actionLoading === app.id}
                      className="py-1.5 px-4 rounded-md bg-accent-dim border border-accent/27 text-accent text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:bg-accent/20 disabled:opacity-50"
                    >
                      {actionLoading === app.id ? "Processing..." : "Re-screen"}
                    </button>
                    <button
                      onClick={() => handleInviteInterview(app.id)}
                      disabled={actionLoading === app.id}
                      className="py-1.5 px-4 rounded-md bg-[#A78BFA]/10 border border-[#A78BFA]/27 text-[#A78BFA] text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:bg-[#A78BFA]/20 disabled:opacity-50"
                    >
                      Send Interview Invite
                    </button>
                  </div>

                  {/* Screening Results */}
                  {app.screeningScore !== null && (
                    <div className="mb-5 p-4 rounded-lg bg-card border border-border">
                      <h4 className="text-xs font-bold text-main mb-2 uppercase tracking-wide">AI Screening</h4>
                      <div className="flex items-center gap-4 mb-2">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: scoreColor(app.screeningScore) }}
                        >
                          {app.screeningScore}/100
                        </span>
                        {app.compositeScore !== null && (
                          <span className="text-xs text-muted">
                            Composite: <span className="text-main font-semibold">{app.compositeScore}/100</span>
                          </span>
                        )}
                        {app.finalRecommendation && (
                          <Pill color={RECOMMENDATION_COLORS[app.finalRecommendation] || "#7A8DB5"}>
                            {RECOMMENDATION_LABELS[app.finalRecommendation] || app.finalRecommendation}
                          </Pill>
                        )}
                      </div>
                      {app.screeningNotes && (
                        <p className="text-xs text-secondary leading-[1.7]">{app.screeningNotes}</p>
                      )}
                    </div>
                  )}

                  {/* Interview Data */}
                  {interviewData[app.id] && (
                    <div className="mb-5 p-4 rounded-lg bg-card border border-border">
                      <h4 className="text-xs font-bold text-main mb-2 uppercase tracking-wide">AI Interview</h4>
                      <div className="flex items-center gap-4 mb-3">
                        <Pill color={
                          interviewData[app.id].status === "completed" ? "#2DD4A8" :
                          interviewData[app.id].status === "in_progress" ? "#F5A623" :
                          interviewData[app.id].status === "expired" ? "#E84855" : "#4A9FF5"
                        }>
                          {interviewData[app.id].status}
                        </Pill>
                        {interviewData[app.id].evaluationScore !== null && (
                          <span
                            className="text-lg font-bold"
                            style={{ color: scoreColor(interviewData[app.id].evaluationScore) }}
                          >
                            {interviewData[app.id].evaluationScore}/100
                          </span>
                        )}
                        {interviewData[app.id].evaluationRecommendation && (
                          <Pill color={RECOMMENDATION_COLORS[interviewData[app.id].evaluationRecommendation!] || "#7A8DB5"}>
                            {RECOMMENDATION_LABELS[interviewData[app.id].evaluationRecommendation!] || interviewData[app.id].evaluationRecommendation}
                          </Pill>
                        )}
                      </div>
                      {interviewData[app.id].evaluationNotes && (
                        <p className="text-xs text-secondary leading-[1.7] mb-3">{interviewData[app.id].evaluationNotes}</p>
                      )}
                      {/* Q&A Transcript */}
                      {interviewData[app.id].answers.length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-accent cursor-pointer font-semibold">
                            View Transcript ({interviewData[app.id].answers.length} answers)
                          </summary>
                          <div className="mt-3 space-y-3">
                            {interviewData[app.id].questions.map((q: { category: string; question: string }, qi: number) => {
                              const ans = interviewData[app.id].answers.find((a: { questionIndex: number }) => a.questionIndex === qi);
                              return (
                                <div key={qi} className="p-3 rounded-lg bg-surface border border-border">
                                  <div className="text-[10px] text-accent font-bold uppercase mb-1">{q.category}</div>
                                  <div className="text-xs text-main font-semibold mb-1.5">Q: {q.question}</div>
                                  <div className="text-xs text-secondary leading-[1.7] whitespace-pre-wrap">
                                    {ans?.answer || "(not answered)"}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      )}
                    </div>
                  )}

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

function RankingsTab() {
  const toast = useToast();
  const [items, setItems] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [positionFilter, setPositionFilter] = useState("");

  useEffect(() => {
    fetchRankings();
  }, [positionFilter]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const data = await getCandidateRankings(positionFilter || undefined);
      setItems(data);
    } catch {
      toast("Failed to load rankings", "error");
    } finally {
      setLoading(false);
    }
  };

  const positions = [...new Set(items.map(a => a.position))];

  if (loading) {
    return <AdminLoadingState label="Loading rankings..." />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-secondary m-0">
          Candidates ranked by composite score &middot; <span className="text-main font-semibold">{items.length} ranked</span>
        </p>
        <select
          value={positionFilter}
          onChange={e => setPositionFilter(e.target.value)}
          className="bg-surface border border-border rounded-md px-3 py-1.5 text-xs text-secondary font-sans outline-none appearance-none cursor-pointer"
        >
          <option value="">All Positions</option>
          {positions.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <Card className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[50px_1.5fr_1.5fr_0.8fr_0.8fr_0.8fr_1fr] min-w-175 px-5 py-3 border-b border-border text-[11px] text-muted font-semibold uppercase tracking-[0.8px]">
            <span>#</span>
            <span>Candidate</span>
            <span>Position</span>
            <span>CV Score</span>
            <span>Interview</span>
            <span>Composite</span>
            <span>Recommendation</span>
          </div>

          {items.length === 0 && (
            <div className="px-5 py-10 text-center text-secondary text-sm">
              No ranked candidates yet. Candidates need both screening and interview scores.
            </div>
          )}

          {items.map((app, i) => (
            <div
              key={app.id}
              className={clsx(
                "grid grid-cols-[50px_1.5fr_1.5fr_0.8fr_0.8fr_0.8fr_1fr] min-w-175 px-5 py-3.5 items-center transition-colors duration-200",
                i < items.length - 1 && "border-b border-border",
                "hover:bg-surface-hover",
              )}
            >
              <span className="text-sm font-bold text-muted">#{i + 1}</span>
              <div>
                <div className="text-sm font-semibold text-main truncate">{app.firstName} {app.lastName}</div>
                <div className="text-[11px] text-muted truncate">{app.email}</div>
              </div>
              <span className="text-xs text-secondary truncate">{app.position}</span>
              <span className="text-xs font-bold" style={{ color: scoreColor(app.screeningScore) }}>
                {app.screeningScore ?? "—"}
              </span>
              <span className="text-xs font-bold" style={{ color: scoreColor(app.interviewScore) }}>
                {app.interviewScore ?? "—"}
              </span>
              <span
                className="text-sm font-bold px-2.5 py-0.5 rounded-md inline-block"
                style={{
                  color: scoreColor(app.compositeScore),
                  backgroundColor: scoreColor(app.compositeScore) + "18",
                }}
              >
                {app.compositeScore ?? "—"}
              </span>
              <div>
                {app.finalRecommendation ? (
                  <Pill color={RECOMMENDATION_COLORS[app.finalRecommendation] || "#7A8DB5"}>
                    {RECOMMENDATION_LABELS[app.finalRecommendation] || app.finalRecommendation}
                  </Pill>
                ) : (
                  <span className="text-[11px] text-muted">—</span>
                )}
              </div>
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
