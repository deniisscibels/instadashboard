import { useState } from "react";
import { Link, Plus, Loader2, Trash2, ArrowRight } from "lucide-react";

const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

function extractReelCode(url) {
  const match = url.match(/\/(reel|reels|p)\/([A-Za-z0-9_-]+)/);
  return match ? match[2] : null;
}

function parseMetaTags(html) {
  const result = { title: "", views: "", likes: "", comments: "", shares: "", saves: "" };

  // Try to get description from og:description
  const descMatch = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]*?)"/i)
    || html.match(/<meta\s+content="([^"]*?)"\s+(?:property|name)="og:description"/i);

  if (descMatch) {
    const desc = descMatch[1];
    // Formats: "123 likes, 45 comments", "123K views", etc.
    const likesMatch = desc.match(/([\d,.]+[KkMm]?)\s*likes?/i);
    const commentsMatch = desc.match(/([\d,.]+[KkMm]?)\s*comments?/i);
    const viewsMatch = desc.match(/([\d,.]+[KkMm]?)\s*(?:views?|plays?|просмотр)/i);

    if (likesMatch) result.likes = parseMetricValue(likesMatch[1]);
    if (commentsMatch) result.comments = parseMetricValue(commentsMatch[1]);
    if (viewsMatch) result.views = parseMetricValue(viewsMatch[1]);
  }

  // Try og:title for description/title
  const titleMatch = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]*?)"/i)
    || html.match(/<meta\s+content="([^"]*?)"\s+(?:property|name)="og:title"/i);
  if (titleMatch) {
    result.title = titleMatch[1].substring(0, 60);
  }

  // Try to extract from JSON-LD or embedded data
  const jsonMatches = html.matchAll(/"video_view_count"\s*:\s*(\d+)/g);
  for (const m of jsonMatches) {
    result.views = m[1];
    break;
  }

  const playMatch = html.match(/"play_count"\s*:\s*(\d+)/);
  if (playMatch) result.views = playMatch[1];

  const likeCountMatch = html.match(/"like_count"\s*:\s*(\d+)/);
  if (likeCountMatch) result.likes = likeCountMatch[1];

  const commentCountMatch = html.match(/"comment_count"\s*:\s*(\d+)/);
  if (commentCountMatch) result.comments = commentCountMatch[1];

  return result;
}

function parseMetricValue(str) {
  str = str.replace(/,/g, "");
  const num = parseFloat(str);
  if (str.match(/[Mm]/)) return String(Math.round(num * 1_000_000));
  if (str.match(/[Kk]/)) return String(Math.round(num * 1_000));
  return String(Math.round(num));
}

async function fetchReelData(url) {
  const code = extractReelCode(url);
  if (!code) throw new Error("Неверная ссылка. Нужна ссылка вида instagram.com/reel/...");

  const igUrl = `https://www.instagram.com/reel/${code}/`;

  for (const makeProxy of CORS_PROXIES) {
    try {
      const resp = await fetch(makeProxy(igUrl), {
        headers: { "Accept": "text/html" },
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) continue;
      const html = await resp.text();
      if (html.length < 500) continue;

      const data = parseMetaTags(html);
      data.url = igUrl;
      data.code = code;

      if (data.likes || data.views || data.comments) {
        return data;
      }
    } catch {
      continue;
    }
  }

  throw new Error("Не удалось получить данные. Instagram может блокировать запросы. Попробуй позже или введи данные вручную.");
}

function formatNum(n) {
  const num = Number(n);
  if (!num) return "-";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}

export default function ReelLink({ onAddReels }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState([]);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");

    try {
      const data = await fetchReelData(url.trim());
      data.date = new Date().toISOString().split("T")[0];
      setFetched((prev) => [...prev, data]);
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (i) => setFetched(fetched.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const reels = fetched.map((r, i) => ({
      title: r.title || `Reel #${i + 1}`,
      date: r.date,
      views: r.views || "",
      likes: r.likes || "",
      comments: r.comments || "",
      shares: r.shares || "",
      saves: r.saves || "",
      retention: "",
    }));

    // Merge with existing
    const existing = JSON.parse(localStorage.getItem("ig_reels") || "[]");
    const merged = [...existing, ...reels];
    localStorage.setItem("ig_reels", JSON.stringify(merged));
    onAddReels(merged);
    setFetched([]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Вставь ссылку на Reel</h3>
        <p className="text-sm text-gray-400 mb-5">
          Скопируй ссылку на рилс из Instagram (кнопка "Поделиться" → "Копировать ссылку") и вставь сюда
        </p>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full bg-[#12122a] border border-[#2a2a4a] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-[#E1306C] focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={loading || !url.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#E1306C]/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {loading ? "Загрузка..." : "Добавить"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}
      </div>

      {/* Fetched reels */}
      {fetched.length > 0 && (
        <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Загружено: {fetched.length} рилсов</h4>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#E1306C]/20 transition-all"
            >
              Сохранить в дашборд <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {fetched.map((reel, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#12122a]">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E1306C] to-[#833AB4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{reel.title || reel.code}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {reel.views && <span className="text-gray-400">👁 {formatNum(reel.views)}</span>}
                  {reel.likes && <span className="text-gray-400">❤ {formatNum(reel.likes)}</span>}
                  {reel.comments && <span className="text-gray-400">💬 {formatNum(reel.comments)}</span>}
                </div>
                <button onClick={() => removeItem(i)} className="text-gray-500 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
