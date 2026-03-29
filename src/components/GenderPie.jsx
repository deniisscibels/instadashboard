import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { genderData } from "../data/mockData";

export default function GenderPie() {
  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Пол аудитории</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={genderData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="value"
            strokeWidth={0}
          >
            {genderData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12 }}
            formatter={(v) => [`${v}%`]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3 mt-4">
        {genderData.map((g) => (
          <div key={g.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
              <span className="text-sm text-gray-300">{g.name}</span>
            </div>
            <span className="text-sm font-semibold text-white">{g.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
