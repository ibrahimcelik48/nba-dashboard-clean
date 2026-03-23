import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://nba-dashboard-backend.onrender.com/api/games")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend hata verdi");
        }
        return res.json();
      })
      .then((data) => {
        setGames(data.games);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="app">
      <h1>NBA Dashboard</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="container">
        {games.map((game) => (
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
                <h2>{game.homeScore} - {game.awayScore}</h2>
                <p>{game.date}</p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;