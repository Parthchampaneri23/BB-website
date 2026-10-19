import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/newsService';
import { Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'compact' | 'horizontal';
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const formattedDate = article.pubDate ? new Date(article.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Recently';

  if (variant === 'featured') {
    return (
      <article className="group bg-white border border-[#dbe7f5] rounded-xs overflow-hidden hover:shadow-md transition duration-200">
        <div className="relative w-full aspect-video max-h-[360px] bg-slate-900 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 700px"
            className="object-cover object-center group-hover:scale-102 transition duration-300"
            unoptimized
          />
          <span className="absolute top-3 left-3 bg-[#0069f7] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
            {article.categoryLabel || article.category}
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2 font-sans">
            <span className="font-semibold text-gray-800">{article.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#0069f7]" />
              {formattedDate}
            </span>
          </div>
          <Link href={`/article/${article.id}`}>
            <h2 className="font-serif font-bold text-xl sm:text-2xl leading-snug text-gray-900 group-hover:text-[#0069f7] transition-colors mb-2">
              {article.title}
            </h2>
          </Link>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-sans">
            {article.summary}
          </p>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-3 p-3 bg-white border-b border-[#e5effb] hover:bg-[#eaf2ff]/30 transition items-center">
        <div className="relative w-28 sm:w-32 aspect-[16/10] shrink-0 bg-slate-900 rounded-xs overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="130px"
            className="object-cover object-center group-hover:scale-105 transition duration-300"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#0069f7] font-bold uppercase tracking-wide mb-1 font-sans">
              <span>{article.category}</span>
              <span className="text-gray-400 font-normal">• {formattedDate}</span>
            </div>
            <Link href={`/article/${article.id}`}>
              <h3 className="font-serif font-bold text-xs sm:text-sm leading-snug text-gray-900 group-hover:text-[#0069f7] transition line-clamp-2">
                {article.title}
              </h3>
            </Link>
          </div>
          <p className="text-gray-500 text-[11px] line-clamp-1 mt-1 hidden sm:block font-sans">
            {article.summary}
          </p>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="py-2.5 border-b border-[#eef4fc] hover:bg-[#eaf2ff]/30 px-2 rounded-xs transition">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1 font-sans">
          <span className="text-[#0069f7] font-bold uppercase">{article.category}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
        <Link href={`/article/${article.id}`}>
          <h4 className="font-serif font-bold text-xs sm:text-[13px] leading-snug text-gray-800 hover:text-[#0069f7] transition line-clamp-2">
            {article.title}
          </h4>
        </Link>
      </article>
    );
  }

  // Standard vertical card
  return (
    <article className="group bg-white border border-[#dbe7f5] rounded-xs overflow-hidden hover:shadow-xs transition flex flex-col h-full">
      <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 350px"
          className="object-cover object-center group-hover:scale-105 transition duration-300"
          unoptimized
        />
        <span className="absolute top-2 left-2 bg-[#0069f7] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs shadow-xs">
          {article.category}
        </span>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[10px] text-gray-500 mb-1.5 flex items-center gap-1 font-sans">
            <Clock className="w-2.5 h-2.5 text-[#0069f7]" />
            <span>{formattedDate}</span>
          </div>
          <Link href={`/article/${article.id}`}>
            <h3 className="font-serif font-bold text-sm leading-snug text-gray-900 group-hover:text-[#0069f7] transition line-clamp-2 mb-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed font-sans">
            {article.summary}
          </p>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100 text-[10px] text-gray-400 font-medium font-sans">
          By {article.author}
        </div>
      </div>
    </article>
  );
}
