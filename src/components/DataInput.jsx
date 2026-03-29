import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

const emptyReel = { title: "", date: "", views: "", likes: "", comments: "", shares: "", saves: "", retention: "" };
const emptyDemographics = {
  followers: "",
  ageData: [
    { age: "13-17", male: "", female: "" },
    { age: "18-24", male: "", female: "" },
    { age: "25-34", male: "", female: "" },
    { age: "35-44", male: "", female: "" },
    { age: "45-54", male: "", female: "" },
    { age: "55+", male: "", female: "" },
  ],
  genderWomen: "",
  genderMen: "",
  genderOther: "",
  countries: [{ name: "", percentage: "" }],
  cities: [{ name: "", percentage: "" }],
};

function loadData(key, fallback) {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch {
    return fallback;
  }
}

export default function DataInput({ onSave }) {
  const [tab, setTab] = useState("reels");
  const [reels, setReels] = useState(() => loadData("ig_reels", [{ ...emptyReel }]));
  const [demo, setDemo] = useState(() => loadData("ig_demographics", { ...emptyDemographics }));
  const [saved, setSaved] = useState(false);

  const updateReel = (i, field, value) => {
    const updated = [...reels];
    updated[i] = { ...updated[i], [field]: value };
    setReels(updated);
  };

  const addReel = () => setReels([...reels, { ...emptyReel }]);
  const removeReel = (i) => setReels(reels.filter((_, idx) => idx !== i));

  const updateDemo = (field, value) => setDemo({ ...demo, [field]: value });
  const updateAge = (i, field, value) => {
    const updated = [...demo.ageData];
    updated[i] = { ...updated[i], [field]: value };
    setDemo({ ...demo, ageData: updated });
  };

  const addListItem = (key) => setDemo({ ...demo, [key]: [...demo[key], { name: "", percentage: "" }] });
  const updateListItem = (key, i, field, value) => {
    const updated = [...demo[key]];
    updated[i] = { ...updated[i], [field]: value };
    setDemo({ ...demo, [key]: updated });
  };
  const removeListItem = (key, i) => setDemo({ ...demo, [key]: demo[key].filter((_, idx) => idx !== i) });

  const handleSave = () => {
    localStorage.setItem("ig_reels", JSON.stringify(reels));
    localStorage.setItem("ig_demographics", JSON.stringify(demo));
    onSave({ reels, demographics: demo });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = "w-full bg-[#12122a] border border-[#2a2a4a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#E1306C] focus:outline-none transition-colors";
  const labelClass = "text-xs text-gray-400 mb-1 block";

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex items-center justify-between">
        <div className="flex bg-[#1a1a2e] rounded-xl p-1">
          <button
            onClick={() => setTab("reels")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "reels" ? "bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Reels данные
          </button>
          <button
            onClick={() => setTab("demographics")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "demographics" ? "bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Аудитория
          </button>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white hover:shadow-lg hover:shadow-[#E1306C]/20"
          }`}
        >
          <Save size={16} />
          {saved ? "Сохранено!" : "Сохранить"}
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Открой Instagram → Профиль → Профессиональный дашборд → Статистика аккаунта. Перепиши данные сюда.
      </p>

      {tab === "reels" && (
        <div className="space-y-4">
          {reels.map((reel, i) => (
            <div key={i} className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-medium">Reel #{i + 1}</span>
                {reels.length > 1 && (
                  <button onClick={() => removeReel(i)} className="text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>Название</label>
                  <input className={inputClass} placeholder="Мой рилс..." value={reel.title} onChange={(e) => updateReel(i, "title", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Дата</label>
                  <input className={inputClass} type="date" value={reel.date} onChange={(e) => updateReel(i, "date", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Просмотры</label>
                  <input className={inputClass} type="number" placeholder="0" value={reel.views} onChange={(e) => updateReel(i, "views", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Лайки</label>
                  <input className={inputClass} type="number" placeholder="0" value={reel.likes} onChange={(e) => updateReel(i, "likes", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Комментарии</label>
                  <input className={inputClass} type="number" placeholder="0" value={reel.comments} onChange={(e) => updateReel(i, "comments", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Репосты</label>
                  <input className={inputClass} type="number" placeholder="0" value={reel.shares} onChange={(e) => updateReel(i, "shares", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Сохранения</label>
                  <input className={inputClass} type="number" placeholder="0" value={reel.saves} onChange={(e) => updateReel(i, "saves", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addReel}
            className="w-full py-3 rounded-xl border-2 border-dashed border-[#2a2a4a] text-gray-400 hover:border-[#E1306C] hover:text-[#E1306C] transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} /> Добавить Reel
          </button>
        </div>
      )}

      {tab === "demographics" && (
        <div className="space-y-6">
          {/* Followers */}
          <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-5">
            <h4 className="text-white font-medium mb-3">Подписчики</h4>
            <div className="w-48">
              <label className={labelClass}>Всего подписчиков</label>
              <input className={inputClass} type="number" placeholder="0" value={demo.followers} onChange={(e) => updateDemo("followers", e.target.value)} />
            </div>
          </div>

          {/* Gender */}
          <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-5">
            <h4 className="text-white font-medium mb-3">Пол (%)</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Женщины %</label>
                <input className={inputClass} type="number" placeholder="0" value={demo.genderWomen} onChange={(e) => updateDemo("genderWomen", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Мужчины %</label>
                <input className={inputClass} type="number" placeholder="0" value={demo.genderMen} onChange={(e) => updateDemo("genderMen", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Другое %</label>
                <input className={inputClass} type="number" placeholder="0" value={demo.genderOther} onChange={(e) => updateDemo("genderOther", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Age */}
          <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-5">
            <h4 className="text-white font-medium mb-3">Возраст (% мужчины / женщины)</h4>
            <div className="space-y-2">
              {demo.ageData.map((row, i) => (
                <div key={row.age} className="grid grid-cols-3 gap-3 items-center">
                  <span className="text-sm text-gray-300">{row.age}</span>
                  <div>
                    <input className={inputClass} type="number" placeholder="Муж %" value={row.male} onChange={(e) => updateAge(i, "male", e.target.value)} />
                  </div>
                  <div>
                    <input className={inputClass} type="number" placeholder="Жен %" value={row.female} onChange={(e) => updateAge(i, "female", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-5">
            <h4 className="text-white font-medium mb-3">Страны</h4>
            <div className="space-y-2">
              {demo.countries.map((c, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input className={inputClass} placeholder="Страна" value={c.name} onChange={(e) => updateListItem("countries", i, "name", e.target.value)} />
                  <input className={`${inputClass} w-24`} type="number" placeholder="%" value={c.percentage} onChange={(e) => updateListItem("countries", i, "percentage", e.target.value)} />
                  {demo.countries.length > 1 && (
                    <button onClick={() => removeListItem("countries", i)} className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => addListItem("countries")} className="mt-2 text-sm text-[#E1306C] hover:underline flex items-center gap-1"><Plus size={14} /> Добавить</button>
          </div>

          {/* Cities */}
          <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-5">
            <h4 className="text-white font-medium mb-3">Города</h4>
            <div className="space-y-2">
              {demo.cities.map((c, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input className={inputClass} placeholder="Город" value={c.name} onChange={(e) => updateListItem("cities", i, "name", e.target.value)} />
                  <input className={`${inputClass} w-24`} type="number" placeholder="%" value={c.percentage} onChange={(e) => updateListItem("cities", i, "percentage", e.target.value)} />
                  {demo.cities.length > 1 && (
                    <button onClick={() => removeListItem("cities", i)} className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => addListItem("cities")} className="mt-2 text-sm text-[#E1306C] hover:underline flex items-center gap-1"><Plus size={14} /> Добавить</button>
          </div>
        </div>
      )}
    </div>
  );
}
