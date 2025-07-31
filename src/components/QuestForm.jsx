import { useState } from "react";
import api from "../api";

function QuestForm({ onQuestCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Quest title is required.");

    try {
      const res = await api.post("/quests", { title, description });
      console.log("Quest created:", res.data);
      setTitle("");
      setDescription("");
      onQuestCreated(res.data);
    } catch (err) {
      alert("Failed to create quest");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "#292943",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        color: "white",
      }}
    >
      <h3 style={{ marginBottom: "1rem", color: "#f1c40f" }}>📝 Create a New Quest</h3>
      <input
        type="text"
        placeholder="Quest Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #666",
          backgroundColor: "#222",
          color: "white",
        }}
      />
      <textarea
        placeholder="Quest Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #666",
          backgroundColor: "#222",
          color: "white",
          marginBottom: "0.5rem",
        }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: "#1c8ad3ff",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
      Start Quest
      </button>
    </form>
  );
}

export default QuestForm;
