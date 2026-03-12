// ============================================
// Core Types — per Dev Spec sections 10 & 11
// ============================================

export type CategoryId =
  | 'fashion'
  | 'beauty'
  | 'fitness'
  | 'food'
  | 'travel'
  | 'tech'
  | 'comedy'
  | 'education'
  | 'art'
  | 'photography'
  | 'parenting'
  | 'music';

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
  active: boolean;
}

export interface Scores {
  overall: number;
  audience: number;
  network: number;
  elite: number;
  relevance: number;
  freshness: number;
  bridge: number;
}

export interface AccountNode {
  id: string;
  name: string;
  handle: string;
  role: string;
  followers: number;
  following?: number;
  avatarUrl?: string;
  profileUrl?: string;
  party?: string | null;
  joinedAt?: string | null;
  category: Category;
  lean: number;
  scores: Scores;
  val: number;
  rank: number;
  // Runtime — populated after graph init
  neighbors: AccountNode[];
  links: GraphEdge[];
  // Optional 3D positions
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphEdge {
  source: string | AccountNode;
  target: string | AccountNode;
}

export interface GraphData {
  nodes: AccountNode[];
  links: GraphEdge[];
}

export type RankMode = 'overall' | 'audience' | 'network' | 'elite';

export interface SnapshotMeta {
  version: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
}