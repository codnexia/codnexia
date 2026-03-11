import { useState, useEffect } from "react";
import clsx from "clsx";
import type { DashboardStat, VisitorEntry } from "../../types";
import { getVisitorData } from "../../lib/api";
import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { StatCard } from "../ui/StatCard";
import { AdminLoadingState } from "../ui/AdminLoadingState";

export function AdminVisitors() {
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [visitors, setVisitors] = useState<VisitorEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVisitorData();
        setStats(data.stats);
        setVisitors(data.visitors);
      } catch (err) {
        void err;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Apply the active/idle/all filter
  const filtered = filter === "all" ? visitors : visitors.filter(v => v.status === filter);

  if (loading) {
    return <AdminLoadingState label="Loading visitors..." />;
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} delay={i * 80} />
        ))}
      </div>

      {/* Visitors table */}
      <Card className="p-0! overflow-hidden">
        {/* Filter bar */}
        <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-main">Live Sessions</span>
            <div className="flex items-center gap-1.25 ml-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
              <span className="text-xs text-accent font-semibold">Real-time</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(["all", "active", "idle"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-3.5 py-1.25 rounded-md border-none cursor-pointer text-xs font-semibold font-sans capitalize",
                  filter === f
                    ? "bg-accent-dim text-accent"
                    : "bg-surface text-secondary",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid grid-cols-[90px_1fr_90px_80px_80px] min-w-120 px-5 py-2.5 text-[11px] text-muted font-semibold uppercase tracking-[0.8px] border-b border-border">
            <span>Visitor</span>
            <span>Page</span>
            <span>Duration</span>
            <span>Device</span>
            <span>Status</span>
          </div>

          {/* Show empty state if no visitors */}
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-muted">
              No visitors to display.
            </div>
          )}

          {/* Table rows */}
          {filtered.map((v, i) => (
            <div
              key={v.id}
              className={clsx(
                "grid grid-cols-[90px_1fr_90px_80px_80px] min-w-120 px-5 py-3 items-center transition-colors duration-150 hover:bg-surface-hover",
                i < filtered.length - 1 && "border-b border-border",
              )}
            >
              <span className="text-xs font-mono text-muted">{v.id}</span>
              <span className="text-[13px] text-main font-medium">{v.page}</span>
              <span className="text-xs text-secondary">{v.duration}</span>
              <span className="text-xs text-secondary">{v.device}</span>
              <Pill color={v.status === "active" ? "#2DD4A8" : "#F5A623"}>
                {v.status}
              </Pill>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
