import React, { useState, useEffect, useRef } from "react";
import derivApi from "../../services/derivApi";

interface TradePanelProps {
  symbol: string;
  currentPrice?: string;
}

type DurationUnit = "t" | "s" | "m" | "h" | "d";

const DURATION_UNITS: { label: string; value: DurationUnit }[] = [
  { label: "Ticks", value: "t" },
  { label: "Seconds", value: "s" },
  { label: "Minutes", value: "m" },
  { label: "Hours", value: "h" },
  { label: "Days", value: "d" },
];

const TradePanel: React.FC<TradePanelProps> = ({ symbol, currentPrice }) => {
  const [amount, setAmount] = useState("10");
  const [duration, setDuration] = useState("5");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("t");
  const [proposalRise, setProposalRise] = useState<string | null>(null);
  const [proposalFall, setProposalFall] = useState<string | null>(null);
  const [tradeResult, setTradeResult] = useState<{ status: "win" | "loss" | "pending"; profit?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const proposalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // auto-fetch proposals when params change
  useEffect(() => {
    clearTimeout(proposalTimer.current);
    proposalTimer.current = setTimeout(() => {
      if (!symbol || isNaN(+amount) || isNaN(+duration)) return;
      derivApi.send({ forget_all: "proposal" });
      derivApi.getProposal({ symbol, contractType: "CALL", duration: +duration, durationUnit, amount: +amount });
      derivApi.getProposal({ symbol, contractType: "PUT", duration: +duration, durationUnit, amount: +amount });
    }, 400);
    return () => clearTimeout(proposalTimer.current);
  }, [symbol, amount, duration, durationUnit]);

  useEffect(() => {
    const unsub = derivApi.on("proposal", (data) => {
      if (!data.proposal) return;
      const payout = parseFloat(data.proposal.payout).toFixed(2);
      if (data.proposal.contract_type === "CALL") setProposalRise(payout);
      else setProposalFall(payout);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = derivApi.on("buy", (data) => {
      setLoading(false);
      if (data.error) {
        setTradeResult(null);
        alert(`Trade error: ${data.error.message}`);
        return;
      }
      setTradeResult({ status: "pending" });

      // track contract
      const contractId = data.buy?.contract_id;
      if (contractId) {
        derivApi.send({ proposal_open_contract: 1, contract_id: contractId, subscribe: 1 });
      }
    });

    const unsubContract = derivApi.on("proposal_open_contract", (data) => {
      const c = data.proposal_open_contract;
      if (!c || !c.is_settleable) return;
      const profit = parseFloat(c.profit);
      setTradeResult({ status: profit >= 0 ? "win" : "loss", profit });
    });

    return () => { unsub(); unsubContract(); };
  }, []);

  const placeTrade = (type: "CALL" | "PUT") => {
    setLoading(true);
    setTradeResult(null);
    derivApi.buyContract({
      symbol,
      contractType: type,
      duration: +duration,
      durationUnit,
      amount: +amount,
      basis: "stake",
    });
  };

  return (
    <div className="trade-panel">
      <div className="trade-panel-header">Trade</div>

      <div className="trade-field">
        <label>Stake (USD)</label>
        <div className="amount-row">
          <button onClick={() => setAmount((v) => String(Math.max(1, +v - 1)))}>−</button>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={() => setAmount((v) => String(+v + 1))}>+</button>
        </div>
      </div>

      <div className="trade-field">
        <label>Duration</label>
        <div className="duration-row">
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ width: "64px" }}
          />
          <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}>
            {DURATION_UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {currentPrice && (
        <div className="current-price">
          <span className="price-label">Current Price</span>
          <span className="price-value">{currentPrice}</span>
        </div>
      )}

      <div className="trade-buttons">
        <button
          className="btn-rise"
          onClick={() => placeTrade("CALL")}
          disabled={loading}
        >
          <span className="btn-arrow">▲</span>
          <span className="btn-label">Rise</span>
          {proposalRise && <span className="btn-payout">${proposalRise}</span>}
        </button>
        <button
          className="btn-fall"
          onClick={() => placeTrade("PUT")}
          disabled={loading}
        >
          <span className="btn-arrow">▼</span>
          <span className="btn-label">Fall</span>
          {proposalFall && <span className="btn-payout">${proposalFall}</span>}
        </button>
      </div>

      {loading && <div className="trade-status pending">Placing trade…</div>}

      {tradeResult && !loading && (
        <div className={`trade-status ${tradeResult.status}`}>
          {tradeResult.status === "pending" && "Trade placed! Waiting for result…"}
          {tradeResult.status === "win" && `✓ Won $${tradeResult.profit?.toFixed(2)}`}
          {tradeResult.status === "loss" && `✗ Lost $${Math.abs(tradeResult.profit ?? 0).toFixed(2)}`}
        </div>
      )}
    </div>
  );
};

export default TradePanel;
