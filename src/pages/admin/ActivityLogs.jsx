import { useState, useEffect } from "react";
import { BookOpen, Search, Heart, MessageSquare, Activity } from "lucide-react";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs");
        const data = await res.json();
        // Sort by newest first
        setLogs(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getActionIcon = (action) => {
    switch (action) {
      case "search":
        return <Search size={16} className="text-blue-600" />;
      case "view_book":
        return <BookOpen size={16} className="text-indigo-600" />;
      case "add_favorite":
        return <Heart size={16} className="text-rose-600" />;
      case "submit_feedback":
        return <MessageSquare size={16} className="text-emerald-600" />;
      default:
        return <Activity size={16} className="text-slate-600" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "search":
        return "bg-blue-100 text-blue-700";
      case "view_book":
        return "bg-indigo-100 text-indigo-700";
      case "add_favorite":
        return "bg-rose-100 text-rose-700";
      case "submit_feedback":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-200 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Activity className="text-indigo-600" size={32} />
            System Activity Logs
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Track user interactions and system events.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold w-1/2">Details</th>
                <th className="p-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action.replace("_", " ")}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {log.details}
                    </td>
                    <td className="p-4 text-slate-500 text-sm text-right whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
