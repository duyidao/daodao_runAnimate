import React from "react";
import {
  SimulationState,
  RefNode,
  EffectNode,
  Link,
} from "@/types/effectRefLink";

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
  const getLinkX = (i: number) => 420 + i * 300;
  const LINK_Y = 220;
  const getRefX = (i: number) => 420 + i * 300;
  const REF_Y = 60;

  return (
    <div className="relative flex-1 flex flex-col gap-6">
      {/* SVG Diagram Area */}
      <div className="relative h-[15rem] bg-[#0d0f12]/40 rounded-lg border border-[#1f2228] shadow-inner overflow-hidden pt-2.5">
        <svg className="w-full h-full" viewBox="0 0 1100 400">
          {/* effect的箭头 */}
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
              id="arrow-green"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6ddf6d" />
            </marker>
            <marker
              id="arrow-pink"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ed6d8f" />
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
                      d={`M ${EFFECT_POS.x + 92} ${EFFECT_POS.y + 12} L ${
                        getLinkX(headIdx) - 62
                      } ${LINK_Y + 12}`}
                      fill="none"
                      stroke="#ed6d8f"
                      strokeWidth="2"
                      markerEnd="url(#arrow-pink)"
                      className="transition-all duration-500"
                    />
                    <text
                      x={(EFFECT_POS.x + getLinkX(headIdx)) / 2 + 10}
                      y={EFFECT_POS.y + 36}
                      textAnchor="middle"
                      className="fill-[#ed6d8f] font-mono text-[1.00rem] font-medium tracking-tighter"
                    >
                      dep
                    </text>
                  </g>
                )}
                {/* link1 -> sub -> effect */}
                {headIdx !== -1 && (
                  <g>
                    <path
                      d={`M ${getLinkX(headIdx) - 62} ${LINK_Y - 18} L ${
                        EFFECT_POS.x + 90
                      } ${EFFECT_POS.y - 18}`}
                      fill="none"
                      stroke="#6ddf6d"
                      strokeWidth="2"
                      markerEnd="url(#arrow-green)"
                      className="transition-all duration-500"
                    />
                    <text
                      x={(EFFECT_POS.x + getLinkX(headIdx)) / 2 + 10}
                      y={EFFECT_POS.y - 28}
                      textAnchor="middle"
                      className="fill-[#6ddf6d] font-mono text-[1.00rem] font-medium tracking-tighter"
                    >
                      sub
                    </text>
                  </g>
                )}
                {/* depsTail Logic */}
                {isUndefined ? (
                  <g>
                    <path
                      d={`M ${EFFECT_POS.x} ${EFFECT_POS.y + 38} L ${
                        EFFECT_POS.x
                      } ${EFFECT_POS.y + 102}`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="4"
                      markerEnd="url(#arrow-red)"
                    />
                    <text
                      x={EFFECT_POS.x - 95}
                      y={EFFECT_POS.y + 128}
                      textAnchor="start"
                      className="fill-red-400 font-mono text-[1.00rem] font-bold"
                    >
                      depsTail: undefined
                    </text>
                  </g>
                ) : (
                  tailIdx !== -1 && (
                    <g>
                      <path
                        d={`M ${EFFECT_POS.x} ${EFFECT_POS.y + 39} L ${
                          EFFECT_POS.x
                        } ${EFFECT_POS.y + 140} L ${getLinkX(tailIdx) + 20} ${
                          EFFECT_POS.y + 140
                        } L ${getLinkX(tailIdx) + 20} ${LINK_Y + 39}`}
                        fill="none"
                        stroke="#ed6d8f"
                        strokeWidth="1.5"
                        markerEnd="url(#arrow-pink)"
                        className="transition-all duration-500"
                      />
                      <text
                        x={getLinkX(tailIdx) / 2 + 20}
                        y={EFFECT_POS.y + 125}
                        className="fill-[#ed6d8f] font-mono text-[1.00rem] font-medium"
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
                      d={`M ${linkX + 119} ${LINK_Y} L ${
                        getLinkX(i + 1) - 69
                      } ${LINK_Y}`}
                      fill="none"
                      stroke="#ed6d8f"
                      strokeWidth="2"
                      markerEnd="url(#arrow-pink)"
                    />
                    <text
                      x={linkX + 170}
                      y={LINK_Y - 12}
                      textAnchor="middle"
                      className="fill-[#ed6d8f] font-mono text-[1.00rem] font-medium tracking-tighter"
                    >
                      nextDep
                    </text>
                  </g>
                )}

                {/* link -> dep -> ref */}
                {refIdx !== -1 && (
                  <g>
                    <path
                      d={`M ${linkX - 25} ${LINK_Y - 51} L ${linkX - 25} ${
                        REF_Y + 30
                      }`}
                      fill="none"
                      stroke="#ed6d8f"
                      strokeWidth="1.5"
                      markerEnd="url(#arrow-pink)"
                    />
                    <text
                      x={linkX - 38}
                      y={(LINK_Y + REF_Y) / 2}
                      textAnchor="end"
                      className="fill-[#ed6d8f] font-mono text-[1.00rem] font-medium"
                    >
                      dep
                    </text>
                  </g>
                )}

                {/* ref -> subs -> link */}
                {refIdx !== -1 && (
                  <g>
                    <path
                      d={`M ${refX + 28} ${REF_Y + 30} L ${refX + 28} ${
                        LINK_Y - 51
                      }`}
                      fill="none"
                      stroke="#6ddf6dff"
                      strokeWidth="1.5"
                      markerEnd="url(#arrow-green)"
                    />
                    <rect
                      x={refX + 3}
                      y={(LINK_Y + REF_Y) / 2 - 10 - 18} // 调整y坐标使文本居中于背景
                      width={55}
                      height={25}
                      fill="#121111" // 设置背景色
                      rx="4" // 添加圆角（可选）
                      ry="4"
                    />
                    <text
                      x={refX + 8}
                      y={(LINK_Y + REF_Y) / 2 - 10}
                      textAnchor="start"
                      className="fill-[#6ddf6dff] bg-transparent font-mono text-[1.00rem] font-medium"
                    >
                      subs
                    </text>
                  </g>
                )}

                {/* ref -> subsTail -> link */}
                {refIdx !== -1 && refs[link.depId]?.subsTailId === link.id && (
                  <g>
                    <path
                      d={`M ${refX + 78} ${REF_Y + 30} L ${refX + 78} ${
                        LINK_Y - 51
                      }`}
                      fill="none"
                      stroke="#6ddf6d"
                      strokeWidth="1.5"
                      strokeDasharray="5"
                      markerEnd="url(#arrow-green)"
                    />
                    <text
                      x={refX + 88}
                      y={(LINK_Y + REF_Y) / 2 - 5}
                      textAnchor="start"
                      className="fill-[#6ddf6d] font-mono text-[1.00rem] font-medium"
                    >
                      subsTail
                    </text>
                  </g>
                )}
              </React.Fragment>
            );
          })}

          {/* Effect Node */}
          {effectList.map((eff) => (
            <g
              key={eff.id}
              transform={`translate(${EFFECT_POS.x}, ${EFFECT_POS.y})`}
            >
              <rect
                x="-85"
                y="-40"
                width="170"
                height="69"
                rx="10"
                fill="#1e293b"
                stroke={eff.active ? "#818cf8" : "#334155"}
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
              <text
                textAnchor="middle"
                dy="1"
                className={`font-mono text-[1.25rem] font-bold uppercase tracking-wider ${
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
                x="-55"
                y="-50"
                width="170"
                height="69"
                rx="30"
                fill="#3b2d1eff"
                stroke="#f6953bff"
                strokeWidth="2.5"
              />
              <text
                textAnchor="middle"
                dy="-5"
                dx="30"
                className="fill-orange-200 font-mono text-[1.25rem] font-bold tracking-wide uppercase"
              >
                {ref.name}
              </text>
            </g>
          ))}

          {/* Link Nodes (link1, link2) */}
          {linkList.map((link, i) => (
            <g key={link.id} transform={`translate(${getLinkX(i)}, ${LINK_Y})`}>
              <rect
                x="-55"
                y="-40"
                width="170"
                height="69"
                rx="10"
                fill="#3b2d1eff"
                stroke="#f6953bff"
                strokeWidth="1.5"
              />
              <text
                textAnchor="middle"
                dy="1"
                dx="25"
                className="fill-orange-100 font-mono text-[1.25rem] font-bold tracking-widest"
              >
                {link.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Grid of Cards for Object Data */}
      <div className="grid grid-cols-3 gap-6 mb-3">
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
