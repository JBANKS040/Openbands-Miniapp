"use client";
import { useAppStore } from "@/lib/store";

export function SortToggle() {
  const sort = useAppStore((s) => s.sort);
  const setSort = useAppStore((s) => s.setSort);

  return (
    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setSort('new')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          sort === 'new'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        New
      </button>
      <button
        onClick={() => setSort('top')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          sort === 'top'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Top
      </button>
    </div>
  );
}
