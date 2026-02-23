import { useState } from "react";
import axios from "axios";

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
  transition: "border-color 0.2s",
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

export default function PatternPanel({
  data,
  selectedIndex,
  selectedDate,
  onResult,
}) {
  const [patternLength, setPatternLength] = useState(20);
  const [forecastHorizon, setForecastHorizon] = useState(30);
  const [topK, setTopK] = useState(5);
  const [method, setMethod] = useState("euclidean");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runPatternMatch = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.post(`${API}/api/pattern`, {
        data,
        selected_index: selectedIndex,
        pattern_length: patternLength,
        forecast_horizon: forecastHorizon,
        top_k: topK,
        method,
      });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResult(res.data);
        if (onResult) onResult(res.data);
      }
    } catch {
      setError("Pattern matching failed");
    }
    setLoading(false);
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d;
    }
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
          Pattern Matching
        </h3>
        <p style={{ fontSize: 12, color: "#4a5568" }}>
          Selected:{" "}
          <span className="mono" style={{ color: "#7a869a" }}>
            {formatDate(selectedDate)}
          </span>
          <span style={{ margin: "0 6px" }}>·</span>
          Index{" "}
          <span className="mono" style={{ color: "#7a869a" }}>
            {selectedIndex}
          </span>
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
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
          <label style={labelStyle}>Forecast Horizon</label>
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

      <button
        onClick={runPatternMatch}
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
          transition: "all 0.2s",
        }}
      >
        {loading ? "Searching..." : "Find Patterns"}
      </button>

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
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              { label: "Matches", value: result.matches.length },
              {
                label: "Scanned",
                value: result.total_matches_scanned.toLocaleString(),
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
            Top Matches
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {result.matches.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#080a0f",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 8,
                  padding: "10px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#60a5fa",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: 12, color: "#7a869a" }}
                  >
                    {m.match_start} → {m.match_end}
                  </span>
                </div>
                <span
                  className="mono"
                  style={{ fontSize: 12, color: "#e4e8f1" }}
                >
                  {m.distance.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
