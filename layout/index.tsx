import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ObjectLoop from "@/views/objectLoop/index";
import { DEMO_CODE, DEMO_STEPS } from "@/views/objectLoop/constants";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Box,
} from "lucide-react";

const CodeViewer: React.FC<{ code: string; activeLine: number }> = ({
  code,
  activeLine,
}) => {
  const lines = code.split("\n");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && activeLine > 0) {
      const lineElement = scrollRef.current.children[
        activeLine - 1
      ] as HTMLElement;
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeLine]);

  return (
    <div className="bg-[#1e1e1e] h-full flex flex-col font-mono text-sm overflow-hidden">
      <div className="flex h-16 items-center px-4 py-3 bg-[#252526] border-b border-[#333]">
        <span className="text-yellow-500 font-bold text-xs uppercase tracking-wider">
          JavaScript 执行
        </span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 leading-6">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === activeLine;
          return (
            <div
              key={index}
              className={`flex transition-colors duration-200 ${
                isActive ? "bg-[#37373d]" : "hover:bg-[#2a2a2d]"
              }`}
            >
              <span
                className={`w-8 text-right pr-4 select-none text-xs pt-[2px] ${
                  isActive ? "text-gray-200 font-bold" : "text-gray-600"
                }`}
              >
                {lineNumber}
              </span>
              <pre
                className={`flex-1 pl-2 ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              >
                {line}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AppLayout({
  children,
  animateCode,
  animateStep,
}: {
  children: React.ReactNode;
  animateCode: string;
  animateStep: any;
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  const steps = animateStep;
  const currentStep = steps[currentStepIndex];

  // 使用 cloneElement 向 children 传递额外 props
  const clonedChildren = React.cloneElement(children as React.ReactElement, {
    currentStepIndex,
    currentStep,
  });

  // Auto-play Logic
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, playbackSpeed]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1)
      setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="h-screen bg-[#101010] text-gray-100 flex overflow-hidden font-sans selection:bg-blue-500/30">
      {/* LEFT PANEL: CODE */}
      <div className="w-1/2 flex flex-col border-r border-[#333]">
        <CodeViewer code={animateCode} activeLine={currentStep.line} />
      </div>

      {/* RIGHT PANEL: EXECUTION */}
      <div className="w-1/2 flex flex-col bg-[#141414]">
        {/* Header Area */}
        <div className="h-16 px-6 border-b border-[#333] flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <Box className="w-4 h-4 text-blue-500" />
            执行流程
          </h1>
          <div className="text-xs font-mono text-gray-500">
            步骤 {currentStepIndex + 1} / {steps.length}
          </div>
        </div>

        {clonedChildren}

        {/* Control Bar */}
        <div className="h-20 border-t border-[#333] bg-[#1a1a1a] flex items-center justify-center gap-4 px-6 shrink-0">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            title="重置"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2.5 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="上一步"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
              isPlaying
                ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="p-2.5 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="下一步"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="w-px h-8 bg-gray-700 mx-2"></div>

          <div className="flex flex-col gap-1 w-24">
            <span className="text-[10px] text-gray-500 font-mono text-center">
              速度
            </span>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={2200 - playbackSpeed} // Invert for logic (Left=Slow, Right=Fast)
              onChange={(e) =>
                setPlaybackSpeed(2200 - parseInt(e.target.value))
              }
              className="h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
