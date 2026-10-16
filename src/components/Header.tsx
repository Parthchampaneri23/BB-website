'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const [currentTimeString, setCurrentTimeString] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const timePart = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setCurrentTimeString(`${datePart} | ${timePart} IST`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const primaryNavItems = [
    { label: 'HOME', href: '/' },
    { label: 'THE SMART INVESTOR', href: '/category/smart-investor' },
    { label: 'COMPANIES', href: '/category/companies' },
    { label: 'OPINION', href: '/category/opinion' },
    { label: 'MARKET', href: '/category/markets' },
    { label: 'ECONOMY', href: '/category/economy' },
    { label: 'PF', href: '/category/pf' },
    { label: 'TECHNOLOGY', href: '/category/technology' },
    { label: 'SPORTS', href: '/category/cricket' },
  ];

  const moreCategories = [
    {
      title: 'Home',
      href: '/',
      isHome: true,
      subLinks: [
        { name: 'Top Headlines', href: '/' },
        { name: 'Breaking News', href: '/' },
        { name: 'Live Updates', href: '/' },
      ]
    },
    {
      title: 'Smart Investor',
      href: '/category/smart-investor',
      subLinks: [
        { name: 'Wealth & Investment', href: '/category/smart-investor' },
        { name: 'Mutual Funds & SIP', href: '/category/smart-investor' },
        { name: 'Portfolio Strategy', href: '/category/smart-investor' },
      ]
    },
    {
      title: 'Companies',
      href: '/category/companies',
      subLinks: [
        { name: 'Corporate Earnings', href: '/category/companies' },
        { name: 'Mergers & Acquisitions', href: '/category/companies' },
        { name: 'Executive Leadership', href: '/category/companies' },
      ]
    },
    {
      title: 'Opinion',
      href: '/category/opinion',
      subLinks: [
        { name: 'Editorials', href: '/category/opinion' },
        { name: 'Guest Columns', href: '/category/opinion' },
        { name: 'Analysis & Commentary', href: '/category/opinion' },
      ]
    },
    {
      title: 'Market',
      href: '/category/markets',
      subLinks: [
        { name: 'Stock Market News', href: '/category/markets' },
        { name: 'BSE & NSE Indices', href: '/category/markets' },
        { name: 'Stock Movements & IPOs', href: '/category/markets' },
      ]
    },
    {
      title: 'Economy',
      href: '/category/economy',
      subLinks: [
        { name: 'Macro Trends & Inflation', href: '/category/economy' },
        { name: 'Fiscal & Monetary Policy', href: '/category/economy' },
        { name: 'RBI Announcements', href: '/category/economy' },
      ]
    },
    {
      title: 'Personal Finance (PF)',
      href: '/category/pf',
      subLinks: [
        { name: 'Retirement & Senior Living', href: '/category/pf' },
        { name: 'Income Tax & Deductions', href: '/category/pf' },
        { name: 'EPFO & Pension Funds', href: '/category/pf' },
      ]
    },
    {
      title: 'Technology',
      href: '/category/technology',
      subLinks: [
        { name: 'Tech News & Updates', href: '/category/technology' },
        { name: 'AI & Enterprise Software', href: '/category/technology' },
        { name: 'Startups & Ventures', href: '/category/technology' },
      ]
    },
    {
      title: 'Sports',
      href: '/category/cricket',
      subLinks: [
        { name: 'Cricket & Tournaments', href: '/category/cricket' },
        { name: 'Football & ISL', href: '/category/cricket' },
        { name: 'Global & Olympic Sports', href: '/category/cricket' },
      ]
    }
  ];

  return (
    <header className="bg-white border-b border-[#dbe7f5] sticky top-0 z-50 font-sans shadow-xs">
      {/* 1. TOP LIVE REAL-TIME DATE & TIME BAR */}
      <div className="border-b border-[#eef4fb] bg-[#fafcff]">
        <div className="max-w-[1240px] mx-auto px-4 py-1 text-[11px] font-sans font-bold text-[#01142e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0069f7] animate-pulse"></span>
            <span>{currentTimeString || 'Loading live time...'}</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#0069f7] hidden sm:inline">
            BusinessBulletin Daily
          </span>
        </div>
      </div>

      {/* 2. MAIN BRANDING ROW: Hamburger (left), Centered Logo SVG / image, Search Icon (right) */}
      <div className="max-w-[1240px] mx-auto px-4 py-2 sm:py-3 flex items-center justify-between relative">
        {/* Left: 3-line Hamburger Menu Button */}
        <div className="flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 -ml-1 text-[#01142e] hover:text-[#0069f7] transition focus:outline-none flex flex-col justify-center gap-1 w-8 h-8 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <span className="block h-[2.5px] w-6 bg-[#01142e]"></span>
            <span className="block h-[2.5px] w-6 bg-[#01142e]"></span>
            <span className="block h-[2.5px] w-6 bg-[#01142e]"></span>
          </button>
        </div>

        {/* Center: Official BusinessBulletin Brand Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <Link href="/" className="inline-flex items-center justify-center group py-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bb-logo.png"
              alt="BusinessBulletin Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-xs group-hover:opacity-95 transition"
            />
          </Link>
        </div>

        {/* Right: Search Icon */}
        <div className="flex items-center">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 text-[#01142e] hover:text-[#0069f7] transition focus:outline-none cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Search Input Dropdown */}
      {searchOpen && (
        <div className="border-t border-b border-[#dbe7f5] bg-[#f5f8fc] px-4 py-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
              }
            }}
            className="max-w-xl mx-auto flex items-center gap-2"
          >
            <input
              type="text"
              autoFocus
              placeholder="Search companies, markets, stocks, news in BusinessBulletin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm bg-white border border-[#c9daf2] rounded px-3 py-1.5 focus:outline-none focus:border-[#0069f7]"
            />
            <button
              type="submit"
              className="bg-[#0069f7] text-white px-4 py-1.5 text-xs font-bold uppercase rounded hover:bg-[#0053c7] cursor-pointer transition shadow-xs"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 3. HORIZONTAL NAVBAR: Primary categories spanning full width + MORE button */}
      <nav className="border-t border-[#dbe7f5] bg-white">
        <div className="max-w-[1240px] mx-auto px-4">
          <ul className="flex items-center justify-between overflow-x-auto no-scrollbar gap-1 sm:gap-2">
            {primaryNavItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <li key={item.label} className="shrink-0">
                  <Link
                    href={item.href}
                    className={`relative group inline-flex items-center py-2.5 px-1.5 sm:px-2 md:px-2.5 text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-normal transition-all duration-200 ${
                      isActive
                        ? 'text-[#0069f7]'
                        : 'text-[#1e293b] hover:text-[#0069f7]'
                    }`}
                  >
                    <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                      {item.label}
                    </span>
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ease-out ${
                        isActive
                          ? 'bg-[#0069f7] opacity-100 scale-x-100'
                          : 'bg-[#0069f7] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}

            {/* MORE button */}
            <li className="shrink-0">
              <button
                onClick={() => setMenuOpen(true)}
                className="relative group inline-flex items-center gap-1.5 py-2.5 px-2 text-[12px] sm:text-[12.5px] font-semibold uppercase text-[#1e293b] hover:text-[#0069f7] transition-all duration-200 cursor-pointer"
              >
                <span className="transition-transform duration-200 group-hover:-translate-y-0.5 flex items-center gap-1">
                  <span>MORE</span>
                  <span className="tracking-widest font-bold text-xs text-[#0069f7]">•••</span>
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0069f7] rounded-full opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 ease-out" />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 4. MORE / HAMBURGER OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in fade-in duration-200">
          {/* Top Bar with close button */}
          <div className="border-b border-[#dbe7f5] bg-[#fafcff]">
            <div className="max-w-[1240px] mx-auto px-6 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/bb-logo.png" alt="BusinessBulletin" className="h-7 w-auto object-contain" />
                <span className="text-gray-400">|</span>
                <span className="text-[#01142e] font-semibold">Categories & Sections</span>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 hover:text-[#0069f7] text-[#01142e] transition flex items-center gap-1 text-xs font-bold uppercase cursor-pointer"
                aria-label="Close menu"
              >
                <span>Close</span>
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Grid of categories in MORE */}
          <div className="max-w-[1240px] mx-auto px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 font-sans">
              {moreCategories.map((cat) => (
                <div key={cat.title} className="space-y-3">
                  <div className="border-b-2 border-[#0069f7] pb-1">
                    <Link
                      href={cat.href}
                      onClick={() => setMenuOpen(false)}
                      className={`font-serif font-bold text-base tracking-tight hover:text-[#0069f7] transition ${cat.isHome ? 'text-[#0069f7]' : 'text-[#01142e]'
                        }`}
                    >
                      {cat.title}
                    </Link>
                  </div>

                  <ul className="space-y-2 text-xs text-gray-700 pt-1">
                    {cat.subLinks.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          onClick={() => setMenuOpen(false)}
                          className="hover:text-[#0069f7] hover:underline block leading-relaxed"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <Link
                      href={cat.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-[11px] font-bold text-[#0069f7] hover:underline uppercase tracking-wider"
                    >
                      View All in {cat.title} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
