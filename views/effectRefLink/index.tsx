import React from "react";
import Visualizer from "./components/Visualizer";
import { useOutletContext } from "react-router-dom";
import { Workflow } from "lucide-react";

export default function EffectRefLink() {
  const { currentStep } = useOutletContext<{
    currentStep: any;
  }>();

  return (
    <div className="flex flex-col h-full px-8 py-4">
      {/* Dynamic Operation Banner */}
      <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-4 rounded-l border-l-4 border-orange-500 mb-4">
        <h2 className="text-xs font-bold text-orange-400 uppercase mb-1">
          当前操作
        </h2>
        <p className="text-lg font-medium text-gray-100">
          {currentStep.description}
        </p>
      </div>

      {/* Visualization Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 my-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <Workflow className="w-3.5 h-3.5" />
          内存对象图表
        </div>
        {currentStep.state && <Visualizer state={currentStep.state} />}
      </div>
    </div>
  );
}
