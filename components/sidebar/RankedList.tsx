'use client';

import { useExplorerStore } from '@/store/useExplorerStore';
import { RankedListItem } from './RankedListItem';
import type { AccountNode } from '@/lib/types';

interface RankedListProps {
  nodes: AccountNode[];
}

export function RankedList({ nodes }: RankedListProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-2">
      {nodes.slice(0, 200).map((node) => (
        <RankedListItem key={node.id} node={node} />
      ))}
      {nodes.length === 0 && (
        <div className="p-8 text-center text-white/30 text-[12px]">
          No accounts match your search.
        </div>
      )}
    </div>
  );
}
