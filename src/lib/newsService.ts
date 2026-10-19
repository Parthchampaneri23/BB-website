import rawArticles from '@/data/articles.json';
import rawMarkets from '@/data/markets.json';

export interface Article {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  category: string;
  categoryLabel: string;
  subCategory?: string;
  subCategoryLabel?: string;
  url: string;
  imageUrl: string;
  originalImageUrl?: string;
  author: string;
  pubDate: string;
  readTime: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBreaking?: boolean;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  schemaMarkup?: string;
}

export interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  percent: string;
  isPositive: boolean;
}

// Exactly 8 articles per section from articles.json, sanitized from Home / Top Stories
export const staticArticles: Article[] = (rawArticles as any[]).map((a) => {
  let categoryLabel = a.categoryLabel || a.category;
  if (!categoryLabel || categoryLabel.toLowerCase().includes('home') || categoryLabel.toLowerCase().includes('top stories')) {
    categoryLabel = a.subCategoryLabel || (a.category !== 'home' ? a.category : 'Market');
  }
  return {
    ...a,
    categoryLabel,
  };
}) as Article[];
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

function transformDocToArticle(doc: any): Article {
  return {
    id: doc.slug || doc.id,
    title: doc.title,
    summary: doc.summary,
    fullText: doc.fullText || doc.summary,
    category: doc.category,
    categoryLabel: (() => {
      const raw = doc.categoryLabel || doc.category;
      if (!raw || raw.toLowerCase().includes('home') || raw.toLowerCase().includes('top stories')) {
        return (doc.subCategoryLabel || (doc.category !== 'home' ? doc.category : 'Market'));
      }
      return raw;
    })(),
    subCategory: doc.subCategory || '',
    subCategoryLabel: doc.subCategoryLabel || '',
    url: doc.url || '',
    imageUrl: doc.imageUrl,
    originalImageUrl: doc.originalImageUrl || doc.imageUrl,
    author: doc.author || 'BusinessBulletin Desk',
    pubDate: doc.pubDate ? new Date(doc.pubDate).toISOString() : new Date().toISOString(),
    readTime: doc.readTime || '3 min read',
    isFeatured: Boolean(doc.isFeatured),
    isTrending: Boolean(doc.isTrending),
    isBreaking: Boolean(doc.isBreaking),
    status: doc.status || 'published',
    metaTitle: doc.metaTitle || '',
    metaDescription: doc.metaDescription || '',
    metaKeywords: doc.metaKeywords || '',
    canonicalUrl: doc.canonicalUrl || '',
    schemaMarkup: doc.schemaMarkup || '',
  };
}

/**
 * Live sync with Admin Panel:
 * Reads from BB-admin API (port 3001 or fallback port 3002).
 * When you edit, publish, or auto-fetch any article in admin,
 * the news will display on the website immediately!
 */
export async function getAllArticles(): Promise<Article[]> {
  const adminPorts = [3001, 3002];
  for (const port of adminPorts) {
    try {
      const res = await fetch(`http://localhost:${port}/api/news?limit=0&status=published`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.news) && data.news.length > 0) {
          return data.news.map(transformDocToArticle);
        }
      }
    } catch {
      // Continue to next port if unreachable
    }
  }
  return staticArticles;
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const all = await getAllArticles();
  if (category === 'all' || category === 'home') {
    return all;
  }
  return all.filter((a) => a.category.toLowerCase() === category.toLowerCase());
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  const all = await getAllArticles();
  const found = all.find((a) => a.id === id);
  if (found) return found;
  return staticArticles.find((a) => a.id === id);
}

export async function getBreakingArticles(limit: number = 8): Promise<Article[]> {
  const all = await getAllArticles();
  const breaking = all.filter((a) => a.isBreaking);
  if (breaking.length > 0) {
    return breaking.slice(0, limit);
  }
  // Fallback to trending or latest if no article is explicitly marked breaking
  return all.slice(0, limit);
}

export const articles: Article[] = staticArticles;

