import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = "BURAYA_SENIN_RAPIDAPI_KEY";
const API_HOST = "nba-api-free-data.p.rapidapi.com";

app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀");
});

app.get("/api/games", async (req, res) => {
  try {
    const response = await fetch(
      "https://nba-api-free-data.p.rapidapi.com/nba-scoreboard-by-date?date=20250120",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": API_HOST,
        },
      }
    );

    const data = await response.json();

    const games =
      data.response?.games?.map((game) => ({
        id: game.id,
        home: game.home?.name,
        away: game.away?.name,
        homeLogo: game.home?.logo,
        awayLogo: game.away?.logo,
        homeScore: game.home?.score,
        awayScore: game.away?.score,
        date: game.date,
      })) || [];

    res.json({ games });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(3000, () => console.log("Server running 🚀"));