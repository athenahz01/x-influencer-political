'use client';

import { useExplorerStore } from '@/store/useExplorerStore';

export function SearchBox() {
  const { searchQuery, setSearchQuery } = useExplorerStore();

  return (
    <div className="mt-4 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-3.5 w-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-9 pr-3 py-2 border border-white/[0.06] rounded-lg leading-5 bg-[#050816] text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-[#8EC5FF]/50 focus:border-[#8EC5FF]/30 text-[12px] transition-all"
        placeholder="Search name, handle, or role..."
      />
    </div>
  );
}
