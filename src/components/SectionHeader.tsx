import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  href?: string;
}

export default function SectionHeader({
  title,
  linkText = "See all",
  href
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-t-4 border-[#01142e] border-b border-[#dbe7f5] py-2 mb-4 mt-8 font-sans">
      <div className="relative">
        <h2 className="font-sans font-black text-lg sm:text-xl text-[#01142e] uppercase tracking-tight">
          {title}
        </h2>
        <div className="absolute -bottom-2.5 left-0 w-full h-[2px] bg-[#0069f7]" />
      </div>

      {href && (
        <Link
          href={href}
          className="group flex items-center gap-1 text-[11px] font-bold text-gray-700 hover:text-[#0069f7] italic transition"
        >
          <span>{linkText}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0069f7] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
