import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Star, BookOpen, Search, AlertCircle } from "lucide-react";
import { fetchBooks } from "../services/bookService";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!query) return;

    const loadBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const { items, isFallback: fallback } = await fetchBooks(query, page * 12, 12);
        setBooks(items || []);
        setIsFallback(fallback);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [query, page]);

  if (!query) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Search className="mx-auto h-12 w-12 mb-4 text-slate-300" />
        <h2 className="text-2xl font-semibold">Enter a search query</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">
          Results for "{query}"
        </h1>
        <div className="text-sm text-slate-500 font-medium">
          Page {page + 1}
        </div>
      </div>

      {isFallback && !loading && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <AlertCircle className="text-amber-500 shrink-0" />
          <p className="font-medium text-sm">
            Showing offline dataset because the API is currently unavailable.
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl p-4 border border-slate-100 shadow-sm h-80 flex flex-col gap-4"
            >
              <div className="bg-slate-200 h-48 rounded-xl w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <BookOpen className="mx-auto h-12 w-12 mb-4 text-slate-300" />
          <h2 className="text-2xl font-semibold">No books found</h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <div className="flex justify-center gap-4 pt-8 border-t border-slate-200">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-6 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={books.length < 12}
              className="px-6 py-2 bg-indigo-600 border border-transparent rounded-xl font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
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
      <div className="relative h-56 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
        <img
          src={coverUrl}
          alt={volumeInfo.title}
          className="h-full object-cover shadow-md rounded-sm group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-5 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {volumeInfo.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium line-clamp-1">
          {volumeInfo.authors?.join(", ") || "Unknown Author"}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
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
