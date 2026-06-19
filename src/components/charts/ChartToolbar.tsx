import React from "react";

export type ChartType = "candles" | "line" | "area";
export type Granularity = 60 | 300 | 900 | 1800 | 3600 | 86400;

interface ChartToolbarProps {
  chartType: ChartType;
  granularity: Granularity;
  onChartTypeChange?: (type: ChartType) => void;
  onGranularityChange?: (granularity: Granularity) => void;
}

const GRANULARITIES = [
  { label: "1m", value: 60 },
  { label: "5m", value: 300 },
  { label: "15m", value: 900 },
  { label: "30m", value: 1800 },
  { label: "1H", value: 3600 },
  { label: "1D", value: 86400 },
] as const;

const CHART_TYPES = [
  {
    label: "▣",
    value: "candles" as ChartType,
    title: "Candlestick",
  },
  {
    label: "╱",
    value: "line" as ChartType,
    title: "Line",
  },
  {
    label: "▲",
    value: "area" as ChartType,
    title: "Area",
  },
];

const ChartToolbar: React.FC<ChartToolbarProps> = ({
  chartType,
  granularity,
  onChartTypeChange,
  onGranularityChange,
}) => {
  return (
    <div className="w-full flex items-center justify-between bg-[#111827] border-b border-gray-800 px-4 py-2">

      {/* Timeframes */}
      <div className="flex items-center gap-2">
        {GRANULARITIES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onGranularityChange?.(item.value)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
              ${
                granularity === item.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Chart Types */}
      <div className="flex items-center gap-2">
        {CHART_TYPES.map((item) => (
          <button
            key={item.value}
            type="button"
            title={item.title}
            onClick={() => onChartTypeChange?.(item.value)}
            className={`w-10 h-10 rounded-md text-lg transition-all duration-200
              ${
                chartType === item.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartToolbar;