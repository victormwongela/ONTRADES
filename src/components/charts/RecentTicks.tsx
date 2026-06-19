import React, { useEffect, useState } from "react";
import derivApi from "../../services/derivApi";

interface Tick {
  id: number;
  quote: string;
  epoch: number;
  direction: "up" | "down" | "flat";
}

interface RecentTicksProps {
  symbol: string;
}

const MAX_TICKS = 20;

const RecentTicks: React.FC<RecentTicksProps> = ({ symbol }) => {
  const [ticks, setTicks] = useState<Tick[]>([]);
  const idRef = React.useRef(0);

  useEffect(() => {
    setTicks([]);
    const unsub = derivApi.on("tick", (data) => {
      if (data.tick?.symbol !== symbol) return;
      const quote = parseFloat(data.tick.quote);

      setTicks((prev) => {
        const prevQuote = prev.length ? parseFloat(prev[0].quote) : null;
        const direction =
          prevQuote === null ? "flat" : quote > prevQuote ? "up" : quote < prevQuote ? "down" : "flat";

        const newTick: Tick = {
          id: idRef.current++,
          quote: quote.toFixed(data.tick.pip_size || 5),
          epoch: data.tick.epoch,
          direction,
        };

        return [newTick, ...prev].slice(0, MAX_TICKS);
      });
    });
    return unsub;
  }, [symbol]);

  const fmt = (epoch: number) =>
    new Date(epoch * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="recent-ticks">
      <div className="ticks-header">Recent Ticks</div>
      <div className="ticks-table-head">
        <span>Time</span>
        <span>Price</span>
        <span>Dir</span>
      </div>
      <div className="ticks-list">
        {ticks.length === 0 && <div className="ticks-empty">Waiting for ticks…</div>}
        {ticks.map((t) => (
          <div key={t.id} className={`tick-row ${t.direction}`}>
            <span className="tick-time">{fmt(t.epoch)}</span>
            <span className="tick-price">{t.quote}</span>
            <span className="tick-dir">
              {t.direction === "up" ? "▲" : t.direction === "down" ? "▼" : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTicks;
