import type { Category, CategoryId } from './types';

export const CATEGORIES: Record<CategoryId, Category> = {
  politician: {
    id: 'politician',
    name: 'Politician / Official',
    color: '#8EC5FF',
    active: true,
  },
  journalist: {
    id: 'journalist',
    name: 'Journalist / Reporter',
    color: '#D9B7FF',
    active: true,
  },
  podcast: {
    id: 'podcast',
    name: 'Podcast Host',
    color: '#F5D08A',
    active: true,
  },
  media: {
    id: 'media',
    name: 'Media Organization',
    color: '#FFB7D8',
    active: true,
  },
  commentator: {
    id: 'commentator',
    name: 'Commentator / Analyst',
    color: '#A7F2B2',
    active: true,
  },
  strategist: {
    id: 'strategist',
    name: 'Think Tank / Strategist',
    color: '#F7A5A5',
    active: true,
  },
};

export function getCategoryList(): Category[] {
  return Object.values(CATEGORIES);
}
