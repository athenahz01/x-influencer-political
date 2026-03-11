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
  const selectedRef = useRef<AccountNode | null>(null);
  const highlightNodesRef = useRef<Set<any>>(new Set());
  const highlightLinksRef = useRef<Set<any>>(new Set());

  const { selectedNode, setSelectedNode, categoryFilters } = useExplorerStore();

  useEffect(() => { selectedRef.current = selectedNode; }, [selectedNode]);

  const focusNode = useCallback((node: any) => {
    const Graph = graphRef.current;
    if (!Graph || !node) return;

    highlightNodesRef.current.clear();
    highlightLinksRef.current.clear();
    highlightNodesRef.current.add(node);

    // Top 12 connections only
    const topNeighbors = [...(node.neighbors || [])]
      .sort((a: any, b: any) => (b.scores?.overall || 0) - (a.scores?.overall || 0))
      .slice(0, 12);
    const topIds = new Set(topNeighbors.map((n: any) => n.id));
    topNeighbors.forEach((n: any) => highlightNodesRef.current.add(n));
    node.links?.forEach((l: any) => {
      const src = typeof l.source === 'object' ? l.source : null;
      const tgt = typeof l.target === 'object' ? l.target : null;
      if (src && tgt) {
        const otherId = src.id === node.id ? tgt.id : src.id;
        if (topIds.has(otherId)) highlightLinksRef.current.add(l);
      }
    });

    Graph
      .nodeThreeObject(Graph.nodeThreeObject())
      .linkWidth(Graph.linkWidth())
      .linkOpacity(Graph.linkOpacity())
      .linkColor(Graph.linkColor());

    const distance = 500;
    const dr = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
    Graph.cameraPosition(
      { x: (node.x || 0) * dr, y: (node.y || 0) * dr, z: (node.z || 0) * dr },
      node, 2000
    );
  }, []);

  const clearFocus = useCallback(() => {
    const Graph = graphRef.current;
    if (!Graph) return;
    highlightNodesRef.current.clear();
    highlightLinksRef.current.clear();
    Graph
      .nodeThreeObject(Graph.nodeThreeObject())
      .linkWidth(Graph.linkWidth())
      .linkOpacity(Graph.linkOpacity())
      .linkColor(Graph.linkColor());
  }, []);

  useEffect(() => { (window as any).__focusGraphNode = focusNode; }, [focusNode]);

  useEffect(() => {
    if (selectedNode && graphRef.current) {
      const gd = graphRef.current.graphData();
      const graphNode = gd.nodes.find((n: any) => n.id === selectedNode.id);
      if (graphNode) focusNode(graphNode);
    } else if (!selectedNode && graphRef.current) {
      clearFocus();
    }
  }, [selectedNode, focusNode, clearFocus]);

  useEffect(() => {
    if (!containerRef.current || graphRef.current) return;

    Promise.all([
      import('3d-force-graph'),
      import('three'),
    ]).then(([forceGraphMod, THREE]) => {
      const ForceGraph3D = forceGraphMod.default as any;

      const Graph = ForceGraph3D()(containerRef.current!)
        .graphData({ nodes: graphData.nodes, links: graphData.links })
        .backgroundColor('#050816')
        .showNavInfo(false)
        .nodeLabel(() => '')

        // ===== NODES =====
        .nodeThreeObject((node: any) => {
          const hl = highlightNodesRef.current;
          const hasHL = hl.size > 0;
          const isHL = !hasHL || hl.has(node);
          const isSel = selectedRef.current?.id === node.id;
          const color = hasHL ? (isHL ? node.category.color : node.category.color) : node.category.color;
          const nodeOpacity = hasHL ? (isHL ? 1.0 : 0.06) : 1.0;

          const group = new THREE.Group();

          // Sphere
          const geo = new THREE.SphereGeometry(node.val, 20, 20);
          const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: nodeOpacity });
          group.add(new THREE.Mesh(geo, mat));

          // Glow — only on visible nodes, not on ghosts
          if (isHL || !hasHL) {
            const glowSize = isSel ? 2.0 : 1.4;
            const glowOpacity = isSel ? 0.3 : 0.08;
            const glowGeo = new THREE.SphereGeometry(node.val * glowSize, 20, 20);
            const glowMat = new THREE.MeshBasicMaterial({
              color: node.category.color, transparent: true, opacity: glowOpacity,
              blending: THREE.AdditiveBlending, side: THREE.BackSide,
            });
            group.add(new THREE.Mesh(glowGeo, glowMat));
          }

          // Label — only on highlighted nodes when selected, or medium+ nodes in default
          const showLabel = hasHL ? isHL : node.val > 4.0;
          if (showLabel && nodeOpacity > 0.05) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            const text = node.name;
            const fontSize = isSel ? 48 : 34;
            const fontWeight = isSel ? '700' : '500';

            ctx.font = `${fontWeight} ${fontSize}px Inter, -apple-system, sans-serif`;
            const textWidth = ctx.measureText(text).width;
            canvas.width = textWidth + 32;
            canvas.height = fontSize + 20;
            ctx.font = `${fontWeight} ${fontSize}px Inter, -apple-system, sans-serif`;
            ctx.fillStyle = isSel ? '#ffffff' : 'rgba(255,255,255,0.8)';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMat = new THREE.SpriteMaterial({
              map: texture, transparent: true,
              opacity: hasHL ? (isHL ? 1.0 : 0.0) : 0.65,
              depthWrite: false, depthTest: false,
            });
            const sprite = new THREE.Sprite(spriteMat);
            const scale = isSel ? 0.55 : 0.4;
            sprite.scale.set(
              (canvas.width / canvas.height) * node.val * scale * 2,
              node.val * scale * 2, 1
            );
            sprite.position.set(0, node.val + 3, 0);
            group.add(sprite);
          }

          return group;
        })
        .nodeThreeObjectExtend(false)

        // ===== LINKS — reactive =====
        .linkWidth((link: any) => {
          const hasHL = highlightLinksRef.current.size > 0;
          if (!hasHL) return 0.15;
          return highlightLinksRef.current.has(link) ? 0.8 : 0.0;
        })
        .linkOpacity((link: any) => {
          const hasHL = highlightLinksRef.current.size > 0;
          if (!hasHL) return 0.08;
          return highlightLinksRef.current.has(link) ? 0.6 : 0.0;
        })
        .linkColor((link: any) => {
          const hasHL = highlightLinksRef.current.size > 0;
          if (!hasHL) return 'rgba(255,255,255,0.12)';
          return highlightLinksRef.current.has(link)
            ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0)';
        })

        // ===== INTERACTIONS =====
        .onNodeHover((node: any) => {
          if (containerRef.current) containerRef.current.style.cursor = node ? 'pointer' : '';
        })
        .onNodeClick((node: any) => { setSelectedNode(node); })
        .onBackgroundClick(() => { setSelectedNode(null); });

      Graph.d3Force('charge')?.strength(-30);
      Graph.d3Force('link')?.distance(20);
      Graph.d3Force('center')?.strength(0.05);

      setTimeout(() => Graph.cameraPosition({ x: 0, y: 0, z: 500 }), 100);

      const onResize = () => { Graph.width(window.innerWidth); Graph.height(window.innerHeight); };
      window.addEventListener('resize', onResize);

      graphRef.current = Graph;
      (window as any).__graphRef = { current: Graph };
    });
  }, [graphData, focusNode, setSelectedNode]);

  useEffect(() => {
    const Graph = graphRef.current;
    if (!Graph) return;
    Graph.nodeVisibility((node: any) => categoryFilters[node.category.id as keyof typeof categoryFilters]);
    Graph.linkVisibility((link: any) => {
      const s = typeof link.source === 'object' ? link.source : null;
      const t = typeof link.target === 'object' ? link.target : null;
      return s && t && categoryFilters[s.category.id as keyof typeof categoryFilters] && categoryFilters[t.category.id as keyof typeof categoryFilters];
    });
  }, [categoryFilters]);

  return (
    <div ref={containerRef} id="graph-container" className="absolute inset-0 z-0" style={{ backgroundColor: '#050816' }} />
  );
}