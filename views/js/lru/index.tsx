import React from "react";
import { useOutletContext } from "react-router-dom";
import { RotateCcw, Layers, ArrowRight, Database, Info } from "lucide-react";
import NowHandle from "@/components/NowHandle/index";
import TitleLayer from "@/components/TitleLayer/index";

export default function LRUCache() {
  const { currentStep } = useOutletContext<{
    currentStep;
  }>();

  const length = currentStep.cache?.length || 0;

  return (
    <div className="flex flex-col h-full gap-6 overflow-auto">
      <NowHandle
        description={currentStep.description}
        title={currentStep.title}
        operation={currentStep.operation}
      />

      {/* 缓存队列状态 */}
      <div>
        <TitleLayer
          title="缓存队列状态"
          element={Layers}
          props={{ color: "[#ff6b00]" }}
        />

        <div className="grid grid-cols-4 gap-6">
          {currentStep.cache?.map((key, i) => (
            <div key={key} className="flex flex-col gap-3">
              <div
                className={`
                          h-[10rem] rounded-[0.95rem] border-2 flex flex-col items-center justify-center gap-[0.5rem] transition-all duration-300
                          ${
                            currentStep.targetKey === key
                              ? "bg-[#292524] active-card-glow border-[#ff6b00]"
                              : "bg-[#1c1917] border-[#44403c]"
                          }
                        `}
              >
                <span className="text-[0.8rem] text-[#78716c] font-bold uppercase">
                  键 (Key)
                </span>
                <span
                  className={`text-[2rem] font-bold ${currentStep.targetKey === key ? "text-white" : "text-[#44403c]"}`}
                >
                  {key.toUpperCase()}
                </span>
                <div className="mt-2 px-[0.6rem] py-[0.2rem] bg-stone-900 rounded-md border border-stone-800">
                  <span className="text-[0.8rem] text-[#ff6b00] font-mono">
                    值: {currentStep.cacheValues[key]}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${i === 0 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : i === length - 1 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-[#44403c]"}`}
                />
                <span className="text-[0.75rem] font-bold text-[#44403c] uppercase tracking-tighter">
                  {i === 0
                    ? "最久未使用 (LRU)"
                    : i === length - 1
                      ? "最新访问 (MRU)"
                      : `位置 ${i}`}
                </span>
              </div>
            </div>
          ))}

          {/* 空插槽 */}
          {Array.from({ length: 4 - length || 0 })?.map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-40 border-2 border-dashed border-[#292524] rounded-2xl bg-[#171412] flex items-center justify-center"
            >
              <span className="text-[#292524] text-[10px] font-bold uppercase tracking-widest italic">
                可用地址
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 底部监视面板 */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-[#292524] border border-[#44403c] rounded-[0.8rem] p-[1.25rem] card-shadow">
          <TitleLayer
            title="运行状态遥测"
            element={Database}
            props={{ color: "[#ff6b00]" }}
          />
          <div className="grid grid-cols-2 gap-y-4 gap-x-10 mt-4">
            <div>
              <label className="text-[1rem] text-[#78716c] font-bold uppercase block mb-1">
                目标操作键
              </label>
              <p className="text-[0.85rem] font-bold text-white">
                {currentStep.targetKey || "无"}
              </p>
            </div>
            <div>
              <label className="text-[1rem] text-[#78716c] font-bold uppercase block mb-1">
                返回结果
              </label>
              <p
                className={`text-[0.85rem] font-bold ${currentStep.result === undefined ? "text-[#44403c]" : "text-blue-400"}`}
              >
                {currentStep.result === undefined
                  ? "VOID (无)"
                  : JSON.stringify(currentStep.result)}
              </p>
            </div>
            <div className="col-span-2 pt-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[0.85rem] text-[#78716c] font-bold uppercase">
                  内存占用率
                </label>
                <span className="text-[0.8rem] font-bold text-white">
                  {length} / 4
                </span>
              </div>
              <div className="h-2 bg-stone-900 rounded-full border border-stone-800 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#ff6b00] to-[#fb923c] transition-all duration-500"
                  style={{
                    width: `${(length / 4) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`col-span-4 rounded-2xl border-2 p-6 flex flex-col justify-center items-center text-center transition-colors duration-300 ${getOperationBgColor(currentStep.operation)}`}
        >
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getOperationColor(currentStep.operation)}`}
          >
            {getOperationIcon(currentStep.operation)}
          </div>
          <p
            className={`text-[0.7rem] font-bold uppercase ${getOperationColor(currentStep.operation)} mb-1 tracking-widest`}
          >
            {getOperationDescription(currentStep.operation)}
          </p>
          {getOperationTargetKey(currentStep) && (
            <p
              className={`text-white font-bold text-lg leading-tight uppercase tracking-tight ${getOperationColor(currentStep.operation)}`}
            >
              移除了 '{getOperationTargetKey(currentStep)}'
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getOperationDescription(operation) {
  const data = {
    EVICT: "触发淘汰机制",
    MOVE: "缓存项权重提升",
  };

  return data[operation] || "引擎空闲中";
}

function getOperationBgColor(operation) {
  const data = {
    EVICT: "bg-red-500/5 border-red-500/20 active-card-glow",
    MOVE: "bg-orange-500/5 border-orange-500/20 active-card-glow",
  };
  return data[operation] || "bg-stone-900/5 border-stone-800 active-card-glow";
}

function getOperationColor(operation) {
  const data = {
    EVICT: "bg-red-500/5",
    MOVE: "bg-orange-500/5",
  };
  return data[operation] || "bg-stone-800";
}

function getOperationIcon(operation) {
  const data = {
    EVICT: <RotateCcw size={20} />,
    MOVE: <ArrowRight size={20} />,
  };
  return data[operation] || <Info size={20} />;
}

function getOperationTargetKey(currentStep) {
  const data = {
    EVICT: currentStep.evictedKey,
    MOVE: currentStep.targetKey,
  };
  return data[currentStep.operation] || "";
}
