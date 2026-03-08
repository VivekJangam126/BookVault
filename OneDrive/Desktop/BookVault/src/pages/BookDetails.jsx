import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, Share2, ArrowLeft, BookOpen, Calendar, Layers, AlertCircle } from "lucide-react";
import { fetchBookById } from "../services/bookService";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      try {
        const { book: data, isFallback: fallback } = await fetchBookById(id);
        setBook(data);
        setIsFallback(fallback);

        // Log activity
        fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "view_book", details: data.volumeInfo.title }),
        });

        // Check favorite
        const favRes = await fetch("/api/favorites");
        const favs = await favRes.json();
        setIsFavorite(favs.some((f) => f.bookId === id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      // Find and delete
      const favRes = await fetch("/api/favorites");
      const favs = await favRes.json();
      const fav = favs.find((f) => f.bookId === id);
      if (fav) {
        await fetch(`/api/favorites/${fav.id}`, { method: "DELETE" });
      }
    } else {
      // Add
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(", ") || "Unknown",
          category: book.volumeInfo.categories?.[0] || "General",
        }),
      });
      // Log activity
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_favorite", details: book.volumeInfo.title }),
      });
    }
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/3 h-96 bg-slate-200 rounded-3xl"></div>
          <div className="w-full md:w-2/3 space-y-6">
            <div className="h-12 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
        {error || "Book not found"}
      </div>
    );
  }

  const { volumeInfo } = book;
  const coverUrl = volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || "https://picsum.photos/seed/book/400/600";
  const description = volumeInfo.description?.replace(/<[^>]+>/g, "") || "No description available.";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to results
        </button>
        {isFallback && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
            <AlertCircle size={16} className="text-amber-500" />
            <span className="text-xs font-semibold">Offline Mode</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-12">
        {/* Cover Image */}
        <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
          <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-slate-100 aspect-[2/3]">
            <img
              src={coverUrl}
              alt={volumeInfo.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex gap-4 w-full max-w-sm">
            <button
              onClick={toggleFavorite}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                isFavorite
                  ? "bg-rose-100 text-rose-600 border border-rose-200 hover:bg-rose-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              <Heart className={isFavorite ? "fill-current" : ""} size={20} />
              {isFavorite ? "Saved" : "Favorite"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="flex-1 py-3 px-4 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-semibold hover:bg-indigo-100 flex items-center justify-center gap-2 transition-all"
            >
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-2/3 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {volumeInfo.title}
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              By <span className="text-indigo-600">{volumeInfo.authors?.join(", ") || "Unknown Author"}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-6 py-6 border-y border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <Star className="fill-current" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Rating</p>
                <p className="font-bold text-slate-900">{volumeInfo.averageRating || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pages</p>
                <p className="font-bold text-slate-900">{volumeInfo.pageCount || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Published</p>
                <p className="font-bold text-slate-900">{volumeInfo.publishedDate || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <Layers size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Category</p>
                <p className="font-bold text-slate-900">{volumeInfo.categories?.[0] || "General"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Description</h3>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
              {description}
            </div>
          </div>

          {volumeInfo.publisher && (
            <div className="pt-6 border-t border-slate-100">
              <p className="text-slate-500 font-medium">
                Publisher: <span className="text-slate-900 font-semibold">{volumeInfo.publisher}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
