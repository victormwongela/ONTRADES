const QuickStrategy = () => {
  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Quick Strategy
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <div className="border p-6 rounded-lg">
          Martingale
        </div>

        <div className="border p-6 rounded-lg">
          D'Alembert
        </div>

        <div className="border p-6 rounded-lg">
          RSI Strategy
        </div>

        <div className="border p-6 rounded-lg">
          Moving Average
        </div>

      </div>

    </div>
  );
};

export default QuickStrategy;