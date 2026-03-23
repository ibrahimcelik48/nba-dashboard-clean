import { useEffect, useState } from "react";

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("https://nba-dashboard-backend.onrender.com/api/games/next")
      .then((res) => res.json())
      .then((data) => {
        console.log("GELEN DATA:", data);

        // 🔥 KRİTİK SATIR
        setGames(data.upcoming || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <h1>NBA Dashboard</h1>

      <h2>Yaklaşan Maçlar</h2>

      {games.length === 0 ? (
        <p>Maç bulunamadı</p>
      ) : (
        <div>
          {games.map((team) => (
            <div key={team.id} style={{ margin: "20px" }}>
              <img src={team.logo} width="80" />
              <h3>{team.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;