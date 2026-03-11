'use client';

import { useEffect, useRef } from 'react';
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
  const THREERef = useRef<any>(null);

  const { selectedNode, setSelectedNode, categoryFilters } = useExplorerStore();

  useEffect(() => {
    selectedRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    if (!containerRef.current || graphRef.current) return;

    Promise.all([
      import('3d-force-graph'),
      import('three'),
    ]).then(([forceGraphMod, THREE]) => {
      const ForceGraph3D = forceGraphMod.default as any;
      THREERef.current = THREE;

      const Graph = ForceGraph3D()(containerRef.current!)
        .graphData({ nodes: graphData.nodes, links: graphData.links })
        .backgroundColor('#050816')
        .showNavInfo(false)

        // --- TOOLTIP (only on hover, not selected) ---
        .nodeLabel((node: any) => {
          if (selectedRef.current) return ''; // hide tooltip when something is selected
          return `<div style="background:rgba(10,15,32,0.95);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:11px;padding:6px 12px;border-radius:8px;font-family:Inter,sans-serif;font-weight:500;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,0.4);">${node.name} <span style="color:rgba(255,255,255,0.4);margin-left:6px;font-family:JetBrains Mono,monospace;font-size:10px;">${formatScore(node.scores.overall)}</span></div>`;
        })

        // --- NODES with text labels when highlighted ---
        .nodeThreeObject((node: any) => {
          const hl = highlightNodesRef.current;
          const hasHL = hl.size > 0;
          const isHL = !hasHL || hl.has(node);
          const isSel = selectedRef.current?.id === node.id;
          const color = isHL ? node.category.color : '#0e1225';
          const opacity = isHL ? 1.0 : 0.12;

          const group = new THREE.Group();

          // Sphere
          const geo = new THREE.SphereGeometry(node.val, 20, 20);
          const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
          const mesh = new THREE.Mesh(geo, mat);
          group.add(mesh);

          // Glow
          if (isHL && (node.val > 3.5 || isSel)) {
            const glowGeo = new THREE.SphereGeometry(node.val * (isSel ? 2.5 : 1.6), 20, 20);
            const glowMat = new THREE.MeshBasicMaterial({
              color: node.category.color,
              transparent: true,
              opacity: isSel ? 0.45 : 0.12,
              blending: THREE.AdditiveBlending,
              side: THREE.BackSide,
            });
            group.add(new THREE.Mesh(glowGeo, glowMat));
          }

          // Text label — show when node is highlighted AND something is selected
          if (hasHL && isHL) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            const text = node.name;
            const fontSize = isSel ? 48 : 36;
            ctx.font = `${isSel ? '600' : '400'} ${fontSize}px Inter, sans-serif`;
            const textWidth = ctx.measureText(text).width;

            canvas.width = textWidth + 24;
            canvas.height = fontSize + 20;

            ctx.font = `${isSel ? '600' : '400'} ${fontSize}px Inter, sans-serif`;
            ctx.fillStyle = isSel ? '#ffffff' : 'rgba(255,255,255,0.85)';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 12, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            const spriteMat = new THREE.SpriteMaterial({
              map: texture,
              transparent: true,
              opacity: isSel ? 1.0 : 0.9,
              depthWrite: false,
            });
            const sprite = new THREE.Sprite(spriteMat);

            const scaleFactor = isSel ? 0.6 : 0.45;
            sprite.scale.set(
              (canvas.width / canvas.height) * node.val * scaleFactor * 2,
              node.val * scaleFactor * 2,
              1
            );
            sprite.position.set(0, node.val + 4, 0);
            group.add(sprite);
          }

          return group;
        })
        .nodeThreeObjectExtend(false)

        // --- LINKS ---
        .linkOpacity(0.25)
        .linkWidth(0.5)
        .linkColor(() => '#ffffff')

        // --- INTERACTIONS ---
        .onNodeHover((node: any) => {
          if (containerRef.current) containerRef.current.style.cursor = node ? 'pointer' : '';
          if (selectedRef.current) return;

          highlightNodesRef.current.clear();
          highlightLinksRef.current.clear();
          if (node) {
            highlightNodesRef.current.add(node);
            node.neighbors?.forEach((n: any) => highlightNodesRef.current.add(n));
            node.links?.forEach((l: any) => highlightLinksRef.current.add(l));
          }
          updateLinkMaterials(Graph);
          Graph.nodeThreeObject(Graph.nodeThreeObject());
        })
        .onNodeClick((node: any) => {
          highlightNodesRef.current.clear();
          highlightLinksRef.current.clear();
          highlightNodesRef.current.add(node);
          node.neighbors?.forEach((n: any) => highlightNodesRef.current.add(n));
          node.links?.forEach((l: any) => highlightLinksRef.current.add(l));
          updateLinkMaterials(Graph);
          Graph.nodeThreeObject(Graph.nodeThreeObject());
          setSelectedNode(node);

          // Gentle zoom — keep network visible
          const distance = 300;
          const dr = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
          Graph.cameraPosition(
            { x: (node.x || 0) * dr, y: (node.y || 0) * dr, z: (node.z || 0) * dr },
            node, 1500
          );
        })
        .onBackgroundClick(() => {
          highlightNodesRef.current.clear();
          highlightLinksRef.current.clear();
          updateLinkMaterials(Graph);
          Graph.nodeThreeObject(Graph.nodeThreeObject());
          setSelectedNode(null);
        });

      // Physics
      Graph.d3Force('charge')?.strength(-55);
      Graph.d3Force('link')?.distance(30);

      setTimeout(() => Graph.cameraPosition({ x: 0, y: 0, z: 500 }), 100);

      const onResize = () => { Graph.width(window.innerWidth); Graph.height(window.innerHeight); };
      window.addEventListener('resize', onResize);

      graphRef.current = Graph;
      (window as any).__graphRef = { current: Graph };
    });
  }, [graphData]);

  function updateLinkMaterials(Graph: any) {
    const hasHL = highlightLinksRef.current.size > 0;
    const gd = Graph.graphData();
    gd.links.forEach((link: any) => {
      const linkObj = link.__threeObj;
      if (!linkObj?.material) return;
      if (hasHL) {
        if (highlightLinksRef.current.has(link)) {
          linkObj.material.opacity = 1.0;
          linkObj.scale.set(1, 1, 5);
        } else {
          linkObj.material.opacity = 0.02;
          linkObj.scale.set(1, 1, 1);
        }
      } else {
        linkObj.material.opacity = 0.25;
        linkObj.scale.set(1, 1, 1);
      }
      linkObj.material.needsUpdate = true;
    });
  }

  // Category filters
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

  // Clear on external deselect
  useEffect(() => {
    if (!selectedNode && graphRef.current) {
      highlightNodesRef.current.clear();
      highlightLinksRef.current.clear();
      updateLinkMaterials(graphRef.current);
      graphRef.current.nodeThreeObject(graphRef.current.nodeThreeObject());
    }
  }, [selectedNode]);

  return (
    <div
      ref={containerRef}
      id="graph-container"
      className="absolute inset-0 z-0"
      style={{ backgroundColor: '#050816' }}
    />
  );
}