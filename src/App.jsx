import { useState, useCallback } from "react";
import {
  Eye, Heart, MessageCircle, Share2, Bookmark, TrendingUp,
  Film, Users, Camera, PenSquare, Upload, Link2,
} from "lucide-react";
import StatCard from "./components/StatCard";
import ReelsChart from "./components/ReelsChart";
import RetentionChart from "./components/RetentionChart";
import ReachSourcesChart from "./components/ReachSourcesChart";
import TopReels from "./components/TopReels";
import AgeGenderChart from "./components/AgeGenderChart";
import GenderPie from "./components/GenderPie";
import GeoTable from "./components/GeoTable";
import ActiveHoursChart from "./components/ActiveHoursChart";
import FollowerGrowthChart from "./components/FollowerGrowthChart";
import DataInput from "./components/DataInput";
import InstagramImport from "./components/InstagramImport";
import ReelLink from "./components/ReelLink";
import { reelsOverview as defaultOverview } from "./data/mockData";

function loadUserData() {
  try {
    const reels = JSON.parse(localStorage.getItem("ig_reels"));
    const demo = JSON.parse(localStorage.getItem("ig_demographics"));
    if (reels?.length && reels[0].views) return { reels, demographics: demo };
  } catch {}
  return null;
}

function computeOverview(reels) {
  const totalViews = reels.reduce((s, r) => s + (Number(r.views) || 0), 0);
  const totalLikes = reels.reduce((s, r) => s + (Number(r.likes) || 0), 0);
  const totalComments = reels.reduce((s, r) => s + (Number(r.comments) || 0), 0);
  const totalShares = reels.reduce((s, r) => s + (Number(r.shares) || 0), 0);
  const totalSaves = reels.reduce((s, r) => s + (Number(r.saves) || 0), 0);
  const engagement = totalViews > 0 ? (((totalLikes + totalComments + totalShares + totalSaves) / totalViews) * 100) : 0;
  return { totalViews, totalLikes, totalComments, totalShares, totalSaves, avgEngagementRate: Math.round(engagement * 10) / 10 };
}

const tabs = [
  { id: "reels", label: "Reels", icon: Film },
  { id: "audience", label: "Аудитория", icon: Users },
  { id: "link", label: "По ссылке", icon: Link2 },
  { id: "import", label: "Импорт ZIP", icon: Upload },
  { id: "input", label: "Мои данные", icon: PenSquare },
];

function App() {
  const [activeTab, setActiveTab] = useState("reels");
  const [userData, setUserData] = useState(loadUserData);

  const handleSave = useCallback((data) => {
    setUserData(data);
  }, []);

  const hasUserData = userData?.reels?.length > 0 && userData.reels[0].views;
  const overview = hasUserData ? computeOverview(userData.reels) : defaultOverview;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-[#2a2a4a] bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F77737] via-[#E1306C] to-[#833AB4] flex items-center justify-center">
              <Camera size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#F77737] via-[#E1306C] to-[#833AB4] bg-clip-text text-transparent">
                InstaDashboard
              </h1>
              <p className="text-xs text-gray-500">
                {hasUserData ? "Твои данные" : "Демо данные"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#1a1a2e] rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white shadow-lg shadow-[#E1306C]/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {activeTab === "reels" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard icon={<Eye size={20} />} label="Просмотры" value={overview.totalViews} />
              <StatCard icon={<Heart size={20} />} label="Лайки" value={overview.totalLikes} gradient="radial-gradient(circle, #833AB4, transparent)" />
              <StatCard icon={<MessageCircle size={20} />} label="Комментарии" value={overview.totalComments} gradient="radial-gradient(circle, #F77737, transparent)" />
              <StatCard icon={<Share2 size={20} />} label="Репосты" value={overview.totalShares} gradient="radial-gradient(circle, #FCAF45, transparent)" />
              <StatCard icon={<Bookmark size={20} />} label="Сохранения" value={overview.totalSaves} gradient="radial-gradient(circle, #5B51D8, transparent)" />
              <StatCard icon={<TrendingUp size={20} />} label="Engagement" value={overview.avgEngagementRate} suffix="%" gradient="radial-gradient(circle, #17bf63, transparent)" />
            </div>

            <ReelsChart userData={hasUserData ? userData.reels : null} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RetentionChart />
              <ReachSourcesChart />
            </div>

            <TopReels userData={hasUserData ? userData.reels : null} />
          </>
        )}

        {activeTab === "audience" && (
          <>
            <FollowerGrowthChart />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgeGenderChart userData={hasUserData ? userData.demographics : null} />
              </div>
              <GenderPie userData={hasUserData ? userData.demographics : null} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GeoTable userData={hasUserData ? userData.demographics : null} />
              <ActiveHoursChart />
            </div>
          </>
        )}

        {activeTab === "link" && (
          <ReelLink onAddReels={(reels) => handleSave({ reels, demographics: userData?.demographics })} />
        )}

        {activeTab === "import" && (
          <InstagramImport onImport={handleSave} />
        )}

        {activeTab === "input" && (
          <DataInput onSave={handleSave} />
        )}
      </main>

      <footer className="border-t border-[#2a2a4a] py-6 text-center text-sm text-gray-600">
        InstaDashboard {hasUserData ? "" : "— Демо данные"}
      </footer>
    </div>
  );
}

export default App;
