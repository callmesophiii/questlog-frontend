import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("avatar1.png");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        { username, email, password, avatar }
      );
      login(res.data);
      navigate("/");
    } catch (err) {
      setError("Registration failed.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #1e1e2f, #2d2d44)",
        fontFamily: "Arial, sans-serif",
        color: "white",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#2c2f4a",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#f1c40f" }}>🛡️ QuestLog</h1>
        <p style={{ textAlign: "center", fontStyle: "italic", marginBottom: "1.5rem" }}>
          Register your hero to begin your journey.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Hero Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={{ marginBottom: "0.5rem", display: "block" }}>
            Choose your Avatar:
          </label>
          <select
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            style={inputStyle}
          >
            <option value="avatar1.png">🧝‍♀️ Traveler</option>
            <option value="avatar2.png">⚒️ Blacksmith</option>
            <option value="avatar3.png">🛡️ Knight</option>
            <option value="avatar4.png">🪄 Spellcaster</option>
          </select>

          <div style={{ textAlign: "center", margin: "1rem 0" }}>
            <img
              src={`/avatars/${avatar}`}
              alt="Selected Avatar"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #888",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "tomato", textAlign: "center", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <button type="submit" style={buttonStyle}>
            ✨ Register Hero
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already enlisted?{" "}
          <a href="/login" style={{ color: "#f1c40f", textDecoration: "underline" }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #666",
  backgroundColor: "#222",
  color: "white",
};

const buttonStyle = {
  width: "100%",
  padding: "0.6rem",
  backgroundColor: "#f1c40f",
  color: "#222",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Register;
