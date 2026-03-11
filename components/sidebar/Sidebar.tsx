'use client';

import { useMemo } from 'react';
import { useExplorerStore } from '@/store/useExplorerStore';
import { SearchBox } from './SearchBox';
import { RankModeSelect } from './RankModeSelect';
import { RankedList } from './RankedList';
import type { AccountNode } from '@/lib/types';

interface SidebarProps {
  nodes: AccountNode[];
}

export function Sidebar({ nodes }: SidebarProps) {
  const { sidebarOpen, toggleSidebar, searchQuery, rankMode, categoryFilters } =
    useExplorerStore();

  // Filter and sort nodes
  const filteredNodes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const scoreKey = rankMode === 'overall' ? 'overall' : rankMode;

    return nodes
      .filter((n) => categoryFilters[n.category.id])
      .filter(
        (n) =>
          !q ||
          n.name.toLowerCase().includes(q) ||
          n.handle.toLowerCase().includes(q) ||
          n.role.toLowerCase().includes(q)
      )
      .sort((a, b) => b.scores[scoreKey] - a.scores[scoreKey])
      .map((n, i) => ({ ...n, rank: i + 1 }));
  }, [nodes, searchQuery, rankMode, categoryFilters]);

  return (
    <div
      className={`w-[340px] h-full bg-[#070B19]/95 backdrop-blur-xl border-r border-white/[0.06] flex flex-col pointer-events-auto sidebar-transition transform shrink-0 relative ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ boxShadow: '8px 0 40px rgba(0,0,0,0.5)' }}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-5 -right-9 bg-[#0a0f20] hover:bg-[#151b36] text-white/40 rounded-md p-1.5 shadow-lg transition-all duration-200 focus:outline-none border border-white/[0.06] z-50 pointer-events-auto hover:text-white/70"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>

      {/* Header */}
      <div className="p-5 pb-3 shrink-0 border-b border-white/[0.04]">
        <h1 className="text-[17px] font-bold text-white tracking-tight">
          Political Network Explorer
        </h1>
        <p className="text-[10px] text-white/40 mt-1 flex items-center font-mono tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse-glow" />
          Data last updated: March 10, 2026
        </p>

        <SearchBox />
        <RankModeSelect />
      </div>

      {/* Ranked list */}
      <RankedList nodes={filteredNodes} />

      {/* Footer */}
      <div className="p-3 text-center border-t border-white/[0.04] text-[10px] text-white/25 bg-[#050816]/80 font-mono">
        v1.0 &bull;{' '}
        <button
          onClick={() => useExplorerStore.getState().toggleMethodology()}
          className="hover:text-white/60 transition-colors underline underline-offset-2"
        >
          Methodology
        </button>
      </div>
    </div>
  );
}
