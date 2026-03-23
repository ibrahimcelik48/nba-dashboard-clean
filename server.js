import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

console.log("SERVER DOSYASI ÇALIŞTI 🚀");

// America/New_York saatine göre tarih üretir
function getESTDate(offset = 0) {
  const now = new Date();

  const estNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  estNow.setDate(estNow.getDate() + offset);

  const year = estNow.getFullYear();
  const month = String(estNow.getMonth() + 1).padStart(2, "0");
  const day = String(estNow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function fetchScoreboardByDate(date) {
  const response = await fetch(
    `https://stats.nba.com/stats/scoreboardv3?GameDate=${date}&LeagueID=00`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://www.nba.com/",
        Origin: "https://www.nba.com",
        Accept: "application/json, text/plain, */*"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Scoreboard HTTP ${response.status}`);
  }

  return response.json();
}

// Sıradaki maç gününü bulur (ET saatine göre)
async function findNextGames(maxDaysToCheck = 7) {
  for (let i = 1; i <= maxDaysToCheck; i++) {
    const nextDate = getESTDate(i);
    const data = await fetchScoreboardByDate(nextDate);
    const games = data?.scoreboard?.games ?? [];

    if (games.length > 0) {
      return {
        date: nextDate,
        games
      };
    }
  }

  return {
    date: null,
    games: []
  };
}

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "server güncel" });
});

// Bugünün maçları (NBA live endpoint)
app.get("/api/games/today", async (req, res) => {
  try {
    const response = await fetch(
      "https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json"
    );

    if (!response.ok) {
      throw new Error(`Today games HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Today games fetch error:", error);
    res.status(500).json({ error: "Today games data could not be fetched" });
  }
});

// Yarın yerine: sıradaki maç günü
app.get("/api/games/next", async (req, res) => {
  try {
    const result = await findNextGames(7);
    res.json(result);
  } catch (error) {
    console.error("Next games fetch error:", error);
    res.status(500).json({ error: "Next games data could not be fetched" });
  }
});

// İstersen dünü de ET saatine göre kullanabilirsin
app.get("/api/games/yesterday", async (req, res) => {
  try {
    const yesterday = getESTDate(-1);
    const data = await fetchScoreboardByDate(yesterday);
    res.json(data);
  } catch (error) {
    console.error("Yesterday games fetch error:", error);
    res.status(500).json({ error: "Yesterday games data could not be fetched" });
  }
});

// Boxscore
app.get("/api/boxscore/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    const response = await fetch(
      `https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`
    );

    if (!response.ok) {
      throw new Error(`Boxscore HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Boxscore fetch error:", error);
    res.status(500).json({ error: "Boxscore data could not be fetched" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});