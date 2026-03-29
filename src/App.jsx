import { useState } from "react";
import {
  Eye, Heart, MessageCircle, Share2, Bookmark, TrendingUp,
  Film, Users, BarChart3, Camera,
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
import { reelsOverview } from "./data/mockData";

const tabs = [
  { id: "reels", label: "Reels", icon: Film },
  { id: "audience", label: "Аудитория", icon: Users },
];

function App() {
  const [activeTab, setActiveTab] = useState("reels");

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
              <p className="text-xs text-gray-500">Аналитика аккаунта</p>
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
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard icon={<Eye size={20} />} label="Просмотры" value={reelsOverview.totalViews} />
              <StatCard icon={<Heart size={20} />} label="Лайки" value={reelsOverview.totalLikes} gradient="radial-gradient(circle, #833AB4, transparent)" />
              <StatCard icon={<MessageCircle size={20} />} label="Комментарии" value={reelsOverview.totalComments} gradient="radial-gradient(circle, #F77737, transparent)" />
              <StatCard icon={<Share2 size={20} />} label="Репосты" value={reelsOverview.totalShares} gradient="radial-gradient(circle, #FCAF45, transparent)" />
              <StatCard icon={<Bookmark size={20} />} label="Сохранения" value={reelsOverview.totalSaves} gradient="radial-gradient(circle, #5B51D8, transparent)" />
              <StatCard icon={<TrendingUp size={20} />} label="Engagement" value={reelsOverview.avgEngagementRate} suffix="%" gradient="radial-gradient(circle, #17bf63, transparent)" />
            </div>

            {/* Main chart */}
            <ReelsChart />

            {/* Retention + Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RetentionChart />
              <ReachSourcesChart />
            </div>

            {/* Top reels */}
            <TopReels />
          </>
        )}

        {activeTab === "audience" && (
          <>
            {/* Follower growth */}
            <FollowerGrowthChart />

            {/* Age + Gender */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgeGenderChart />
              </div>
              <GenderPie />
            </div>

            {/* Geo + Active hours */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GeoTable />
              <ActiveHoursChart />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a4a] py-6 text-center text-sm text-gray-600">
        InstaDashboard &mdash; Mock data for demonstration
      </footer>
    </div>
  );
}

export default App;
