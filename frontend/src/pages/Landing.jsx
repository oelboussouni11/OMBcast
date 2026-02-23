import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useMemo } from "react";

function CandlestickMockup() {
  const candles = useMemo(() => {
    const data = [];
    let price = 100;
    for (let i = 0; i < 48; i++) {
      const change = (Math.random() - 0.48) * 6;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      data.push({ open, close, high, low, bullish: close > open });
      price = close;
    }
    return data;
  }, []);

  const minLow = Math.min(...candles.map((c) => c.low));
  const maxHigh = Math.max(...candles.map((c) => c.high));
  const range = maxHigh - minLow;

  const toY = (val) => ((maxHigh - val) / range) * 100;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: "30px 20px",
        position: "relative",
      }}
    >
      {/* Prediction cloud overlay on last 12 candles */}
      <div
        style={{
          position: "absolute",
          right: "4%",
          top: "15%",
          width: "26%",
          height: "55%",
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)",
          borderRadius: 8,
          border: "1px solid rgba(59,130,246,0.1)",
          animation: "cloudPulse 3s ease-in-out infinite",
        }}
      />

      {candles.map((c, i) => {
        const bodyTop = toY(Math.max(c.open, c.close));
        const bodyBot = toY(Math.min(c.open, c.close));
        const bodyH = Math.max(bodyBot - bodyTop, 1.5);
        const wickTop = toY(c.high);
        const wickBot = toY(c.low);
        const color = c.bullish ? "#10b981" : "#ef4444";

        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: `candleGrow 0.6s ease ${i * 0.03}s forwards`,
              transformOrigin: "bottom",
              opacity: 0,
            }}
          >
            {/* Wick */}
            <div
              style={{
                position: "absolute",
                top: `${wickTop}%`,
                height: `${wickBot - wickTop}%`,
                width: 1,
                background: color,
                opacity: 0.5,
                transformOrigin: "bottom",
                animation: `wickGrow 0.4s ease ${i * 0.03 + 0.1}s forwards`,
                transform: "scaleY(0)",
              }}
            />
            {/* Body */}
            <div
              style={{
                position: "absolute",
                top: `${bodyTop}%`,
                height: `${bodyH}%`,
                width: "60%",
                minHeight: 2,
                background: color,
                borderRadius: 1,
                opacity: 0.85,
              }}
            />
          </div>
        );
      })}

      {/* Median prediction line */}
      <svg
        style={{
          position: "absolute",
          right: "4%",
          top: 0,
          width: "26%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 55 Q 25 48 50 42 T 100 35"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.8"
          opacity="0.6"
          strokeDasharray="3 2"
        />
      </svg>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!pageRef.current) return;
      pageRef.current.style.setProperty("--mx", `${e.clientX}px`);
      pageRef.current.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={pageRef}
      style={{
        background: "#050608",
        position: "relative",
        "--mx": "50%",
        "--my": "50%",
      }}
    >
      {/* Full page cursor glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(800px circle at var(--mx) var(--my), rgba(59, 130, 246, 0.04), transparent 50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Grid bg */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(5, 6, 8, 0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(59,130,246,0.3)",
              }}
            >
              <svg
                width="13"
                height="13"
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
              className="mono"
              style={{
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "-0.01em",
              }}
            >
              OMBcast
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a
              href="#features"
              style={{
                color: "#5a6478",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#e4e8f1")}
              onMouseLeave={(e) => (e.target.style.color = "#5a6478")}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              style={{
                color: "#5a6478",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#e4e8f1")}
              onMouseLeave={(e) => (e.target.style.color = "#5a6478")}
            >
              How it works
            </a>
            <a
              href="https://github.com/oelboussouni11"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#5a6478",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#e4e8f1")}
              onMouseLeave={(e) => (e.target.style.color = "#5a6478")}
            >
              GitHub
            </a>
            <button
              onClick={() => navigate("/app")}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 7,
                padding: "7px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
              onMouseLeave={(e) => (e.target.style.background = "#3b82f6")}
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 32px 60px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div
            className="animate-slide-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(59, 130, 246, 0.06)",
              border: "1px solid rgba(59, 130, 246, 0.12)",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 500,
              color: "#60a5fa",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#3b82f6",
              }}
            />
            Free & Open Source
          </div>

          <h1
            className="animate-slide-up-delay-1"
            style={{
              fontSize: "clamp(36px, 5.5vw, 58px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              marginBottom: 18,
            }}
          >
            Forecast prices with{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              pattern matching
            </span>
          </h1>

          <p
            className="animate-slide-up-delay-2"
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "#5a6478",
              maxWidth: 460,
              margin: "0 auto 36px",
              fontWeight: 400,
            }}
          >
            Select a pattern in any chart. OMBcast scans all historical data for
            similar shapes and shows you what happened next.
          </p>

          <div
            className="animate-slide-up-delay-3"
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/app")}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 9,
                padding: "13px 28px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: "0 2px 16px rgba(59,130,246,0.25)",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 4px 24px rgba(59,130,246,0.4)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "0 2px 16px rgba(59,130,246,0.25)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Launch App →
            </button>
            <a
              href="https://github.com/oelboussouni11"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "rgba(255,255,255,0.03)",
                color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 9,
                padding: "13px 28px",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-block",
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

          <p
            className="animate-slide-up-delay-4"
            style={{
              fontSize: 11,
              color: "#3a4050",
              marginTop: 14,
              fontWeight: 500,
            }}
          >
            Stocks · Crypto · Forex · CSV
          </p>
        </div>

        {/* Candlestick mockup */}
        <div
          className="animate-slide-up-delay-4"
          style={{
            marginTop: 56,
            width: "100%",
            maxWidth: 860,
            height: 340,
            background:
              "linear-gradient(180deg, rgba(10,14,23,0.9) 0%, rgba(8,10,15,0.95) 100%)",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.04)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top bar mockup */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 5 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ef4444",
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10b981",
                  opacity: 0.7,
                }}
              />
            </div>
            <span
              className="mono"
              style={{ fontSize: 10, color: "#3a4050", marginLeft: 8 }}
            >
              AAPL · 1D
            </span>
          </div>
          <CandlestickMockup />
          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30%",
              background:
                "linear-gradient(180deg, transparent, rgba(8,10,15,0.9))",
              pointerEvents: "none",
            }}
          />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{
          padding: "80px 32px",
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              marginBottom: 10,
            }}
          >
            Built for serious analysis
          </h2>
          <p style={{ color: "#5a6478", fontSize: 15 }}>
            Everything you need to find, forecast, and validate.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              title: "Pattern Detection",
              desc: "Select any segment. OMBcast normalizes and scans all history for similar shapes.",
              icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            },
            {
              title: "Prediction Cloud",
              desc: "See what happened after each historical match, overlaid as a probability range.",
              icon: "M22 12l-4 0-3 9-6-18-3 9-4 0",
            },
            {
              title: "Dual Algorithms",
              desc: "Euclidean distance for speed, DTW for flexible time-warped matching.",
              icon: "M12 20V10M18 20V4M6 20v-4",
            },
            {
              title: "Backtesting",
              desc: "Run hundreds of random tests with live progress and accuracy metrics.",
              icon: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
            },
            {
              title: "No Data Leakage",
              desc: "The model never sees future data. Predictions are honest and realistic.",
              icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
            },
            {
              title: "Any Data Source",
              desc: "Yahoo Finance for stocks and crypto, or upload any CSV file.",
              icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 10,
                padding: "22px 24px",
                transition: "all 0.25s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
                e.currentTarget.style.background = "rgba(59,130,246,0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                e.currentTarget.style.background = "rgba(255,255,255,0.015)";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: 14, opacity: 0.8 }}
              >
                <path d={f.icon} />
              </svg>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: "#5a6478" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        style={{
          padding: "60px 32px 80px",
          maxWidth: 720,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              marginBottom: 10,
            }}
          >
            How it works
          </h2>
          <p style={{ color: "#5a6478", fontSize: 15 }}>Three steps.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            {
              n: "01",
              title: "Load your data",
              desc: "Search a stock or crypto symbol, or upload a CSV with your own historical data.",
            },
            {
              n: "02",
              title: "Select a pattern",
              desc: "Click a candle and choose how many candles back define your pattern.",
            },
            {
              n: "03",
              title: "See the forecast",
              desc: "OMBcast finds similar historical patterns and overlays what happened next.",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                padding: "20px 24px",
                background: "rgba(255,255,255,0.015)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#3b82f6",
                  opacity: 0.5,
                  lineHeight: 1,
                  minWidth: 36,
                }}
              >
                {s.n}
              </span>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: "#5a6478" }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "40px 32px 80px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          Ready to find patterns?
        </h2>
        <p style={{ color: "#5a6478", fontSize: 14, marginBottom: 28 }}>
          Free, open source, and built with real algorithms.
        </p>
        <button
          onClick={() => navigate("/app")}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 9,
            padding: "13px 28px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            boxShadow: "0 2px 16px rgba(59,130,246,0.25)",
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = "0 4px 24px rgba(59,130,246,0.4)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = "0 2px 16px rgba(59,130,246,0.25)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Launch App →
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.03)",
          padding: "20px 32px",
          textAlign: "center",
          fontSize: 12,
          color: "#3a4050",
          position: "relative",
          zIndex: 2,
        }}
      >
        © 2026 OMBcast ·{" "}
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
