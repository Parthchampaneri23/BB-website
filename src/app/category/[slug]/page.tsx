import React from 'react';
import { getArticlesByCategory, CATEGORIES, articles } from '@/lib/newsService';
import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'markets' },
    { slug: 'economy' },
    { slug: 'pf' },
    { slug: 'smart-investor' },
    { slug: 'technology' },
    { slug: 'cricket' },
    { slug: 'companies' },
    { slug: 'opinion' },
  ];
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryData = CATEGORIES.find((c) => c.id === slug);

  const categoryArticles = await getArticlesByCategory(slug);
  const allArticles = await getArticlesByCategory('all');
  const trendingArticles = allArticles.slice(0, 6);

  const title = categoryData ? categoryData.name : slug.replace('-', ' ').toUpperCase();

  return (
    <div className="space-y-6">
      {/* Category Breadcrumb & Title */}
      <div className="bg-white p-4 border border-[#dbe7f5] rounded-xs font-sans">
        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
          <Link href="/" className="hover:text-[#0069f7]">Home</Link>
          <span>/</span>
          <span className="font-semibold text-gray-800 capitalize">{title}</span>
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#01142e] uppercase tracking-tight">
          {title} News & Analysis
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          Comprehensive updates, market implications, and in-depth stories from BusinessBulletin reporters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Category Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {categoryArticles.length > 0 ? (
            <>
              {/* Featured top story */}
              <ArticleCard article={categoryArticles[0]} variant="featured" />

              {/* Grid of 2 standard stories */}
              {categoryArticles.length > 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {categoryArticles.slice(1, 3).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="standard" />
                  ))}
                </div>
              )}

              {/* Horizontal list of remaining stories */}
              <div className="bg-white border border-[#dbe7f5] rounded-xs mt-4 divide-y divide-gray-100">
                {categoryArticles.slice(3).map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white p-8 text-center border border-[#dbe7f5] rounded-xs font-sans">
              <p className="text-gray-600">No articles currently indexed for this category.</p>
              <Link href="/" className="inline-block mt-4 text-[#0069f7] font-bold text-xs uppercase underline">
                Return to Homepage
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#dbe7f5] p-4 rounded-xs shadow-xs font-sans">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#01142e] pb-2 border-b-2 border-[#0069f7] mb-3">
              Top Trending Today
            </h3>
            <div className="divide-y divide-gray-100">
              {trendingArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
