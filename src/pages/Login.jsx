import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password }
      );
      login(res.data);
      navigate("/");
    } catch (err) {
      setError("Login failed. Check your email and password.");
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
      }}
    >
      <div
        style={{
          background: "#2c2f4a",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#f1c40f" }}>⚔️ QuestLog</h1>
        <p style={{ textAlign: "center", marginBottom: "1.5rem", fontStyle: "italic" }}>
          Welcome back, hero. Log in to begin your quest.
        </p>

        <form onSubmit={handleSubmit}>
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
          {error && <p style={{ color: "tomato", textAlign: "center" }}>{error}</p>}
          <button type="submit" style={buttonStyle}>
            🛡️ Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          New here?{" "}
          <a href="/register" style={{ color: "#f1c40f", textDecoration: "underline" }}>
            Register
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

export default Login;
