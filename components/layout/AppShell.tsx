'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { GraphControls } from '@/components/graph/GraphControls';
import { ProfileCard } from '@/components/panel/ProfileCard';
import { LegendPanel } from '@/components/filters/LegendPanel';
import { MethodologyModal } from '@/components/modals/MethodologyModal';
import { fetchGraphData } from '@/lib/api';
import type { GraphData } from '@/lib/types';

export function AppShell() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGraphData()
      .then((data) => {
        setGraphData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch graph data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#8EC5FF] rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-white/40 text-sm font-mono">Loading political network...</p>
        </div>
      </div>
    );
  }

  if (error || !graphData) {
    return (
      <div className="h-screen w-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-sm mb-2">Failed to load data</p>
          <p className="text-white/30 text-xs font-mono">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GraphCanvas graphData={graphData} />
      <div className="absolute inset-0 z-10 pointer-events-none flex">
        <Sidebar nodes={graphData.nodes} />
        <div className="flex-1 relative">
          <ProfileCard />
          <LegendPanel nodes={graphData.nodes} />
          <GraphControls />
        </div>
      </div>
      <MethodologyModal />
    </>
  );
}