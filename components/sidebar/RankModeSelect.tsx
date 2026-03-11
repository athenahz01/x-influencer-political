'use client';

import { useExplorerStore } from '@/store/useExplorerStore';
import type { RankMode } from '@/lib/types';

const RANK_OPTIONS: { value: RankMode; label: string }[] = [
  { value: 'overall', label: 'Overall Political Influence' },
  { value: 'audience', label: 'Largest Audience (Reach)' },
  { value: 'network', label: 'Most Connected (Centrality)' },
  { value: 'elite', label: 'Elite Signal (Insider Attention)' },
];

export function RankModeSelect() {
  const { rankMode, setRankMode } = useExplorerStore();

  return (
    <div className="mt-3">
      <label className="block text-[9px] uppercase tracking-[0.15em] text-white/30 mb-1.5 font-medium">
        Ranking Mode
      </label>
      <div className="relative">
        <select
          value={rankMode}
          onChange={(e) => setRankMode(e.target.value as RankMode)}
          className="block w-full pl-3 pr-8 py-1.5 border border-white/[0.06] rounded-lg bg-[#050816] text-white/80 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#8EC5FF]/50 appearance-none cursor-pointer transition-colors hover:border-white/[0.12]"
        >
          {RANK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/30">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
