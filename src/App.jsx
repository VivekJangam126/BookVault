import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import BookDetails from "./pages/BookDetails";
import Favorites from "./pages/Favorites";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminFeedback from "./pages/admin/FeedbackMonitor";
import AdminLogs from "./pages/admin/ActivityLogs";
import AdminLogin from "./pages/admin/AdminLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="book/:id" element={<BookDetails />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
