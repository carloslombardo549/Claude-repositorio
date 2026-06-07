import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "purple" | "amber" | "rose";
  trend?: string;
  trendUp?: boolean;
}

const colorMap = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    value: "text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    value: "text-emerald-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: "text-purple-400",
    value: "text-purple-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    value: "text-amber-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: "text-rose-400",
    value: "text-rose-400",
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  trendUp,
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={`rounded-xl border ${colors.border} ${colors.bg} p-5 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] card-glow cursor-default`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${colors.value}`}>{value}</p>
          {trend && (
            <p
              className={`text-xs mt-1 ${
                trendUp ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}
