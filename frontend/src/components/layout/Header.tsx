import { AlertTriangle } from "lucide-react";
import { STUDY_AREA } from "../../config";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-slate-800">
          Study Area: <span className="font-normal text-slate-600">{STUDY_AREA.name}</span>
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600 border border-accent-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          DEMO DATA: synthetic/illustrative
        </div>
      </div>
    </header>
  );
}
