import React, { useEffect, useState } from "react";
import derivApi from "../../services/derivApi";

interface Market {
  symbol: string;
  display_name: string;
  pip: number;
  market: string;
  submarket_display_name: string;
}

interface MarketSidebarProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

const POPULAR = ["R_100", "R_50", "R_25", "R_10", "1HZ100V", "WLDAUD", "frxEURUSD"];

const MarketSidebar: React.FC<MarketSidebarProps> = ({ selectedSymbol, onSelectSymbol }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    derivApi.getActiveSymbols();
    const unsub = derivApi.on("active_symbols", (data) => {
      const syms: Market[] = data.active_symbols || [];
      setMarkets(syms.filter((s) => s.market === "synthetic_index" || s.market === "forex"));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = derivApi.on("tick", (data) => {
      if (data.tick) {
        setPrices((prev) => ({
          ...prev,
          [data.tick.symbol]: parseFloat(data.tick.quote).toFixed(data.tick.pip_size || 2),
        }));
      }
    });
    return unsub;
  }, []);

  const filtered = markets.filter(
    (m) =>
      m.display_name.toLowerCase().includes(search.toLowerCase()) ||
      m.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const popular = filtered.filter((m) => POPULAR.includes(m.symbol));
  const rest = filtered.filter((m) => !POPULAR.includes(m.symbol));

  const handleSelect = (symbol: string) => {
    onSelectSymbol(symbol);
    derivApi.subscribeTicks(symbol);
  };

  return (
    <aside className="market-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Markets</span>
      </div>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search markets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {popular.length > 0 && (
        <>
          <div className="sidebar-group-label">Popular</div>
          {popular.map((m) => (
            <MarketRow
              key={m.symbol}
              market={m}
              isSelected={selectedSymbol === m.symbol}
              price={prices[m.symbol]}
              onSelect={handleSelect}
            />
          ))}
        </>
      )}

      {rest.length > 0 && (
        <>
          <div className="sidebar-group-label">All Markets</div>
          {rest.map((m) => (
            <MarketRow
              key={m.symbol}
              market={m}
              isSelected={selectedSymbol === m.symbol}
              price={prices[m.symbol]}
              onSelect={handleSelect}
            />
          ))}
        </>
      )}
    </aside>
  );
};

const MarketRow: React.FC<{
  market: Market;
  isSelected: boolean;
  price?: string;
  onSelect: (s: string) => void;
}> = ({ market, isSelected, price, onSelect }) => (
  <div
    className={`market-row ${isSelected ? "active" : ""}`}
    onClick={() => onSelect(market.symbol)}
  >
    <div className="market-info">
      <span className="market-name">{market.display_name}</span>
      <span className="market-sub">{market.submarket_display_name}</span>
    </div>
    <span className="market-price">{price ?? "—"}</span>
  </div>
);

export default MarketSidebar;
