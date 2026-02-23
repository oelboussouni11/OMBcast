import { useState } from "react";

const API = "http://127.0.0.1:8000";

const inputStyle = {
  width: "100%",
  background: "#080a0f",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "9px 12px",
  color: "#e4e8f1",
  fontSize: 13,
  fontFamily: "'JetBrains Mono', monospace",
  outline: "none",
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: "#4a5568",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 6,
  display: "block",
};

export default function BacktestPanel({ data }) {
  const [patternLength, setPatternLength] = useState(20);
  const [forecastHorizon, setForecastHorizon] = useState(30);
  const [topK, setTopK] = useState(5);
  const [method, setMethod] = useState("euclidean");
  const [numTests, setNumTests] = useState(50);
  const [testAll, setTestAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runBacktest = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);
    setProgressText("Starting...");
    try {
      const response = await fetch(`${API}/api/backtest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          pattern_length: patternLength,
          forecast_horizon: forecastHorizon,
          top_k: topK,
          method,
          num_tests: testAll ? null : numTests,
          test_all: testAll,
        }),
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const cleaned = line.replace("data: ", "").trim();
          if (!cleaned) continue;
          try {
            const update = JSON.parse(cleaned);
            if (update.type === "progress") {
              setProgress(update.progress);
              setProgressText(`${update.current} / ${update.total}`);
            } else if (update.type === "result") {
              setResult(update);
            } else if (update.type === "error") {
              setError(update.message);
            }
          } catch {}
        }
      }
    } catch {
      setError("Backtest failed");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
          Backtesting
        </h3>
        <p style={{ fontSize: 12, color: "#4a5568" }}>
          Validate the strategy across historical data
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <label style={labelStyle}>Pattern Length</label>
          <input
            type="number"
            value={patternLength}
            onChange={(e) => setPatternLength(Number(e.target.value))}
            min={5}
            max={200}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Forecast</label>
          <input
            type="number"
            value={forecastHorizon}
            onChange={(e) => setForecastHorizon(Number(e.target.value))}
            min={5}
            max={100}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Top K</label>
          <input
            type="number"
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            min={1}
            max={20}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{testAll ? "All" : "Num Tests"}</label>
          <input
            type="number"
            value={numTests}
            onChange={(e) => setNumTests(Number(e.target.value))}
            min={5}
            max={500}
            disabled={testAll}
            style={{ ...inputStyle, opacity: testAll ? 0.3 : 1 }}
          />
        </div>
        <div>
          <label style={labelStyle}>Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{
              ...inputStyle,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <option value="euclidean">Euclidean</option>
            <option value="dtw">DTW</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={runBacktest}
          disabled={loading}
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            fontFamily: "inherit",
            opacity: loading ? 0.5 : 1,
            boxShadow: "0 2px 12px rgba(37,99,235,0.3)",
          }}
        >
          {loading ? "Running..." : "Run Backtest"}
        </button>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            onClick={() => setTestAll(!testAll)}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: testAll ? "#3b82f6" : "rgba(255,255,255,0.08)",
              position: "relative",
              transition: "background 0.2s",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "white",
                position: "absolute",
                top: 2,
                left: testAll ? 18 : 2,
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: "#7a869a" }}>Test all</span>
        </label>
      </div>

      {loading && (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#4a5568",
              marginBottom: 6,
            }}
          >
            <span className="mono">{progressText}</span>
            <span className="mono">{progress}%</span>
          </div>
          <div
            style={{
              background: "#080a0f",
              borderRadius: 4,
              height: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #2563eb, #60a5fa)",
                height: "100%",
                borderRadius: 4,
                width: `${progress}%`,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 14,
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#f87171",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              { label: "Tests", value: result.total_tests },
              {
                label: "Direction",
                value: `${result.direction_accuracy}%`,
                color: result.direction_accuracy >= 50 ? "#10b981" : "#ef4444",
              },
              {
                label: "Range",
                value: `${result.avg_range_accuracy}%`,
                color: "#f59e0b",
              },
              {
                label: "Method",
                value: result.method.toUpperCase(),
                color: "#60a5fa",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#4a5568",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 4,
                  }}
                >
                  {s.label}
                </p>
                <p
                  className="mono"
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: s.color || "#e4e8f1",
                  }}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#4a5568",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            Results ({result.details.length})
          </p>
          <div
            style={{
              maxHeight: 240,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {result.details.map((d, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#080a0f",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    className="mono"
                    style={{ color: "#4a5568", width: 24 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mono" style={{ color: "#7a869a" }}>
                    {d.date || `idx ${d.test_index}`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="mono" style={{ color: "#7a869a" }}>
                    {d.range_accuracy}%
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: d.direction_correct
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(239,68,68,0.1)",
                      color: d.direction_correct ? "#10b981" : "#ef4444",
                      border: d.direction_correct
                        ? "1px solid rgba(16,185,129,0.2)"
                        : "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    {d.direction_correct ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
