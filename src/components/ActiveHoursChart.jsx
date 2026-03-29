import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { activeHours } from "../data/mockData";

export default function ActiveHoursChart() {
  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Активность по часам</h3>
      <p className="text-sm text-gray-400 mb-6">Когда ваша аудитория онлайн</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={activeHours}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
          <XAxis dataKey="hour" stroke="#6b7280" tick={{ fontSize: 11 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} hide />
          <Tooltip
            contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12 }}
            labelFormatter={(l) => `${l}:00`}
            formatter={(v) => [`${v}%`, "Активность"]}
          />
          <Bar dataKey="activity" radius={[4, 4, 0, 0]} fill="url(#barGrad)">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E1306C" />
                <stop offset="100%" stopColor="#833AB4" />
              </linearGradient>
            </defs>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
