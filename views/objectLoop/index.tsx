import React from "react";
import { Database, Box, Layers } from "lucide-react";

const SetVisualizer: React.FC<{ seen: string[]; isNewScope: boolean }> = ({
  seen,
  isNewScope,
}) => {
  return (
    <div
      className={`flex flex-col p-4 rounded-xl border transition-all duration-500 ${
        isNewScope
          ? "bg-indigo-900/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          : "bg-gray-800/40 border-gray-700"
      }`}
    >
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
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-700 border border-gray-600 text-xs font-mono text-gray-200 animate-in zoom-in duration-300"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item === "root" ? "bg-blue-400" : "bg-purple-400"
                  }`}
                ></div>
                {item === "root" ? "obj" : `obj.${item}`}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const GraphVisualizer: React.FC<{
  activeNode: string | null;
  seen: string[];
}> = ({ activeNode, seen }) => {
  // Nodes: root, a, c
  const isRoot = activeNode === "root";
  const isA = activeNode === "a";
  const isC = activeNode === "c";

  // Determine if node is in CURRENT set
  const inSetRoot = seen.includes("root");
  const inSetA = seen.includes("a");
  const inSetC = seen.includes("c");

  return (
    <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl relative overflow-hidden flex flex-col items-center justify-center py-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 flex flex-col items-center gap-12 scale-110">
        {/* ROOT */}
        <div
          className={`relative flex flex-col items-center transition-all duration-300 ${
            isRoot ? "scale-110" : "opacity-90"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-gray-800 transition-all duration-300 z-10 
                        ${
                          isRoot
                            ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                            : inSetRoot
                            ? "border-blue-900/50 opacity-50"
                            : "border-gray-600"
                        }
                    `}
          >
            <Box
              className={`w-6 h-6 ${
                isRoot ? "text-blue-400" : "text-gray-500"
              }`}
            />
          </div>
          <span className="absolute -right-8 top-4 text-xs font-mono text-gray-500">
            obj
          </span>
          {inSetRoot && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900 z-20" />
          )}
        </div>

        {/* Branches Container */}
        <div className="flex gap-16 relative">
          {/* Connection Lines (drawn via CSS borders for simplicity or SVG) */}
          <svg className="absolute -top-12 left-0 w-full h-12 pointer-events-none overflow-visible">
            {/* Line to A */}
            <path
              d="M 50% 0 C 50% 20, 20% 20, 20% 48"
              fill="none"
              stroke={isA ? "#a855f7" : "#4b5563"}
              strokeWidth="2"
            />
            {/* Line to C */}
            <path
              d="M 50% 0 C 50% 20, 80% 20, 80% 48"
              fill="none"
              stroke={isC ? "#a855f7" : "#4b5563"}
              strokeWidth="2"
            />
          </svg>

          {/* Node A */}
          <div
            className={`flex flex-col items-center transition-all duration-300 ${
              isA ? "scale-110" : "opacity-80"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-gray-800 transition-all 
                             ${
                               isA
                                 ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                                 : inSetA
                                 ? "border-purple-900/50"
                                 : "border-gray-600"
                             }
                        `}
            >
              <span className="text-[10px] font-bold text-gray-300">
                {"{b:2}"}
              </span>
            </div>
            <span className="mt-2 text-xs font-mono text-gray-500">
              key: 'a'
            </span>
            {inSetA && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900 z-20" />
            )}
          </div>

          {/* Node C */}
          <div
            className={`flex flex-col items-center transition-all duration-300 ${
              isC ? "scale-110" : "opacity-80"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-gray-800 transition-all
                             ${
                               isC
                                 ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                                 : inSetC
                                 ? "border-purple-900/50"
                                 : "border-gray-600"
                             }
                        `}
            >
              <span className="text-[10px] font-bold text-gray-300">
                {"{b:2}"}
              </span>
            </div>
            <span className="mt-2 text-xs font-mono text-gray-500">
              key: 'c'
            </span>
            {inSetC && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900 z-20" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ObjectLoop({ currentStep }) {
  return (
    <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
      {/* 1. Step Description */}
      <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-4 rounded-l border-l-4 border-blue-500">
        <h2 className="text-xs font-bold text-blue-400 uppercase mb-1">
          当前操作
        </h2>
        <p className="text-lg font-medium text-gray-100">
          {currentStep.description}
        </p>
      </div>

      {/* 2. Visualizers Grid */}
      <div className="grid grid-cols-1 gap-4 shrink-0">
        <SetVisualizer
          seen={currentStep.seen}
          isNewScope={currentStep.isNewScope}
        />
      </div>

      {/* 3. Graph */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5" /> 对象图表
        </div>
        <GraphVisualizer
          activeNode={currentStep.activeNode}
          seen={currentStep.seen}
        />
      </div>
    </div>
  );
}
