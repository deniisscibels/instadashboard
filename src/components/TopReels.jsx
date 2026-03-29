import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { topReels as defaultReels } from "../data/mockData";

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n;
}

export default function TopReels({ userData }) {
  const reels = userData
    ? userData
        .map((r, i) => ({
          id: i,
          title: r.title || `Reel #${i + 1}`,
          views: Number(r.views) || 0,
          likes: Number(r.likes) || 0,
          comments: Number(r.comments) || 0,
          shares: Number(r.shares) || 0,
          date: r.date ? new Date(r.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) : "",
        }))
        .sort((a, b) => (b.views || b.likes) - (a.views || a.likes))
        .slice(0, 10)
    : defaultReels;

  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Топ Reels</h3>
      <div className="space-y-3">
        {reels.map((reel, i) => (
          <div
            key={reel.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#12122a] hover:bg-[#1e1e3a] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E1306C] to-[#833AB4] flex items-center justify-center text-white font-bold text-sm shrink-0">
              #{i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{reel.title}</p>
              <p className="text-gray-500 text-xs">{reel.date}</p>
            </div>
            <div className="hidden sm:flex items-center gap-5 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Eye size={14} /> {formatNum(reel.views)}</span>
              <span className="flex items-center gap-1"><Heart size={14} /> {formatNum(reel.likes)}</span>
              <span className="flex items-center gap-1"><MessageCircle size={14} /> {formatNum(reel.comments)}</span>
              <span className="flex items-center gap-1"><Share2 size={14} /> {formatNum(reel.shares)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
