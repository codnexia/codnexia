import { useState, useEffect } from "react";
import clsx from "clsx";
import type { DashboardStat } from "../../types";
import { getDashboardData, getRecentActivity } from "../../lib/api";
import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { StatCard } from "../ui/StatCard";
import { BarChart } from "../ui/BarChart";
import { AdminLoadingState } from "../ui/AdminLoadingState";

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [weeklyTraffic, setWeeklyTraffic] = useState<{ data: number[]; labels: string[] }>({
    data: [],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  });
  const [activity, setActivity] = useState<{ text: string; time: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboard, activityData] = await Promise.all([
          getDashboardData(),
          getRecentActivity(),
        ]);
        setStats(dashboard.stats);
        setWeeklyTraffic(dashboard.weeklyTraffic);
        setActivity(activityData);
      } catch (err) {
        void err;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <AdminLoadingState label="Loading dashboard..." />;
  }

  return (
    <div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} delay={i * 80} />
        ))}
      </div>

      {/* Charts + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <Card>
          <div className="flex justify-between items-center mb-5">
            <span className="text-[15px] font-bold text-main">Weekly Traffic</span>
            <Pill>This week</Pill>
          </div>
          <BarChart data={weeklyTraffic.data} labels={weeklyTraffic.labels} />
        </Card>

        <Card>
          <span className="text-[15px] font-bold text-main block mb-4">Recent Activity</span>
          {activity.length === 0 && (
            <p className="text-xs text-muted py-4">No recent activity yet.</p>
          )}
          {activity.map((a, i) => (
            <div
              key={i}
              className={clsx(
                "flex items-center gap-2.5 py-2.5",
                i < activity.length - 1 && "border-b border-border",
              )}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: a.color }}
              />
              <div className="flex-1">
                <div className="text-[13px] text-main font-medium">{a.text}</div>
                <div className="text-[11px] text-muted">{a.time}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
