import clsx from "clsx";
import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { StatCard } from "../ui/StatCard";
import { BarChart } from "../ui/BarChart";
import { DASHBOARD_STATS, WEEKLY_TRAFFIC, RECENT_ACTIVITY } from "../../assets/data";

export function AdminDashboard() {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {DASHBOARD_STATS.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <Card>
          <div className="flex justify-between items-center mb-5">
            <span className="text-[15px] font-bold text-main">Weekly Traffic</span>
            <Pill>This week</Pill>
          </div>
          <BarChart data={WEEKLY_TRAFFIC.data} labels={WEEKLY_TRAFFIC.labels} />
        </Card>
        <Card>
          <span className="text-[15px] font-bold text-main block mb-4">Recent Activity</span>
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className={clsx("flex items-center gap-2.5 py-2.5", i < 4 && "border-b border-border")}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
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
