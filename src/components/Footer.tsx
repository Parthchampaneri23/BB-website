import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const sections = [
    { name: 'Home', href: '/' },
    { name: 'Market', href: '/category/markets' },
    { name: 'Economy', href: '/category/economy' },
    { name: 'Personal Finance (PF)', href: '/category/pf' },
    { name: 'Smart Investor', href: '/category/smart-investor' },
    { name: 'Companies', href: '/category/companies' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Sports', href: '/category/cricket' },
    { name: 'Opinion', href: '/category/opinion' },
  ];

  return (
    <footer className="bg-[#01142e] text-white pt-10 pb-6 border-t-4 border-[#0069f7] mt-16 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#07244d]">
          {/* Brand info (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bb-logo.png"
                alt="BusinessBulletin Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 text-xs leading-relaxed max-w-lg">
              BusinessBulletin is your premier digital business daily newspaper. Providing in-depth analysis on stock markets, economy, industry trends, personal finance, policy decisions, technology, and sports.
            </p>
          </div>

          {/* Key Sections only (5 cols) */}
          <div className="md:col-span-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0069f7] mb-3 pb-1 border-b border-[#07244d]">
              Key Sections
            </h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-300">
              {sections.map((section) => (
                <li key={section.name}>
                  <Link
                    href={section.href}
                    className="hover:text-[#0069f7] hover:underline transition block py-0.5"
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-6 text-center sm:text-left text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} BusinessBulletin Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
