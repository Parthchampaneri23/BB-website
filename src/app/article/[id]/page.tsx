import { getArticleById, getAllArticles } from '@/lib/newsService';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, User, Share2, Bookmark, ArrowLeft, Hash } from 'lucide-react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const allArticles = await getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 4);

  const formattedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'Recent Update';

  const displayImage = article.imageUrl || article.originalImageUrl || '/images/news/cat_home_default.jpg';

  // Generate contextual hashtags
  const titleWords = article.title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'were', 'what', 'into', 'says', 'amid'].includes(w.toLowerCase()))
    .slice(0, 3);

  const categoryTag = article.category.replace(/[^a-zA-Z0-9]/g, '');
  const rawTags = [
    categoryTag,
    ...titleWords,
    'BusinessBulletin',
    'IndiaNews',
  ];

  const hashtags = Array.from(new Set(rawTags.map((t) => t.toLowerCase()))).slice(0, 5);

  return (
    <article className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-gray-500 py-1 font-sans">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#0069f7]">Home</Link>
          <span>/</span>
          <Link href={`/category/${article.category}`} className="capitalize hover:text-[#0069f7]">
            {article.categoryLabel || article.category}
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px] sm:max-w-md">{article.title}</span>
        </div>
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 text-[#0069f7] font-semibold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Article Body (8 cols) */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-8 border border-[#dbe7f5] rounded-xs shadow-xs">
          {/* Category Tag */}
          <span className="inline-block bg-[#0069f7] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs mb-3 shadow-xs font-sans">
            {article.categoryLabel || article.category}
          </span>

          {/* Headline */}
          <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl leading-tight text-[#01142e] mb-4">
            {article.title}
          </h1>

          {/* Subheader / Summary */}
          <div className="border-l-4 border-[#0069f7] pl-3 py-1 mb-6 text-gray-600 text-sm sm:text-base leading-relaxed bg-[#eaf2ff]/30 italic">
            {article.summary}
          </div>

          {/* Author, Date & Share Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-[#dbe7f5] text-xs text-gray-600 mb-6 font-sans">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#01142e] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#0069f7]" />
                {article.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-[#0069f7]" />
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button aria-label="Share article" className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition">
                <Share2 className="w-4 h-4" />
              </button>
              <button aria-label="Bookmark" className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Article Main Featured Image */}
          {displayImage && (
            <figure className="mb-6">
              <div className="relative w-full aspect-video sm:aspect-[16/9] max-h-[480px] overflow-hidden rounded-xs bg-slate-900 border border-[#dbe7f5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImage}
                  alt={article.title}
                  className="w-full h-full object-cover object-center block"
                  loading="eager"
                />
              </div>
              <figcaption className="text-[11px] text-gray-500 italic mt-2 text-right font-sans">
                Photo: BusinessBulletin Desk
              </figcaption>
            </figure>
          )}

          {/* Article Content / Body Text */}
          <div
            className="article-body article-content"
            dangerouslySetInnerHTML={{
              __html: article.fullText || article.summary || '',
            }}
          />

          {/* Hashtags Section */}
          <div className="mt-8 pt-4 border-t border-[#dbe7f5]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#01142e] uppercase tracking-wider mb-2 font-sans">
              <Hash className="w-3.5 h-3.5 text-[#0069f7]" />
              <span>Related Topics & Hashtags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center text-xs font-sans font-semibold text-gray-700 bg-gray-100 hover:bg-[#eaf2ff] hover:text-[#0069f7] px-2.5 py-1 rounded-full transition border border-[#dbe7f5]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#dbe7f5] p-4 rounded-xs shadow-xs font-sans">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#01142e] pb-2 border-b-2 border-[#0069f7] mb-3">
              Related In {article.categoryLabel || article.category}
            </h3>
            <div className="divide-y divide-gray-100">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
