import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { genderData as defaultGenderData } from "../data/mockData";

export default function GenderPie({ userData }) {
  const data = userData?.genderWomen
    ? [
        { name: "Женщины", value: Number(userData.genderWomen) || 0, color: "#E1306C" },
        { name: "Мужчины", value: Number(userData.genderMen) || 0, color: "#833AB4" },
        { name: "Другое", value: Number(userData.genderOther) || 0, color: "#5B51D8" },
      ]
    : defaultGenderData;

  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Пол аудитории</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
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
        {data.map((g) => (
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
