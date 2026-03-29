import { topCities as defaultCities, topCountries as defaultCountries } from "../data/mockData";
import { useState } from "react";

export default function GeoTable({ userData }) {
  const [tab, setTab] = useState("countries");

  const countries = userData?.countries?.length > 0 && userData.countries[0].name
    ? userData.countries.map((c) => ({ country: c.name, percentage: Number(c.percentage) || 0, flag: "" }))
    : defaultCountries;

  const cities = userData?.cities?.length > 0 && userData.cities[0].name
    ? userData.cities.map((c) => ({ city: c.name, percentage: Number(c.percentage) || 0 }))
    : defaultCities;

  const data = tab === "countries" ? countries : cities;
  const maxVal = data[0]?.percentage || 1;

  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">География</h3>
        <div className="flex bg-[#12122a] rounded-lg p-1">
          <button
            onClick={() => setTab("countries")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === "countries" ? "bg-[#E1306C] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Страны
          </button>
          <button
            onClick={() => setTab("cities")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === "cities" ? "bg-[#E1306C] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Города
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((item) => {
          const label = tab === "countries" ? `${item.flag ? item.flag + " " : ""}${item.country}` : item.city;
          return (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{label}</span>
                <span className="text-white font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-[#12122a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E1306C] to-[#833AB4] transition-all duration-500"
                  style={{ width: `${(item.percentage / maxVal) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
