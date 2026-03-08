import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, TrendingUp, Star, BookOpen, AlertCircle } from "lucide-react";
import { fetchBooks } from "../services/bookService";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [sections, setSections] = useState({
    trending: { books: [], loading: true, isFallback: false },
    programming: { books: [], loading: true, isFallback: false },
    technology: { books: [], loading: true, isFallback: false },
    fiction: { books: [], loading: true, isFallback: false },
  });

  useEffect(() => {
    const loadSections = async () => {
      const queries = {
        trending: "subject:bestsellers",
        programming: "subject:programming",
        technology: "subject:technology",
        fiction: "subject:fiction",
      };

      for (const [key, q] of Object.entries(queries)) {
        try {
          const { items, isFallback } = await fetchBooks(q, 0, 4);
          setSections((prev) => ({
            ...prev,
            [key]: { books: items || [], loading: false, isFallback },
          }));
        } catch (error) {
          setSections((prev) => ({
            ...prev,
            [key]: { books: [], loading: false, isFallback: true },
          }));
        }
      }
    };

    loadSections();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", details: query }),
      });
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const renderSection = (title, sectionKey) => {
    const section = sections[sectionKey];
    
    if (section.loading) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-slate-100 h-64">
                <div className="bg-slate-200 h-40 rounded-xl w-full mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {sectionKey === "trending" && <TrendingUp className="text-indigo-600" />}
            {title}
          </h2>
          {section.isFallback && (
            <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-md">
              Offline Mode
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    );
  };

  const isAnyFallback = Object.values(sections).some(s => s.isFallback);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      {isAnyFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3 shadow-sm mx-auto max-w-7xl">
          <AlertCircle className="text-amber-500 shrink-0" />
          <p className="font-medium text-sm">
            Showing offline dataset because the API is currently unavailable.
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-indigo-600 rounded-3xl p-12 text-center text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/library/1920/1080?blur=10')] opacity-20 mix-blend-overlay object-cover"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Discover Your Next Great Read
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl font-medium">
            Explore millions of books, authors, and categories.
          </p>

          <form onSubmit={handleSearch} className="relative mt-8 max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border-0 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-300 focus:outline-none text-lg shadow-lg transition-shadow"
              placeholder="Search by title, author, or keyword..."
            />
            <button
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Default Sections */}
      {renderSection("Trending Books", "trending")}
      {renderSection("Programming Books", "programming")}
      {renderSection("Technology Books", "technology")}
      {renderSection("Fiction Books", "fiction")}
    </div>
  );
}

function BookCard({ book }) {
  const { volumeInfo } = book;
  const coverUrl = volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || "https://picsum.photos/seed/book/300/400";

  return (
    <Link
      to={`/book/${book.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
        <img
          src={coverUrl}
          alt={volumeInfo.title}
          className="h-full object-cover shadow-md rounded-sm group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {volumeInfo.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium line-clamp-1">
          {volumeInfo.authors?.join(", ") || "Unknown Author"}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-bold text-slate-700">
              {volumeInfo.averageRating || "N/A"}
            </span>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
            {volumeInfo.categories?.[0] || "General"}
          </span>
        </div>
      </div>
    </Link>
  );
}
