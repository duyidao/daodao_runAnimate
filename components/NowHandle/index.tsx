import { NotebookText } from 'lucide-react';
import TitleLayer from '@/components/TitleLayer/index'

export default function NowHandle({ description }: { description: string }) {
  return (
    <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-4 rounded-l border-l-4 border-orange-500">
      <TitleLayer title="当前操作" element={NotebookText} props={{
        color: 'orange-400',
        size: 14
      }} />
      <p className="text-ms font-medium text-gray-100">
        {description}
      </p>
    </div>
  )
}