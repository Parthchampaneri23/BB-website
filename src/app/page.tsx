import React from 'react';
import { articles } from '@/lib/newsService';
import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import { TrendingUp, Flame, Award, Wallet, Building2, TrendingDown, Landmark } from 'lucide-react';

import TopStoriesSlider from '@/components/TopStoriesSlider';

export default function HomePage() {
  const homeStories = articles.filter(a => a.category === 'home' || a.category === 'latest');
  const marketStories = articles.filter(a => a.category === 'markets');
  const economyStories = articles.filter(a => a.category === 'economy');
  const pfStories = articles.filter(a => a.category === 'pf');
  const smartInvestorStories = articles.filter(a => a.category === 'smart-investor');
  const techStories = articles.filter(a => a.category === 'technology');
  const sportsStories = articles.filter(a => a.category === 'cricket');
  const companyStories = articles.filter(a => a.category === 'companies');
  const opinionStories = articles.filter(a => a.category === 'opinion');

  // Top 7 stories for the hero slider
  const top7Stories = [
    ...(homeStories.slice(0, 3)),
    ...(marketStories.slice(0, 1)),
    ...(economyStories.slice(0, 1)),
    ...(companyStories.slice(0, 1)),
    ...(sportsStories.slice(0, 1)),
  ].slice(0, 7);

  // Trending section: Exactly ONE news per key section
  const trendingSections = [
    { label: 'The Smart Investor', article: smartInvestorStories[0] },
    { label: 'Companies', article: companyStories[0] },
    { label: 'Opinion', article: opinionStories[0] },
    { label: 'Market', article: marketStories[0] },
    { label: 'Economy', article: economyStories[0] },
    { label: 'Personal Finance (PF)', article: pfStories[0] },
    { label: 'Technology', article: techStories[0] },
    { label: 'Sports', article: sportsStories[0] },
  ].filter(item => Boolean(item.article));

  return (
    <div className="space-y-6">
      {/* 1. TOP STORIES & SECTION-WISE TRENDING NEWS */}
      <section className="bg-white p-3 sm:p-5 border border-[#dbe7f5] rounded-xs shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Top Stories Slider (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#0069f7]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0069f7]" />
                <h2 className="font-serif font-black text-xl sm:text-2xl text-[#01142e] tracking-tight uppercase">
                  Top Stories
                </h2>
              </div>
              <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline">
                Live Editorial Feed
              </span>
            </div>

            <TopStoriesSlider stories={top7Stories} />
          </div>

          {/* Right Trending News: 1 News Per Section (4 cols) */}
          <div className="lg:col-span-4 bg-[#fbfdff] p-3.5 rounded-xs border border-[#dbe7f5] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#0069f7] mb-2 text-[#0069f7] font-bold text-xs uppercase tracking-wider font-sans">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-current text-[#0069f7]" />
                  <span className="text-[#01142e] font-extrabold">Trending News</span>
                </div>
                <span className="text-[10px] bg-[#0069f7]/10 text-[#0069f7] px-1.5 py-0.5 rounded-xs font-semibold">
                  By Section
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {trendingSections.map(({ label, article }) => (
                  <article key={article.id} className="py-2.5 hover:bg-[#eaf2ff]/30 px-2 rounded-xs transition group">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1 font-sans">
                      <span className="text-[#0069f7] font-extrabold uppercase tracking-wide">
                        {label}
                      </span>
                      <span className="text-gray-400">
                        {article.pubDate ? new Date(article.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                      </span>
                    </div>
                    <Link href={`/article/${article.id}`}>
                      <h4 className="font-serif font-bold text-xs sm:text-[13px] leading-snug text-gray-800 group-hover:text-[#0069f7] transition line-clamp-2">
                        {article.title}
                      </h4>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE SMART INVESTOR SECTION */}
      <section>
        <SectionHeader
          title="The Smart Investor"
          href="/category/smart-investor"
          linkText="Smart Investing & Wealth"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {smartInvestorStories.slice(0, 4).map((story) => (
            <ArticleCard key={story.id} article={story} variant="standard" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {smartInvestorStories.slice(4, 8).map((story) => (
            <ArticleCard key={story.id} article={story} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* 3. COMPANIES SECTION */}
      <section>
        <SectionHeader
          title="Companies & Corporate"
          href="/category/companies"
          linkText="Corporate & Earnings Desk"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companyStories.slice(0, 4).map((story) => (
            <ArticleCard key={story.id} article={story} variant="standard" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {companyStories.slice(4, 8).map((story) => (
            <ArticleCard key={story.id} article={story} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* 4. OPINION & ANALYSIS */}
      <section>
        <SectionHeader
          title="Opinion & Editorials"
          href="/category/opinion"
          linkText="Explore All Opinions"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {opinionStories.slice(0, 4).map((story) => (
            <ArticleCard key={story.id} article={story} variant="standard" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {opinionStories.slice(4, 8).map((story) => (
            <ArticleCard key={story.id} article={story} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* 5. MARKET SECTION */}
      <section>
        <SectionHeader
          title="Market & Stock Exchange News"
          href="/category/markets"
          linkText="Explore All Market News"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketStories.slice(0, 4).map((story) => (
            <ArticleCard key={story.id} article={story} variant="standard" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {marketStories.slice(4, 8).map((story) => (
            <ArticleCard key={story.id} article={story} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* 6. ECONOMY & PERSONAL FINANCE (PF) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Economy Section (6 cols) */}
        <section className="lg:col-span-6">
          <SectionHeader
            title="Economy & Policy"
            href="/category/economy"
            linkText="Economy Desk"
          />
          <div className="bg-white border border-[#dbe7f5] p-3 rounded-xs">
            {economyStories.length > 0 && (
              <ArticleCard article={economyStories[0]} variant="featured" />
            )}
            <div className="mt-4 divide-y divide-gray-100">
              {economyStories.slice(1, 5).map((story) => (
                <ArticleCard key={story.id} article={story} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>

        {/* Personal Finance (PF) Section (6 cols) */}
        <section className="lg:col-span-6">
          <SectionHeader
            title="Personal Finance (PF)"
            href="/category/pf"
            linkText="View All PF News"
          />
          <div className="bg-white border border-[#dbe7f5] p-3 rounded-xs">
            {pfStories.length > 0 && (
              <ArticleCard article={pfStories[0]} variant="featured" />
            )}
            <div className="mt-4 divide-y divide-gray-100">
              {pfStories.slice(1, 5).map((story) => (
                <ArticleCard key={story.id} article={story} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 7. TECHNOLOGY & SPORTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6">
          <SectionHeader
            title="Technology"
            href="/category/technology"
            linkText="View Technology"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {techStories.slice(0, 4).map((story) => (
              <ArticleCard key={story.id} article={story} variant="standard" />
            ))}
          </div>
        </section>

        <section className="lg:col-span-6">
          <SectionHeader
            title="Sports"
            href="/category/cricket"
            linkText="Sports Desk"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sportsStories.slice(0, 4).map((story) => (
              <ArticleCard key={story.id} article={story} variant="standard" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
