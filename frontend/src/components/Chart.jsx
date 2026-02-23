import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function Chart({
  data,
  onCandleClick,
  selectedIndex,
  patternResult,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const seriesRef = useRef(null);
  const dataRef = useRef([]);
  const cloudSeriesRef = useRef([]);
  const actualSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 520,
      layout: {
        background: { color: "#0a0e17" },
        textColor: "#4a5568",
        fontFamily: "'Outfit', sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.02)", style: 1 },
        horzLines: { color: "rgba(255,255,255,0.02)", style: 1 },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: "rgba(59,130,246,0.25)",
          labelBackgroundColor: "#2563eb",
        },
        horzLine: {
          color: "rgba(59,130,246,0.25)",
          labelBackgroundColor: "#2563eb",
        },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.04)",
        timeVisible: true,
        rightOffset: 5,
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.04)" },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#10b981",
      wickDownColor: "#ef444480",
      wickUpColor: "#10b98180",
    });

    chartInstance.current = chart;
    seriesRef.current = candleSeries;

    chart.subscribeClick((param) => {
      if (param.time && onCandleClick) {
        const idx = dataRef.current.findIndex((f) => f.time === param.time);
        if (idx !== -1)
          onCandleClick(idx, new Date(param.time * 1000).toISOString());
      }
    });

    const handleResize = () => {
      if (chartRef.current)
        chart.applyOptions({ width: chartRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartInstance.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Load candle data
  useEffect(() => {
    if (!seriesRef.current || !data.length) return;
    const formatted = data
      .map((d) => {
        const parsed = new Date(String(d.date).trim().replace(" ", "T"));
        if (isNaN(parsed.getTime())) return null;
        return {
          time: Math.floor(parsed.getTime() / 1000),
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.time - b.time);
    const unique = [];
    for (let i = 0; i < formatted.length; i++) {
      if (i === 0 || formatted[i].time !== formatted[i - 1].time)
        unique.push(formatted[i]);
    }
    dataRef.current = unique;
    seriesRef.current.setData(unique);
    chartInstance.current.timeScale().fitContent();
  }, [data]);

  // Draw prediction cloud + actual price line
  useEffect(() => {
    if (!chartInstance.current) return;

    // Remove old cloud series
    cloudSeriesRef.current.forEach((s) => {
      try {
        chartInstance.current.removeSeries(s);
      } catch {}
    });
    cloudSeriesRef.current = [];

    // Remove old actual price line
    if (actualSeriesRef.current) {
      try {
        chartInstance.current.removeSeries(actualSeriesRef.current);
      } catch {}
      actualSeriesRef.current = null;
    }

    if (!patternResult || !patternResult.cloud || !dataRef.current.length)
      return;
    if (selectedIndex == null || selectedIndex >= dataRef.current.length)
      return;

    const baseTime = dataRef.current[selectedIndex].time;
    const basePrice = dataRef.current[selectedIndex].close;

    // Estimate candle interval
    let candleInterval = 86400;
    if (dataRef.current.length > 1) {
      candleInterval = dataRef.current[1].time - dataRef.current[0].time;
    }

    const toPrice = (pct) => basePrice * (1 + pct / 100);

    // Draw cloud lines
    const lines = [
      {
        data: patternResult.cloud.map((c) => ({
          time: baseTime + c.step * candleInterval,
          value: toPrice(c.max),
        })),
        color: "rgba(59,130,246,0.1)",
        width: 1,
        style: 2,
      },
      {
        data: patternResult.cloud.map((c) => ({
          time: baseTime + c.step * candleInterval,
          value: toPrice(c.min),
        })),
        color: "rgba(59,130,246,0.1)",
        width: 1,
        style: 2,
      },
      {
        data: patternResult.cloud.map((c) => ({
          time: baseTime + c.step * candleInterval,
          value: toPrice(c.p75),
        })),
        color: "rgba(59,130,246,0.2)",
        width: 1,
        style: 2,
      },
      {
        data: patternResult.cloud.map((c) => ({
          time: baseTime + c.step * candleInterval,
          value: toPrice(c.p25),
        })),
        color: "rgba(59,130,246,0.2)",
        width: 1,
        style: 2,
      },
      {
        data: patternResult.cloud.map((c) => ({
          time: baseTime + c.step * candleInterval,
          value: toPrice(c.median),
        })),
        color: "#3b82f6",
        width: 2,
        style: 0,
      },
    ];

    lines.forEach((l) => {
      const s = chartInstance.current.addLineSeries({
        color: l.color,
        lineWidth: l.width,
        lineStyle: l.style,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      s.setData(l.data);
      cloudSeriesRef.current.push(s);
    });

    // Draw actual price line (what really happened after the selected candle)
    const cloudSteps = patternResult.cloud.length;
    const actualData = [];

    for (let step = 0; step <= cloudSteps; step++) {
      const dataIdx = selectedIndex + step;
      if (dataIdx >= dataRef.current.length) break;

      const candle = dataRef.current[dataIdx];
      const time = baseTime + step * candleInterval;

      actualData.push({
        time,
        value: candle.close,
      });
    }

    if (actualData.length > 1) {
      const actualSeries = chartInstance.current.addLineSeries({
        color: "#f59e0b",
        lineWidth: 2,
        lineStyle: 0,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      actualSeries.setData(actualData);
      actualSeriesRef.current = actualSeries;
      cloudSeriesRef.current.push(actualSeries);
    }
  }, [patternResult, selectedIndex]);

  return <div ref={chartRef} className="w-full" />;
}
