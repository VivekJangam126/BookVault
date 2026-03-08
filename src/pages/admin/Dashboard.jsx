import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Search, BookOpen, Heart, MessageSquare, TrendingUp, Users } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSearches: 0,
    totalBooksViewed: 0,
    favoritesCount: 0,
    feedbackSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts since we don't have complex aggregations in our simple JSON backend
  const categoryData = [
    { name: "Fiction", value: 400 },
    { name: "Science", value: 300 },
    { name: "History", value: 300 },
    { name: "Technology", value: 200 },
  ];
  const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b"];

  const activityData = [
    { name: "Mon", searches: 40, views: 24, favs: 10 },
    { name: "Tue", searches: 30, views: 13, favs: 5 },
    { name: "Wed", searches: 20, views: 48, favs: 15 },
    { name: "Thu", searches: 27, views: 39, favs: 8 },
    { name: "Fri", searches: 18, views: 48, favs: 12 },
    { name: "Sat", searches: 23, views: 38, favs: 18 },
    { name: "Sun", searches: 34, views: 43, favs: 20 },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-200 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-2 font-medium">Overview of system activity and user engagement.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
          <TrendingUp size={20} />
          Live Updates
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Searches"
          value={stats.totalSearches}
          icon={<Search className="text-blue-600" size={24} />}
          bg="bg-blue-100"
          trend="+12%"
        />
        <StatCard
          title="Books Viewed"
          value={stats.totalBooksViewed}
          icon={<BookOpen className="text-indigo-600" size={24} />}
          bg="bg-indigo-100"
          trend="+5%"
        />
        <StatCard
          title="Favorites Added"
          value={stats.favoritesCount}
          icon={<Heart className="text-rose-600" size={24} />}
          bg="bg-rose-100"
          trend="+18%"
        />
        <StatCard
          title="Feedback Received"
          value={stats.feedbackSubmissions}
          icon={<MessageSquare className="text-emerald-600" size={24} />}
          bg="bg-emerald-100"
          trend="+2%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Activity Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} dx={-10} />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="searches" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Searches" />
                <Bar dataKey="views" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Category Distribution</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm font-medium text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg, trend }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${bg}`}>{icon}</div>
        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-bold">
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-slate-500 font-medium text-sm mb-1">{title}</h3>
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
