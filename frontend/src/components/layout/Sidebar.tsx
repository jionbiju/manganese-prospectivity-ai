import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map, TrendingDown, Sliders, FileText } from "lucide-react";
import { cn } from "../../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Exploration Map", href: "/map", icon: Map },
  { name: "Production Risk", href: "/risk", icon: TrendingDown },
  { name: "Scenario Simulator", href: "/simulator", icon: Sliders },
  { name: "Method & Data", href: "/method", icon: FileText },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Map className="w-5 h-5 text-accent-500" />
          OreVision
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-slate-800 text-brand-500"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
            <span className="text-xs font-medium text-slate-300">OP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Operator</span>
            <span className="text-xs text-slate-400">Balaghat Belt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
