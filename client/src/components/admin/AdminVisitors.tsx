import { useState } from "react";
import clsx from "clsx";
import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { StatCard } from "../ui/StatCard";

export function AdminVisitors() {
  const [filter, setFilter] = useState("all");
  const visitors = [
    { id: "v_8f2a", page: "/home", duration: "4m 12s", country: "\uD83C\uDDF0\uD83C\uDDEA", device: "Desktop", status: "active" },
    { id: "v_3c1b", page: "/services", duration: "2m 34s", country: "\uD83C\uDDFA\uD83C\uDDF8", device: "Mobile", status: "active" },
    { id: "v_9d4e", page: "/about", duration: "1m 08s", country: "\uD83C\uDDEC\uD83C\uDDE7", device: "Desktop", status: "active" },
    { id: "v_7a2f", page: "/contact", duration: "0m 47s", country: "\uD83C\uDDE9\uD83C\uDDEA", device: "Tablet", status: "idle" },
    { id: "v_1e5c", page: "/home", duration: "6m 21s", country: "\uD83C\uDDF3\uD83C\uDDEC", device: "Mobile", status: "active" },
    { id: "v_4b3d", page: "/services", duration: "3m 45s", country: "\uD83C\uDDFF\uD83C\uDDE6", device: "Desktop", status: "idle" },
    { id: "v_6f7a", page: "/about", duration: "1m 33s", country: "\uD83C\uDDEE\uD83C\uDDF3", device: "Mobile", status: "active" },
  ];
  const filtered = filter === "all" ? visitors : visitors.filter(v => v.status === filter);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Live Visitors" value={34} change={4.2} icon="\u25C9" delay={0} spark={[20,28,24,32,30,36,34]} />
        <StatCard label="Today's Views" value={1847} change={11.3} icon="\u25D0" delay={80} spark={[800,950,1100,1300,1500,1700,1847]} />
        <StatCard label="Bounce Rate" value={38} change={-3.1} icon="\u21A9" delay={160} suffix="%" spark={[45,42,44,40,41,39,38]} />
      </div>
      <Card className="!p-0 overflow-hidden">
        <div className="px-5 py-4 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-main">Live Sessions</span>
            <div className="flex items-center gap-1.25 ml-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
              <span className="text-xs text-accent font-semibold">Real-time</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(["all", "active", "idle"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={clsx(
                "px-3.5 py-1.25 rounded-md border-none cursor-pointer text-xs font-semibold font-sans capitalize",
                filter === f ? "bg-accent-dim text-accent" : "bg-surface text-secondary",
              )}>{f}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[90px_1fr_90px_80px_80px_60px] px-5 py-2.5 text-[11px] text-muted font-semibold uppercase tracking-[0.8px] border-b border-border">
          <span>Visitor</span><span>Page</span><span>Duration</span><span>Device</span><span>Status</span><span></span>
        </div>
        {filtered.map((v, i) => (
          <div key={v.id} className={clsx(
            "grid grid-cols-[90px_1fr_90px_80px_80px_60px] px-5 py-3 items-center transition-colors duration-150 hover:bg-surface-hover",
            i < filtered.length - 1 && "border-b border-border",
          )}>
            <span className="text-xs font-mono text-muted">{v.id}</span>
            <span className="text-[13px] text-main font-medium">{v.page}</span>
            <span className="text-xs text-secondary">{v.duration}</span>
            <span className="text-xs text-secondary">{v.device}</span>
            <Pill color={v.status === "active" ? "#2DD4A8" : "#F5A623"}>{v.status}</Pill>
            <span className="text-xl text-center">{v.country}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
