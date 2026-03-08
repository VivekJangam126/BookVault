import { Outlet, Link, useLocation } from "react-router-dom";
import { BookOpen, Search, Heart, MessageSquare } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <BookOpen size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">BookDiscover</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-3">
            Discover
          </div>
          <NavLink to="/" icon={<Search size={20} />} label="Home" active={location.pathname === "/" || location.pathname === "/search"} />
          <NavLink to="/favorites" icon={<Heart size={20} />} label="Favorites" active={location.pathname === "/favorites"} />
          <NavLink to="/feedback" icon={<MessageSquare size={20} />} label="Feedback" active={location.pathname === "/feedback"} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 justify-between shrink-0">
          <h2 className="text-lg font-medium text-slate-800 capitalize">
            {location.pathname === "/" ? "Home" : location.pathname.split("/").pop().replace("-", " ")}
          </h2>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active
          ? "bg-indigo-50 text-indigo-700 font-medium"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
