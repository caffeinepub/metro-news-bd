// Shared types for news articles
// These are defined locally since backend interface is empty (no backend methods for these yet)

export interface Article {
  id: bigint;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  author: string;
  isFeatured: boolean;
  publishedAt: bigint;
  sourceUrl: string;
  sourceName: string;
}

export interface LocalNewsArticle {
  id: bigint;
  title: string;
  summary: string;
  category: string;
  imageBase64: string;
  author: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: bigint;
}
