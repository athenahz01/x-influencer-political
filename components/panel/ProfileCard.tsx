'use client';

import { useState, useMemo } from 'react';
import { useExplorerStore } from '@/store/useExplorerStore';
import { formatNumber, formatScore } from '@/lib/format';
import { generateExplanations, getConfidenceLevel } from '@/lib/scoring';

const SCORE_BARS = [
  { key: 'network' as const, label: 'Network', color: '#D9B7FF' },
  { key: 'audience' as const, label: 'Audience', color: '#8EC5FF' },
  { key: 'elite' as const, label: 'Elite Signal', color: '#F5D08A' },
  { key: 'relevance' as const, label: 'Relevance', color: '#A7F2B2' },
  { key: 'freshness' as const, label: 'Freshness', color: '#FFB7D8' },
  { key: 'bridge' as const, label: 'Bridge', color: '#F7A5A5' },
];

function isHighScore(score: number): boolean {
  return score >= 0.8;
}

export function ProfileCard() {
  const { selectedNode, setSelectedNode } = useExplorerStore();
  const [imgError, setImgError] = useState(false);

  // Reset img error when node changes
  const nodeId = selectedNode?.id;

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
  const topConnections = [...node.neighbors]
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, 6);

  const cleanHandle = node.handle.replace('@', '');
  const profileUrl = node.profileUrl || `https://x.com/${cleanHandle}`;
  const showVerified = isHighScore(node.scores.overall);
  const hasFollowing = Boolean(node.following);

  return (
    <div
      key={nodeId}
      className="absolute top-5 right-5 w-[380px] glass-panel rounded-xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
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

      {/* Close button */}
      <button
        onClick={() => setSelectedNode(null)}
        className="absolute top-4 right-4 z-10 text-white/30 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Avatar section */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4 mb-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            {node.avatarUrl && !imgError ? (
              <img
                src={node.avatarUrl}
                alt={node.name}
                className="w-16 h-16 rounded-full object-cover"
                style={{ boxShadow: '0 0 20px rgba(255,255,255,0.12)' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-[#050816]"
                style={{
                  backgroundColor: node.category.color,
                  boxShadow: '0 0 20px rgba(255,255,255,0.12)',
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Name + handle */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-bold text-white leading-tight truncate">
                {node.name}
              </h2>
              {showVerified && (
                <span className="text-[#8EC5FF] text-[14px] shrink-0">&#10003;</span>
              )}
            </div>
            <p className="text-[12px] text-white/40 font-mono">{node.handle}</p>
          </div>

          {/* Follow button */}
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-1.5 bg-white text-[#050816] text-[12px] font-bold rounded-full hover:bg-white/90 transition-colors"
          >
            Follow
          </a>
        </div>

        {/* Bio */}
        <p className="text-[13px] text-white/70 leading-relaxed mb-3">
          {node.role}
        </p>

        {/* Followers / Following */}
        <div className="flex items-center gap-4 text-[13px] mb-1">
          {hasFollowing && (
            <span>
              <strong className="text-white">{formatNumber(node.following || 0)}</strong>
              <span className="text-white/40 ml-1">Following</span>
            </span>
          )}
          <span>
            <strong className="text-white">{formatNumber(node.followers)}</strong>
            <span className="text-white/40 ml-1">Followers</span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* Category + Rank */}
      <div className="px-5 pt-3 pb-2 flex items-center gap-2">
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

      {/* Score Dashboard */}
      <div className="px-5 pb-3">
        <div className="bg-[#050816]/60 rounded-lg border border-white/[0.04] p-3">
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
      </div>

      {/* Explanations */}
      <div className="px-5 pb-3">
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
        <div className="px-5 pb-3">
          <h4 className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-2 font-medium">
            Top Connections
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {topConnections.map((conn) => (
              <button
                key={conn.id}
                onClick={() => {
                  setImgError(false);
                  setSelectedNode(conn);
                }}
                className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                {conn.handle}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex justify-between items-center text-[10px] text-white/30 font-mono">
        <span>{formatNumber(node.followers)} Followers</span>
        <span>
          Confidence: <span className={confidence.color}>{confidence.label}</span>
        </span>
      </div>
    </div>
  );
}