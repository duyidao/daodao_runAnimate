import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Box,
} from "lucide-react";
import NavigationOverlay from "./navigationOverlay";
import { CATEGORIES } from "@/constants";
import { Outlet } from "react-router-dom";
import CodeViewer from "./codeViewer";

export default function AppLayout() {
  const location = useLocation();
  // 路由信息
  const route = useMemo(() => {
    const type = location.pathname.split("/")[1];
    const cat = CATEGORIES.find((cat) => cat.id === type);
    return cat?.scenarios?.find((e) => e.path === location.pathname) || {};
  }, [location.pathname]);
  // 步骤数组
  const steps = useMemo(() => {
    const type = location.pathname.split("/")[1];
    const cat = CATEGORIES.find((cat) => cat.id === type);
    return (
      cat?.scenarios?.find((e) => e.path === location.pathname)?.steps || []
    );
  }, [location.pathname]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  // 总步骤数
  const totalSteps = useMemo(() => {
    return steps.length || 0;
  }, [steps]);
  const playTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      playTimer.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }

    return () => {
      if (playTimer.current) {
        clearInterval(playTimer.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => {
      // 如果在最后一步且用户点击播放，则重置到开始
      if (!prev && currentStepIndex === totalSteps - 1) {
        setCurrentStepIndex(0);
        return true;
      }
      return !prev;
    });
  }, [currentStepIndex, totalSteps]);

  // 当前步骤对象
  const currentStep = useMemo(() => {
    return { ...steps[currentStepIndex] };
  }, [currentStepIndex, totalSteps]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSelectScenario = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="h-screen bg-[#171412] text-gray-100 flex overflow-hidden font-sans selection:bg-orange-500/30">
      <NavigationOverlay
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onSelect={handleSelectScenario}
      />

      {/* LEFT PANEL: CODE */}
      <div className="w-1/2 flex flex-col">
        <CodeViewer
          code={route.code || ""}
          name={route.name}
          activeLine={currentStep.highlightLines}
        />
      </div>

      {/* RIGHT PANEL: EXECUTION */}
      <div className="w-1/2 flex flex-col">
        {/* Header Area */}
        <div className="h-16 px-6 border-b border-[#333] flex items-center justify-between text-[12px]">
          <h1
            className="font-bold text-gray-200 flex items-center gap-2 bg-stone-800/80 hover:bg-orange-900/30 px-5 py-2 rounded-xl border border-stone-700 transition-all active:scale-95 group shadow-xl shadow-black/40 cursor-pointer"
            onClick={() => setIsNavOpen(true)}
          >
            <Box className="w-4 h-4 text-orange-500" />
            切换执行流程
          </h1>
          <div className="font-mono">
            步骤 {currentStepIndex + 1} / {steps?.length}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Outlet
            context={{
              currentStep,
            }}
          />
        </div>

        {/* Control Bar */}
        <div className="h-20 border-t border-[#333] bg-[#1a1a1a] flex items-center justify-center gap-4 px-6 shrink-0">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-full text-gray-400 hover:bg-orange-500/50 hover:text-white transition-colors"
            title="重置"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-full text-gray-400 hover:bg-orange-500/50 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="上一步"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => handlePlayPause(!isPlaying)}
            className={`w-[3rem] h-[3rem] rounded-[1.05rem] flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
              isPlaying
                ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                : "bg-orange-600 hover:bg-orange-500 text-white"
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
            disabled={currentStepIndex === steps?.length - 1}
            className="p-2 rounded-full text-gray-400 hover:bg-orange-500/50 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="下一步"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="w-px h-8 bg-gray-700 mx-2"></div>

          <div className="flex flex-col gap-1 w-24">
            <span className="text-[11px] text-gray-200 font-mono text-center mb-1">
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
              className="h-1 bg-orange-500/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-orange-400/80 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
