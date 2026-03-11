import type { Scores } from './types';

// ============================================
// Scoring weights — Dev Spec Section 11.7
// ============================================
// overall_score = 0.23 * audience + 0.27 * network + 0.18 * elite
//               + 0.17 * relevance + 0.10 * freshness + 0.05 * bridge

export const SCORE_WEIGHTS = {
  audience: 0.23,
  network: 0.27,
  elite: 0.18,
  relevance: 0.17,
  freshness: 0.10,
  bridge: 0.05,
} as const;

export function computeOverallScore(scores: Omit<Scores, 'overall'>): number {
  return (
    SCORE_WEIGHTS.audience * scores.audience +
    SCORE_WEIGHTS.network * scores.network +
    SCORE_WEIGHTS.elite * scores.elite +
    SCORE_WEIGHTS.relevance * scores.relevance +
    SCORE_WEIGHTS.freshness * scores.freshness +
    SCORE_WEIGHTS.bridge * scores.bridge
  );
}

export function getConfidenceLevel(
  scores: Scores
): { label: string; color: string } {
  const avg =
    (scores.audience + scores.network + scores.elite + scores.relevance) / 4;
  if (avg > 0.7) return { label: 'High', color: 'text-emerald-400' };
  if (avg > 0.5) return { label: 'Medium', color: 'text-yellow-400' };
  return { label: 'Low', color: 'text-red-400' };
}

export function generateExplanations(scores: Scores): string[] {
  const exp: string[] = [];
  if (scores.audience > 0.85)
    exp.push('Massive reach relative to ecosystem peers.');
  if (scores.network > 0.82)
    exp.push('High structural centrality; widely followed by insiders.');
  if (scores.elite > 0.8)
    exp.push('Disproportionate attention from top-tier accounts.');
  if (scores.bridge > 0.5)
    exp.push('Bridges distinct ideological clusters.');
  if (scores.freshness > 0.85)
    exp.push('High volume of recent political network activity.');
  if (scores.relevance > 0.9)
    exp.push('Core political discourse density above 90th percentile.');
  if (exp.length === 0)
    exp.push('Solid baseline metrics across all ecosystem parameters.');
  return exp.slice(0, 4);
}
