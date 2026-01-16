import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { SimulationState, MapEntryState } from "@/types/asyncOnce";
import {
  Globe,
  Users,
  Database,
  CheckCircle2,
  Loader2,
  Activity,
} from "lucide-react";
import NowHandle from "@/components/NowHandle/index";

interface VisualizerProps {
  state: SimulationState;
}

const Visualizer: React.FC<VisualizerProps> = () => {
  const { currentStep } = useOutletContext<{
    currentStep: any;
  }>();

  const [callers, setCallers] = useState<any[]>([]); // 调用者列表
  const [map, setMap] = useState<any>({}); // 调用者与 API 的映射关系[]>([]); // 调用者列表
  const [apiStatus, setApiStatus] = useState<any>({}); // API 状态[]>([]); // 调用者列表

  useEffect(() => {
    if (currentStep) {
      setCallers(currentStep.state?.callers || []);
      setMap(currentStep.state?.map || {});
      setApiStatus(currentStep.state?.apiStatus || {});
    }
  }, [currentStep.state]);

  const [activeEntryKey, setActiveEntryKey] = useState<any>(null); // API 状态[]>([]); // 调用者列表
  const [activeEntry, setActiveEntry] = useState<any>(null); // API 状态[]>([]); // 调用者列表

  useEffect(() => {
    if (map) {
      setActiveEntryKey(Object.keys(map).find((k) => map[k] !== null));
      setActiveEntry(activeEntryKey ? map[activeEntryKey] : null);
    }
  }, [map]);

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Action Banner */}
      <NowHandle description={currentStep.description} />

      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#4f46e5 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* 核心可视化区 */}
      <div className="relative h-[20rem] border border-[#1f2228] bg-[#0d0f12]/20 rounded-lg shadow-inner flex items-center justify-around px-8">
        {/* 调用者列表 (User A, B, C) */}
        <div className="flex flex-col gap-4 z-10 w-[10.5rem]">
          <div className="text-[0.75rem] text-gray-400 font-bold uppercase tracking-widest text-center mb-1">
            并发请求方 (Clients)
          </div>
          {callers?.map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all duration-300 ${
                c.status === "pending"
                  ? "bg-orange-600/10 border-orange-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  : c.status === "resolved"
                  ? "bg-green-600/10 border-green-500"
                  : "bg-[#1a1c22] border-[#2d333b] opacity-40"
              }`}
            >
              <Users
                size={14}
                className={
                  c.status === "pending"
                    ? "text-orange-400"
                    : c.status === "resolved"
                    ? "text-green-400"
                    : "text-gray-600"
                }
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[0.6rem] font-mono font-bold truncate">
                  {c.id}
                </span>
              </div>
              {c.status === "pending" && (
                <Loader2 size={12} className="animate-spin text-orange-500" />
              )}
              {c.status === "resolved" && (
                <CheckCircle2 size={12} className="text-green-500" />
              )}
            </div>
          ))}
        </div>

        {/* Map Entry 内部结构透视 */}
        <div className="flex flex-col items-center gap-4 flex-1 max-w-[18.5rem]">
          <div
            className={`relative w-full p-5 rounded-2xl bg-[#161a22] border-2 transition-all duration-500 ${
              activeEntry
                ? "border-indigo-500/60 shadow-[0_0_40px_rgba(79,70,229,0.15)]"
                : "border-[#2d333b] opacity-20"
            }`}
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#2d333b] pb-2">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-indigo-400" />
                <span className="text-2xs font-bold text-indigo-100 font-mono tracking-tighter">
                  Entry: "{activeEntryKey || "..."}"
                </span>
              </div>
            </div>

            <div className="space-y-4 text-[0.7rem]">
              {/* resolve 数组 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="font-black uppercase text-green-500/70">
                    resolve: Array({activeEntry?.resolveQueue.length || 0})
                  </span>
                </div>
                <div className="h-9 bg-[#090b0e] rounded border border-[#2d333b] flex items-center px-1.5 gap-1.5 overflow-x-auto custom-scrollbar">
                  {activeEntry?.resolveQueue.map((id, i) => (
                    <div
                      key={i}
                      className="px-2 py-0.5 bg-green-900/30 text-green-400 border border-green-500/30 rounded font-mono font-bold animate-in zoom-in"
                    >
                      {id}
                    </div>
                  ))}
                  {(!activeEntry || activeEntry.resolveQueue.length === 0) && (
                    <span className="text-gray-700 italic">empty</span>
                  )}
                </div>
              </div>

              {/* reject 数组 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="font-black uppercase text-red-500/70">
                    reject: Array({activeEntry?.rejectQueue.length || 0})
                  </span>
                </div>
                <div className="h-9 bg-[#090b0e] rounded border border-[#2d333b] flex items-center px-1.5 gap-1.5 overflow-x-auto custom-scrollbar">
                  {activeEntry?.rejectQueue.map((id, i) => (
                    <div
                      key={i}
                      className="px-2 py-0.5 bg-red-900/30 text-red-400 border border-red-500/30 rounded font-mono font-bold animate-in zoom-in"
                    >
                      {id}
                    </div>
                  ))}
                  {(!activeEntry || activeEntry.rejectQueue.length === 0) && (
                    <span className="text-gray-700 italic">empty</span>
                  )}
                </div>
              </div>

              {/* isPending 标志位 */}
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0d0f12] border border-[#2d333b]">
                <div className="flex items-center gap-2">
                  <Activity
                    size={12}
                    className={
                      activeEntry?.isPending
                        ? "text-orange-400"
                        : "text-gray-600"
                    }
                  />
                  <span className="font-bold text-gray-400">isPending</span>
                </div>
                <span
                  className={`font-mono font-black ${
                    activeEntry?.isPending ? "text-orange-400" : "text-gray-600"
                  }`}
                >
                  {activeEntry
                    ? activeEntry.isPending
                      ? "TRUE"
                      : "FALSE"
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 外部网络接口 */}
        <div className="flex flex-col items-center w-[7.5rem]">
          <div
            className={`p-6 rounded-full border-2 transition-all duration-700 ${
              apiStatus === "fetching"
                ? "border-orange-500 bg-orange-500/10 shadow-[0_0_25px_rgba(59,130,246,0.2)] scale-110"
                : apiStatus === "success"
                ? "border-green-500 bg-green-500/10"
                : "border-[#2d333b] bg-[#1a1c22]"
            }`}
          >
            <Globe
              size={36}
              className={
                apiStatus === "fetching"
                  ? "text-orange-400"
                  : apiStatus === "success"
                  ? "text-green-400"
                  : "text-gray-700"
              }
            />
          </div>
          <div className="mt-4 text-[0.75rem] font-mono text-center flex flex-col gap-1">
            <span
              className={
                apiStatus === "fetching"
                  ? "text-orange-400 font-bold"
                  : "text-gray-600"
              }
            >
              {apiStatus === "fetching" ? "请求中..." : "空闲"}
            </span>
            <span className="text-[0.6rem] text-gray-300">
              api.github.com/users
            </span>
          </div>
        </div>
      </div>

      {/* Map 实例实时转储表格 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-[0.65rem] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
            Map 实例状态转储 (Memory Dump)
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#2d333b] bg-[#161a22]/50 backdrop-blur-sm overflow-hidden shadow-2xl">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-gray-600 text-left border-b border-[#1f2228]">
                <th className="pb-3 px-2 font-black tracking-widest">
                  KEY (STRING)
                </th>
                <th className="pb-3 px-2 font-black tracking-widest">
                  IS_PENDING
                </th>
                <th className="pb-3 px-2 font-black tracking-widest">
                  RESOLVE[] LEN
                </th>
                <th className="pb-3 px-2 font-black tracking-widest">
                  REJECT[] LEN
                </th>
                <th className="pb-3 px-2 font-black tracking-widest">
                  VALUE STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2228]">
              {(Object.entries(map) as [string, MapEntryState | null][]).map(
                ([key, value]) => (
                  <tr
                    key={key}
                    className={`group transition-all ${
                      value
                        ? "text-orange-100 bg-white/[0.01]"
                        : "text-gray-600"
                    }`}
                  >
                    <td className="py-3 px-2 font-bold text-indigo-400">
                      "{key}"
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[0.6rem] font-black ${
                          value?.isPending
                            ? "bg-orange-600/30 text-orange-400 border border-orange-500/30"
                            : "bg-gray-800/50 text-gray-500"
                        }`}
                      >
                        {value ? (value.isPending ? "TRUE" : "FALSE") : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {value ? `${value.resolveQueue.length} items` : "0"}
                    </td>
                    <td className="py-3 px-2">
                      {value ? `${value.rejectQueue.length} items` : "0"}
                    </td>
                    <td className="py-3 px-2">
                      {value === null ? (
                        <span className="text-red-500/60 italic font-medium">
                          null (cleaned)
                        </span>
                      ) : (
                        <span className="text-green-500/80 font-bold tracking-tight">
                          Object{"{...}"}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              )}
              {Object.keys(map).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-gray-700 italic font-mono tracking-tighter"
                  >
                    Map (empty) - 等待第一个 API 请求拦截...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
