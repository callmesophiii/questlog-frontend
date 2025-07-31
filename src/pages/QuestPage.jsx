import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function QuestPage() {
  const { id } = useParams();
  const { hero, setHero } = useContext(AuthContext);
  const [quest, setQuest] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [canJoin, setCanJoin] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestAndObjectives() {
      try {
        setLoading(true);
        const questRes = await api.get(`/quests/${id}`);
        setQuest(questRes.data);

        const isOwner = questRes.data.owner._id === hero._id;
        const isCollaborator = questRes.data.collaborators.some(c => c._id === hero._id);
        setCanJoin(!isOwner && !isCollaborator);

        const objRes = await api.get(`/quests/${id}/objectives`);
        setObjectives(objRes.data);
      } catch (err) {
        console.error("Failed to load quest or objectives", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestAndObjectives();
  }, [id, hero._id]);

  const handleJoinQuest = async () => {
    try {
      const res = await api.put(`/quests/${id}/join`);
      setQuest(res.data.quest);
      setCanJoin(false);
      alert("You’ve joined the quest!");
    } catch (err) {
      console.error("Failed to join quest", err);
      const msg = err.response?.data?.error || "Failed to join quest.";
      alert(msg);
    }
  };

  const handleAddObjective = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Objective title is required");

    try {
      const res = await api.post(`/quests/${id}/objectives`, {
        title,
        description,
        xpReward: 200,
      });
      setObjectives((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
    } catch {
      alert("Failed to add objective");
    }
  };

  const updateObjective = async (objectiveId, updates) => {
    try {
      const existing = objectives.find((o) => o._id === objectiveId);
      const wasDone = existing.status === "Done";

      const res = await api.put(`/quests/${id}/objectives/${objectiveId}`, updates);
      const updated = res.data;

      setObjectives((prev) =>
        prev.map((obj) => (obj._id === objectiveId ? updated : obj))
      );

      if (!wasDone && updates.status === "Done") {
        const newXP = hero.xp + (updated.xpReward || 200);
        const newLevel = Math.floor(newXP / 5000) + 1;
        const updatedHero = { ...hero, xp: newXP, level: newLevel };
        setHero(updatedHero);
        localStorage.setItem("hero", JSON.stringify(updatedHero));
      }
    } catch {
      alert("Failed to update objective");
    }
  };

  const deleteObjective = async (objectiveId) => {
    if (!window.confirm("Delete this objective?")) return;

    try {
      await api.delete(`/quests/${id}/objectives/${objectiveId}`);
      setObjectives((prev) => prev.filter((obj) => obj._id !== objectiveId));
    } catch {
      alert("Failed to delete objective");
    }
  };

  const handleCompleteQuest = async () => {
    if (!window.confirm("Mark quest as complete?")) return;

    try {
      const res = await api.put(`/quests/${id}`, { completed: true });
      setQuest(res.data);
    } catch {
      alert("Failed to complete quest.");
    }
  };

  const isMember = quest && (quest.owner._id === hero._id || quest.collaborators.some(c => c._id === hero._id));
  const allObjectivesDone = objectives.length > 0 && objectives.every(o => o.status === "Done");

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Loading quest...</p>;
  if (!quest) return <p style={{ color: "red", textAlign: "center" }}>Quest not found.</p>;

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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Link to="/" style={{ color: "#f1c40f", textDecoration: "underline", fontWeight: "bold" }}>🏠 Dashboard</Link>
        <Link to="/profile" style={{ color: "#f1c40f", textDecoration: "underline", fontWeight: "bold" }}>🧝 Profile</Link>
      </div>

      <h1 style={{ color: "#f1c40f", marginBottom: "0.5rem", fontSize: "1.8rem" }}>🗺️ {quest.title}</h1>
      <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>{quest.description}</p>

      {canJoin && (
        <button
          onClick={handleJoinQuest}
          style={{
            background: "#3498db",
            border: "none",
            padding: "0.6rem 1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
            maxWidth: "300px",
            color: "white"
          }}
        >
          🤝 Join Quest
        </button>
      )}

      {quest.completed && (
        <p style={{ color: "#2ecc71", fontWeight: "bold", marginBottom: "1rem" }}>
          ✅ This quest is complete!
        </p>
      )}

      {!quest.completed && allObjectivesDone && isMember && (
        <button
          onClick={handleCompleteQuest}
          style={{
            background: "#2ecc71",
            border: "none",
            padding: "0.6rem 1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
            maxWidth: "300px",
          }}
        >
          🎉 Complete Quest
        </button>
      )}

      <h2 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Objectives</h2>
      {objectives.length === 0 && <p>No objectives yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {objectives.map(({ _id, title, status }) => (
          <li
            key={_id}
            style={{
              background: "#333",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <strong style={{ fontSize: "1.1rem" }}>{title}</strong>
            {isMember && (
              <>
                <label style={{ margin: "0.5rem 0" }}>
                  Status:{" "}
                  <select
                    value={status}
                    onChange={(e) => updateObjective(_id, { status: e.target.value })}
                    style={{
                      padding: "0.4rem",
                      backgroundColor: "#222",
                      color: "white",
                      borderRadius: "4px",
                      border: "1px solid #999",
                      width: "100%",
                      maxWidth: "200px",
                    }}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </label>
                <button
                  onClick={() => deleteObjective(_id)}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "0.4rem",
                    borderRadius: "5px",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {isMember && (
        <>
          <h3 style={{ fontSize: "1.3rem", marginTop: "1.5rem" }}>Add New Objective</h3>
          <form onSubmit={handleAddObjective} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="Objective Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "1px solid #666",
                backgroundColor: "#222",
                color: "white",
              }}
            />
            <textarea
              placeholder="Objective Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "6px",
                fontSize: "1rem",
                minHeight: "80px",
                border: "1px solid #666",
                backgroundColor: "#222",
                color: "white",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#f7cc1fff",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
                width: "100%",
                maxWidth: "300px",
              }}
            >
              ➕ Add Objective
            </button>
          </form>
        </>
      )}

      {/* Collaborators */}
      <h3 style={{ marginTop: "2rem" }}>Collaborators</h3>
        {console.log("Collaborators:", quest.collaborators)}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {quest.collaborators.map((c, i) => (
        
          <li key={c._id || `${c.username}-${i}`} style={{ marginBottom: "0.5rem" }}>
            🧝 {c.username}
          </li>
        ))}
      </ul>

      {/* Invite Hero Form */}
      {isMember && (
        <>
          <h3>Invite Hero</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!inviteName.trim()) return alert("Username required");

              try {
                const res = await api.put(`/quests/${id}/invite`, { username: inviteName });
                setQuest(res.data.quest);
                setInviteName("");
                alert("Hero invited!");
              } catch (err) {
                const msg = err.response?.data?.error || "Failed to invite.";
                alert(msg);
              }
            }}
            style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}
          >
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Enter hero username"
              style={{
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #888",
                flexGrow: 1,
                backgroundColor: "#222",
                color: "white"
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#f39c12",
                color: "white",
                border: "none",
                padding: "0.4rem 1rem",
                borderRadius: "6px",
                fontWeight: "bold"
              }}
            >
              Invite
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default QuestPage;
