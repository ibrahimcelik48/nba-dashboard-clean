import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 3001;

const safeFetch = async (url) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error("API response not ok");

    return await res.json();
  } catch (err) {
    console.error("FETCH ERROR:", err.message);
    return null;
  }
};

const getGames = async () => {
  const url = "https://api-nba-v1.p.rapidapi.com/games";

  const data = await safeFetch(url);

  if (!data || !data.response) return [];

  return data.response;
};

const findNextGames = (games, count = 7) => {
  if (!games || !Array.isArray(games)) return [];

  const now = new Date();

  return games
    .filter((g) => g?.date?.start && new Date(g.date.start) > now)
    .slice(0, count);
};

app.get("/api/games/next", async (req, res) => {
  try {
    const games = await getGames();
    const result = findNextGames(games);

    res.json(result);
  } catch (error) {
    console.error("Next games error:", error);
    res.status(500).json({ error: "failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running 🚀");
});