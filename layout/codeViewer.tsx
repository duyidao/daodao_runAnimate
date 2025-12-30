import React, { useEffect, useRef } from "react";

const CodeViewer: React.FC<{
  code: string;
  activeLine: number | number[];
  name: string;
}> = ({ code, activeLine, name }) => {
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
        <div className="flex gap-1.5 mr-5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-yellow-500 font-bold text-xs uppercase tracking-wider">
          {name}
        </span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 leading-6">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLine instanceof Array ? activeLine.includes(lineNumber) : lineNumber === activeLine;
          return (
            <div
              key={index}
              className={`flex items-center transition-colors duration-200 ${
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

export default CodeViewer;