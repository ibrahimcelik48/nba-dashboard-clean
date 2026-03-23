import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://nba-dashboard-backend.onrender.com";

function App() {
  const [todayGames, setTodayGames] = useState([]);
  const [nextGames, setNextGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/games/next`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setNextGames(data.upcoming || []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>NBA Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Bugünün Maçları</h2>
      {todayGames.length === 0 && <p>Maç bulunamadı</p>}

      <h2>Yaklaşan Maçlar</h2>
      {nextGames.length === 0 ? (
        <p>Maç bulunamadı</p>
      ) : (
        nextGames.map((team, index) => (
          <p key={index}>{team.team_name || "Takım"}</p>
        ))
      )}
    </div>
  );
}

export default App;