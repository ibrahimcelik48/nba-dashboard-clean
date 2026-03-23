const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// TEST
app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀");
});

// 🔥 MAÇLAR (STABLE)
app.get("/api/games", async (req, res) => {
  try {
    const response = await fetch(
      "https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
    );

    const data = await response.json();

    const events = data.events || [];

    const games = events.map((event, index) => {
      const comp = event.competitions[0];

      const home = comp.competitors.find(t => t.homeAway === "home");
      const away = comp.competitors.find(t => t.homeAway === "away");

      return {
        id: index,
        home: home.team.displayName,
        away: away.team.displayName,
        homeScore: home.score,
        awayScore: away.score,
        homeLogo: home.team.logo,
        awayLogo: away.team.logo,
        status: comp.status.type.description,
        date: event.date
      };
    });

    res.json({ games });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server çalışıyor 🚀");
});