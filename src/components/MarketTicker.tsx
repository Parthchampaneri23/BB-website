'use client';

import React from 'react';
import Link from 'next/link';
import { articles } from '@/lib/newsService';
import { Flame } from 'lucide-react';

export default function MarketTicker() {
  // Select top 5-6 news from completely different categories
  const targetCategories = [
    { key: 'markets', label: 'Market' },
    { key: 'economy', label: 'Economy' },
    { key: 'companies', label: 'Companies' },
    { key: 'cricket', label: 'Sports' },
    { key: 'technology', label: 'Technology' },
    { key: 'smart-investor', label: 'Smart Investor' },
  ];

  const breakingNews = targetCategories
    .map(({ key, label }) => {
      const match = articles.find((a) => a.category.toLowerCase() === key);
      if (!match) return null;
      return {
        ...match,
        displayCategory: label,
      };
    })
    .filter(Boolean) as (typeof articles[0] & { displayCategory: string })[];

  // Duplicate for seamless endless marquee loop
  const displayItems = [...breakingNews, ...breakingNews];

  return (
    <div className="bg-white border-b border-[#dbe7f5] py-2 overflow-hidden shadow-xs">
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 flex items-center">
        {/* Breaking News Label */}
        <div className="shrink-0 flex items-center gap-1.5 bg-[#0069f7] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs mr-3 shadow-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          <Flame className="w-3.5 h-3.5 fill-current text-white" />
          <span>Breaking News</span>
        </div>

        {/* Clickable News Slider / Ticker */}
        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker flex items-center gap-8 text-xs font-sans">
            {displayItems.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={`/article/${item.id}`}
                className="flex items-center gap-2 shrink-0 py-0.5 px-2 rounded-xs hover:bg-[#eaf2ff] transition-colors group cursor-pointer"
              >
                <span className="bg-[#0069f7]/10 text-[#0069f7] text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-xs tracking-wide">
                  {item.displayCategory}
                </span>
                <span className="font-semibold text-gray-800 group-hover:text-[#0069f7] transition-colors line-clamp-1 max-w-[340px] sm:max-w-[420px] md:max-w-none">
                  {item.title}
                </span>
                <span className="text-gray-300 font-light text-sm ml-2 select-none">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
