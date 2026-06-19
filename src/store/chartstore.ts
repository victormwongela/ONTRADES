import { create } from "zustand";

interface ChartStore {
  symbol: string;
  timeframe: string;

  setSymbol: (symbol: string) => void;
  setTimeframe: (timeframe: string) => void;
}

export const useChartStore = create<ChartStore>(
  (set) => ({
    symbol: "R_100",
    timeframe: "1m",

    setSymbol: (symbol) =>
      set({ symbol }),

    setTimeframe: (timeframe) =>
      set({ timeframe }),
  })
);