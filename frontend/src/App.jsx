import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const improvePrompt = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/prompt/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      console.log("FRONTEND RESULT:", data);
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Promptica</h1>
        <p style={styles.subtitle}>AI Prompt Intelligence Engine</p>

        <textarea
          style={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
        />

        <button style={styles.button} onClick={improvePrompt}>
          {loading ? "Analyzing..." : "Improve Prompt"}
        </button>

        {result && (
          <div style={styles.grid}>
            {/* SCORE + CATEGORY */}
            <div style={styles.card}>
              <h3>Analysis</h3>

              <p>
                <strong>Category:</strong>{" "}
                {result.analysis?.category || "N/A"}
              </p>

              <p>
                <strong>Intents:</strong>
              </p>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(result.analysis?.intents || []).map((intent, i) => (
                  <span key={i} style={styles.tag}>
                    {intent}
                  </span>
                ))}
              </div>

              <p style={{ marginTop: "10px" }}>
                <strong>Score:</strong>{" "}
                {result?.analysis?.score !== undefined
                  ? result.analysis.score
                  : "N/A"}
              </p>
            </div>

            {/* FEEDBACK */}
            <div style={styles.card}>
              <h3>Feedback</h3>
              <ul>
                {(result.feedback || []).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* IMPROVED PROMPT */}
            <div style={styles.cardFull}>
              <h3>Improved Prompt</h3>
              <pre style={styles.pre}>
                {typeof result.improved === "string"
                  ? result.improved
                  : JSON.stringify(result.improved, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "40px",
    fontFamily: "Arial",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  title: {
    fontSize: "42px",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "15px",
  },
  button: {
    padding: "12px 18px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "25px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
  },
  cardFull: {
    gridColumn: "span 2",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
  },
  pre: {
    whiteSpace: "pre-wrap",
    background: "#0b1220",
    padding: "12px",
    borderRadius: "8px",
  },
  tag: {
    background: "#3b82f6",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    color: "white",
  },
};

export default App;