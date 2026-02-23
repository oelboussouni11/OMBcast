import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const CANDLES = [
  { o: 100, h: 103, l: 98, c: 101 },
  { o: 101, h: 105, l: 100, c: 104 },
  { o: 104, h: 106, l: 101, c: 102 },
  { o: 102, h: 104, l: 99, c: 100 },
  { o: 100, h: 103, l: 97, c: 98 },
  { o: 98, h: 101, l: 96, c: 100 },
  { o: 100, h: 104, l: 99, c: 103 },
  { o: 103, h: 108, l: 102, c: 107 },
  { o: 107, h: 110, l: 105, c: 106 },
  { o: 106, h: 108, l: 103, c: 104 },
  { o: 104, h: 107, l: 103, c: 106 },
  { o: 106, h: 112, l: 105, c: 111 },
  { o: 111, h: 114, l: 109, c: 113 },
  { o: 113, h: 115, l: 110, c: 111 },
  { o: 111, h: 113, l: 108, c: 109 },
  { o: 109, h: 112, l: 107, c: 110 },
  { o: 110, h: 116, l: 109, c: 115 },
  { o: 115, h: 118, l: 113, c: 117 },
  { o: 117, h: 120, l: 115, c: 119 },
  { o: 119, h: 121, l: 116, c: 118 },
  { o: 118, h: 120, l: 114, c: 115 },
  { o: 115, h: 117, l: 112, c: 113 },
  { o: 113, h: 116, l: 111, c: 114 },
  { o: 114, h: 119, l: 113, c: 118 },
  { o: 118, h: 122, l: 117, c: 121 },
  { o: 121, h: 124, l: 119, c: 120 },
  { o: 120, h: 122, l: 116, c: 117 },
  { o: 117, h: 120, l: 115, c: 118 },
  { o: 118, h: 123, l: 117, c: 122 },
  { o: 122, h: 126, l: 121, c: 125 },
];

const CLOUD = [
  { min: 119, p25: 121, med: 123, p75: 125, max: 128 },
  { min: 118, p25: 122, med: 125, p75: 128, max: 132 },
  { min: 116, p25: 123, med: 127, p75: 131, max: 135 },
  { min: 114, p25: 124, med: 129, p75: 134, max: 138 },
  { min: 112, p25: 125, med: 131, p75: 137, max: 142 },
  { min: 110, p25: 126, med: 133, p75: 140, max: 146 },
];

function HeroChart() {
  const W = 900,
    H = 380,
    PAD = 24;
  const allPrices = CANDLES.flatMap((c) => [c.h, c.l]).concat(
    CLOUD.flatMap((c) => [c.min, c.max]),
  );
  const minP = Math.min(...allPrices) - 2;
  const maxP = Math.max(...allPrices) + 2;
  const toY = (p) => PAD + (1 - (p - minP) / (maxP - minP)) * (H - PAD * 2);
  const totalBars = CANDLES.length + CLOUD.length;
  const barW = (W - PAD * 2) / totalBars;
  const toX = (i) => PAD + i * barW + barW / 2;
  const selIdx = 24;

  const cloudPts = CLOUD.map((c, i) => ({ x: toX(selIdx + i + 1), ...c }));
  const maxPath = cloudPts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${toY(p.max)}`)
    .join(" ");
  const minPathR = [...cloudPts]
    .reverse()
    .map((p) => `L ${p.x} ${toY(p.min)}`)
    .join(" ");
  const p75Path = cloudPts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${toY(p.p75)}`)
    .join(" ");
  const p25PathR = [...cloudPts]
    .reverse()
    .map((p) => `L ${p.x} ${toY(p.p25)}`)
    .join(" ");
  const medPath = cloudPts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${toY(p.med)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id="cOuter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="cInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="selG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="chartFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060810" stopOpacity="0" />
          <stop offset="85%" stopColor="#060810" stopOpacity="0" />
          <stop offset="100%" stopColor="#060810" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {[0.2, 0.4, 0.6, 0.8].map((f, i) => (
        <line
          key={i}
          x1={PAD}
          y1={PAD + f * (H - PAD * 2)}
          x2={W - PAD}
          y2={PAD + f * (H - PAD * 2)}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
        />
      ))}
      <path d={`${maxPath} ${minPathR} Z`} fill="url(#cOuter)" />
      <path d={`${p75Path} ${p25PathR} Z`} fill="url(#cInner)" />
      <path
        d={maxPath}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1"
        opacity="0.2"
        strokeDasharray="4 3"
      />
      {(() => {
        const pts = [...cloudPts].reverse();
        return (
          <path
            d={`M ${pts[0].x} ${toY(pts[0].min)} ${pts
              .slice(1)
              .map((p) => `L ${p.x} ${toY(p.min)}`)
              .join(" ")}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            opacity="0.2"
            strokeDasharray="4 3"
          />
        );
      })()}
      <path
        d={medPath}
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x={toX(selIdx) - barW / 2 - 3}
        y={PAD}
        width={barW + 6}
        height={H - PAD * 2}
        fill="url(#selG)"
        rx="2"
      />
      <line
        x1={toX(selIdx)}
        y1={PAD}
        x2={toX(selIdx)}
        y2={H - PAD}
        stroke="#f59e0b"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.4"
      />
      {CANDLES.map((c, i) => {
        const x = toX(i);
        const green = c.c >= c.o;
        const color = i === selIdx ? "#f59e0b" : green ? "#10b981" : "#ef4444";
        const bodyTop = toY(Math.max(c.o, c.c));
        const bodyBot = toY(Math.min(c.o, c.c));
        const bodyH = Math.max(bodyBot - bodyTop, 1);
        return (
          <g key={i} opacity={i > selIdx ? 0.2 : 1}>
            <line
              x1={x}
              y1={toY(c.h)}
              x2={x}
              y2={toY(c.l)}
              stroke={color}
              strokeWidth="1.2"
            />
            <rect
              x={x - barW * 0.32}
              y={bodyTop}
              width={barW * 0.64}
              height={bodyH}
              fill={color}
              rx="0.5"
            />
          </g>
        );
      })}
      <rect x="0" y="0" width={W} height={H} fill="url(#chartFade)" />
    </svg>
  );
}

function Counter({ end, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let start = 0;
          const step = end / (duration / 16);
          const run = () => {
            start += step;
            if (start >= end) {
              setVal(end);
              return;
            }
            setVal(Math.floor(start * 10) / 10);
            requestAnimationFrame(run);
          };
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return (
    <span ref={ref}>
      {typeof end === "number" && end % 1 !== 0
        ? val.toFixed(1)
        : Math.floor(val)}
      {suffix}
    </span>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#060810",
        color: "#e4e8f1",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(6, 8, 16, 0.7)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Docs", action: () => navigate("/docs") },
              {
                label: "GitHub",
                href: "https://github.com/oelboussouni11",
                ext: true,
              },
            ].map((l, i) =>
              l.action ? (
                <span
                  key={i}
                  onClick={l.action}
                  style={{
                    color: "#5a6478",
                    fontSize: 13,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#e4e8f1")}
                  onMouseLeave={(e) => (e.target.style.color = "#5a6478")}
                >
                  {l.label}
                </span>
              ) : (
                <a
                  key={i}
                  href={l.href}
                  target={l.ext ? "_blank" : undefined}
                  rel={l.ext ? "noreferrer" : undefined}
                  style={{
                    color: "#5a6478",
                    fontSize: 13,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#e4e8f1")}
                  onMouseLeave={(e) => (e.target.style.color = "#5a6478")}
                >
                  {l.label}
                </a>
              ),
            )}
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

      {/* ═══ HERO ═══ */}
      <section
        style={{ position: "relative", paddingTop: 140, paddingBottom: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            width: "110%",
            maxWidth: 1400,
            opacity: 0.08,
            pointerEvents: "none",
            filter: "blur(2px)",
          }}
        >
          <HeroChart />
        </div>
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)",
            top: "-10%",
            left: "10%",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)",
            top: "20%",
            right: "5%",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 32px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.12)",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 500,
              color: "#60a5fa",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#3b82f6",
                boxShadow: "0 0 8px rgba(59,130,246,0.6)",
              }}
            />
            Free & Open Source
          </div>

          <h1
            style={{
              fontSize: "clamp(38px, 5.5vw, 62px)",
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
              marginBottom: 18,
              maxWidth: 700,
              margin: "0 auto 18px",
            }}
          >
            History repeats itself.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #60a5fa 40%, #93c5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Find it before it does.
            </span>
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "#6b7280",
              maxWidth: 480,
              margin: "0 auto 32px",
            }}
          >
            OMBcast scans historical price data for patterns that look like now
            — then shows you what happened next.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <button
              onClick={() => navigate("/app")}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "13px 30px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow:
                  "0 4px 24px rgba(37,99,235,0.35), 0 0 60px rgba(59,130,246,0.08)",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow =
                  "0 8px 40px rgba(37,99,235,0.5), 0 0 80px rgba(59,130,246,0.12)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow =
                  "0 4px 24px rgba(37,99,235,0.35), 0 0 60px rgba(59,130,246,0.08)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Try it now →
            </button>
            <a
              href="https://github.com/oelboussouni11"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "rgba(255,255,255,0.03)",
                color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                padding: "13px 30px",
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.06)";
                e.target.style.color = "#e4e8f1";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.03)";
                e.target.style.color = "#9ca3af";
              }}
            >
              View Source
            </a>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              fontSize: 12,
              color: "#2d3548",
              marginBottom: 48,
            }}
          >
            {["Stocks", "Crypto", "Forex", "CSV"].map((t, i) => (
              <span
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#1e2638",
                  }}
                />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Chart card */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 32px",
          }}
        >
          <div
            style={{
              background: "rgba(10,14,24,0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px 16px 0 0",
              boxShadow:
                "0 -4px 40px rgba(0,0,0,0.3), 0 0 100px rgba(59,130,246,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ef4444",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#10b981",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  marginLeft: 14,
                  display: "flex",
                  gap: 2,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 6,
                  padding: 2,
                }}
              >
                {["AAPL", "BTC", "EUR/USD"].map((t, i) => (
                  <span
                    key={i}
                    className="mono"
                    style={{
                      fontSize: 10,
                      padding: "3px 10px",
                      borderRadius: 4,
                      background:
                        i === 0 ? "rgba(59,130,246,0.1)" : "transparent",
                      color: i === 0 ? "#60a5fa" : "#2d3548",
                      fontWeight: i === 0 ? 600 : 400,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 12, color: "#e4e8f1", fontWeight: 600 }}
                >
                  $125.42
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#10b981",
                    padding: "2px 7px",
                    background: "rgba(16,185,129,0.08)",
                    borderRadius: 4,
                  }}
                >
                  +2.34%
                </span>
              </div>
            </div>
            <div style={{ padding: "4px 8px 0" }}>
              <HeroChart />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 16px 10px",
                borderTop: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", gap: 20 }}>
                {[
                  { label: "Matches", value: "5", color: "#60a5fa" },
                  {
                    label: "Best similarity",
                    value: "87.3%",
                    color: "#10b981",
                  },
                  { label: "Method", value: "Euclidean", color: "#8b5cf6" },
                ].map((s, i) => (
                  <span key={i} style={{ fontSize: 10, color: "#3a4050" }}>
                    {s.label}{" "}
                    <span
                      className="mono"
                      style={{ color: s.color, fontWeight: 600 }}
                    >
                      {s.value}
                    </span>
                  </span>
                ))}
              </div>
              <span className="mono" style={{ fontSize: 10, color: "#1e2638" }}>
                20 candles · 30 forecast
              </span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              background: "rgba(255,255,255,0.03)",
              borderRadius: "0 0 16px 16px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.04)",
              borderTop: "none",
            }}
          >
            {[
              {
                label: "Direction Accuracy",
                value: 68.2,
                suffix: "%",
                color: "#10b981",
              },
              {
                label: "Patterns Scanned",
                value: 1247,
                suffix: "",
                color: "#60a5fa",
              },
              {
                label: "Avg Similarity",
                value: 74.8,
                suffix: "%",
                color: "#8b5cf6",
              },
              { label: "Algorithms", value: 2, suffix: "", color: "#f59e0b" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 24px",
                  textAlign: "center",
                  background: "rgba(6,8,16,0.6)",
                  backdropFilter: "blur(12px)",
                  borderRight:
                    i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: "#3a4050",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </p>
                <p
                  className="mono"
                  style={{ fontSize: 22, fontWeight: 700, color: s.color }}
                >
                  <Counter end={s.value} suffix={s.suffix} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{ padding: "100px 32px 80px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            Built for serious analysis
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: 16,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Everything you need to find patterns, forecast outcomes, and
            validate strategies.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              title: "Pattern Detection",
              desc: "Select any segment. OMBcast normalizes and scans all history for similar shapes using Euclidean distance or DTW.",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              ),
            },
            {
              title: "Prediction Cloud",
              desc: "Overlays what happened after each match — builds min, max, median, and percentile ranges as a visual forecast.",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
            },
            {
              title: "Similarity Scoring",
              desc: "Pearson correlation measures actual shape similarity — not just distance. See exactly how close each match is.",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                </svg>
              ),
            },
            {
              title: "Backtesting",
              desc: "Validate across hundreds of random historical points with live progress. Measures direction accuracy and range hits.",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              ),
            },
            {
              title: "No Data Leakage",
              desc: "The algorithm is blind to data after your selected point. Predictions are honest — no peeking at the future.",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
            },
            {
              title: "Any Data Source",
              desc: "Yahoo Finance for stocks and crypto, or upload your own CSV. Works with any OHLC time series data.",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              ),
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 14,
                padding: 28,
                transition: "all 0.25s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
                e.currentTarget.style.background = "rgba(59,130,246,0.03)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(59,130,246,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                e.currentTarget.style.background = "rgba(255,255,255,0.015)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b7280" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        style={{ padding: "80px 32px", maxWidth: 800, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            How it works
          </h2>
          <p style={{ color: "#6b7280", fontSize: 16 }}>
            Three steps to forecast any asset.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              step: "01",
              title: "Load your data",
              desc: "Search any stock or crypto ticker, or drag-and-drop a CSV with OHLC columns.",
            },
            {
              step: "02",
              title: "Select a pattern",
              desc: "Click any candle. Choose how far back to look and which algorithm — Euclidean or Dynamic Time Warping.",
            },
            {
              step: "03",
              title: "See the forecast",
              desc: "OMBcast finds the closest historical matches and overlays their futures as a prediction cloud.",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                padding: 24,
                background: "rgba(255,255,255,0.015)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#3b82f6",
                  opacity: 0.5,
                  lineHeight: 1,
                  minWidth: 44,
                }}
              >
                {s.step}
              </span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b7280" }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Link to full docs */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <span
            onClick={() => navigate("/docs")}
            style={{
              fontSize: 14,
              color: "#60a5fa",
              cursor: "pointer",
              fontWeight: 500,
              borderBottom: "1px solid rgba(96,165,250,0.3)",
              paddingBottom: 2,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderBottomColor = "#60a5fa";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottomColor = "rgba(96,165,250,0.3)";
            }}
          >
            Read the full documentation — math, algorithms & tutorial →
          </span>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px 100px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "48px 40px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 20,
            boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            Ready to find patterns?
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 28 }}>
            No signup. No paywall. Just algorithms.
          </p>
          <button
            onClick={() => navigate("/app")}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "13px 28px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 24px rgba(37,99,235,0.35)",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0 6px 32px rgba(37,99,235,0.5)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 4px 24px rgba(37,99,235,0.35)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Launch App →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "24px 32px",
          textAlign: "center",
          fontSize: 13,
          color: "#3a4050",
        }}
      >
        © 2026 OMBcast ·{" "}
        <span
          onClick={() => navigate("/docs")}
          style={{
            color: "#5a6478",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Docs
        </span>
        {" · "}
        <a
          href="https://github.com/oelboussouni11"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#5a6478", textDecoration: "none" }}
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
