const WS_URL = "wss://ws.binaryws.com/websockets/v3?app_id=1089";

type Listener = (data: any) => void;

class DerivAPI {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Listener[]> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private subscriptionQueue: object[] = [];
  private connected = false;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      this.connected = true;
      this.subscriptionQueue.forEach((msg) => this.send(msg));
      this.subscriptionQueue = [];
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const msgType = data.msg_type;
      (this.listeners.get(msgType) || []).forEach((cb) => cb(data));
      (this.listeners.get("*") || []).forEach((cb) => cb(data));
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  send(payload: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    } else {
      this.subscriptionQueue.push(payload);
    }
  }

  on(msgType: string, cb: Listener) {
    if (!this.listeners.has(msgType)) this.listeners.set(msgType, []);
    this.listeners.get(msgType)!.push(cb);
    return () => this.off(msgType, cb);
  }

  off(msgType: string, cb: Listener) {
    const list = this.listeners.get(msgType) || [];
    this.listeners.set(msgType, list.filter((l) => l !== cb));
  }

  // ── Ticks ──────────────────────────────────────────────────────────────────
  subscribeTicks(symbol: string) {
    this.send({ ticks: symbol, subscribe: 1 });
  }

  unsubscribeTicks(symbol: string) {
    this.send({ forget_all: "ticks" });
  }

  // ── Candles / history ──────────────────────────────────────────────────────
  getCandles(symbol: string, granularity: number, count = 500) {
    this.send({
      ticks_history: symbol,
      adjust_start_time: 1,
      count,
      end: "latest",
      granularity,
      style: "candles",
      subscribe: 1,
    });
  }

  // ── Active Symbols ─────────────────────────────────────────────────────────
  getActiveSymbols() {
    this.send({ active_symbols: "brief", product_type: "basic" });
  }

  // ── Buy contract ───────────────────────────────────────────────────────────
  buyContract(params: {
    symbol: string;
    contractType: "CALL" | "PUT";
    duration: number;
    durationUnit: "t" | "s" | "m" | "h" | "d";
    amount: number;
    basis: "stake" | "payout";
  }) {
    this.send({
      buy: 1,
      price: params.amount,
      parameters: {
        amount: params.amount,
        basis: params.basis,
        contract_type: params.contractType,
        currency: "USD",
        duration: params.duration,
        duration_unit: params.durationUnit,
        symbol: params.symbol,
      },
    });
  }

  // ── Price proposal ────────────────────────────────────────────────────────
  getProposal(params: {
    symbol: string;
    contractType: "CALL" | "PUT";
    duration: number;
    durationUnit: string;
    amount: number;
  }) {
    this.send({
      proposal: 1,
      subscribe: 1,
      amount: params.amount,
      basis: "stake",
      contract_type: params.contractType,
      currency: "USD",
      duration: params.duration,
      duration_unit: params.durationUnit,
      symbol: params.symbol,
    });
  }
}

export const derivApi = new DerivAPI();
export default derivApi;
