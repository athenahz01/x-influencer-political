'use client';

import { useExplorerStore } from '@/store/useExplorerStore';
import { formatScore } from '@/lib/format';
import type { AccountNode } from '@/lib/types';

interface RankedListItemProps {
  node: AccountNode;
}

export function RankedListItem({ node }: RankedListItemProps) {
  const { selectedNode, setSelectedNode, rankMode } = useExplorerStore();
  const isSelected = selectedNode?.id === node.id;
  const scoreKey = rankMode === 'overall' ? 'overall' : rankMode;

  return (
    <div
      id={`list-item-${node.id}`}
      onClick={() => setSelectedNode(node)}
      className={`flex px-4 py-2.5 cursor-pointer items-start border-b border-white/[0.03] transition-all duration-150 group ${
        isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.03]'
      }`}
    >
      {/* Rank badge */}
      <div
        className={`w-6 h-6 rounded bg-[#0a0f20] text-white/50 flex items-center justify-center text-[9px] font-mono font-bold mr-3 shrink-0 border border-white/[0.06] group-hover:border-white/[0.12] transition-colors ${
          isSelected ? 'border-white/20 text-white/80' : ''
        }`}
      >
        {node.rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <h4 className="text-[12px] font-semibold text-white/90 truncate pr-2">
            {node.name}
          </h4>
          <span
            className="text-[10px] font-mono shrink-0"
            style={{ color: node.category.color + '80' }}
          >
            {formatScore(node.scores[scoreKey])}
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-[10px] text-white/30 truncate font-mono">
            {node.handle}
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0 ml-2"
            style={{ backgroundColor: node.category.color }}
          />
        </div>
      </div>
    </div>
  );
}
