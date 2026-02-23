import clsx from "clsx";
import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { StatCard } from "../ui/StatCard";
import { BarChart } from "../ui/BarChart";

export function AdminDashboard() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Visitors" value={12847} change={12.5} icon="\u25C9" delay={0} spark={[30,45,35,60,50,70,85,65,90,78,95,100]} />
        <StatCard label="Page Views" value={48293} change={8.3} icon="\u25D0" delay={80} spark={[20,30,45,35,55,40,60,50,65,75,70,80]} />
        <StatCard label="Active Now" value={34} change={-2.1} icon="\u26A1" delay={160} spark={[40,35,50,30,45,55,38,42,36,44,32,34]} />
        <StatCard label="Avg. Session" value={245} change={5.7} icon="\u23F1" delay={240} suffix="s" spark={[180,200,190,220,210,230,225,240,235,245,250,245]} />
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <Card>
          <div className="flex justify-between items-center mb-5">
            <span className="text-[15px] font-bold text-main">Weekly Traffic</span>
            <Pill>This week</Pill>
          </div>
          <BarChart data={[320,480,390,520,610,450,380]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} />
        </Card>
        <Card>
          <span className="text-[15px] font-bold text-main block mb-4">Recent Activity</span>
          {[
            { text: "Hero section updated", time: "2m ago", color: "#2DD4A8" },
            { text: "New media uploaded", time: "18m ago", color: "#4A9FF5" },
            { text: "Services page edited", time: "1h ago", color: "#F5A623" },
            { text: "Admin role changed", time: "3h ago", color: "#E84855" },
            { text: "Contact form received", time: "5h ago", color: "#2DD4A8" },
          ].map((a, i) => (
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
