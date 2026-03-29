import { useState } from "react";
import JSZip from "jszip";
import { Upload, CheckCircle, AlertCircle, FileArchive, Loader2 } from "lucide-react";

// Instagram data export has different structures depending on version.
// We try to find reels/posts data and follower info from common paths.
const POSSIBLE_REELS_PATHS = [
  "content/reels.json",
  "your_instagram_activity/content/reels.json",
  "content/posts_1.json",
  "your_instagram_activity/content/posts_1.json",
];

const POSSIBLE_FOLLOWERS_PATHS = [
  "followers_and_following/followers_1.json",
  "connections/followers_and_following/followers_1.json",
];

const POSSIBLE_FOLLOWING_PATHS = [
  "followers_and_following/following.json",
  "connections/followers_and_following/following.json",
];

async function findFile(zip, paths) {
  for (const p of paths) {
    const file = zip.file(p);
    if (file) {
      const text = await file.async("string");
      return JSON.parse(text);
    }
  }
  // Try to find by partial name match
  let found = null;
  zip.forEach((relativePath, entry) => {
    if (found) return;
    for (const p of paths) {
      const filename = p.split("/").pop();
      if (relativePath.endsWith(filename)) {
        found = entry;
      }
    }
  });
  if (found) {
    const text = await found.async("string");
    return JSON.parse(text);
  }
  return null;
}

function decodeUtf8(str) {
  if (!str) return "";
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

function parseReels(data) {
  if (!Array.isArray(data)) {
    // might be wrapped: { ig_reels_media: [...] } or similar
    const key = Object.keys(data).find((k) => Array.isArray(data[k]));
    if (key) data = data[key];
    else return [];
  }

  return data.map((item, i) => {
    const media = item.media?.[0] || item;
    const title = decodeUtf8(media.title || item.title || "");
    const timestamp = media.creation_timestamp || item.creation_timestamp;
    const date = timestamp ? new Date(timestamp * 1000).toISOString().split("T")[0] : "";

    // Instagram export doesn't include view counts in the data download,
    // but includes likes/comments if available
    const likes = item.likes?.length || item.like_count || 0;
    const comments = item.comments?.length || item.comment_count || 0;

    return {
      title: title || `Reel #${i + 1}`,
      date,
      views: item.view_count || item.play_count || "",
      likes: String(likes),
      comments: String(comments),
      shares: item.share_count ? String(item.share_count) : "",
      saves: item.save_count ? String(item.save_count) : "",
      retention: "",
    };
  });
}

export default function InstagramImport({ onImport }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("loading");
    setMessage("Читаю архив...");

    try {
      const zip = await JSZip.loadAsync(file);
      const result = { reels: [], followers: 0, following: 0 };

      // Parse reels/posts
      const reelsData = await findFile(zip, POSSIBLE_REELS_PATHS);
      if (reelsData) {
        result.reels = parseReels(reelsData);
      }

      // Also try to find all post files (posts_1.json, posts_2.json, etc.)
      if (result.reels.length === 0) {
        const postFiles = [];
        zip.forEach((path, entry) => {
          if (path.match(/posts_\d+\.json$/)) {
            postFiles.push(entry);
          }
        });
        for (const entry of postFiles) {
          const text = await entry.async("string");
          const data = JSON.parse(text);
          result.reels.push(...parseReels(data));
        }
      }

      // Parse followers
      const followersData = await findFile(zip, POSSIBLE_FOLLOWERS_PATHS);
      if (followersData) {
        result.followers = Array.isArray(followersData)
          ? followersData.length
          : (followersData.relationships_followers || []).length || Object.values(followersData).flat().length;
      }

      // Parse following
      const followingData = await findFile(zip, POSSIBLE_FOLLOWING_PATHS);
      if (followingData) {
        result.following = Array.isArray(followingData)
          ? followingData.length
          : (followingData.relationships_following || []).length || Object.values(followingData).flat().length;
      }

      if (result.reels.length === 0 && result.followers === 0) {
        setStatus("error");
        setMessage("Не нашёл данных в архиве. Убедись что скачал данные в формате JSON.");
        return;
      }

      // Save to localStorage
      if (result.reels.length > 0) {
        localStorage.setItem("ig_reels", JSON.stringify(result.reels));
      }
      if (result.followers > 0) {
        const demo = JSON.parse(localStorage.getItem("ig_demographics") || "{}");
        demo.followers = String(result.followers);
        localStorage.setItem("ig_demographics", JSON.stringify(demo));
      }

      setStats(result);
      setStatus("success");
      setMessage(`Импортировано: ${result.reels.length} рилсов/постов, ${result.followers} подписчиков`);

      onImport({
        reels: result.reels,
        demographics: { followers: String(result.followers) },
      });
    } catch (err) {
      setStatus("error");
      setMessage(`Ошибка: ${err.message}. Убедись что это ZIP-архив от Instagram.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Импорт данных из Instagram</h3>
        <div className="space-y-3 text-sm text-gray-400">
          <p className="text-gray-300 font-medium">Как скачать свои данные:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Открой Instagram → Профиль → <span className="text-white">Настройки и конфиденциальность</span></li>
            <li>Прокрути вниз → <span className="text-white">Ваша активность</span> → <span className="text-white">Скачать информацию</span></li>
            <li>Нажми <span className="text-white">Запросить скачивание</span></li>
            <li>Формат: обязательно выбери <span className="text-[#E1306C] font-medium">JSON</span></li>
            <li>Придёт ссылка на почту или в уведомления (обычно 10-30 минут)</li>
            <li>Скачай ZIP-архив и загрузи его сюда</li>
          </ol>
        </div>
      </div>

      {/* Upload area */}
      <label
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all ${
          status === "loading"
            ? "border-[#833AB4] bg-[#833AB4]/5"
            : status === "success"
            ? "border-green-500 bg-green-500/5"
            : status === "error"
            ? "border-red-500 bg-red-500/5"
            : "border-[#2a2a4a] bg-[#1a1a2e] hover:border-[#E1306C] hover:bg-[#E1306C]/5"
        }`}
      >
        <input
          type="file"
          accept=".zip"
          onChange={handleFile}
          className="hidden"
          disabled={status === "loading"}
        />
        {status === "idle" && (
          <>
            <FileArchive size={48} className="text-gray-500 mb-4" />
            <p className="text-white font-medium mb-1">Загрузи ZIP-архив от Instagram</p>
            <p className="text-sm text-gray-500">Нажми или перетащи файл сюда</p>
          </>
        )}
        {status === "loading" && (
          <>
            <Loader2 size={48} className="text-[#833AB4] mb-4 animate-spin" />
            <p className="text-white font-medium">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle size={48} className="text-green-500 mb-4" />
            <p className="text-white font-medium mb-1">Готово!</p>
            <p className="text-sm text-gray-400">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <p className="text-white font-medium mb-1">Не удалось</p>
            <p className="text-sm text-red-300">{message}</p>
            <p className="text-xs text-gray-500 mt-2">Нажми чтобы попробовать другой файл</p>
          </>
        )}
      </label>

      {/* Results */}
      {stats && (
        <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-6">
          <h4 className="text-white font-medium mb-4">Найдено в архиве</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-[#12122a]">
              <p className="text-2xl font-bold text-[#E1306C]">{stats.reels.length}</p>
              <p className="text-xs text-gray-400 mt-1">Рилсов / Постов</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[#12122a]">
              <p className="text-2xl font-bold text-[#833AB4]">{stats.followers.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Подписчиков</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[#12122a]">
              <p className="text-2xl font-bold text-[#F77737]">{stats.following.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Подписок</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Переключись на вкладки "Reels" и "Аудитория" чтобы увидеть свои данные.
            Данные, которых нет в экспорте (просмотры, демография), можно добавить вручную во вкладке "Мои данные".
          </p>
        </div>
      )}
    </div>
  );
}
