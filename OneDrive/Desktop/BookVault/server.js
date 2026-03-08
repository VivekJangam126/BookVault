import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Books API client
let booksApi;
try {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "google-credentials.json"),
    scopes: ["https://www.googleapis.com/auth/books"],
  });
  booksApi = google.books({ version: "v1", auth });
} catch (error) {
  console.error("Failed to initialize Google Books API client:", error.message);
}

// Helper to read JSON
const readJson = async (filename) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "data", filename), "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(path.join(__dirname, "data", filename), "[]");
      return [];
    }
    throw err;
  }
};

// Helper to write JSON
const writeJson = async (filename, data) => {
  await fs.writeFile(path.join(__dirname, "data", filename), JSON.stringify(data, null, 2));
};

// --- API Routes ---

// Google Books Proxy
app.get("/api/books/search", async (req, res) => {
  try {
    const { q, startIndex = 0, maxResults = 12 } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    if (!booksApi) {
      return res.status(500).json({ error: "Google Books API client not initialized" });
    }
    const response = await booksApi.volumes.list({
      q,
      startIndex: parseInt(startIndex, 10),
      maxResults: parseInt(maxResults, 10),
    }, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching books from Google API:", error.message);
    res.status(500).json({ error: "Failed to fetch books from Google API" });
  }
});

app.get("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!booksApi) {
      return res.status(500).json({ error: "Google Books API client not initialized" });
    }
    const response = await booksApi.volumes.get({
      volumeId: id,
    }, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching book by ID from Google API:", error.message);
    res.status(500).json({ error: "Failed to fetch book by ID from Google API" });
  }
});

// Favorites
app.get("/api/favorites", async (req, res) => {
  const favorites = await readJson("favorites.json");
  res.json(favorites);
});

app.post("/api/favorites", async (req, res) => {
  const favorites = await readJson("favorites.json");
  const newFavorite = { ...req.body, id: Date.now().toString(), dateAdded: new Date().toISOString() };
  favorites.push(newFavorite);
  await writeJson("favorites.json", favorites);
  res.json(newFavorite);
});

app.delete("/api/favorites/:id", async (req, res) => {
  let favorites = await readJson("favorites.json");
  favorites = favorites.filter((f) => f.id !== req.params.id);
  await writeJson("favorites.json", favorites);
  res.json({ success: true });
});

// Feedback
app.get("/api/feedback", async (req, res) => {
  const feedback = await readJson("feedback.json");
  res.json(feedback);
});

app.post("/api/feedback", async (req, res) => {
  const feedback = await readJson("feedback.json");
  const newFeedback = { ...req.body, id: Date.now().toString(), date: new Date().toISOString() };
  feedback.push(newFeedback);
  await writeJson("feedback.json", feedback);
  res.json(newFeedback);
});

// Activity Logs
app.get("/api/logs", async (req, res) => {
  const logs = await readJson("activityLogs.json");
  res.json(logs);
});

app.post("/api/logs", async (req, res) => {
  try {
    if (!req.body || !req.body.action) {
      return res.status(400).json({ error: "'action' field is required" });
    }
    const logs = await readJson("activityLogs.json");
    const newLog = { ...req.body, id: Date.now().toString(), timestamp: new Date().toISOString() };
    logs.push(newLog);
    await writeJson("activityLogs.json", logs);
    res.json(newLog);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to save log" });
    }
  }
});

// Admin Analytics
app.get("/api/analytics", async (req, res) => {
  const logs = await readJson("activityLogs.json");
  const favorites = await readJson("favorites.json");
  const feedback = await readJson("feedback.json");

  const totalSearches = logs.filter(l => l.action === "search").length;
  const totalBooksViewed = logs.filter(l => l.action === "view_book").length;
  const favoritesCount = favorites.length;
  const feedbackSubmissions = feedback.length;

  res.json({
    totalSearches,
    totalBooksViewed,
    favoritesCount,
    feedbackSubmissions,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
