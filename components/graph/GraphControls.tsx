'use client';

import { useExplorerStore } from '@/store/useExplorerStore';

export function GraphControls() {
  const setSelectedNode = useExplorerStore((s) => s.setSelectedNode);

  const getGraph = () => (window as any).__graphRef?.current;

  const zoomIn = () => {
    const Graph = getGraph();
    if (!Graph) return;
    const pos = Graph.cameraPosition();
    Graph.cameraPosition(
      { x: pos.x * 0.7, y: pos.y * 0.7, z: pos.z * 0.7 },
      null,
      500
    );
  };

  const zoomOut = () => {
    const Graph = getGraph();
    if (!Graph) return;
    const pos = Graph.cameraPosition();
    Graph.cameraPosition(
      { x: pos.x * 1.3, y: pos.y * 1.3, z: pos.z * 1.3 },
      null,
      500
    );
  };

  const reset = () => {
    const Graph = getGraph();
    if (!Graph) return;
    Graph.cameraPosition({ x: 0, y: 0, z: 480 }, { x: 0, y: 0, z: 0 }, 1000);
    setSelectedNode(null);
  };

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto">
      <div className="flex bg-[#0a0f20]/90 border border-white/[0.06] rounded-lg shadow-lg overflow-hidden mb-2 backdrop-blur-xl">
        <button onClick={zoomOut} className="px-3 py-1.5 hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <div className="w-px bg-white/[0.06]" />
        <button onClick={reset} className="px-3 py-1.5 hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <div className="w-px bg-white/[0.06]" />
        <button onClick={zoomIn} className="px-3 py-1.5 hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <p className="text-[8px] text-white/20 font-mono select-none tracking-[0.2em] uppercase">
        Left-click: Rotate &bull; Scroll: Zoom &bull; Right-click: Pan
      </p>
    </div>
  );
}
