'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { articles } from '@/lib/newsService';
import ArticleCard from '@/components/ArticleCard';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const filteredArticles = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 border border-[#dbe7f5] rounded-xs shadow-xs">
        <h1 className="font-serif font-bold text-2xl text-[#01142e] mb-4">
          Search BusinessBulletin News
        </h1>

        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search keywords, companies, stocks, policy..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-[#c9daf2] rounded-lg focus:outline-none focus:border-[#0069f7] focus:bg-white"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        </div>

        <div className="mt-3 text-xs text-gray-500">
          {query.trim() ? (
            <span>Found <strong>{filteredArticles.length}</strong> stories matching &ldquo;{query}&rdquo;</span>
          ) : (
            <span>Type a keyword above to find stories across stock markets, economy, tech, and sports.</span>
          )}
        </div>
      </div>

      {filteredArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      )}

      {query.trim() && filteredArticles.length === 0 && (
        <div className="bg-white p-12 text-center border border-[#dbe7f5] rounded-xs">
          <p className="text-gray-600 font-medium">No stories found matching &ldquo;{query}&rdquo;</p>
          <p className="text-xs text-gray-400 mt-1">Try checking for typos or using broader keywords like &ldquo;market&rdquo;, &ldquo;RBI&rdquo;, or &ldquo;India&rdquo;.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
