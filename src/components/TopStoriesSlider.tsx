'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/newsService';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface TopStoriesSliderProps {
  stories: Article[];
}

export default function TopStoriesSlider({ stories }: TopStoriesSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = Math.min(stories.length, 7);
  const currentStory = stories[currentIndex];

  // 5-second automatic rotation timer
  useEffect(() => {
    if (isPaused || total <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, total]);

  if (!currentStory) return null;

  const formattedDate = currentStory.pubDate ? new Date(currentStory.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Recently';

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <div
      className="relative flex flex-col h-full justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Active Story Card */}
      <article className="group bg-white rounded-xs overflow-hidden flex flex-col flex-1">
        {/* Main Image Stage */}
        <div className="relative w-full h-64 sm:h-80 md:h-[370px] bg-gray-900 overflow-hidden rounded-xs">
          <Image
            src={currentStory.imageUrl}
            alt={currentStory.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 750px"
            className="object-cover group-hover:scale-102 transition duration-500 ease-out"
            unoptimized
          />
          {/* Subtle gradient vignette at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Category Badge & Slide Counter */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <span className="bg-[#0069f7] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-md">
              {currentStory.categoryLabel || currentStory.category}
            </span>
          </div>

          <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono font-semibold px-2.5 py-1 rounded-xs z-10 border border-white/20">
            {currentIndex + 1} / {total}
          </div>

          {/* Prominent Always-Visible Slider Buttons on Image */}
          <div className="absolute inset-y-0 left-3 flex items-center z-20">
            <button
              onClick={handlePrev}
              aria-label="Previous story"
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-[#0069f7] text-[#01142e] hover:text-white transition duration-200 shadow-lg flex items-center justify-center border border-gray-200 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center z-20">
            <button
              onClick={handleNext}
              aria-label="Next story"
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-[#0069f7] text-[#01142e] hover:text-white transition duration-200 shadow-lg flex items-center justify-center border border-gray-200 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Story Details */}
        <div className="pt-4 pb-1 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-sans">
              <span className="font-semibold text-gray-800">{currentStory.author || 'BusinessBulletin Desk'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#0069f7]">
                <Clock className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            </div>

            <Link href={`/article/${currentStory.id}`}>
              <h2 className="font-serif font-bold text-xl sm:text-2xl md:text-[26px] leading-tight text-gray-900 group-hover:text-[#0069f7] transition-colors mb-2">
                {currentStory.title}
              </h2>
            </Link>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-sans">
              {currentStory.summary}
            </p>
          </div>

          {/* Centered Controls: Prominent Prev/Next Buttons + Slide Indicator Pills */}
          <div className="mt-4 pt-3 border-t border-[#eaf2ff] flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              aria-label="Previous story"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#dbe7f5] bg-white hover:bg-[#0069f7] text-gray-700 hover:text-white font-sans text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {/* Centered Navigation Pills */}
            <div className="flex items-center gap-1.5">
              {stories.slice(0, total).map((story, idx) => (
                <button
                  key={story.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-7 bg-[#0069f7]'
                      : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  title={story.title}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next story"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#dbe7f5] bg-white hover:bg-[#0069f7] text-gray-700 hover:text-white font-sans text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
