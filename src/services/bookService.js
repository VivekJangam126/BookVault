import localBooks from "../data/books.json";

// Service to handle book fetching with fallback
export const fetchBooks = async (query, startIndex = 0, maxResults = 12) => {
  try {
    const res = await fetch(
      `/api/books/search?q=${encodeURIComponent(
        query
      )}&startIndex=${startIndex}&maxResults=${maxResults}`,
      { signal: AbortSignal.timeout(12000) } // 12 second timeout
    );

    if (!res.ok) throw new Error("API request failed");
    
    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error("Empty API response");
    }

    return {
      items: data.items,
      isFallback: false
    };
  } catch (error) {
    console.warn("Google Books API failed, using fallback data:", error.message);
    
    // Fallback logic
    const lowerQuery = query.toLowerCase();
    
    // Filter local books
    const filtered = localBooks.filter(book => {
      const title = book.volumeInfo.title?.toLowerCase() || "";
      const author = book.volumeInfo.authors?.join(" ").toLowerCase() || "";
      const category = book.volumeInfo.categories?.join(" ").toLowerCase() || "";
      
      return title.includes(lowerQuery) || 
             author.includes(lowerQuery) || 
             category.includes(lowerQuery) ||
             lowerQuery.includes(category) || // e.g. "subject:fiction"
             lowerQuery.includes("subject:"); // if it's a category search, just match any if we want, but let's be simple
    });

    // If query contains "subject:", extract the subject
    let finalFiltered = filtered;
    if (lowerQuery.includes("subject:")) {
      const subject = lowerQuery.replace("subject:", "").trim();
      finalFiltered = localBooks.filter(book => 
        book.volumeInfo.categories?.some(c => c.toLowerCase().includes(subject))
      );
    }

    // If still empty, just return some random books so it's never empty
    if (finalFiltered.length === 0) {
      finalFiltered = localBooks.slice(0, maxResults);
    }

    // Paginate local results
    const paginated = finalFiltered.slice(startIndex, startIndex + maxResults);

    return {
      items: paginated,
      isFallback: true
    };
  }
};

export const fetchBookById = async (id) => {
  try {
    // If it's a dummy ID, skip API
    if (id.startsWith("dummy-")) {
      throw new Error("Local dummy ID");
    }

    const res = await fetch(`/api/books/${id}`, {
      signal: AbortSignal.timeout(12000)
    });
    
    if (!res.ok) throw new Error("API request failed");
    
    const data = await res.json();
    return {
      book: data,
      isFallback: false
    };
  } catch (error) {
    console.warn("Google Books API failed for ID, using fallback data:", error.message);
    
    const localBook = localBooks.find(b => b.id === id);
    
    if (localBook) {
      return {
        book: localBook,
        isFallback: true
      };
    }
    
    // If not found in local, return the first one as a fallback so it doesn't break
    return {
      book: localBooks[0],
      isFallback: true
    };
  }
};
