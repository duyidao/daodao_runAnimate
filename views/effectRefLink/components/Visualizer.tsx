import React from "react";
import {
  SimulationState,
  RefNode,
  EffectNode,
  Link,
} from "../../../types/types";

interface VisualizerProps {
  state: SimulationState;
}

const Visualizer: React.FC<VisualizerProps> = ({ state }) => {
  const { refs, effects, links } = state;

  const refList = Object.values(refs) as RefNode[];
  const effectList = Object.values(effects) as EffectNode[];
  const linkList = Object.values(links) as Link[];

  // Graph Layout Positions
  const EFFECT_POS = { x: 120, y: 220 };
  const getLinkX = (i: number) => 400 + i * 300;
  const LINK_Y = 220;
  const getRefX = (i: number) => 400 + i * 300;
  const REF_Y = 60;

  return (
    <div className="relative flex-1 flex flex-col gap-6 bg-[#0d0f1233] rounded-xl border border-[#1f2228] overflow-hidden p-6">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#4f46e5 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* SVG Diagram Area */}
      <div className="relative h-[320px] bg-[#0d0f12]/40 rounded-lg border border-[#1f2228] shadow-inner overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1100 400">
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
            </marker>
            <marker
              id="arrow-red"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Relationships / Arrows */}
          {effectList.map((eff) => {
            const headIdx = linkList.findIndex((l) => l.id === eff.depsHeadId);
            const tailIdx = linkList.findIndex((l) => l.id === eff.depsTailId);
            const isUndefined = eff.depsTailId === "undefined";

            return (
              <React.Fragment key={`eff-rel-${eff.id}`}>
                {/* effect -> dep -> link1 (head) */}
                {headIdx !== -1 && (
                  <g>
                    <path
                      d={`M ${EFFECT_POS.x + 85} ${EFFECT_POS.y + 12} L ${
                        getLinkX(headIdx) - 85
                      } ${LINK_Y + 12}`}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                      className="transition-all duration-500"
                    />
                    <text
                      x={(EFFECT_POS.x + getLinkX(headIdx)) / 2}
                      y={EFFECT_POS.y + 32}
                      textAnchor="middle"
                      className="fill-indigo-300 font-mono text-[11px] font-medium tracking-tighter"
                    >
                      dep
                    </text>
                  </g>
                )}
                {/* link1 -> sub -> effect */}
                {headIdx !== -1 && (
                  <g>
                    <path
                      d={`M ${getLinkX(headIdx) - 85} ${LINK_Y - 12} L ${
                        EFFECT_POS.x + 85
                      } ${EFFECT_POS.y - 12}`}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                      className="transition-all duration-500"
                    />
                    <text
                      x={(EFFECT_POS.x + getLinkX(headIdx)) / 2}
                      y={EFFECT_POS.y - 20}
                      textAnchor="middle"
                      className="fill-indigo-300 font-mono text-[11px] font-medium tracking-tighter"
                    >
                      sub
                    </text>
                  </g>
                )}
                {/* depsTail Logic */}
                {isUndefined ? (
                  <g>
                    <path
                      d={`M ${EFFECT_POS.x} ${EFFECT_POS.y + 45} L ${
                        EFFECT_POS.x
                      } ${EFFECT_POS.y + 95}`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="4"
                      markerEnd="url(#arrow-red)"
                    />
                    <text
                      x={EFFECT_POS.x - 60}
                      y={EFFECT_POS.y + 122}
                      textAnchor="start"
                      className="fill-red-400 font-mono text-[11px] font-bold"
                    >
                      depsTail: undefined
                    </text>
                  </g>
                ) : (
                  tailIdx !== -1 && (
                    <g>
                      <path
                        d={`M ${EFFECT_POS.x} ${EFFECT_POS.y + 45} L ${
                          EFFECT_POS.x
                        } ${EFFECT_POS.y + 140} L ${getLinkX(tailIdx)} ${
                          EFFECT_POS.y + 140
                        } L ${getLinkX(tailIdx)} ${LINK_Y + 45}`}
                        fill="none"
                        stroke="#818cf8"
                        strokeWidth="1.5"
                        markerEnd="url(#arrow)"
                        className="transition-all duration-500"
                      />
                      <text
                        x={EFFECT_POS.x + 8}
                        y={EFFECT_POS.y + 130}
                        className="fill-indigo-300 font-mono text-[10px] font-medium"
                      >
                        depsTail
                      </text>
                    </g>
                  )
                )}
              </React.Fragment>
            );
          })}

          {/* Links Between Elements (nextDep) */}
          {linkList.map((link, i) => {
            const linkX = getLinkX(i);
            const refIdx = refList.findIndex((r) => r.id === link.depId);
            const refX = getRefX(refIdx);

            return (
              <React.Fragment key={`link-rel-${link.id}`}>
                {/* link -> nextDep -> nextLink */}
                {link.nextDepId && (
                  <g>
                    <path
                      d={`M ${linkX + 85} ${LINK_Y} L ${
                        getLinkX(i + 1) - 85
                      } ${LINK_Y}`}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={linkX + 115}
                      y={LINK_Y - 12}
                      textAnchor="middle"
                      className="fill-indigo-300 font-mono text-[11px] font-medium tracking-tighter"
                    >
                      nextDep
                    </text>
                  </g>
                )}

                {/* link -> dep -> ref */}
                {refIdx !== -1 && (
                  <g>
                    <path
                      d={`M ${linkX - 35} ${LINK_Y - 45} L ${linkX - 35} ${
                        REF_Y + 30
                      }`}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={linkX - 45}
                      y={(LINK_Y + REF_Y) / 2}
                      textAnchor="end"
                      className="fill-orange-300 font-mono text-[10px] font-medium"
                    >
                      dep
                    </text>
                  </g>
                )}

                {/* ref -> subs -> link */}
                {refIdx !== -1 && (
                  <g>
                    <path
                      d={`M ${refX} ${REF_Y + 30} L ${refX} ${LINK_Y - 45}`}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={refX + 8}
                      y={(LINK_Y + REF_Y) / 2 - 10}
                      textAnchor="start"
                      className="fill-orange-300 font-mono text-[10px] font-medium"
                    >
                      subs
                    </text>
                  </g>
                )}

                {/* ref -> subsTail -> link */}
                {refIdx !== -1 && refs[link.depId]?.subsTailId === link.id && (
                  <g>
                    <path
                      d={`M ${refX + 35} ${REF_Y + 30} L ${refX + 35} ${
                        LINK_Y - 45
                      }`}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      strokeDasharray="3"
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={refX + 42}
                      y={(LINK_Y + REF_Y) / 2 + 15}
                      textAnchor="start"
                      className="fill-orange-300 font-mono text-[10px] font-medium opacity-80"
                    >
                      subsTail
                    </text>
                  </g>
                )}
              </React.Fragment>
            );
          })}

          {/* Render Actual Nodes */}

          {/* Effect Node */}
          {effectList.map((eff) => (
            <g
              key={eff.id}
              transform={`translate(${EFFECT_POS.x}, ${EFFECT_POS.y})`}
            >
              <rect
                x="-85"
                y="-45"
                width="170"
                height="90"
                rx="10"
                fill="#1e293b"
                stroke={eff.active ? "#818cf8" : "#334155"}
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
              <text
                textAnchor="middle"
                dy="5"
                className={`font-mono text-2xl font-bold uppercase tracking-wider ${
                  eff.active ? "fill-orange-100" : "fill-indigo-300"
                }`}
              >
                {eff.name}
              </text>
            </g>
          ))}

          {/* Ref Nodes (flag, count) */}
          {refList.map((ref, i) => (
            <g key={ref.id} transform={`translate(${getRefX(i)}, ${REF_Y})`}>
              <rect
                x="-85"
                y="-30"
                width="170"
                height="60"
                rx="30"
                fill="#3b2d1eff"
                stroke="#f6953bff"
                strokeWidth="2.5"
              />
              <text
                textAnchor="middle"
                dy="5"
                className="fill-orange-200 font-mono text-2xl font-bold tracking-wide uppercase"
              >
                {ref.name}
              </text>
            </g>
          ))}

          {/* Link Nodes (link1, link2) */}
          {linkList.map((link, i) => (
            <g key={link.id} transform={`translate(${getLinkX(i)}, ${LINK_Y})`}>
              <rect
                x="-85"
                y="-45"
                width="170"
                height="90"
                rx="10"
                fill="#3b2d1eff"
                stroke="#f6953bff"
                strokeWidth="1.5"
              />
              <text
                textAnchor="middle"
                dy="5"
                className="fill-orange-100 font-mono text-2xl font-bold tracking-widest"
              >
                {link.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Grid of Cards for Object Data */}
      <div className="grid grid-cols-3 gap-6 overflow-y-auto pr-2">
        {/* Effect Details */}
        <div className="space-y-4">
          <div className="text-[10px] text-white-500 font-bold uppercase tracking-widest px-1">
            Effect 状态数据
          </div>
          {effectList.map((eff) => (
            <div
              key={eff.id}
              className={`p-4 rounded-lg border bg-[#161a22] shadow-sm transition-all ${
                eff.active
                  ? "border-indigo-500 shadow-md ring-1 ring-indigo-500/20"
                  : "border-[#2d333b]"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white font-mono uppercase">
                  Effect (Sub)
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    eff.active
                      ? "bg-indigo-600 text-white"
                      : "bg-[#2d333b] text-[#ccc]"
                  }`}
                >
                  {eff.active ? "运行中" : "空闲"}
                </span>
              </div>
              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex justify-between border-b border-[#2d333b] pb-1">
                  <span className="text-[#ccc]">depsHead:</span>
                  <span className="text-indigo-400">
                    {eff.depsHeadId || "null"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2d333b] pb-1">
                  <span className="text-[#ccc]">depsTail:</span>
                  <span
                    className={
                      eff.depsTailId === "undefined"
                        ? "text-red-400 font-bold italic"
                        : "text-indigo-400"
                    }
                  >
                    {eff.depsTailId || "null"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link Details */}
        <div className="space-y-4">
          <div className="text-[10px] text-white-500 font-bold uppercase tracking-widest px-1">
            Link 节点数据
          </div>
          {linkList.map((link) => (
            <div
              key={link.id}
              className="p-4 rounded-lg border border-[#2d333b] bg-[#161a22] shadow-sm"
            >
              <div className="text-xs font-bold text-orange-400 font-mono mb-3 uppercase">
                {link.id} (Bridge)
              </div>
              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex justify-between border-b border-[#2d333b] pb-1">
                  <span className="text-[#ccc]">sub (Effect):</span>
                  <span className="text-indigo-300">
                    {effects[link.subId]?.name}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2d333b] pb-1">
                  <span className="text-[#ccc]">dep (Ref):</span>
                  <span className="text-orange-300">
                    {refs[link.depId]?.name}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2d333b] pb-1">
                  <span className="text-[#ccc]">nextDep:</span>
                  <span className="text-gray-400">
                    {link.nextDepId || "null"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ccc]">prevDep:</span>
                  <span className="text-gray-400">
                    {link.prevDepId || "null"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {linkList.length === 0 && (
            <div className="text-[11px] text-white-700 italic text-center p-8 bg-[#111] rounded border border-dashed border-[#222]">
              等待追踪流程启动...
            </div>
          )}
        </div>

        {/* Ref Details */}
        <div className="space-y-4">
          <div className="text-[10px] text-white-500 font-bold uppercase tracking-widest px-1">
            RefImpl 响应式数据
          </div>
          {refList.map((ref) => (
            <div
              key={ref.id}
              className="p-4 rounded-lg border border-orange-900/40 bg-[#161a22] shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-orange-400 font-mono uppercase">
                  {ref.name}
                </span>
                <span className="text-[10px] text-orange-100 px-2 py-0.5 bg-orange-900/40 rounded font-mono">
                  val: {JSON.stringify(ref.value)}
                </span>
              </div>
              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex justify-between border-b border-[#2d333b] pb-1">
                  <span className="text-[#ccc]">subsHead:</span>
                  <span className="text-orange-300">
                    {ref.subsHeadId || "null"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ccc]">subsTail:</span>
                  <span className="text-orange-300">
                    {ref.subsTailId || "null"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
