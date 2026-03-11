import { create } from 'zustand';
import type { AccountNode, RankMode, CategoryId } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';

interface ExplorerState {
  // Selection
  selectedNode: AccountNode | null;
  hoveredNode: AccountNode | null;

  // Filters
  searchQuery: string;
  rankMode: RankMode;
  categoryFilters: Record<CategoryId, boolean>;

  // UI
  sidebarOpen: boolean;
  methodologyOpen: boolean;

  // Actions
  setSelectedNode: (node: AccountNode | null) => void;
  setHoveredNode: (node: AccountNode | null) => void;
  setSearchQuery: (query: string) => void;
  setRankMode: (mode: RankMode) => void;
  toggleCategory: (id: CategoryId) => void;
  toggleSidebar: () => void;
  toggleMethodology: () => void;
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  // Initial state
  selectedNode: null,
  hoveredNode: null,
  searchQuery: '',
  rankMode: 'overall',
  categoryFilters: {
    politician: true,
    journalist: true,
    podcast: true,
    media: true,
    commentator: true,
    strategist: true,
  },
  sidebarOpen: true,
  methodologyOpen: false,

  // Actions
  setSelectedNode: (node) => set({ selectedNode: node }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setRankMode: (mode) => set({ rankMode: mode }),
  toggleCategory: (id) =>
    set((state) => ({
      categoryFilters: {
        ...state.categoryFilters,
        [id]: !state.categoryFilters[id],
      },
    })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMethodology: () =>
    set((state) => ({ methodologyOpen: !state.methodologyOpen })),
}));
