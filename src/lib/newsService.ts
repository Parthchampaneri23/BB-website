import rawArticles from '@/data/articles.json';
import rawMarkets from '@/data/markets.json';

export interface Article {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  category: string;
  categoryLabel: string;
  url: string;
  imageUrl: string;
  originalImageUrl?: string;
  author: string;
  pubDate: string;
  readTime: string;
}

export interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  percent: string;
  isPositive: boolean;
}

export const articles: Article[] = rawArticles as Article[];
export const markets: MarketItem[] = rawMarkets as MarketItem[];

export const CATEGORIES = [
  { id: 'all', name: 'Home', path: '/' },
  { id: 'markets', name: 'Market', path: '/category/markets' },
  { id: 'economy', name: 'Economy', path: '/category/economy' },
  { id: 'pf', name: 'PF', path: '/category/pf' },
  { id: 'smart-investor', name: 'Smart Investor', path: '/category/smart-investor' },
  { id: 'companies', name: 'Companies', path: '/category/companies' },
  { id: 'technology', name: 'Technology', path: '/category/technology' },
  { id: 'cricket', name: 'Sports', path: '/category/cricket' },
  { id: 'opinion', name: 'Opinion', path: '/category/opinion' },
];

export function getArticlesByCategory(category: string): Article[] {
  if (category === 'all' || category === 'home') {
    return articles;
  }
  return articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getTrendingArticles(limit: number = 6): Article[] {
  return articles.slice(0, limit);
}
