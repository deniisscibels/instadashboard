import { useState, useEffect } from "react";
import { Save, User } from "lucide-react";
import { saveUserData, loadUserData, saveStatsSnapshot } from "../firestoreService";

export default function ProfileSetup({ user, userData, onProfileSaved }) {
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData(user.uid).then((data) => {
        if (data) {
          setHandle(data.instagramHandle || "");
          setFollowers(data.followers || "");
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    // Compute totals from reels
    const reels = userData?.reels || JSON.parse(localStorage.getItem("ig_reels") || "[]");
    const totalViews = reels.reduce((s, r) => s + (Number(r.views) || 0), 0);
    const totalLikes = reels.reduce((s, r) => s + (Number(r.likes) || 0), 0);

    const profile = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      instagramHandle: handle,
      followers: followers,
      totalViews,
      totalLikes,
      reelsCount: reels.length,
    };

    try {
      await saveUserData(user.uid, profile);
      await saveStatsSnapshot(user.uid, profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onProfileSaved?.();
    } catch (err) {
      console.error("Save error:", err);
      alert("Ошибка сохранения. Проверь настройки Firebase.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <div className="flex items-center gap-3 mb-6">
        <User size={20} className="text-[#E1306C]" />
        <h3 className="text-lg font-semibold text-white">Мой профиль</h3>
      </div>

      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-[#12122a]">
        {user?.photoURL && (
          <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
        )}
        <div>
          <p className="text-white font-medium">{user?.displayName}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Instagram @username</label>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value.replace("@", ""))}
            placeholder="username"
            className="w-full bg-[#12122a] border border-[#2a2a4a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#E1306C] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Количество подписчиков</label>
          <input
            type="number"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            placeholder="0"
            className="w-full bg-[#12122a] border border-[#2a2a4a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#E1306C] focus:outline-none"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Данные рилсов берутся из вкладок "По ссылке" / "Мои данные". Заполни их перед сохранением.
      </p>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          saved
            ? "bg-green-600 text-white"
            : "bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white hover:shadow-lg hover:shadow-[#E1306C]/20"
        } disabled:opacity-50`}
      >
        <Save size={16} />
        {saving ? "Сохраняю..." : saved ? "Сохранено!" : "Сохранить в лидерборд"}
      </button>
    </div>
  );
}
