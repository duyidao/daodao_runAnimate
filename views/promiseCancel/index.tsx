import React from "react";
import { PromiseStatus } from "@/types/promiseCancel";
import { useOutletContext } from "react-router-dom";
import NowHandle from '@/components/NowHandle/index'
import { Database, Box, Layers } from "lucide-react";
import TitleLayer from '@/components/TitleLayer/index'

const VisualizerPanel: React.FC<any> = () => {
  const { currentStep } = useOutletContext<{
    currentStep: any;
  }>();
  console.log(currentStep);

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Action Banner */}
      <NowHandle description={currentStep.description} />

      {/* Main Diagram Area */}
      <div className="space-y-6">
        <TitleLayer title="对象图表" element={Layers} />
        <div className="bg-stone-900/30 border border-stone-800/50 rounded-[2rem] p-10 min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="flex items-center gap-16 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="px-6 py-4 bg-stone-900 border border-orange-500/40 rounded-2xl text-orange-400 text-xs font-black tracking-widest text-center shadow-lg relative z-10">
                EFFECT
              </div>
            </div>

            <div className="w-32 h-1 bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-1000 ${
                  currentStep.id > 1 ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </div>

            <div className="flex flex-col gap-6">
              <div
                className={`px-6 py-4 rounded-2xl border transition-all duration-500 transform ${
                  currentStep.id >= 0
                    ? "bg-stone-900 border-stone-700 text-stone-200 scale-100 shadow-xl"
                    : "opacity-20 scale-95 grayscale"
                }`}
              >
                <div className="text-[10px] font-black text-orange-500/60 mb-1">
                  FLAG (Ref)
                </div>
                <div className="text-sm font-mono font-bold tracking-tight">
                  value:{" "}
                  <span className="text-orange-400">
                    {currentStep.id >= 3 ? "false" : "true"}
                  </span>
                </div>
              </div>
              <div
                className={`px-6 py-4 rounded-2xl border transition-all duration-500 transform ${
                  currentStep.id >= 0
                    ? "bg-stone-900 border-stone-700 text-stone-200 scale-100 shadow-xl"
                    : "opacity-20 scale-95 grayscale"
                }`}
              >
                <div className="text-[10px] font-black text-orange-500/60 mb-1">
                  COUNT (Ref)
                </div>
                <div className="text-sm font-mono font-bold tracking-tight">
                  value:{" "}
                  <span className="text-orange-400">
                    {currentStep.id >= 4 ? "1" : "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "radial-gradient(#d97706 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-stone-900/30 border border-stone-800 rounded-3xl p-6 font-mono text-[11px] shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-600/60" />
            <span className="text-white-500 font-black tracking-[0.1em] text-[9px] uppercase">
              Debug Terminal
            </span>
          </div>
          <span className="text-[9px] text-[#ccc]">STD_OUT</span>
        </div>
        <div className="space-y-2 overflow-y-auto max-h-36 scrollbar-hide">
          {currentStep.terminalOutput?.length === 0 ? (
            <span className="text-stone-800 italic select-none opacity-50">
              Empty log stack...
            </span>
          ) : (
            currentStep.terminalOutput?.map((line, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <span className="text-orange-800 font-black select-none">
                  »
                </span>
                <span className="text-orange-300/80 leading-relaxed font-medium">
                  {line}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizerPanel;
