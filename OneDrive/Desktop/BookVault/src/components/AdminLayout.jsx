import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Activity, LogOut, ShieldAlert } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";

  if (!isAuthenticated && location.pathname !== "/admin/login") {
    return <Navigate to="/admin/login" replace />;
  }

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row font-sans text-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-rose-600 p-2 rounded-xl text-white">
            <ShieldAlert size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === "/admin/dashboard"} />
          <NavLink to="/admin/feedback" icon={<MessageSquare size={20} />} label="Feedback" active={location.pathname === "/admin/feedback"} />
          <NavLink to="/admin/logs" icon={<Activity size={20} />} label="Activity Logs" active={location.pathname === "/admin/logs"} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-slate-950 border-b border-slate-800 h-16 flex items-center px-6 justify-between shrink-0">
          <h2 className="text-lg font-medium text-white capitalize">
            {location.pathname.split("/").pop().replace("-", " ")}
          </h2>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
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
          ? "bg-rose-500/10 text-rose-500 font-medium"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
