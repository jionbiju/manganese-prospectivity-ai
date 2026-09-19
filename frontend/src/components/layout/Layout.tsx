import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 bg-white p-3 text-center text-xs text-slate-500">
          Prototype: production data simulated; MOIL operational data can be connected via the documented schema.
        </footer>
      </div>
    </div>
  );
}
