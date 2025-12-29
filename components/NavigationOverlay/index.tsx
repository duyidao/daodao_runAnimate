import React, { useState } from "react";
import { CATEGORIES } from "@/constants";
import { Scenario } from "../../types/navigationOverlay";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  X,
  Terminal,
} from "lucide-react";
import SimpleIcon from '../SimpleIcon/index'

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (scenario: Scenario) => void;
}

const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    CATEGORIES[0].id
  );
  
  const navigate = useNavigate();
  const location = useLocation();

  // 点击切换路由
  const handleSc = (sc) => {
                    onSelect(sc);
                    onClose();
                    navigate(sc.path);
  }

  if (!isOpen) return null;

  const activeCategory =
    CATEGORIES.find((cat) => cat.id === activeCategoryId) || CATEGORIES[0];
  
  

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-ms animate-in fade-in duration-500">
      <div className="bg-stone-950 border border-stone-800 w-full max-w-6xl h-[85vh] rounded-[1.25rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-800/50 bg-stone-900/10">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-[6px] bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center border border-orange-400/30 shadow-xl shadow-orange-950/40">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-white tracking-tight leading-none">
                选择逻辑架构
              </h3>
              <p className="text-[10px] font-bold text-stone-600 mt-2 uppercase tracking-widest">
                切换其他逻辑架构，查看不同效果
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-stone-900 hover:bg-orange-950/10 border border-stone-800 rounded-[5px] text-stone-500 transition-all group shadow-lg"
          >
            <X
              size={24}
              className="group-hover:rotate-90 transition-transform duration-500 group-hover:text-orange-500"
            />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-80 bg-stone-900/20 border-r border-stone-800/50 px-8 py-6 space-y-6">
            <div className="space-y-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-xl border transition-all duration-300 group relative ${
                    activeCategoryId === cat.id
                      ? "bg-orange-950/10 border-orange-500/30 text-orange-400/85 shadow-[0_10px_30px_-5px_rgba(249,115,22,0.05)]"
                      : "border-transparent text-stone-500 hover:bg-stone-900 hover:text-stone-300"
                  }`}
                >
                  <div
                    className={`p-3 rounded-[6px] ${
                      activeCategoryId === cat.id
                        ? "bg-orange-500/85 text-white shadow-lg"
                        : "bg-stone-800 group-hover:bg-stone-700"
                    }`}
                  >
                    {<SimpleIcon size={20} icon={cat.icon} color={activeCategoryId === cat.id ? '#fff' : '#858585'} />}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black tracking-tight mb-1">
                      {cat.name}
                    </span>
                    <span className="text-[9px] font-bold opacity-60 uppercase">
                      {cat.scenarios.length} 个模块
                    </span>
                  </div>
                  {activeCategoryId === cat.id && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scenarios Content */}
          <div className="flex-1 px-8 py-6 overflow-y-auto bg-stone-950/40 scrollbar-hide">
              <div className="group flex flex-col mb-8 w-fit">
                <h4 className="text-xl font-black text-stone-100 tracking-tight flex items-center gap-3">
                  {activeCategory.name}
                </h4>
                <div className="h-0.5 w-5 bg-orange-500 mt-1 group:hover:w-full" />
              </div>

            <div className="grid grid-cols-2 gap-6">
              {activeCategory.scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleSc(sc)}
                  className={`group relative flex flex-col p-5 rounded-[14px] border transition-all duration-300 text-left overflow-hidden h-full ${
                    location.pathname === sc.path
                      ? "bg-gradient-to-br from-orange-500/20 to-amber-700/50 border-orange-400/50 shadow-2xl shadow-orange-950/40"
                      : "bg-stone-900/40 border-stone-800 hover:border-orange-500/30 hover:bg-stone-900 shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                  <span
                    className={`text-lg font-black leading-none italic ${
                      location.pathname === sc.path
                        ? "text-white"
                        : "text-stone-100"
                    }`}
                  >
                    {sc.name}
                  </span>
                    <ChevronRight
                      size={22}
                      className={`transition-transform duration-300 group-hover:translate-x-1 ${
                        location.pathname === sc.path
                          ? "text-white"
                          : "text-stone-700"
                      }`}
                    />
                  </div>

                  <p
                    className={`text-[11px] leading-relaxed font-medium line-clamp-3 mb-1 ${
                      location.pathname === sc.path
                        ? "text-orange-100/70"
                        : "text-stone-500"
                    }`}
                  >
                    {sc.description || '暂无简介'}
                  </p>

                        <div className="mt-auto pt-4 flex items-center gap-2">
                  {
                    (sc.tag || []).map(tag => {
                      return (
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${
                        location.pathname === sc.path
                          ? "bg-black/20 text-white"
                          : "bg-stone-800 text-stone-600"
                      }`}
                      key={tag}
                    >
                      {tag}
                    </span>
                      )
                    })
                  }
                  </div>

                  {location.pathname === sc.path && (
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer Tag */}
            <div className="mt-20 border-t border-stone-800/50 pt-8 flex items-center justify-center gap-8 opacity-40">
              <span className="text-[9px] font-black text-stone-600 uppercase tracking-[0.4em]">
                Visualizer Core v4.0.12
              </span>
              <div className="w-1 h-1 rounded-full bg-stone-800" />
              <span className="text-[9px] font-black text-stone-600 uppercase tracking-[0.4em]">
                Neural Trace Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationOverlay;
