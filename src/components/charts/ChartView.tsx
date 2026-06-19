import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type LineData,
  type Time,
} from "lightweight-charts";

import derivApi from "../../services/derivApi";
import type { ChartType, Granularity } from "./ChartToolbar";

interface ChartViewProps {
  symbol: string;
  chartType: ChartType;
  granularity: Granularity;
}

const ChartView: React.FC<ChartViewProps> = ({
  symbol,
  chartType,
  granularity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const chartRef = useRef<IChartApi | null>(null);

  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  /**
   * ----------------------------------------------------
   * Create Chart
   * ----------------------------------------------------
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: "#0f1117",
        },
        textColor: "#d1d5db",
      },

      grid: {
        vertLines: {
          color: "#1f2937",
        },
        horzLines: {
          color: "#1f2937",
        },
      },

      crosshair: {
        mode: 1,
      },

      rightPriceScale: {
        borderColor: "#374151",
      },

      timeScale: {
        borderColor: "#374151",
        timeVisible: true,
        secondsVisible: false,
      },

      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    chartRef.current = chart;

    const resize = new ResizeObserver(() => {
      if (!containerRef.current) return;

      chart.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    });

    resize.observe(containerRef.current);

    return () => {
      resize.disconnect();
      chart.remove();
    };
  }, []);

  /**
   * ----------------------------------------------------
   * Rebuild Series
   * ----------------------------------------------------
   */
  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) return;

    if (candleSeriesRef.current) {
      chart.removeSeries(candleSeriesRef.current);
      candleSeriesRef.current = null;
    }

    if (lineSeriesRef.current) {
      chart.removeSeries(lineSeriesRef.current);
      lineSeriesRef.current = null;
    }

    if (areaSeriesRef.current) {
      chart.removeSeries(areaSeriesRef.current);
      areaSeriesRef.current = null;
    }

    switch (chartType) {
      case "candles":
        candleSeriesRef.current = chart.addCandlestickSeries({
          upColor: "#22c55e",
          downColor: "#ef4444",
          borderUpColor: "#22c55e",
          borderDownColor: "#ef4444",
          wickUpColor: "#22c55e",
          wickDownColor: "#ef4444",
        });
        break;

      case "line":
        lineSeriesRef.current = chart.addLineSeries({
          color: "#6366f1",
          lineWidth: 2,
        });
        break;

      case "area":
        areaSeriesRef.current = chart.addAreaSeries({
          topColor: "rgba(99,102,241,.35)",
          bottomColor: "rgba(99,102,241,0)",
          lineColor: "#6366f1",
          lineWidth: 2,
        });
        break;
    }
  }, [chartType]);

  /**
   * ----------------------------------------------------
   * Load Historical Candles
   * ----------------------------------------------------
   */
  useEffect(() => {
    derivApi.send({
      forget_all: "candles",
    });

    derivApi.getCandles(symbol, granularity, 300);

    const unsubscribeCandles = derivApi.on("candles", (data: any) => {
      console.log("RAW CANDLES:", data);

      const candles: CandlestickData[] = (data?.candles ?? [])
        .map((c: any) => ({
          time: c.epoch as Time,

          open: Number(c.open),

          high: Number(c.high),

          low: Number(c.low),

          close: Number(c.close),
        }))
        .filter(
          (c) =>
            Number.isFinite(c.open) &&
            Number.isFinite(c.high) &&
            Number.isFinite(c.low) &&
            Number.isFinite(c.close)
        );

      if (candles.length === 0) {
        console.warn("No valid candles.");
        return;
      }

      const lineData: LineData[] = candles.map((c) => ({
        time: c.time,
        value: c.close,
      }));

      candleSeriesRef.current?.setData(candles);
      lineSeriesRef.current?.setData(lineData);
      areaSeriesRef.current?.setData(lineData);

      chartRef.current?.timeScale().fitContent();
    });

    /**
     * ---------------------------------------------
     * Live Updates
     * ---------------------------------------------
     */

    const unsubscribeOHLC = derivApi.on("ohlc", (data: any) => {
      if (!data?.ohlc) return;

      const bar: CandlestickData = {
        time: data.ohlc.epoch as Time,

        open: Number(data.ohlc.open),

        high: Number(data.ohlc.high),

        low: Number(data.ohlc.low),

        close: Number(data.ohlc.close),
      };

      if (
        !Number.isFinite(bar.open) ||
        !Number.isFinite(bar.high) ||
        !Number.isFinite(bar.low) ||
        !Number.isFinite(bar.close)
      ) {
        console.warn("Invalid OHLC:", data.ohlc);
        return;
      }

      candleSeriesRef.current?.update(bar);

      lineSeriesRef.current?.update({
        time: bar.time,
        value: bar.close,
      });

      areaSeriesRef.current?.update({
        time: bar.time,
        value: bar.close,
      });
    });

    return () => {
      unsubscribeCandles();
      unsubscribeOHLC();
    };
  }, [symbol, granularity]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default ChartView;