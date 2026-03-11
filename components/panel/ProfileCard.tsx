'use client';

import { useExplorerStore } from '@/store/useExplorerStore';
import { formatNumber, formatScore } from '@/lib/format';
import { generateExplanations, getConfidenceLevel } from '@/lib/scoring';

const SCORE_BARS = [
  { key: 'network', label: 'Network', color: '#D9B7FF' },
  { key: 'audience', label: 'Audience', color: '#8EC5FF' },
  { key: 'elite', label: 'Elite Signal', color: '#F5D08A' },
  { key: 'relevance', label: 'Relevance', color: '#A7F2B2' },
  { key: 'freshness', label: 'Freshness', color: '#FFB7D8' },
  { key: 'bridge', label: 'Bridge', color: '#F7A5A5' },
] as const;

export function ProfileCard() {
  const { selectedNode, setSelectedNode } = useExplorerStore();

  if (!selectedNode) return null;

  const node = selectedNode;
  const initials = node.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const explanations = generateExplanations(node.scores);
  const confidence = getConfidenceLevel(node.scores);
  const topConnections = node.neighbors
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, 6);

  return (
    <div
      className="absolute top-5 right-5 w-[360px] glass-panel rounded-xl shadow-2xl p-5 pointer-events-auto flex flex-col"
      style={{
        animation: 'fadeScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold text-[#050816]"
              style={{
                backgroundColor: node.category.color,
                boxShadow: '0 0 20px rgba(255,255,255,0.12)',
              }}
            >
              {initials}
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0c1022]"
              style={{ backgroundColor: node.category.color }}
            />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white leading-tight">
              {node.name}
            </h2>
            <p className="text-[11px] text-white/40 font-mono">{node.handle}</p>
          </div>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="text-white/30 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-md p-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Category + Rank */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[9px] uppercase tracking-[0.12em] font-semibold px-2 py-0.5 rounded-full border"
          style={{
            color: node.category.color,
            borderColor: node.category.color + '30',
            backgroundColor: node.category.color + '10',
          }}
        >
          {node.category.name}
        </span>
        <span className="text-[9px] text-white/40 font-mono">
          Rank #{node.rank}
        </span>
      </div>

      {/* Role */}
      <p className="text-[11px] text-white/60 mb-4 leading-relaxed border-l-2 border-white/10 pl-3 italic">
        {node.role}
      </p>

      {/* Score Dashboard */}
      <div className="bg-[#050816]/60 rounded-lg border border-white/[0.04] p-3 mb-4">
        <div className="flex justify-between items-baseline border-b border-white/[0.06] pb-2 mb-2.5">
          <span className="text-[9px] uppercase tracking-[0.15em] text-white/30 font-medium">
            Composite Score
          </span>
          <span className="text-[20px] font-mono font-bold text-[#8EC5FF] score-glow">
            {formatScore(node.scores.overall)}
          </span>
        </div>

        <div className="space-y-2">
          {SCORE_BARS.map(({ key, label, color }) => (
            <div key={key} className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-white/40 w-[72px]">{label}</span>
              <div className="flex-1 mx-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full score-bar-fill"
                  style={{
                    width: `${node.scores[key] * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="text-white/60 w-8 text-right">
                {formatScore(node.scores[key])}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanations */}
      <div className="mb-4">
        <h4 className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-2 font-medium">
          Why Ranked Here
        </h4>
        <ul className="text-[11px] text-white/60 list-disc pl-4 space-y-1 marker:text-white/20 leading-relaxed">
          {explanations.map((exp, i) => (
            <li key={i}>{exp}</li>
          ))}
        </ul>
      </div>

      {/* Top Connections */}
      {topConnections.length > 0 && (
        <div className="mb-4">
          <h4 className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-2 font-medium">
            Top Connections
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {topConnections.map((conn) => (
              <button
                key={conn.id}
                onClick={() => setSelectedNode(conn)}
                className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                {conn.handle}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-white/[0.06] flex justify-between items-center text-[10px] text-white/30 font-mono">
        <span>{formatNumber(node.followers)} Followers</span>
        <span>
          Confidence:{' '}
          <span className={confidence.color}>{confidence.label}</span>
        </span>
      </div>
    </div>
  );
}
