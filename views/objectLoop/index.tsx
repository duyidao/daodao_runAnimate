import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Database, Box, Layers, ArrowDown } from 'lucide-react';
import { DEMO_CODE, DEMO_STEPS } from './constants';

// --- Components ---

const CodeViewer: React.FC<{ code: string; activeLine: number }> = ({ code, activeLine }) => {
  const lines = code.split('\n');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && activeLine > 0) {
      const lineElement = scrollRef.current.children[activeLine - 1] as HTMLElement;
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLine]);

  return (
    <div className="bg-[#1e1e1e] h-full flex flex-col font-mono text-sm overflow-hidden">
      <div className="flex items-center px-4 py-3 bg-[#252526] border-b border-[#333]">
         <span className="text-yellow-500 font-bold text-xs uppercase tracking-wider">JavaScript 执行</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 leading-6">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === activeLine;
          return (
            <div
              key={index}
              className={`flex transition-colors duration-200 ${isActive ? 'bg-[#37373d]' : 'hover:bg-[#2a2a2d]'}`}
            >
              <span className={`w-8 text-right pr-4 select-none text-xs pt-[2px] ${isActive ? 'text-gray-200 font-bold' : 'text-gray-600'}`}>
                {lineNumber}
              </span>
              <pre className={`flex-1 pl-2 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                 {line}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SetVisualizer: React.FC<{ seen: string[]; isNewScope: boolean }> = ({ seen, isNewScope }) => {
  return (
    <div className={`flex flex-col p-4 rounded-xl border transition-all duration-500 ${isNewScope ? 'bg-indigo-900/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-gray-800/40 border-gray-700'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">
          <Database className="w-3.5 h-3.5" />
          当前值 (Set)
        </div>
        {isNewScope && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full animate-pulse">
            <Layers className="w-3 h-3" /> NEW SET COPY
          </span>
        )}
      </div>
          
      <div className="flex flex-wrap gap-2 min-h-[36px] items-center">
        {seen.length === 0 ? (
          <span className="text-gray-600 italic text-sm">Empty Set</span>
        ) : (
          <>
            {seen.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-700 border border-gray-600 text-xs font-mono text-gray-200 animate-in zoom-in duration-300">
                <div className={`w-2 h-2 rounded-full ${item === 'root' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                {item === 'root' ? 'obj' : `obj.${item}`}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const GraphVisualizer: React.FC<{ activeNode: string | null; seen: string[] }> = ({ activeNode, seen }) => {
     // Nodes: root, a, c
     const isRoot = activeNode === 'root';
     const isA = activeNode === 'a';
     const isC = activeNode === 'c';
     
     // Determine if node is in CURRENT set
     const inSetRoot = seen.includes('root');
     const inSetA = seen.includes('a');
     const inSetC = seen.includes('c');

     return (
        <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl relative overflow-hidden flex flex-col items-center justify-center py-8">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-12 scale-110">
                {/* ROOT */}
                <div className={`relative flex flex-col items-center transition-all duration-300 ${isRoot ? 'scale-110' : 'opacity-90'}`}>
                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-gray-800 transition-all duration-300 z-10 
                        ${isRoot ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : inSetRoot ? 'border-blue-900/50 opacity-50' : 'border-gray-600'}
                    `}>
                        <Box className={`w-6 h-6 ${isRoot ? 'text-blue-400' : 'text-gray-500'}`} />
                    </div>
                    <span className="absolute -right-8 top-4 text-xs font-mono text-gray-500">obj</span>
                    {inSetRoot && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900 z-20" />}
                </div>

                {/* Branches Container */}
                <div className="flex gap-16 relative">
                    {/* Connection Lines (drawn via CSS borders for simplicity or SVG) */}
                    <svg className="absolute -top-12 left-0 w-full h-12 pointer-events-none overflow-visible">
                        {/* Line to A */}
                        <path d="M 50% 0 C 50% 20, 20% 20, 20% 48" fill="none" stroke={isA ? '#a855f7' : '#4b5563'} strokeWidth="2" />
                        {/* Line to C */}
                        <path d="M 50% 0 C 50% 20, 80% 20, 80% 48" fill="none" stroke={isC ? '#a855f7' : '#4b5563'} strokeWidth="2" />
                    </svg>

                    {/* Node A */}
                    <div className={`flex flex-col items-center transition-all duration-300 ${isA ? 'scale-110' : 'opacity-80'}`}>
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-gray-800 transition-all 
                             ${isA ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : inSetA ? 'border-purple-900/50' : 'border-gray-600'}
                        `}>
                            <span className="text-[10px] font-bold text-gray-300">{"{b:2}"}</span>
                        </div>
                        <span className="mt-2 text-xs font-mono text-gray-500">key: 'a'</span>
                        {inSetA && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900 z-20" />}
                    </div>

                    {/* Node C */}
                    <div className={`flex flex-col items-center transition-all duration-300 ${isC ? 'scale-110' : 'opacity-80'}`}>
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-gray-800 transition-all
                             ${isC ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : inSetC ? 'border-purple-900/50' : 'border-gray-600'}
                        `}>
                            <span className="text-[10px] font-bold text-gray-300">{"{b:2}"}</span>
                        </div>
                        <span className="mt-2 text-xs font-mono text-gray-500">key: 'c'</span>
                         {inSetC && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900 z-20" />}
                    </div>
                </div>
            </div>
        </div>
     )
}

// --- Main ObjectLoop ---

export default function ObjectLoop() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  const steps = DEMO_STEPS;
  const currentStep = steps[currentStepIndex];

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
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="h-screen bg-[#101010] text-gray-100 flex overflow-hidden font-sans selection:bg-blue-500/30">
        
      {/* LEFT PANEL: CODE */}
      <div className="w-1/2 flex flex-col border-r border-[#333]">
        <CodeViewer code={DEMO_CODE} activeLine={currentStep.line} />
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

          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
             
             {/* 1. Step Description */}
             <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-4 rounded-l border-l-4 border-blue-500">
                 <h2 className="text-xs font-bold text-blue-400 uppercase mb-1">当前操作</h2>
                 <p className="text-lg font-medium text-gray-100">{currentStep.description}</p>
             </div>

             {/* 2. Visualizers Grid */}
             <div className="grid grid-cols-1 gap-4 shrink-0">
                 <SetVisualizer seen={currentStep.seen} isNewScope={currentStep.isNewScope} />
             </div>
             
             {/* 3. Graph */}
             <div className="flex-1 flex flex-col min-h-0">
                 <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                     <Layers className="w-3.5 h-3.5" /> 对象图表
                 </div>
                 <GraphVisualizer activeNode={currentStep.activeNode} seen={currentStep.seen} />
             </div>

          </div>

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
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-black' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
              >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
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
                  <span className="text-[10px] text-gray-500 font-mono text-center">速度</span>
                  <input 
                    type="range" 
                    min="200" 
                    max="2000" 
                    step="100"
                    value={2200 - playbackSpeed} // Invert for logic (Left=Slow, Right=Fast)
                    onChange={(e) => setPlaybackSpeed(2200 - parseInt(e.target.value))}
                    className="h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-white"
                  />
              </div>
          </div>
      </div>
    </div>
  );
}