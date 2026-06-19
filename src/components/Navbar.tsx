import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Gift,
  TrendingUp,
  Activity,
  ShieldCheck,
  Copy,
  BarChart3,
  Crown,
} from "lucide-react";

const Navbar = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            ON
          </div>

          <div>
            <h1 className="font-bold text-lg text-gray-800">
              ONTRADES
            </h1>
            <p className="text-xs text-gray-500">
              Trading Automation
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center gap-2 text-sm">

          <NavLink to="/" className={navClass}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>

          <NavLink to="/bot-builder" className={navClass}>
            <Bot size={16} />
            Bot Builder
          </NavLink>

          <NavLink to="/free-bots" className={navClass}>
            <Gift size={16} />
            Free Bots
          </NavLink>

          <NavLink to="/d-trader" className={navClass}>
            <TrendingUp size={16} />
            D-Trader
          </NavLink>

          <NavLink to="/analysis-tool" className={navClass}>
            <Activity size={16} />
            Analysis Tool
          </NavLink>

          <NavLink to="/signal-center" className={navClass}>
            <Activity size={16} />
            Signal Center
          </NavLink>

          <NavLink to="/money-management" className={navClass}>
            <ShieldCheck size={16} />
            Money Management
          </NavLink>

          <NavLink to="/copy-trader" className={navClass}>
            <Copy size={16} />
            Copy Trader
          </NavLink>

          <NavLink to="/charts" className={navClass}>
            <BarChart3 size={16} />
            Charts
          </NavLink>

          <NavLink to="/ultimate-bot" className={navClass}>
            <Crown size={16} />
            Ultimate Bot
          </NavLink>

        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <button
            className="
            text-sm
            font-medium
            text-gray-700
            hover:text-blue-600
            "
          >
            Log In
          </button>

          <button
            className="
            border
            border-gray-300
            px-4
            py-2
            rounded-lg
            text-sm
            hover:bg-gray-100
            "
          >
            Token
          </button>

          <button
            className="
            bg-black
            text-white
            px-4
            py-2
            rounded-lg
            text-sm
            hover:bg-gray-800
            "
          >
            Sign Up
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;