'use client';

import { useExplorerStore } from '@/store/useExplorerStore';

export function MethodologyModal() {
  const { methodologyOpen, toggleMethodology } = useExplorerStore();

  if (!methodologyOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050816]/85 backdrop-blur-lg flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleMethodology();
      }}
      style={{ animation: 'fadeIn 0.3s ease forwards' }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div
        className="glass-panel rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative border border-white/[0.1] max-h-[88vh] overflow-y-auto"
        style={{ animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        <button
          onClick={toggleMethodology}
          className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-[22px] font-bold text-white mb-1 tracking-tight">
          Methodology
        </h2>
        <p className="text-[12px] text-white/40 mb-8 border-b border-white/[0.06] pb-4 font-mono">
          Political Network Explorer &bull; Scoring Framework v1.0
        </p>

        <div className="space-y-8 text-[13px] text-white/60 leading-relaxed">
          {/* Discovery */}
          <section>
            <h3 className="text-[11px] font-bold text-[#8EC5FF] tracking-[0.12em] uppercase mb-3 flex items-center">
              <span className="w-5 h-px bg-[#8EC5FF] mr-3" />
              Discovery &amp; Selection
            </h3>
            <p className="mb-3">
              Starting from{' '}
              <strong className="text-white/80">multi-basket seed accounts</strong>{' '}
              (elected officials, political journalists, podcasters, think tanks,
              strategists), we crawl who they follow to find political voices. If
              multiple trusted sources follow someone, they matter. The top 300 are
              selected using:
            </p>
            <div className="bg-[#050816] border border-white/[0.04] rounded-lg px-4 py-3 font-mono text-[12px] text-[#8EC5FF] text-center mb-3">
              Score = log&#x2081;&#x2080;(followers) &times; seed_connections &times;
              relevance_weight
            </div>
            <p className="text-[11px] text-white/40">
              Log scale prevents mega-accounts from dominating. Minimum 5K followers,
              political keywords in bio, blocklist for entertainment-only media.
            </p>
          </section>

          {/* Scoring */}
          <section>
            <h3 className="text-[11px] font-bold text-[#D9B7FF] tracking-[0.12em] uppercase mb-3 flex items-center">
              <span className="w-5 h-px bg-[#D9B7FF] mr-3" />
              Influence Scoring Algorithm
            </h3>
            <p className="mb-4">
              Raw follower counts are a flawed proxy for influence. This explorer
              ranks accounts using a{' '}
              <strong className="text-white/80">Composite Overall Score</strong>{' '}
              from a weighted 6-factor model:
            </p>

            <div className="grid grid-cols-2 gap-3 bg-[#050816] rounded-lg border border-white/[0.04] p-4 mb-4">
              <div>
                <strong className="text-white/80 text-[12px]">Network Centrality (27%)</strong>
                <br />
                <span className="text-[10px] text-white/40">Weighted PageRank within the political graph.</span>
              </div>
              <div>
                <strong className="text-white/80 text-[12px]">Audience Reach (23%)</strong>
                <br />
                <span className="text-[10px] text-white/40">Normalized log&#x2081;&#x2080; scale of followers.</span>
              </div>
              <div>
                <strong className="text-white/80 text-[12px]">Elite Signal (18%)</strong>
                <br />
                <span className="text-[10px] text-white/40">Attention from high-value node interactions.</span>
              </div>
              <div>
                <strong className="text-white/80 text-[12px]">Topical Relevance (17%)</strong>
                <br />
                <span className="text-[10px] text-white/40">Density of political entities in discourse.</span>
              </div>
              <div>
                <strong className="text-white/80 text-[12px]">Freshness (10%)</strong>
                <br />
                <span className="text-[10px] text-white/40">Recency of high-value graph connections.</span>
              </div>
              <div>
                <strong className="text-white/80 text-[12px]">Bridge Builder (5%)</strong>
                <br />
                <span className="text-[10px] text-white/40">Edges spanning distinct ideological clusters.</span>
              </div>
            </div>

            <div className="bg-blue-900/15 border border-blue-500/20 rounded-lg px-4 py-3 font-mono text-[11px] text-[#8EC5FF] text-center">
              Overall = 0.27(NC) + 0.23(AR) + 0.18(ES) + 0.17(TR) + 0.10(FR) + 0.05(BB)
            </div>
          </section>

          {/* Graph */}
          <section>
            <h3 className="text-[11px] font-bold text-[#F5D08A] tracking-[0.12em] uppercase mb-3 flex items-center">
              <span className="w-5 h-px bg-[#F5D08A] mr-3" />
              Graph &amp; Connections
            </h3>
            <p className="mb-3">
              The default view shows all connections.{' '}
              <strong className="text-white/80">Click a node</strong> to see who
              they connect to. Node sizes reflect composite score, not raw
              followers. Filter by category using the legend.
            </p>
            <p className="text-[11px] text-white/40">
              Edge weights depend on source quality, relation type, mutuality, and
              recency. Community detection uses Louvain clustering for stable visual
              groupings.
            </p>
          </section>

          {/* Limitations */}
          <section>
            <h3 className="text-[11px] font-bold text-[#F7A5A5] tracking-[0.12em] uppercase mb-3 flex items-center">
              <span className="w-5 h-px bg-[#F7A5A5] mr-3" />
              Known Limitations
            </h3>
            <p className="text-[11px] text-white/40">
              Rankings are model-based estimates, not objective truth. Inclusion does
              not equal endorsement. Data may be incomplete or delayed. Seed bias,
              incomplete relationship coverage, and platform-specific distortion are
              inherent limitations. Categories may contain ambiguity for hybrid
              accounts.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
