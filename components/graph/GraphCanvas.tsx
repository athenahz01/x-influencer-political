'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useExplorerStore } from '@/store/useExplorerStore';
import type { GraphData, AccountNode } from '@/lib/types';
import { formatScore } from '@/lib/format';

interface GraphCanvasProps {
  graphData: GraphData;
}

export function GraphCanvas({ graphData }: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const {
    selectedNode,
    setSelectedNode,
    categoryFilters,
  } = useExplorerStore();

  // Initialize graph
  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamic import — 3d-force-graph only works client-side
    import('3d-force-graph').then((mod) => {
      const ForceGraph3D = mod.default;

      const Graph = ForceGraph3D()(containerRef.current!)
        .graphData(graphData)
        .backgroundColor('#050816')
        .nodeLabel(
          (node: any) =>
            `<div style="background:rgba(10,15,32,0.92);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);color:#fff;font-size:11px;padding:6px 10px;border-radius:6px;font-family:Inter,sans-serif;font-weight:500;pointer-events:none;">${node.name} <span style="color:rgba(255,255,255,0.35);margin-left:4px;font-family:JetBrains Mono,monospace;font-size:10px;">${formatScore(node.scores.overall)}</span></div>`
        )
        .nodeColor((node: any) => node.category.color)
        .linkOpacity(0.06)
        .linkWidth(0.15)
        .linkColor(() => 'rgba(255,255,255,0.3)')
        .onNodeClick((node: any) => {
          setSelectedNode(node);
          // Camera fly-to
          const distance = 120;
          const distRatio =
            1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
          Graph.cameraPosition(
            {
              x: (node.x || 0) * distRatio,
              y: (node.y || 0) * distRatio,
              z: (node.z || 0) * distRatio,
            },
            node,
            1200
          );
        })
        .onBackgroundClick(() => {
          setSelectedNode(null);
        });

      // Custom Three.js nodes
      Graph.nodeThreeObject((node: any) => {
        const THREE = (window as any).THREE || Graph.scene()?.constructor;
        // Fallback: use import
        return null; // Let the library handle default rendering initially
      });

      // Physics
      Graph.d3Force('charge')?.strength(-80);
      Graph.d3Force('link')?.distance(40);

      // Initial camera
      setTimeout(() => Graph.cameraPosition({ x: 0, y: 0, z: 480 }), 100);

      // Handle resize
      const onResize = () => {
        Graph.width(window.innerWidth);
        Graph.height(window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      graphRef.current = Graph;

      return () => {
        window.removeEventListener('resize', onResize);
      };
    });
  }, []);

  // Update visibility when category filters change
  useEffect(() => {
    if (!graphRef.current) return;
    const Graph = graphRef.current;

    Graph.nodeVisibility((node: any) => categoryFilters[node.category.id]);
    Graph.linkVisibility((link: any) => {
      const s = typeof link.source === 'object' ? link.source : null;
      const t = typeof link.target === 'object' ? link.target : null;
      return s && t && categoryFilters[s.category.id] && categoryFilters[t.category.id];
    });
  }, [categoryFilters]);

  // Expose graph ref for controls
  useEffect(() => {
    (window as any).__graphRef = graphRef;
  }, []);

  return (
    <div
      ref={containerRef}
      id="graph-container"
      className="absolute inset-0 z-0"
      style={{ backgroundColor: '#050816' }}
    />
  );
}
