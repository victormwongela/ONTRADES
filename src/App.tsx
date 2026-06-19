import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import BotBuilder from "./pages/BotBuilder";
import AnalysisTool from "./pages/AnalysisTool";
import CopyTrader from "./pages/CopyTrader";
import Charts from "./pages/Charts";
import QuickStrategy from "./pages/QuickStrategy";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bot-builder" element={<BotBuilder />} />
        <Route path="/analysis-tool" element={<AnalysisTool />} />
        <Route path="/copy-trader" element={<CopyTrader />} />
        <Route path="/charts" element={<Charts />} />
        <Route
  path="/quick-strategy"
  element={<QuickStrategy />}
/>
      </Routes>
    </>
  );
}

export default App;