import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { followerGrowth } from "../data/mockData";

export default function FollowerGrowthChart() {
  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Рост подписчиков</h3>
      <p className="text-sm text-gray-400 mb-6">
        +{((followerGrowth.at(-1).followers - followerGrowth[0].followers) / 1000).toFixed(1)}K за месяц
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={followerGrowth}>
          <defs>
            <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E1306C" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#E1306C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
          <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} domain={["dataMin - 1000", "dataMax + 1000"]} />
          <Tooltip
            contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12 }}
            formatter={(v) => [`${(v / 1000).toFixed(1)}K`, "Подписчики"]}
          />
          <Area type="monotone" dataKey="followers" stroke="#E1306C" fill="url(#fGrad)" strokeWidth={2.5} dot={{ fill: "#E1306C", r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
