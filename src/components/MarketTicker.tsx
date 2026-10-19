'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Article, articles as staticArticles } from '@/lib/newsService';
import { Flame } from 'lucide-react';

export default function MarketTicker() {
  const [tickerItems, setTickerItems] = useState<Article[]>([]);

  useEffect(() => {
    async function loadTickerNews() {
      try {
        const res = await fetch('/api/news?limit=0&status=published', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.news) && data.news.length > 0) {
            // First check if user explicitly ticked breaking news
            const userBreaking = data.news.filter((a: any) => Boolean(a.isBreaking));
            
            // "only put 1 news from each category":
            // Pick exactly 1 latest news from each category (giving priority to breaking news if ticked)
            const categories = ['markets', 'companies', 'economy', 'smart-investor', 'technology', 'cricket', 'opinion', 'pf'];
            const categoryNewsMap: any[] = [];
            
            // First add explicitly marked breaking news
            userBreaking.forEach((bNews: any) => {
              categoryNewsMap.push(bNews);
            });

            // For any remaining category not yet added, pick 1 news from that category
            categories.forEach((catKey) => {
              const alreadyHas = categoryNewsMap.some((item) => (item.category || '').toLowerCase() === catKey);
              if (!alreadyHas) {
                const match = data.news.find((a: any) => (a.category || '').toLowerCase() === catKey);
                if (match) {
                  categoryNewsMap.push(match);
                }
              }
            });

            if (categoryNewsMap.length > 0) {
              setTickerItems(categoryNewsMap);
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Ticker fetch error:', e);
      }

      // Default static fallback: exactly 1 news per category
      const fallbackList: any[] = [];
      const cats = ['markets', 'companies', 'economy', 'smart-investor', 'technology', 'cricket', 'opinion', 'pf'];
      cats.forEach((c) => {
        const item = staticArticles.find((a) => a.category.toLowerCase() === c);
        if (item) fallbackList.push(item);
      });
      setTickerItems(fallbackList);
    }

    loadTickerNews();
  }, []);

  const displayList = tickerItems.length > 0 ? tickerItems : staticArticles.slice(0, 8);
  // Duplicate for seamless endless marquee loop
  const displayItems = [...displayList, ...displayList];

  return (
    <div className="bg-white border-b border-[#dbe7f5] py-2 overflow-hidden shadow-xs">
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 flex items-center">
        {/* Breaking News Label */}
        <div className="shrink-0 flex items-center gap-1.5 bg-[#0069f7] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs mr-3 shadow-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          <Flame className="w-3.5 h-3.5 fill-current text-white" />
          <span>Breaking News</span>
        </div>

        {/* Clickable News Slider / Ticker with seamless infinite marquee */}
        <div className="overflow-hidden relative w-full select-none">
          <style jsx>{`
            @keyframes marqueeScroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .bb-ticker-track {
              display: flex;
              width: max-content;
              animation: marqueeScroll 40s linear infinite;
              will-change: transform;
            }
            .bb-ticker-track:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="bb-ticker-track flex items-center gap-8 text-xs font-sans py-0.5">
            {displayItems.map((item, index) => {
              // Format category so "Home / Top Stories" is replaced by clean specific category
              let cat = item.categoryLabel || (item as any).displayCategory || item.category || 'Market';
              if (cat.toLowerCase().includes('home') || cat.toLowerCase().includes('top stories')) {
                cat = item.subCategoryLabel || (item.category !== 'home' ? item.category : 'MARKETS');
              }

              return (
                <Link
                  key={`${item.id}-${index}`}
                  href={`/article/${item.id}`}
                  className="flex items-center gap-2 shrink-0 py-0.5 px-2 rounded-xs hover:bg-[#eaf2ff] transition-colors group cursor-pointer whitespace-nowrap"
                >
                  <span className="bg-[#0069f7]/10 text-[#0069f7] text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs tracking-wide">
                    {cat}
                  </span>
                  <span className="font-semibold text-gray-800 group-hover:text-[#0069f7] transition-colors max-w-[380px] sm:max-w-[480px] md:max-w-none truncate">
                    {item.title}
                  </span>
                  <span className="text-gray-300 font-light text-sm ml-2 select-none">•</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
