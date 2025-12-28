import React, { useState } from "react";
import { CATEGORIES } from "./constants";
import { Scenario } from "../../types/navigationOverlay";
import {
  Code,
  Boxes,
  ChevronRight,
  X,
  Search,
  Terminal,
  Sparkles,
} from "lucide-react";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (scenario: Scenario) => void;
  currentScenarioId: string;
}

const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentScenarioId,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    CATEGORIES[0].id
  );

  if (!isOpen) return null;

  const activeCategory =
    CATEGORIES.find((cat) => cat.id === activeCategoryId) || CATEGORIES[0];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-stone-950 border border-stone-800 w-full max-w-6xl h-[85vh] rounded-[1.25rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-8 border-b border-stone-800/50 bg-stone-900/10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center border border-orange-400/30 shadow-xl shadow-orange-950/40">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-white tracking-tight leading-none">
                SCENARIO SELECTOR
              </h3>
              <p className="text-[10px] font-bold text-stone-600 mt-1 uppercase tracking-widest">
                Select logic architecture for visualization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-stone-900 hover:bg-orange-950/40 border border-stone-800 rounded-2xl text-stone-500 transition-all group shadow-lg"
          >
            <X
              size={24}
              className="group-hover:rotate-90 transition-transform duration-500 group-hover:text-orange-500"
            />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-80 bg-stone-900/20 border-r border-stone-800/50 p-8 space-y-6">
            <div className="px-2">
              <span className="text-[9px] font-black text-stone-700 uppercase tracking-[0.3em]">
                Categories
              </span>
            </div>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all duration-300 group relative ${
                    activeCategoryId === cat.id
                      ? "bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-[0_10px_30px_-5px_rgba(249,115,22,0.1)]"
                      : "border-transparent text-stone-500 hover:bg-stone-900 hover:text-stone-300"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl transition-all duration-500 ${
                      activeCategoryId === cat.id
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-stone-800 group-hover:bg-stone-700"
                    }`}
                  >
                    {cat.id === "js" ? <Code size={20} /> : <Boxes size={20} />}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black tracking-tight">
                      {cat.name}
                    </span>
                    <span className="text-[9px] font-bold opacity-60 uppercase">
                      {cat.scenarios.length} modules
                    </span>
                  </div>
                  {activeCategoryId === cat.id && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800/50">
              <div className="flex items-center gap-2 mb-3 text-orange-500/80">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Engine Tip
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed font-medium">
                Switch between different JavaScript patterns to see how they
                manage state, closures, and side effects.
              </p>
            </div>
          </div>

          {/* Scenarios Content */}
          <div className="flex-1 p-10 overflow-y-auto bg-stone-950/40 scrollbar-hide">
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col">
                <h4 className="text-xl font-black text-stone-100 italic tracking-tight flex items-center gap-3">
                  {activeCategory.name}
                </h4>
                <div className="h-0.5 w-12 bg-orange-500 mt-1 rounded-full" />
              </div>
              <div className="relative group">
                <Search
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 group-hover:text-orange-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Filter scenes..."
                  className="bg-stone-900 border border-stone-800 rounded-2xl py-2.5 pl-10 pr-6 text-xs text-stone-400 focus:outline-none focus:border-orange-500/50 focus:bg-orange-950/5 transition-all w-64"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {activeCategory.scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelect(sc);
                    onClose();
                  }}
                  className={`group relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 text-left overflow-hidden h-full ${
                    currentScenarioId === sc.id
                      ? "bg-gradient-to-br from-orange-600 to-amber-700 border-orange-400 shadow-2xl shadow-orange-950/40 translate-y-[-4px]"
                      : "bg-stone-900/40 border-stone-800 hover:border-orange-500/30 hover:bg-stone-900 hover:translate-y-[-2px] shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                        currentScenarioId === sc.id
                          ? "bg-white/10 text-white border-white/20"
                          : "bg-stone-800 text-stone-500 border-stone-700"
                      }`}
                    >
                      {activeCategory.id === "js" ? "Advanced" : "Core Engine"}
                    </span>
                    <ChevronRight
                      size={20}
                      className={`transition-transform duration-500 group-hover:translate-x-1 ${
                        currentScenarioId === sc.id
                          ? "text-white"
                          : "text-stone-700"
                      }`}
                    />
                  </div>

                  <span
                    className={`text-lg font-black mb-3 leading-none italic ${
                      currentScenarioId === sc.id
                        ? "text-white"
                        : "text-stone-100"
                    }`}
                  >
                    {sc.name}
                  </span>

                  <p
                    className={`text-[11px] leading-relaxed font-medium line-clamp-3 mb-4 ${
                      currentScenarioId === sc.id
                        ? "text-orange-100/70"
                        : "text-stone-500"
                    }`}
                  >
                    Interactive visualization of {sc.name}. Step into memory
                    allocations and logical flow.
                  </p>

                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <div
                      className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${
                        currentScenarioId === sc.id
                          ? "bg-black/20 text-white"
                          : "bg-stone-800 text-stone-600"
                      }`}
                    >
                      v1.2
                    </div>
                  </div>

                  {currentScenarioId === sc.id && (
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer Tag */}
            <div className="mt-20 border-t border-stone-800/50 pt-8 flex items-center justify-center gap-8 opacity-40">
              <span className="text-[9px] font-black text-stone-600 uppercase tracking-[0.4em]">
                Visualizer Core v4.0.12
              </span>
              <div className="w-1 h-1 rounded-full bg-stone-800" />
              <span className="text-[9px] font-black text-stone-600 uppercase tracking-[0.4em]">
                Neural Trace Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationOverlay;
