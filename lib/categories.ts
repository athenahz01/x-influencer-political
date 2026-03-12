import type { Category, CategoryId } from './types';

export const CATEGORIES: Record<CategoryId, Category> = {
  fashion: { id: 'fashion', name: 'Fashion / Style', color: '#F5A0C0', active: true },
  beauty: { id: 'beauty', name: 'Beauty / Skincare', color: '#D9B7FF', active: true },
  fitness: { id: 'fitness', name: 'Fitness / Wellness', color: '#8EC5FF', active: true },
  food: { id: 'food', name: 'Food / Recipe', color: '#F5D08A', active: true },
  travel: { id: 'travel', name: 'Travel / Lifestyle', color: '#A7F2B2', active: true },
  tech: { id: 'tech', name: 'Tech / Business', color: '#7EC8E3', active: true },
  comedy: { id: 'comedy', name: 'Comedy / Entertainment', color: '#FFB7D8', active: true },
  education: { id: 'education', name: 'Education / Self-help', color: '#9DE0E8', active: true },
  art: { id: 'art', name: 'Art / Design', color: '#F7A5A5', active: true },
  photography: { id: 'photography', name: 'Photography / Film', color: '#C4B5FD', active: true },
  parenting: { id: 'parenting', name: 'Parenting / Family', color: '#FCD34D', active: true },
  music: { id: 'music', name: 'Music / Dance', color: '#FB923C', active: true },
};

export function getCategoryList(): Category[] {
  return Object.values(CATEGORIES);
}