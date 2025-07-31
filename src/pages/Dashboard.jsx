import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import QuestForm from "../components/QuestForm";
import { Link, useNavigate } from "react-router-dom";
import XPBar from "../components/XPBar";

function Dashboard() {
  const { hero, logout } = useContext(AuthContext);
  const [allQuests, setAllQuests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const res = await api.get("/quests");
        console.log("Fetched quests:", res.data);
        setAllQuests(res.data);
      } catch (err) {
        console.error("Failed to load quests", err);
      }
    };

    fetchQuests();
  }, []);

  const handleQuestCreated = (newQuest) => {
    setAllQuests((prev) => [newQuest, ...prev]);
  };

  const handleLogout = () => {
    logout();
    alert("You have been logged out.");
    navigate("/register");
  };

  const ownedQuests = allQuests.filter((q) => q.owner._id === hero._id);
  const joinedQuests = allQuests.filter(
    (q) => q.owner._id !== hero._id && q.collaborators.some((c) => c._id === hero._id)
  );

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        padding: "1.5rem",
        background: "linear-gradient(to bottom, #1e1e2f, #2d2d44)",
        borderRadius: "12px",
        color: "white",
        boxShadow: "0 0 15px rgba(0,0,0,0.6)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
        <Link
          to="/profile"
          style={{ color: "#f1c40f", textDecoration: "underline", fontWeight: "bold" }}
        >
          🧝 Profile
        </Link>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "0.4rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚪 Logout
        </button>
      </header>

      <h1>Welcome, {hero?.username}!</h1>
      <p>Level: {hero?.level}</p>

      <XPBar xp={hero?.xp} level={hero?.level} />

      {hero?.avatar && (
        <img
          src={`/avatars/${hero.avatar}`}
          alt="Your Avatar"
          width={100}
          style={{ borderRadius: "50%", marginBottom: "1rem", border: "2px solid #888" }}
        />
      )}

      <QuestForm onQuestCreated={handleQuestCreated} />

      {/* === Owned Quests === */}
      <h2 style={{ marginTop: "2rem" }}>🛡️ Your Quests</h2>
      {ownedQuests.length === 0 && <p>You haven’t created any quests yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {ownedQuests.map((quest) => (
          <li
            key={quest._id}
            style={{
              background: "#333",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <Link
              to={`/quests/${quest._id}`}
              style={{ color: "#f1c40f", fontWeight: "bold", textDecoration: "none" }}
            >
              🗺️ {quest.title}
            </Link>
            <p>{quest.description || "No description."}</p>
            <p>Status: {quest.completed ? "✅ Completed" : "🧭 In Progress"}</p>
          </li>
        ))}
      </ul>

      {/* === Joined Quests === */}
      {joinedQuests.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem" }}>🤝 Joined Quests</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {joinedQuests.map((quest) => (
              <li
                key={quest._id}
                style={{
                  background: "#2c2f48",
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <Link
                  to={`/quests/${quest._id}`}
                  style={{ color: "#f1c40f", fontWeight: "bold", textDecoration: "none" }}
                >
                  🗺️ {quest.title}
                </Link>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    backgroundColor: "#f39c12",
                    color: "#000",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  Joined Quest
                </span>
                <p>{quest.description || "No description."}</p>
                <p>Status: {quest.completed ? "✅ Completed" : "🧭 In Progress"}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Dashboard;
