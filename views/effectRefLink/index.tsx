import React from "react";
import Visualizer from "./components/Visualizer";
import { useOutletContext } from "react-router-dom";
import { Workflow } from "lucide-react";
import NowHandle from '@/components/NowHandle/index'
import TitleLayer from '@/components/TitleLayer/index'

export default function EffectRefLink() {
  const { currentStep } = useOutletContext<{
    currentStep: any;
  }>();

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Dynamic Operation Banner */}
      <NowHandle description={currentStep.description} />

      {/* Visualization Content Area */}
      <div className="flex-1 flex flex-col min-h-0 mt-2">
        <TitleLayer title="内存对象图表" element={Workflow} />
        {currentStep.state && <Visualizer state={currentStep.state} />}
      </div>
    </div>
  );
}
