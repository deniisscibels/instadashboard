import { useState, useEffect } from "react";
import { Trophy, TrendingUp, Eye, Heart, Users, Loader2 } from "lucide-react";
import { getLeaderboard } from "../firestoreService";

const SORT_OPTIONS = [
  { id: "followers", label: "Подписчики", icon: Users },
  { id: "followerGrowth", label: "Рост подписчиков", icon: TrendingUp },
  { id: "totalViews", label: "Просмотры", icon: Eye },
  { id: "totalLikes", label: "Лайки", icon: Heart },
];

function formatNum(n) {
  if (!n) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function getMedal(i) {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return `#${i + 1}`;
}

export default function Leaderboard({ currentUid }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("followers");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLeaderboard();
      setUsers(data);
    } catch (err) {
      setError("Не удалось загрузить лидерборд. Проверь настройки Firebase.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...users].sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-[#E1306C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={24} className="text-[#FCAF45]" />
          <h3 className="text-lg font-semibold text-white">Лидерборд</h3>
          <button
            onClick={loadData}
            className="ml-auto text-sm text-gray-400 hover:text-white transition-colors"
          >
            Обновить
          </button>
        </div>

        {/* Sort tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === opt.id
                  ? "bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white"
                  : "bg-[#12122a] text-gray-400 hover:text-white"
              }`}
            >
              <opt.icon size={14} />
              {opt.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {sorted.length === 0 && !error && (
          <div className="text-center py-12">
            <Users size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Пока никого нет. Войди и добавь свои данные!</p>
          </div>
        )}

        {/* Table */}
        <div className="space-y-3">
          {sorted.map((user, i) => {
            const isMe = user.uid === currentUid;
            return (
              <div
                key={user.uid}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  isMe ? "bg-[#E1306C]/10 border border-[#E1306C]/30" : "bg-[#12122a] hover:bg-[#1e1e3a]"
                }`}
              >
                {/* Rank */}
                <div className="w-10 text-center text-lg font-bold shrink-0">
                  {getMedal(i)}
                </div>

                {/* Avatar + Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E1306C] to-[#833AB4] flex items-center justify-center text-white font-bold text-sm">
                      {(user.displayName || "?")[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {user.displayName}
                      {isMe && <span className="text-[#E1306C] ml-2 text-xs">(ты)</span>}
                    </p>
                    {user.instagramHandle && (
                      <p className="text-gray-500 text-xs">@{user.instagramHandle}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-xs text-gray-400">
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">{formatNum(user.followers)}</p>
                    <p>подписчики</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold text-sm ${user.followerGrowth > 0 ? "text-green-400" : "text-white"}`}>
                      {user.followerGrowth > 0 ? "+" : ""}{formatNum(user.followerGrowth)}
                    </p>
                    <p>рост</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">{formatNum(user.totalViews)}</p>
                    <p>просмотры</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">{formatNum(user.totalLikes)}</p>
                    <p>лайки</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
