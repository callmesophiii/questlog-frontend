import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import XPBar from "../components/XPBar";
import { Link } from "react-router-dom";

function ProfilePage() {
  const { token } = useContext(AuthContext);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar1.png");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await api.get("/heroes/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHero(res.data);
        setSelectedAvatar(res.data.avatar);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchHero();
  }, [token]);


  const handleAvatarChange = async () => {
    try {
      await api.put(
        "/auth/avatar",
        { avatar: selectedAvatar },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ Avatar updated!");
    } catch (error) {
      console.error("Failed to update avatar:", error);
      setMessage("❌ Avatar update failed.");
    }
  };

  if (loading) return <p style={{ color: "white" }}>Loading profile...</p>;
  if (!hero) return <p style={{ color: "red" }}>Hero not found.</p>;

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "2rem auto",
        padding: "1.5rem",
        background:
          "linear-gradient(to bottom, #1e1e2f, #2d2d44)",
        borderRadius: "12px",
        color: "white",
        boxShadow: "0 0 15px rgba(0,0,0,0.7)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: "1rem",
          color: "#f1c40f",
          fontWeight: "bold",
        }}
      >
        🧝🏼 Hero Profile
      </h1>

      <Link
      to="/"
      style={{
        display: "inline-block",
        marginBottom: "1rem",
        color: "#f1c40f",
        textDecoration: "underline",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      🏠 Back to Dashboard
    </Link>

      <img
        src={`/avatars/${hero.avatar}`}
        alt="Hero Avatar"
        width={150}
        style={{
          display: "block",
          margin: "0 auto 1rem auto",
          borderRadius: "50%",
          border: "4px solid #f1c40f",
        }}
      />

      <h2 style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        {hero.username}
      </h2>

      <p style={{ textAlign: "center", margin: "0.25rem 0" }}>
        Level: {hero.level}
      </p>
      <p style={{ textAlign: "center", margin: "0.25rem 0 1rem 0" }}>
        XP: {hero.xp}
      </p>

      <XPBar xp={hero.xp} level={hero.level} />

      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>🎨 Change Avatar</h3>
        <select
          value={selectedAvatar}
          onChange={(e) => setSelectedAvatar(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#333",
            color: "white",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="avatar1.png">🧝‍♀️ Traveler</option>
          <option value="avatar2.png">⚒️ Blacksmith</option>
          <option value="avatar3.png">🛡️ Knight</option>
          <option value="avatar4.png">🪄 Spellcaster</option>
        </select>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <img
            src={`/avatars/${selectedAvatar}`}
            alt="Selected Avatar Preview"
            width={80}
            height={80}
            style={{ borderRadius: "50%", border: "2px solid white" }}
          />
          <button
            onClick={handleAvatarChange}
            style={{
              backgroundColor: "#f1c40f",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#000",
              flexShrink: 0,
            }}
          >
            Update Avatar
          </button>
        </div>
      </div>

      {message && (
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            color: message.startsWith("✅") ? "#2ecc71" : "#e74c3c",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
