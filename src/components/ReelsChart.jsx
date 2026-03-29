import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { reelsPerformance } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-3 shadow-xl">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {(entry.value / 1000).toFixed(1)}K
        </p>
      ))}
    </div>
  );
};

export default function ReelsChart({ userData }) {
  const data = userData
    ? userData
        .filter((r) => r.views && r.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((r) => ({
          name: new Date(r.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
          views: Number(r.views) || 0,
          likes: Number(r.likes) || 0,
          shares: Number(r.shares) || 0,
        }))
    : reelsPerformance;

  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Динамика Reels</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E1306C" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#E1306C" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="likesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#833AB4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#833AB4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sharesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F77737" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#F77737" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
          <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 12, fontSize: 13 }} />
          <Area type="monotone" dataKey="views" name="Просмотры" stroke="#E1306C" fill="url(#viewsGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="likes" name="Лайки" stroke="#833AB4" fill="url(#likesGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="shares" name="Репосты" stroke="#F77737" fill="url(#sharesGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
