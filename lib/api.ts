import { supabase } from './supabase';
import { CATEGORIES } from './categories';
import { computeOverallScore } from './scoring';
import type { AccountNode, GraphEdge, Category, Scores } from './types';

export async function fetchGraphData(): Promise<{
  nodes: AccountNode[];
  links: GraphEdge[];
}> {
  // Fetch accounts
  const { data: accounts, error: accError } = await supabase
    .from('accounts')
    .select('*')
    .eq('is_active', true)
    .order('score_overall', { ascending: false });

  if (accError) throw accError;

  // Fetch edges
  const { data: edges, error: edgeError } = await supabase
    .from('edges')
    .select('*');

  if (edgeError) throw edgeError;

  // Transform accounts to nodes
  const nodes: AccountNode[] = (accounts || []).map((acc, index) => {
    const category = CATEGORIES[acc.category as keyof typeof CATEGORIES];
    const scores: Scores = {
      audience: acc.score_audience || 0,
      network: acc.score_network || 0,
      elite: acc.score_elite || 0,
      relevance: acc.score_relevance || 0,
      freshness: acc.score_freshness || 0,
      bridge: acc.score_bridge || 0,
      overall: acc.score_overall || 0,
    };

    return {
      id: acc.handle,
      name: acc.display_name,
      handle: acc.handle,
      role: acc.bio || acc.subcategory || '',
      followers: acc.followers_count || 0,
      category,
      lean: acc.lean || 0,
      scores,
      val: Math.max(1.5, scores.overall * 7),
      rank: index + 1,
      neighbors: [],
      links: [],
    };
  });

  // Build handle set for validation
  const handleSet = new Set(nodes.map((n) => n.id));

  // Transform edges to links (only include edges where both nodes exist)
  const links: GraphEdge[] = (edges || [])
    .filter((e) => handleSet.has(e.source_handle) && handleSet.has(e.target_handle))
    .map((e) => ({
      source: e.source_handle,
      target: e.target_handle,
    }));

  // Build neighbor references
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  links.forEach((link) => {
    const a = nodeMap.get(link.source as string);
    const b = nodeMap.get(link.target as string);
    if (a && b) {
      a.neighbors.push(b);
      b.neighbors.push(a);
      a.links.push(link);
      b.links.push(link);
    }
  });

  return { nodes, links };
}