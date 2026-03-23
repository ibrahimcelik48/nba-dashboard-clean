const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀");
});

app.get("/api/games", async (req, res) => {
  try {
    const response = await fetch(
      "https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
    );

    if (!response.ok) {
      return res.status(500).json({ error: "API error" });
    }

    const data = await response.json();

    const events = data.events || [];

    if (events.length === 0) {
      return res.json({ games: [] });
    }

    const games = events.map((event, index) => {
      const comp = event.competitions[0];

      const home = comp.competitors.find(
        (t) => t.homeAway === "home"
      );

      const away = comp.competitors.find(
        (t) => t.homeAway === "away"
      );

      return {
        id: index,
        home: home?.team?.displayName || "Unknown",
        away: away?.team?.displayName || "Unknown",
        homeScore: home?.score || "0",
        awayScore: away?.score || "0",
        homeLogo: home?.team?.logo,
        awayLogo: away?.team?.logo,
        date: event.date,
        status: comp.status.type.description,
      };
    });

    res.json({ games });

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});