import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { ageData as defaultAgeData } from "../data/mockData";

export default function AgeGenderChart({ userData }) {
  const data = userData?.ageData
    ? userData.ageData.map((r) => ({ age: r.age, male: Number(r.male) || 0, female: Number(r.female) || 0 }))
    : defaultAgeData;

  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Возраст и пол</h3>
      <p className="text-sm text-gray-400 mb-6">Распределение аудитории</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
          <XAxis dataKey="age" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12 }}
            formatter={(v) => [`${v}%`]}
          />
          <Legend wrapperStyle={{ paddingTop: 12, fontSize: 13 }} />
          <Bar dataKey="female" name="Женщины" fill="#E1306C" radius={[4, 4, 0, 0]} />
          <Bar dataKey="male" name="Мужчины" fill="#833AB4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
