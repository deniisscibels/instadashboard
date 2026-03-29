import { LogIn, LogOut } from "lucide-react";

export default function AuthButton({ user, onLogin, onLogout }) {
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={user.photoURL}
          alt=""
          className="w-8 h-8 rounded-full border border-[#2a2a4a]"
          referrerPolicy="no-referrer"
        />
        <span className="text-sm text-gray-300 hidden md:block">{user.displayName}</span>
        <button
          onClick={onLogout}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a4a] transition-colors"
          title="Выйти"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onLogin}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#E1306C]/20 transition-all"
    >
      <LogIn size={16} />
      Войти через Google
    </button>
  );
}
