import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// 🔥 SENİN KEY (SS'ten aldım)
const API_KEY = "431672076bmsh5c6f32152d56b04p17e7a4jsn32ef1d20eb5c";

const BASE_URL = "https://nba-api-free-data.p.rapidapi.com";

const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": "nba-api-free-data.p.rapidapi.com",
};

// 🔥 TEST ENDPOINT (önce bunu deniyoruz)
app.get("/api/test", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/nba-atlantic-team-list`, {
      headers,
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API çalışmadı" });
  }
});

// 🔥 ŞİMDİ GAMES (GERÇEK MAÇ VERİSİ)
app.get("/api/games/next", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/games`, {
      headers,
    });

    const data = await response.json();

    console.log("GAMES:", data);

    res.json(data);
  } catch (err) {
    console.error("Games error:", err);
    res.status(500).json({ error: "Games çekilemedi" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`);
});