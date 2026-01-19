import { Zap } from "lucide-react";

export default function NowHandle({
  description,
  title = "当前操作",
  operation = "-",
}: {
  description: string;
  title?: string;
  operation?: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-[#292524] p-4 rounded-l border-l-4 border-orange-500">
      <div className="p-3.5 rounded-xl shadow-md bg-[#ff6b00]/10 text-[#ff6b00]">
        <Zap size={24} />
      </div>
      <div className="flex flex-col justify-between gap-1 h-full">
        <div className="flex items-center gap-2 text-[1.1rem] font-bold text-gray-100">
          <p className="px-[0.65rem] py-[0.185rem] text-[0.65rem] rounded-[0.2rem] border border-stone-700 pt-[0.25rem]">
            {operation}
          </p>
          <p>{title}</p>
        </div>
        <p className="text-[0.9rem] font-medium text-gray-100">{description}</p>
      </div>
    </div>
  );
}
