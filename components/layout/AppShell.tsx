'use client';

import { useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { GraphControls } from '@/components/graph/GraphControls';
import { ProfileCard } from '@/components/panel/ProfileCard';
import { LegendPanel } from '@/components/filters/LegendPanel';
import { MethodologyModal } from '@/components/modals/MethodologyModal';
import { buildGraphData } from '@/data/accounts';
import type { GraphData } from '@/lib/types';

export function AppShell() {
  // Build graph data once (client-side)
  const graphData: GraphData = useMemo(() => buildGraphData(), []);

  return (
    <>
      {/* 3D Graph — full screen background */}
      <GraphCanvas graphData={graphData} />

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex">
        {/* Left sidebar */}
        <Sidebar nodes={graphData.nodes} />

        {/* Right overlays */}
        <div className="flex-1 relative">
          <ProfileCard />
          <LegendPanel nodes={graphData.nodes} />
          <GraphControls />
        </div>
      </div>

      {/* Methodology modal */}
      <MethodologyModal />
    </>
  );
}
