import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function App() {
  const [todayGames, setTodayGames] = useState([]);
  const [nextGames, setNextGames] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    try {
      const res = await fetch(url);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      return await res.json();
    } catch (err) {
      console.error("FETCH ERROR:", err);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const today = await fetchData(
          `${API_BASE_URL}/api/games/today`
        );

        const next = await fetchData(
          `${API_BASE_URL}/api/games/next`
        );

        setTodayGames(today);
        setNextGames(next);
      } catch (err) {
        setError("Sunucu uyanıyor... tekrar deneyin ⏳");
      }
    };

    loadData();
  }, []);

  return (
    <div className="container">
      <h1>NBA Dashboard</h1>

      {error && <p style={{ color: "orange" }}>{error}</p>}

      <h2>Bugünün Maçları</h2>
      {todayGames.length === 0 ? (
        <p>Maç bulunamadı</p>
      ) : (
        todayGames.map((g, i) => (
          <div key={i} className="card">
            <p>
              {g.teams?.home?.name} vs {g.teams?.away?.name}
            </p>
          </div>
        ))
      )}

      <h2>Yaklaşan Maçlar</h2>
      {nextGames.length === 0 ? (
        <p>Maç bulunamadı</p>
      ) : (
        nextGames.map((g, i) => (
          <div key={i} className="card">
            <p>
              {g.teams?.home?.name} vs {g.teams?.away?.name}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;