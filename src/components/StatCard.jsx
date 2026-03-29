function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export default function StatCard({ icon, label, value, suffix = "", gradient }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] p-5 hover:border-[#E1306C]/40 transition-all duration-300">
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-20 blur-2xl"
        style={{ background: gradient || "radial-gradient(circle, #E1306C, transparent)" }}
      />
      <div className="flex items-center gap-3 mb-3">
        <div className="text-[#E1306C]">{icon}</div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white">
        {typeof value === "number" ? formatNumber(value) : value}
        {suffix && <span className="text-lg text-gray-400 ml-1">{suffix}</span>}
      </div>
    </div>
  );
}
