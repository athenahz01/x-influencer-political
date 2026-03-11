'use client';

import { useExplorerStore } from '@/store/useExplorerStore';
import { getCategoryList } from '@/lib/categories';
import type { AccountNode, CategoryId } from '@/lib/types';

interface LegendPanelProps {
  nodes: AccountNode[];
}

export function LegendPanel({ nodes }: LegendPanelProps) {
  const { categoryFilters, toggleCategory, toggleMethodology } =
    useExplorerStore();

  const categories = getCategoryList();

  return (
    <div className="absolute bottom-5 right-5 w-56 glass-panel rounded-xl p-4 pointer-events-auto">
      <h3 className="text-[9px] font-bold text-white/40 tracking-[0.15em] uppercase mb-3">
        Legend
      </h3>
      <div className="space-y-1.5">
        {categories.map((cat) => {
          const count = nodes.filter((n) => n.category.id === cat.id).length;
          const isActive = categoryFilters[cat.id];

          return (
            <div
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`legend-item flex items-center text-[11px] text-white/60 font-medium py-0.5 ${
                !isActive ? 'dimmed' : ''
              }`}
            >
              <span
                className="w-2 h-2 rounded-sm mr-2.5 shrink-0"
                style={{
                  backgroundColor: cat.color,
                  boxShadow: `0 0 6px ${cat.color}40`,
                }}
              />
              <span className="flex-1">{cat.name}</span>
              <span className="text-[9px] text-white/25 font-mono">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06]">
        <button
          onClick={toggleMethodology}
          className="flex items-center justify-center w-full py-1.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-[10px] text-white/50 hover:text-white/70 transition-all font-medium"
        >
          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Methodology
        </button>
      </div>
    </div>
  );
}
