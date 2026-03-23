import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*"
}));

const PORT = process.env.PORT || 3001;

const safeFetch = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("API response not ok");

      return await res.json();
    } catch (err) {
      console.log(`Retry ${i + 1} failed`);

      if (i === retries - 1) {
        console.error("FINAL FETCH ERROR:", err.message);
        return null;
      }
    }
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

    if (!games.length) {
      return res.json([]); // ❗ crash yerine boş dön
    }

    const result = findNextGames(games);

    res.json(result);
  } catch (error) {
    console.error("Next games error:", error);
    res.json([]); // ❗ 500 yerine boş array
  }
});

app.get("/api/games/today", async (req, res) => {
  try {
    const games = await getGames();

    if (!games.length) {
      return res.json([]);
    }

    const today = new Date().toISOString().split("T")[0];

    const result = games.filter((g) =>
      g?.date?.start?.startsWith(today)
    );

    res.json(result);
  } catch (error) {
    console.error("Today games error:", error);
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log("Server running 🚀");
});