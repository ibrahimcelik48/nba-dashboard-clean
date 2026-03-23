import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// 🔥 API KEY (seninki)
const API_KEY = "431672076bmsh5c6f32152d56b04p17e7a4jsn32ef1d20eb5c";

const BASE_URL = "https://nba-api-free-data.p.rapidapi.com";

const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": "nba-api-free-data.p.rapidapi.com",
};

// ✅ TEST (çalıştığını görmek için)
app.get("/api/test", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/nba-atlantic-team-list`, {
      headers,
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API error" });
  }
});

// ✅ FRONTEND İÇİN (şu an fake ama çalışacak)
app.get("/api/games/next", async (req, res) => {
  res.json([
    {
      home: "Lakers",
      away: "Warriors",
      date: "2026-03-24",
    },
    {
      home: "Bulls",
      away: "Celtics",
      date: "2026-03-24",
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`);
});