import "./App.css";
import { useEffect, useState } from "react";

// 🔥 BURASI: API BASE URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function App() {
  const [todayGames, setTodayGames] = useState([]);
  const [nextGames, setNextGames] = useState([]);
  const [nextGamesDate, setNextGamesDate] = useState("");
  const [flippedCards, setFlippedCards] = useState({});
  const [topPlayersByGame, setTopPlayersByGame] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function getStatusLabel(game) {
    const text = (game.statusText || "").toLowerCase();

    if (text.includes("final")) return "FINAL";
    if (
      text.includes("q1") ||
      text.includes("q2") ||
      text.includes("q3") ||
      text.includes("q4") ||
      text.includes("halftime") ||
      text.includes("half") ||
      text.includes("ot")
    ) {
      return "LIVE";
    }

    return "SCHEDULED";
  }

  function getStatusClass(game) {
    const label = getStatusLabel(game);

    if (label === "LIVE") return "status-badge live";
    if (label === "FINAL") return "status-badge final";
    return "status-badge scheduled";
  }

  function normalizeTodayGame(game) {
    return {
      gameId: game?.gameId,
      home: game?.homeTeam?.teamName || "Home Team",
      away: game?.awayTeam?.teamName || "Away Team",
      homeScore: Number(game?.homeTeam?.score ?? 0),
      awayScore: Number(game?.awayTeam?.score ?? 0),
      statusText: game?.gameStatusText || "Durum yok",
      status: Number(game?.gameStatus ?? 1),
    };
  }

  function normalizeDateBasedGame(game) {
    return {
      gameId: game?.gameId,
      home:
        game?.homeTeam?.teamName ||
        game?.homeTeam?.teamTricode ||
        "Home Team",
      away:
        game?.awayTeam?.teamName ||
        game?.awayTeam?.teamTricode ||
        "Away Team",
      homeScore: Number(game?.homeTeam?.score ?? 0),
      awayScore: Number(game?.awayTeam?.score ?? 0),
      statusText: game?.gameStatusText || "Scheduled",
      status: Number(game?.gameStatus ?? 1),
    };
  }

  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        setError("");

        const [todayResponse, nextResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/games/today`),
          fetch(`${API_BASE_URL}/api/games/next`),
        ]);

        if (!todayResponse.ok) {
          throw new Error(`Today HTTP ${todayResponse.status}`);
        }

        if (!nextResponse.ok) {
          throw new Error(`Next HTTP ${nextResponse.status}`);
        }

        const todayData = await todayResponse.json();
        const nextData = await nextResponse.json();

        const todayRawGames = todayData?.scoreboard?.games ?? [];
        const nextRawGames = nextData?.games ?? [];

        setTodayGames(todayRawGames.map(normalizeTodayGame));
        setNextGamesDate(nextData?.date || "");
        setNextGames(nextRawGames.map(normalizeDateBasedGame));
      } catch (err) {
        console.error("Games could not be fetched:", err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAllGames();
  }, []);

  const handleFlip = async (cardKey, gameId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));

    if (!topPlayersByGame[gameId]) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/boxscore/${gameId}`
        );

        if (!response.ok) {
          throw new Error(`Boxscore HTTP ${response.status}`);
        }

        const data = await response.json();

        const homePlayers = data?.game?.homeTeam?.players || [];
        const awayPlayers = data?.game?.awayTeam?.players || [];
        const allPlayers = [...homePlayers, ...awayPlayers];

        const sortedPlayers = allPlayers
          .map((player) => ({
            name:
              player?.firstName && player?.familyName
                ? `${player.firstName} ${player.familyName}`
                : "Unknown Player",
            points: Number(player?.statistics?.points ?? 0),
          }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 3);

        setTopPlayersByGame((prev) => ({
          ...prev,
          [gameId]: sortedPlayers,
        }));
      } catch (err) {
        console.error("Oyuncu verileri alınamadı:", err);
      }
    }
  };

  const todayPlayedOrLiveGames = todayGames.filter(
    (game) => game.status !== 1
  );
  const todayScheduledGames = todayGames.filter(
    (game) => game.status === 1
  );

  const renderGameCards = (games, prefix) => {
    if (games.length === 0) {
      return <p>Maç yok.</p>;
    }

    return (
      <div className="games">
        {games.map((game, index) => {
          const cardKey = `${prefix}-${index}`;

          return (
            <div
              key={game.gameId || cardKey}
              className="flip-card"
              onClick={() => handleFlip(cardKey, game.gameId)}
            >
              <div
                className={`flip-card-inner ${
                  flippedCards[cardKey] ? "flipped" : ""
                }`}
              >
                <div className="flip-card-front">
                  <div className={getStatusClass(game)}>
                    {getStatusLabel(game)}
                  </div>

                  <p className="match-title">
                    {game.away} vs {game.home}
                  </p>

                  <h2>
                    {game.awayScore} - {game.homeScore}
                  </h2>

                  <span className="status-text">
                    {game.statusText}
                  </span>
                </div>

                <div className="flip-card-back">
                  <h3>Top Scorers</h3>

                  {topPlayersByGame[game.gameId] ? (
                    <ul>
                      {topPlayersByGame[game.gameId].map((player, i) => (
                        <li key={i}>
                          {player.name} - {player.points}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Oyuncular yükleniyor...</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="page">
      <h1>NBA Dashboard</h1>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}

      {!loading && !error && (
        <>
          <section>
            <h2 className="section-title">
              Bugünün Canlı / Biten Maçları
            </h2>
            {todayPlayedOrLiveGames.length === 0 ? (
              <p>Henüz oynanan maç yok.</p>
            ) : (
              renderGameCards(todayPlayedOrLiveGames, "today-played")
            )}
          </section>

          <section>
            <h2 className="section-title">
              Bugünün Oynanacak Maçları
            </h2>
            {todayScheduledGames.length === 0 ? (
              <p>Bugün için planlanmış maç yok.</p>
            ) : (
              renderGameCards(todayScheduledGames, "today-scheduled")
            )}
          </section>

          <section>
            <h2 className="section-title">
              Sıradaki Maçlar{" "}
              {nextGamesDate ? `(${nextGamesDate})` : ""}
            </h2>
            {nextGames.length === 0 ? (
              <p>Sıradaki maç bulunamadı.</p>
            ) : (
              renderGameCards(nextGames, "next")
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default App;
console.log("ENV:", import.meta.env.VITE_API_BASE_URL);