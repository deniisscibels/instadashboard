import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { retentionData } from "../data/mockData";

export default function RetentionChart() {
  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Удержание аудитории</h3>
      <p className="text-sm text-gray-400 mb-6">Средний % зрителей по секундам</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={retentionData}>
          <defs>
            <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#833AB4" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#833AB4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
          <XAxis dataKey="second" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12 }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(v) => [`${v}%`, "Удержание"]}
          />
          <Area type="monotone" dataKey="retention" stroke="#833AB4" fill="url(#retGrad)" strokeWidth={2.5} dot={{ fill: "#833AB4", r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
