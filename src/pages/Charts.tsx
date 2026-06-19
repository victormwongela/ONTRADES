import MarketSidebar from "../components/charts/MarketSidebar";
import MarketStats from "../components/charts/MarketStats";
import ChartToolbar from "../components/charts/ChartToolbar";
import ChartView from "../components/charts/ChartView";
import RecentTicks from "../components/charts/RecentTicks";

const Charts = () => {
  return (
    <div className="flex h-[calc(100vh-64px)]">

      <MarketSidebar selected={""} onSelect={function (symbol: string): void {
        throw new Error("Function not implemented.");
      } } />

      <div className="flex-1 p-6 overflow-auto">

        <MarketStats />

        <div className="mt-4">
          <ChartToolbar />
        </div>

        <ChartView />

        <RecentTicks />

      </div>

    </div>
  );
};

export default Charts;