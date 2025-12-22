import React, { useState, useEffect, useCallback, useRef } from "react";
import Visualizer from "./components/Visualizer";

export default function App({
  currentStep,
}: {
  currentStep?: {
    description: string;
    state: any;
  };
}) {
  return (
    <div className="flex flex-col h-full bg-[#090b0e]">
      {/* Dynamic Operation Banner */}
      <div className="px-8 py-6 bg-[#0d0f12]/50 border-b border-[#1f2228]">
        <div className="relative border-l-4 border-blue-600 bg-[#12141a]/80 backdrop-blur-md p-5 rounded-r-lg border border-white/5 shadow-2xl">
          <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-1.5">
            当前操作
          </div>
          <p className="text-xl font-bold text-gray-100 tracking-tight leading-snug">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Visualization Content Area */}
      <div className="flex-1 px-8 pb-4 flex flex-col min-h-0 bg-[#090b0e]">
        <div className="flex items-center gap-2 my-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          内存对象图表
        </div>
        <Visualizer state={currentStep.state} />
      </div>
    </div>
  );
}
