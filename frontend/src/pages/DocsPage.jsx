import { useNavigate } from "react-router-dom";
import { useState } from "react";

const sections = [
  { id: "pattern-matching", label: "Pattern Matching" },
  { id: "the-math", label: "The Math" },
  { id: "prediction-cloud", label: "Prediction Cloud" },
  { id: "backtesting", label: "Backtesting" },
  { id: "tutorial", label: "How to Use" },
  { id: "limitations", label: "Limitations" },
];

function Formula({ children }) {
  return (
    <div
      style={{
        background: "rgba(59,130,246,0.04)",
        border: "1px solid rgba(59,130,246,0.1)",
        borderRadius: 10,
        padding: "16px 20px",
        margin: "16px 0",
        fontFamily: "'Space Mono', monospace",
        fontSize: 14,
        color: "#93c5fd",
        overflowX: "auto",
      }}
    >
      {children}
    </div>
  );
}

function InfoBox({ title, children, color = "#3b82f6" }) {
  const bg =
    color === "#f59e0b"
      ? "rgba(245,158,11,0.04)"
      : color === "#10b981"
        ? "rgba(16,185,129,0.04)"
        : "rgba(59,130,246,0.04)";
  const border =
    color === "#f59e0b"
      ? "rgba(245,158,11,0.12)"
      : color === "#10b981"
        ? "rgba(16,185,129,0.12)"
        : "rgba(59,130,246,0.12)";
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 10,
        padding: "16px 20px",
        margin: "16px 0",
      }}
    >
      {title && (
        <p style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 6 }}>
          {title}
        </p>
      )}
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "#9ca3af" }}>
        {children}
      </div>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        padding: 20,
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: 12,
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#3b82f6",
          opacity: 0.6,
          lineHeight: 1,
          minWidth: 36,
        }}
      >
        {number}
      </span>
      <div>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 4,
            color: "#e4e8f1",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: "#6b7280" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("pattern-matching");

  const scrollTo = (id) => {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const h2Style = {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginBottom: 12,
    paddingTop: 24,
  };
  const h3Style = {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    marginTop: 24,
    color: "#e4e8f1",
  };
  const pStyle = {
    fontSize: 15,
    lineHeight: 1.75,
    color: "#9ca3af",
    marginBottom: 16,
  };

  return (
    <div
      style={{ background: "#060810", color: "#e4e8f1", minHeight: "100vh" }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(6,8,16,0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="14"
                height="14"
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
            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-0.02em",
              }}
            >
              OMBcast
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 13, color: "#5a6478", fontWeight: 500 }}>
              Documentation
            </span>
            <button
              onClick={() => navigate("/app")}
              style={{
                background: "rgba(59,130,246,0.1)",
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.18)",
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(59,130,246,0.18)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(59,130,246,0.1)";
              }}
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Layout: sidebar + content */}
      <div
        style={{
          display: "flex",
          maxWidth: 1140,
          margin: "0 auto",
          paddingTop: 70,
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            position: "sticky",
            top: 70,
            height: "calc(100vh - 70px)",
            width: 220,
            minWidth: 220,
            padding: "32px 24px 32px 32px",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            overflowY: "auto",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#3a4050",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            Contents
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  textAlign: "left",
                  background:
                    activeSection === s.id
                      ? "rgba(59,130,246,0.08)"
                      : "transparent",
                  color: activeSection === s.id ? "#60a5fa" : "#5a6478",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: activeSection === s.id ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  borderLeft:
                    activeSection === s.id
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== s.id) e.target.style.color = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== s.id) e.target.style.color = "#5a6478";
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "32px 48px 100px", maxWidth: 760 }}>
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <h1
              style={{
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 10,
              }}
            >
              How OMBcast Works
            </h1>
            <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.6 }}>
              A complete guide to the algorithms, math, and methodology behind
              pattern-based price forecasting.
            </p>
          </div>

          {/* ─── SECTION 1: Pattern Matching ─── */}
          <section id="pattern-matching">
            <h2 style={h2Style}>What is Pattern Matching?</h2>
            <p style={pStyle}>
              Pattern matching is the idea that price movements tend to repeat.
              When a stock, crypto, or forex pair moves in a certain shape — say
              a gradual rise followed by a sharp dip — that same shape has
              likely appeared before in history.
            </p>
            <p style={pStyle}>
              OMBcast takes the pattern you select on the chart and searches
              through all available historical data to find the moments that
              looked most similar. It then looks at what happened <em>after</em>{" "}
              those historical moments to build a forecast.
            </p>
            <InfoBox title="Key idea">
              If the market moved in shape X five times before, and each time it
              went up afterward — there's a reasonable probability it might go
              up again. OMBcast quantifies this.
            </InfoBox>
            <h3 style={h3Style}>The process</h3>
            <p style={pStyle}>
              When you click a candle and run pattern matching, OMBcast takes
              the N candles before your selection (the "pattern length"),
              normalizes them to percentage changes from the first candle, then
              slides this normalized shape across the entire dataset comparing
              it to every possible window of the same length.
            </p>
            <p style={pStyle}>
              Each comparison produces a distance score — the lower the
              distance, the more similar the shapes. OMBcast keeps the top K
              best matches and uses their future price movements to build a
              prediction.
            </p>
          </section>

          {/* ─── SECTION 2: The Math ─── */}
          <section id="the-math">
            <h2 style={h2Style}>The Math</h2>
            <p style={pStyle}>
              OMBcast uses three key mathematical concepts: Euclidean distance
              for basic shape comparison, Dynamic Time Warping (DTW) for
              flexible matching, and Pearson correlation for similarity scoring.
            </p>

            <h3 style={h3Style}>Normalization</h3>
            <p style={pStyle}>
              Before comparing, all patterns are normalized to percentage change
              from the first candle's close price. This means we compare{" "}
              <em>shapes</em>, not absolute prices. A pattern from $10→$12 is
              the same shape as $100→$120 — both are +20%.
            </p>
            <Formula>
              normalized[i] = (close[i] - close[0]) / close[0] × 100
            </Formula>

            <h3 style={h3Style}>Euclidean Distance</h3>
            <p style={pStyle}>
              The simplest way to compare two sequences. Take the difference at
              each point, square it, sum them all, and take the square root. A
              distance of 0 means identical shapes.
            </p>
            <Formula>d(A, B) = √( Σ (Aᵢ - Bᵢ)² )</Formula>
            <InfoBox>
              Fast to compute, works well when patterns have the same length and
              are aligned in time. This is the default method.
            </InfoBox>

            <h3 style={h3Style}>Dynamic Time Warping (DTW)</h3>
            <p style={pStyle}>
              DTW is more flexible — it can match patterns even if they're
              stretched or compressed in time. A 5-day rally might match a 7-day
              rally if the overall shape is similar. DTW "warps" the time axis
              to find the best alignment.
            </p>
            <Formula>
              DTW(A, B) = min cost path through a distance matrix where each
              cell (i,j) = (Aᵢ - Bⱼ)²
            </Formula>
            <p style={pStyle}>
              DTW builds a matrix of all pairwise distances between points in
              sequence A and sequence B, then finds the lowest-cost path from
              corner to corner. This path represents the optimal alignment.
            </p>
            <InfoBox title="When to use DTW" color="#f59e0b">
              Use DTW when you think the pattern's timing might vary — for
              example, if a sell-off happened over 3 days in one case but 5 days
              in another. DTW is slower than Euclidean but catches these
              variations.
            </InfoBox>

            <h3 style={h3Style}>Pearson Correlation (Similarity Score)</h3>
            <p style={pStyle}>
              After finding matches by distance, we compute a Pearson
              correlation coefficient to give an intuitive similarity
              percentage. This measures how well two shapes move together,
              regardless of scale.
            </p>
            <Formula>
              r = Σ(Aᵢ - Ā)(Bᵢ - B̄) / √( Σ(Aᵢ - Ā)² · Σ(Bᵢ - B̄)² )
            </Formula>
            <p style={pStyle}>
              The result ranges from -1 to +1. We convert it to a 0-100% score
              where:
            </p>
            <div style={{ display: "flex", gap: 10, margin: "12px 0 16px" }}>
              {[
                {
                  range: "> 70%",
                  label: "Strong match",
                  color: "#10b981",
                  bg: "rgba(16,185,129,0.06)",
                },
                {
                  range: "40-70%",
                  label: "Moderate",
                  color: "#f59e0b",
                  bg: "rgba(245,158,11,0.06)",
                },
                {
                  range: "< 40%",
                  label: "Weak match",
                  color: "#ef4444",
                  bg: "rgba(239,68,68,0.06)",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: s.bg,
                    border: `1px solid ${s.color}22`,
                    borderRadius: 8,
                    padding: "12px 14px",
                    textAlign: "center",
                  }}
                >
                  <p
                    className="mono"
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: s.color,
                      marginBottom: 2,
                    }}
                  >
                    {s.range}
                  </p>
                  <p style={{ fontSize: 11, color: "#5a6478" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── SECTION 3: Prediction Cloud ─── */}
          <section id="prediction-cloud">
            <h2 style={h2Style}>Prediction Cloud</h2>
            <p style={pStyle}>
              Once OMBcast finds the top K historical matches, it looks at what
              happened <em>after</em> each match — the next N candles (the
              "forecast horizon"). These future paths are aggregated into a
              prediction cloud.
            </p>

            <h3 style={h3Style}>How it's built</h3>
            <p style={pStyle}>
              For each match, OMBcast extracts the future price path as
              percentage changes. At each future step, it computes statistics
              across all matches:
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                margin: "12px 0 16px",
              }}
            >
              {[
                {
                  label: "Max",
                  desc: "Best case — highest % change across all matches",
                  color: "#3b82f6",
                },
                {
                  label: "75th percentile",
                  desc: "Upper quartile — optimistic but realistic",
                  color: "#60a5fa",
                },
                {
                  label: "Median",
                  desc: "Middle path — the most likely outcome",
                  color: "#93c5fd",
                },
                {
                  label: "25th percentile",
                  desc: "Lower quartile — conservative estimate",
                  color: "#60a5fa",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 8,
                    padding: "12px 14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: s.color,
                      marginBottom: 2,
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{ fontSize: 12, color: "#5a6478", lineHeight: 1.5 }}
                  >
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
            <p style={pStyle}>
              The cloud is rendered on your chart as a shaded area. The wider
              the cloud, the more the historical matches disagreed about the
              future — meaning more uncertainty. A narrow cloud means the
              matches all did similar things afterward.
            </p>

            <h3 style={h3Style}>Actual price overlay</h3>
            <p style={pStyle}>
              After the prediction cloud is shown, the amber line shows the{" "}
              <em>actual</em> price that occurred. This lets you visually
              compare: did the real price stay inside the cloud? Did it follow
              the median? This is the core feedback loop of the tool.
            </p>
          </section>

          {/* ─── SECTION 4: Backtesting ─── */}
          <section id="backtesting">
            <h2 style={h2Style}>Backtesting</h2>
            <p style={pStyle}>
              Backtesting answers: "Would this strategy have worked in the
              past?" Instead of running pattern matching on one candle, it runs
              it on many candles automatically and measures how accurate the
              predictions were.
            </p>

            <h3 style={h3Style}>How it works</h3>
            <p style={pStyle}>
              You choose how many test points to run (or test all candles). For
              each test point, OMBcast pretends it's "standing" at that candle —
              it only looks at data before it, finds matches, builds a
              prediction cloud, then checks what <em>actually</em> happened
              next.
            </p>

            <h3 style={h3Style}>Metrics</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                margin: "12px 0 16px",
              }}
            >
              <InfoBox title="Direction Accuracy" color="#10b981">
                Did the prediction correctly guess whether the price would go up
                or down? Measures the % of tests where the predicted direction
                matched reality.
              </InfoBox>
              <InfoBox title="Range Accuracy" color="#3b82f6">
                What % of future candles fell inside the prediction cloud
                (between min and max)? Higher means the cloud was
                well-calibrated.
              </InfoBox>
            </div>
            <p style={pStyle}>
              A direction accuracy above 50% means the strategy is better than a
              coin flip. Range accuracy above 60% means the cloud is well-sized
              — not too narrow (missing moves) and not too wide (useless).
            </p>

            <InfoBox title="No data leakage" color="#f59e0b">
              Critically, the backtest never lets the algorithm see data after
              the test point. This prevents overfitting and gives honest
              results. If the direction accuracy is 55% in backtesting, you can
              reasonably expect similar performance going forward.
            </InfoBox>
          </section>

          {/* ─── SECTION 5: Tutorial ─── */}
          <section id="tutorial">
            <h2 style={h2Style}>How to Use OMBcast</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 16,
              }}
            >
              <StepCard
                number="01"
                title="Load your data"
                desc="Type a stock ticker (AAPL, TSLA, BTC-USD) and press Search. Or upload a CSV file with date, open, high, low, close columns. Choose the time period and interval."
              />
              <StepCard
                number="02"
                title="Click a candle"
                desc="Click any candle on the chart. This becomes your 'current moment' — the point from which you want to forecast. The index and date will appear in the Pattern Matching panel."
              />
              <StepCard
                number="03"
                title="Configure parameters"
                desc="Set Pattern Length (how many candles back define your pattern — 20 is a good default), Forecast Horizon (how far to predict — 30 is typical), Top K (number of matches), and Method (Euclidean or DTW)."
              />
              <StepCard
                number="04"
                title="Run pattern matching"
                desc="Hit 'Find Patterns'. OMBcast scans the entire dataset, finds the best matches, and draws the prediction cloud on your chart. Click any match to see a visual comparison."
              />
              <StepCard
                number="05"
                title="Analyze results"
                desc="The blue cloud shows the predicted range. The amber line shows what actually happened. Use the similarity scores to gauge how reliable each match is. Switch to the Backtest tab to test the strategy at scale."
              />
            </div>
          </section>

          {/* ─── SECTION 6: Limitations ─── */}
          <section id="limitations">
            <h2 style={h2Style}>Limitations & Disclaimers</h2>
            <InfoBox title="⚠ Not financial advice" color="#ef4444">
              OMBcast is an educational and analytical tool. It does not predict
              the future. Past patterns do not guarantee future results. Never
              make trading decisions based solely on pattern matching.
            </InfoBox>
            <p style={pStyle}>There are important limitations to understand:</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 8,
              }}
            >
              {[
                {
                  title: "Markets are not deterministic",
                  desc: "Just because a shape appeared before doesn't mean the same outcome will follow. External events, news, and market conditions can override any pattern.",
                },
                {
                  title: "Limited by data quality",
                  desc: "Results are only as good as the data. Small datasets have fewer potential matches, making predictions less reliable. More historical data = better.",
                },
                {
                  title: "Overfitting risk",
                  desc: "Using very long patterns or very few matches can lead to overfitting — the model finds noise instead of signal. Use backtesting to validate.",
                },
                {
                  title: "Close prices only",
                  desc: "The algorithm compares close prices, not full OHLC candles. Two candles might have the same close but very different intraday action.",
                },
                {
                  title: "No volume or fundamentals",
                  desc: "OMBcast is purely price-based. It doesn't consider trading volume, earnings, economic data, or any fundamental analysis.",
                },
              ].map((l, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 18px",
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 10,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 4,
                      color: "#e4e8f1",
                    }}
                  >
                    {l.title}
                  </p>
                  <p
                    style={{ fontSize: 13, lineHeight: 1.6, color: "#6b7280" }}
                  >
                    {l.desc}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 32,
                padding: "20px 24px",
                background: "rgba(59,130,246,0.04)",
                border: "1px solid rgba(59,130,246,0.1)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                Ready to explore?
              </p>
              <button
                onClick={() => navigate("/app")}
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Launch App →
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
