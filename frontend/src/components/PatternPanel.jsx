import { useState, useMemo } from "react";
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
  fontFamily: "'Space Mono', monospace",
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

function ComparisonLine({ selectedCandles, matchedCandles }) {
  const normalize = (candles) => {
    const first = candles[0].close;
    return candles.map((c) => ((c.close - first) / first) * 100);
  };
  const selNorm = normalize(selectedCandles);
  const matNorm = normalize(matchedCandles);
  const allVals = [...selNorm, ...matNorm];
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1;
  const toY = (val) => 100 - ((val - min) / range) * 100;
  const buildPath = (vals) =>
    vals
      .map((v, i) => {
        const x = (i / (vals.length - 1)) * 100;
        return `${i === 0 ? "M" : "L"} ${x} ${toY(v)}`;
      })
      .join(" ");

  return (
    <div style={{ padding: "8px 0" }}>
      <svg
        viewBox="-2 -5 104 110"
        style={{ width: "100%", height: 180 }}
        preserveAspectRatio="none"
      >
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.3"
          />
        ))}
        <line
          x1="0"
          y1={toY(0)}
          x2="100"
          y2={toY(0)}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.3"
          strokeDasharray="2 2"
        />
        <path
          d={buildPath(selNorm)}
          fill="none"
          stroke="#e4e8f1"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={buildPath(matNorm)}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          marginTop: 4,
          fontSize: 11,
        }}
      >
        <span style={{ color: "#5a6478" }}>
          Your:{" "}
          <span className="mono" style={{ color: "#e4e8f1" }}>
            {selNorm[selNorm.length - 1].toFixed(2)}%
          </span>
        </span>
        <span style={{ color: "#5a6478" }}>
          Match:{" "}
          <span className="mono" style={{ color: "#3b82f6" }}>
            {matNorm[matNorm.length - 1].toFixed(2)}%
          </span>
        </span>
      </div>
    </div>
  );
}

function computeSimilarity(data, startA, startB, length) {
  const norm = (start) => {
    const candles = [];
    for (let i = 0; i < length; i++) {
      const idx = start + i;
      if (idx < 0 || idx >= data.length) break;
      candles.push(data[idx].close);
    }
    if (!candles.length) return [];
    const first = candles[0];
    return candles.map((c) => ((c - first) / first) * 100);
  };
  const a = norm(startA);
  const b = norm(startB);
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const meanA = a.reduce((s, v) => s + v, 0) / n;
  const meanB = b.reduce((s, v) => s + v, 0) / n;
  let num = 0,
    denA = 0,
    denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const corr = denA && denB ? num / Math.sqrt(denA * denB) : 0;
  return Math.max(0, corr * 100);
}

function SimilarityBadge({ similarity }) {
  const sim = similarity;
  const color = sim > 70 ? "#10b981" : sim > 40 ? "#f59e0b" : "#ef4444";
  const bg =
    sim > 70
      ? "rgba(16,185,129,0.08)"
      : sim > 40
        ? "rgba(245,158,11,0.08)"
        : "rgba(239,68,68,0.08)";
  const border =
    sim > 70
      ? "rgba(16,185,129,0.2)"
      : sim > 40
        ? "rgba(245,158,11,0.2)"
        : "rgba(239,68,68,0.2)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: "8px 14px",
      }}
    >
      <div style={{ textAlign: "right" }}>
        <p style={{ fontSize: 10, color: "#5a6478", marginBottom: 2 }}>
          Similarity
        </p>
        <p
          className="mono"
          style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1 }}
        >
          {sim.toFixed(1)}%
        </p>
      </div>
      <div style={{ width: 40, height: 40 }}>
        <svg
          viewBox="0 0 36 36"
          style={{ width: 40, height: 40, transform: "rotate(-90deg)" }}
        >
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${sim * 0.94} 100`}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

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
  const [selectedMatch, setSelectedMatch] = useState(null);

  const runPatternMatch = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setSelectedMatch(null);
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

  const matchesWithSim = useMemo(() => {
    if (!result || !result.matches) return [];
    return result.matches.map((m) => ({
      ...m,
      similarity: computeSimilarity(
        data,
        selectedIndex - patternLength,
        m.match_start,
        patternLength,
      ),
    }));
  }, [result, data, selectedIndex, patternLength]);

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

  const getCandles = (startIdx, length) => {
    const candles = [];
    for (let i = 0; i < length; i++) {
      const idx = startIdx + i;
      if (idx < 0 || idx >= data.length) break;
      candles.push({
        open: data[idx].open,
        high: data[idx].high,
        low: data[idx].low,
        close: data[idx].close,
      });
    }
    return candles;
  };

  const handleMatchClick = (match, index) => {
    setSelectedMatch(selectedMatch === index ? null : index);
  };

  const selectedCandles =
    matchesWithSim.length > 0 && selectedMatch !== null
      ? getCandles(selectedIndex - patternLength, patternLength)
      : [];
  const matchedCandles =
    matchesWithSim.length > 0 &&
    selectedMatch !== null &&
    matchesWithSim[selectedMatch]
      ? getCandles(matchesWithSim[selectedMatch].match_start, patternLength)
      : [];

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
            max={50}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{ ...inputStyle, fontFamily: "'Outfit', sans-serif" }}
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
              { label: "Matches", value: matchesWithSim.length },
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
              color: "#4a5468",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            Top Matches{" "}
            <span
              style={{
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              — click to compare
            </span>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {matchesWithSim.map((m, i) => (
              <div key={i}>
                <div
                  onClick={() => handleMatchClick(m, i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background:
                      selectedMatch === i ? "rgba(59,130,246,0.06)" : "#080a0f",
                    border:
                      selectedMatch === i
                        ? "1px solid rgba(59,130,246,0.2)"
                        : "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMatch !== i) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMatch !== i) {
                      e.currentTarget.style.background = "#080a0f";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.04)";
                    }
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background:
                          selectedMatch === i
                            ? "rgba(59,130,246,0.15)"
                            : "rgba(59,130,246,0.1)",
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
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color:
                          m.similarity > 70
                            ? "#10b981"
                            : m.similarity > 40
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    >
                      {m.similarity.toFixed(1)}%
                    </span>
                    <span
                      className="mono"
                      style={{ fontSize: 11, color: "#3a4050" }}
                    >
                      {m.distance.toFixed(2)}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={selectedMatch === i ? "#60a5fa" : "#3a4050"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform:
                          selectedMatch === i
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {selectedMatch === i &&
                  selectedCandles.length > 0 &&
                  matchedCandles.length > 0 && (
                    <div
                      style={{
                        marginTop: 6,
                        background: "#080a0f",
                        border: "1px solid rgba(59,130,246,0.15)",
                        borderRadius: 8,
                        overflow: "hidden",
                        padding: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <div
                              style={{
                                width: 12,
                                height: 2,
                                background: "#e4e8f1",
                                borderRadius: 1,
                              }}
                            />
                            <span style={{ color: "#7a869a" }}>
                              Your pattern
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <div
                              style={{
                                width: 12,
                                height: 2,
                                background: "#3b82f6",
                                borderRadius: 1,
                              }}
                            />
                            <span style={{ color: "#7a869a" }}>
                              Match #{i + 1}
                            </span>
                          </div>
                        </div>
                        <SimilarityBadge similarity={m.similarity} />
                      </div>
                      <ComparisonLine
                        selectedCandles={selectedCandles}
                        matchedCandles={matchedCandles}
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
