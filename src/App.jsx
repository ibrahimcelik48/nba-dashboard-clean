import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://nba-dashboard-backend.onrender.com/api/games")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend error");
        }
        return res.json();
      })
      .then((data) => {
        setGames(data.games);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Veri alınamadı");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <h1>NBA Dashboard</h1>

      {loading && <p>Yükleniyor...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && games.length === 0 && (
        <p>Bugün maç yok</p>
      )}

      <div className="grid">
        {games.map((game) => (
          <div className="card" key={game.id}>
            <div className="inner">

              {/* FRONT */}
              <div className="front">
                <img src={game.homeLogo} alt="" />
                <h3>{game.home}</h3>

                <span>VS</span>

                <img src={game.awayLogo} alt="" />
                <h3>{game.away}</h3>
              </div>

              {/* BACK */}
              <div className="back">
                <h2>
                  {game.homeScore} - {game.awayScore}
                </h2>

                <p>{game.status}</p>

                <p>
                  {new Date(game.date).toLocaleString()}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;