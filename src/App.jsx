import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://nba-dashboard-backend.onrender.com/api/games")
      .then(res => res.json())
      .then(data => {
        setGames(data.games);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Yükleniyor...</h2>;

  return (
    <div className="app">
      <h1>NBA Dashboard</h1>

      <div className="grid">
        {games.map(game => (
          <div className="card" key={game.id}>
            <div className="inner">

              {/* FRONT */}
              <div className="front">
                <img src={game.homeLogo} />
                <h3>{game.home}</h3>

                <span>VS</span>

                <img src={game.awayLogo} />
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