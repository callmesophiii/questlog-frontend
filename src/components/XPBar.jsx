function XPBar({ xp, level }) {
  const xpPerLevel = 100;
  const xpForPrevLevels = (level - 1) * xpPerLevel;
  const xpIntoCurrentLevel = xp - xpForPrevLevels;
  const progress = (xpIntoCurrentLevel / xpPerLevel) * 100;

  return (
    <div style={{ marginTop: "1rem", fontFamily: "Arial, sans-serif" }}>
      <p style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
        XP: {xpIntoCurrentLevel} / {xpPerLevel}
      </p>
      <div
        style={{
          height: "20px",
          background: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: "#f1c40f",
            height: "100%",
            transition: "width 0.4s ease",
            borderRadius: progress >= 100 ? "10px" : "10px 0 0 10px",
          }}
        />
      </div>
    </div>
  );
}

export default XPBar;
