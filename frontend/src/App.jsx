import { useState, useEffect} from "react";

function App() {

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
 

  const [prompt, setPrompt] = useState(
    localStorage.getItem("promptica_prompt") || ""
  );

  const [result, setResult] = useState(() => {
    const saved =
      localStorage.getItem("promptica_result");

    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState(() => {
    const saved =
      localStorage.getItem("promptica_history");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "promptica_prompt",
      prompt
    );
  }, [prompt]);

  useEffect(() => {
    localStorage.setItem(
      "promptica_result",
      JSON.stringify(result)
    );
  }, [result]);

  useEffect(() => {
    localStorage.setItem(
      "promptica_history",
      JSON.stringify(history)
    );
  }, [history]);

  //The Functions for improving the prompt, copying the result, and getting the score label are defined here.
  const improvePrompt = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/api/prompt/improve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt })
        }
      );

      const data = await res.json();

      console.log("FRONTEND RESULT:", data);

      setResult(data);
      setHistory((prev) => [
        prompt,
        ...prev.filter((p) => p !== prompt)
      ].slice(0, 5));
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(
      result?.improved?.text || ""
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Improvement";
  };

  //HTML and CSS
  const spinner = (
    <span
      style={{
        display: "inline-block",
        animation: "spin 1s linear infinite"
      }}
    >
      ⟳
    </span>
  );
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <img
            src="/promptica-logo.png"
            alt="Promptica"
            style={styles.logo}
          />

          <div style={styles.version}>
            Version 2.0
          </div>
        </div>
  
        <div style={styles.templates}>
          <button
            style={styles.templateBtn}
            onClick={() =>
              setPrompt(
                "I want to build a SaaS application using React and Node.js"
              )
            }
          >
            🚀 SaaS App
          </button>

          <button
            style={styles.templateBtn}
            onClick={() =>
              setPrompt(
                "Teach me React from beginner to advanced level"
              )
            }
          >
            📚 Learn React
          </button>

          <button
            style={styles.templateBtn}
            onClick={() =>
              setPrompt(
                "Help me debug an Express API returning 500 errors"
              )
            }
          >
            🐛 Debug Code
          </button>

          <button
            style={styles.templateBtn}
            onClick={() =>
              setPrompt(
                "Create a complete digital marketing strategy"
              )
            }
          >
            📈 Marketing
          </button>
        </div>
        <div style={styles.textareaWrapper}>
        <textarea
          style={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              if (!loading && prompt.trim()) {
                improvePrompt();
              }
            }
          }}
        />
         <button
          style={styles.clearButton}
          onClick={() => {
            setPrompt("");
            setResult(null);
          }}
        >
          x
        </button>
        </div>
        {history.length > 0 && (
          <div style={styles.historyCard}>
            <h3>Recent Prompts</h3>

            {history.map((item, index) => (
              <div
                key={index}
                style={styles.historyItem}
                onClick={() => setPrompt(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
        <div style={styles.charCount}>
          {prompt.length} characters
        </div>

       <div style={styles.buttonRow}>
        <button
          style={{
            ...styles.button,
            opacity: 7 ? 0.7 : 1
          }}
          disabled={loading}
          onClick={improvePrompt}
        >
          {loading ? (
            <>
              {spinner} Enhancing...
            </>
          ) : (
            "Improve Prompt"
          )}
        </button>

      </div>

        {!result && (
          <div style={styles.welcomeCard}>
            <h3>Ready to Enhance</h3>
            <p>
              Enter a prompt and Promptica will:
            </p>

            <ul>
              <li>Analyze prompt quality</li>
              <li>Detect category and intent</li>
              <li>Generate feedback</li>
              <li>Create an enhanced prompt</li>
            </ul>
          </div>
        )}
        {result && (
          <div style={styles.grid}>
            {/* ANALYSIS */}
            <div style={styles.card}>
              <h3>Analysis</h3>

              <div style={styles.scoreBox}>
                <div
                  style={{
                    ...styles.score,
                    color:
                      result.analysis.score >= 85
                        ? "#22c55e"
                        : result.analysis.score >= 70
                        ? "#3b82f6"
                        : result.analysis.score >= 50
                        ? "#f59e0b"
                        : "#ef4444"
                  }}
                >
                  {result.analysis.score}
                </div>

                <div style={styles.scoreLabel}>
                  {getScoreLabel(result.analysis.score)}
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px"
                }}
              >
                <div
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold"
                  }}
                >
                  Original Length:{" "}
                  {result.original.length}
                </div>

                <div
                  style={{
                    color: "#3b82f6",
                    fontWeight: "bold",
                    marginTop: "5px"
                  }}
                >
                  Enhanced Length:{" "}
                  {result.improved?.text?.length || 0}
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    color: "#f59e0b",
                    fontWeight: "bold"
                  }}
                >
                  +
                  {Math.round(
                    (
                      ((result.improved?.text?.length || 1) -
                        result.original.length) /
                      result.original.length
                    ) *
                      100
                  )}
                  % Detail Increase
                </div>
              </div>
              {/* <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px"
                }}
              >
                <div
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold"
                  }}
                >
                  +{Math.max(
                    0,
                    100 - result.analysis.score 
                  )}
                   Potential Improvement
                </div>
              </div> */}
              <p style={{ textAlign: "center" }}>
                <strong>Category:</strong>{" "}
                {result.analysis.category}
              </p>

              <div style={styles.tags}>
                {(result.analysis.intents || []).map(
                  (intent, i) => (
                    <span key={i} style={styles.tag}>
                      {intent}
                    </span>
                  )
                )}
              </div>

              <div style={{ marginTop: "20px" }}>
                <h4>Quality Breakdown</h4>

                <p>
                  {result.analysis.missing.includes("goal")
                    ? "❌ Goal"
                    : "✅ Goal"}
                </p>

                <p>
                  {result.analysis.missing.includes("details")
                    ? "❌ Details"
                    : "✅ Details"}
                </p>

                <p>
                  {result.analysis.missing.includes(
                    "technology"
                  )
                    ? "❌ Technology"
                    : "✅ Technology"}
                </p>

                <p>
                  {result.analysis.missing.includes(
                    "constraints"
                  )
                    ? "❌ Constraints"
                    : "✅ Constraints"}
                </p>

                <p>
                  {result.analysis.missing.includes(
                    "expected output"
                  )
                    ? "❌ Output Format"
                    : "✅ Output Format"}
                </p>
              </div>
            </div>
            {/* FEEDBACK */}
            <div style={styles.card}>
              <h3>Improvement Suggestions</h3>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px"
                  }}
                >
                  Recommendations generated from prompt analysis.
                </p>
              <div style={styles.feedbackContainer}>
                {(result.feedback || []).map(
                  (item, i) => (
                    <div
                      key={i}
                      style={styles.feedbackItem}
                    >
                      💡 {item}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* IMPROVED PROMPT */}
            {/* BEFORE / AFTER */}
            <div style={styles.cardFull}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h3>Prompt Enhancement</h3>

                <button
                  style={styles.copyButton}
                  onClick={copyPrompt}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>

              <div style={styles.compareGrid}>
                <div>
                  <h4>Original Prompt</h4>

                  <pre style={styles.pre}>
                    {result.original}
                  </pre>
                </div>

                <div>
                  <h4>Enhanced Prompt</h4>

                  <pre style={styles.pre}>
                    {result.improved?.text}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={styles.footer}>
        Promptica © 2026
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#2c354800",
    color: "#e2e8f0",
    padding: "80px",
    fontFamily: "Arial"
  },

  container: {
    maxWidth: "100%",
    margin: "0 auto"
  },

  // title: {
  //   fontSize: "56px",
  //   fontWeight: "800",
  //   letterSpacing: "-2px",
  //   marginBottom: "20px"
  // },

  // subtitle: {
  //   textAlign: "center",
  //   color: "#48484f",
  //   fontWeight: "600",
  //   marginBottom: "10px",
  //   letterSpacing: "3px  "
  // },
  logo: {
    width: "450px",
    maxWidth: "95%",
    display: "block",
    margin: "0 auto"
  },

  hero: {
    textAlign: "center",
    marginBottom: "30px"
  },

  version: {
    color: "#b4addb52",
    fontSize: "10px",
    fontWeight: "300",
    letterSpacing: "4px",
    marginTop: "10px",
    textTransform: "uppercase"
  },
  textarea: {
    width: "100%",
    height: "140px",
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "15px",
    fontSize: "15px"
  },

  button: {
    display: "block",
    margin: "0 auto 30px auto",
    padding: "12px 20px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },

  card: {
    background: "#2c3548",
    padding: "24px",
    borderRadius: "12px",
    minHeight: "260px"
  },

  cardFull: {
    gridColumn: "span 2",
    background: "#2c3548",
    padding: "24px",
    borderRadius: "12px"
  },

  scoreBox: {
    textAlign: "center",
    marginBottom: "20px"
  },

  score: {
    fontSize: "64px",
    fontWeight: "bold",
    lineHeight: "1"
  },

  scoreLabel: {
    color: "#94a3b8",
    marginTop: "8px",
    fontSize: "14px"
  },

  tags: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "8px"
  },

  tag: {
    background: "#3b82f6",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    color: "white",
    fontWeight: "500"
  },

  feedbackList: {
    paddingLeft: "20px",
    lineHeight: "1.8"
  },
  feedbackContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "15px"
  },

  feedbackItem: {
    background: "#0b1220",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "12px",
    lineHeight: "1.6"
  },
  copyButton: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "0.2s"
  },
  compareGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "15px"
  },
  charCount: {
    textAlign: "right",
    color: "#94a3b8",
    marginBottom: "15px",
    fontSize: "13px"
  },
  welcomeCard: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    marginTop: "20px"
  },
  historyCard: {
    background: "#1e293b",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "20px"
  },

  historyItem: {
    padding: "10px",
    borderBottom: "1px solid #334155",
    cursor: "pointer"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "30px"
  },
  textareaWrapper: {
    position: "relative"
  },
  clearButton: {
    position: "absolute",
    top: "14px",
    right: "14px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "50%",
    color: "#94a3b8",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)"
  },
  clearButtonHover: {
    color: "#b20b0b"
  },
  templates: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "20px"
  },

  templateBtn: {
    background: "#1e293b",
    color: "white",
    border: "1px solid #334155",
    borderRadius: "999px",
    padding: "8px 14px",
    cursor: "pointer"
  },
  pre: {
    whiteSpace: "pre-wrap",
    background: "#0b1220",
    padding: "20px",
    borderRadius: "10px",
    lineHeight: "1.8",
    fontSize: "14px",
    overflowX: "auto"
  },
  footer: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "40px",
    fontSize: "13px"
  }
};

export default App;