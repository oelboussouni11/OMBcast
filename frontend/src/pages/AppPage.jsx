import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "../components/Chart";
import PatternPanel from "../components/PatternPanel";
import BacktestPanel from "../components/BacktestPanel";

const API = "https://ombcast-production.up.railway.app";

function DataModal({ onDataLoaded, onClose }) {
  const [tab, setTab] = useState("search");
  const [symbol, setSymbol] = useState("");
  const [interval, setInterval] = useState("1d");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const fetchData = async () => {
    if (!symbol.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API}/api/data/${symbol.toUpperCase()}?interval=${interval}`,
      );
      if (res.data.error) {
        setError(res.data.error);
      } else {
        onDataLoaded(res.data.data, `${symbol.toUpperCase()} · ${interval}`);
      }
    } catch {
      setError("Failed to fetch data. Check the symbol.");
    }
    setLoading(false);
  };

  const handleCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API}/api/upload`, formData);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        onDataLoaded(
          res.data.data,
          `${file.name} · ${res.data.timeframe || "CSV"}`,
        );
      }
    } catch {
      setError("Failed to parse CSV.");
    }
    setLoading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0c1017",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14,
          width: "100%",
          maxWidth: 460,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "22px 24px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 3 }}>
            Load Data
          </h2>
          <p style={{ fontSize: 12, color: "#5a6478" }}>
            Search a symbol or upload CSV.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            padding: "18px 24px 0",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {["search", "upload"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError("");
              }}
              style={{
                padding: "9px 18px",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: tab === t ? "#e4e8f1" : "#3a4050",
                borderBottom:
                  tab === t ? "2px solid #3b82f6" : "2px solid transparent",
                marginBottom: -1,
                transition: "all 0.15s",
              }}
            >
              {t === "search" ? "Search" : "Upload CSV"}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {tab === "search" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#3a4050",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 5,
                    display: "block",
                  }}
                >
                  Symbol
                </label>
                <input
                  type="text"
                  placeholder="AAPL, BTC-USD, EURUSD=X..."
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchData()}
                  className="mono"
                  style={{
                    width: "100%",
                    background: "#080a0f",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 7,
                    padding: "9px 12px",
                    color: "#e4e8f1",
                    fontSize: 13,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(59,130,246,0.35)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.07)")
                  }
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#3a4050",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 5,
                    display: "block",
                  }}
                >
                  Timeframe
                </label>
                <div style={{ display: "flex", gap: 4 }}>
                  {["1m", "5m", "15m", "1h", "1d", "1wk"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setInterval(tf)}
                      className="mono"
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        fontSize: 11,
                        fontWeight: 600,
                        background:
                          interval === tf
                            ? "rgba(59,130,246,0.1)"
                            : "rgba(255,255,255,0.02)",
                        color: interval === tf ? "#60a5fa" : "#5a6478",
                        border:
                          interval === tf
                            ? "1px solid rgba(59,130,246,0.2)"
                            : "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 5,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={fetchData}
                disabled={loading || !symbol.trim()}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: 7,
                  padding: "10px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? "wait" : "pointer",
                  fontFamily: "inherit",
                  opacity: loading || !symbol.trim() ? 0.4 : 1,
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Loading..." : "Load Data"}
              </button>
            </div>
          )}

          {tab === "upload" && (
            <div
              style={{
                border: "1.5px dashed rgba(255,255,255,0.07)",
                borderRadius: 10,
                padding: "36px 20px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => fileRef.current?.click()}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)";
                e.currentTarget.style.background = "rgba(59,130,246,0.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3a4050"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ margin: "0 auto 10px" }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#5a6478",
                  marginBottom: 3,
                }}
              >
                Click to upload
              </p>
              <p style={{ fontSize: 11, color: "#3a4050" }}>
                CSV: date, open, high, low, close
              </p>
              <input
                type="file"
                accept=".csv"
                ref={fileRef}
                onChange={handleCSV}
                style={{ display: "none" }}
              />
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 12,
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.12)",
                borderRadius: 7,
                padding: "8px 12px",
                color: "#f87171",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [patternResult, setPatternResult] = useState(null);
  const [activeTab, setActiveTab] = useState("pattern");

  const handleDataLoaded = (newData, source) => {
    setData(newData);
    setDataSource(source);
    setShowModal(false);
    setSelectedIndex(null);
    setPatternResult(null);
  };

  const handleCandleClick = (index, date) => {
    setSelectedIndex(index);
    setSelectedDate(date);
    setPatternResult(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050608" }}>
      {/* Header */}
      <header
        style={{
          background: "rgba(5,6,8,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 5,
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span className="mono" style={{ fontWeight: 700, fontSize: 13 }}>
                OMBcast
              </span>
            </div>
            {dataSource && (
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  color: "#60a5fa",
                  background: "rgba(59,130,246,0.07)",
                  border: "1px solid rgba(59,130,246,0.12)",
                  borderRadius: 14,
                  padding: "2px 10px",
                }}
              >
                {dataSource}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "rgba(255,255,255,0.03)",
              color: "#9ca3af",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "#e4e8f1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Load Data
          </button>
        </div>
      </header>

      {showModal && (
        <DataModal
          onDataLoaded={handleDataLoaded}
          onClose={() => data.length > 0 && setShowModal(false)}
        />
      )}

      {data.length > 0 && (
        <main
          style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 24px" }}
        >
          <div
            style={{
              background: "#0a0e17",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <Chart
              data={data}
              onCandleClick={handleCandleClick}
              selectedIndex={selectedIndex}
              patternResult={patternResult}
            />
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 1,
              background: "rgba(255,255,255,0.015)",
              borderRadius: 8,
              padding: 3,
              marginBottom: 16,
            }}
          >
            {["pattern", "backtest"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  background:
                    activeTab === t ? "rgba(255,255,255,0.04)" : "transparent",
                  color: activeTab === t ? "#e4e8f1" : "#3a4050",
                  border:
                    activeTab === t
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "1px solid transparent",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t === "pattern" ? "Pattern Matching" : "Backtesting"}
              </button>
            ))}
          </div>

          {/* Both panels always mounted — just show/hide to persist state */}
          <div style={{ display: activeTab === "pattern" ? "block" : "none" }}>
            {selectedIndex !== null ? (
              <PatternPanel
                data={data}
                selectedIndex={selectedIndex}
                selectedDate={selectedDate}
                onResult={setPatternResult}
              />
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: "40px 20px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 13, color: "#3a4050" }}>
                  Click a candle on the chart to begin
                </p>
              </div>
            )}
          </div>
          <div style={{ display: activeTab === "backtest" ? "block" : "none" }}>
            <BacktestPanel data={data} />
          </div>
        </main>
      )}
    </div>
  );
}
