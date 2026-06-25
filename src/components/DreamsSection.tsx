/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DreamItem } from "../types";
import { ChevronLeft, ChevronRight, Sparkles, Plane, Home, Calendar } from "lucide-react";

interface DreamsSectionProps {
  dreams: DreamItem[];
}

export const DreamsSection: React.FC<DreamsSectionProps> = ({ dreams }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % dreams.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + dreams.length) % dreams.length);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "viagem":
        return <Plane className="w-4 h-4 text-sky-400" />;
      case "casa":
        return <Home className="w-4 h-4 text-emerald-400" />;
      default:
        return <Calendar className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div id="dreams-root" className="w-full max-w-xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-stone-200 shadow-xl">
        <AnimatePresence mode="wait">
          {dreams.map((dream, index) => {
            if (index !== currentIndex) return null;

            return (
              <motion.div
                key={dream.id}
                id={`dream-item-${dream.id}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                {/* Visual Image */}
                <div className="h-64 md:h-72 relative">
                  <img
                    src={dream.photo}
                    alt={dream.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-stone-100 text-[10px] font-bold rounded-full uppercase tracking-wider z-10 border border-stone-800">
                    {getCategoryIcon(dream.category)}
                    {dream.category.toUpperCase()}
                  </span>
                </div>

                {/* Content Pane */}
                <div className="p-6 md:p-8 space-y-3 bg-white text-stone-900">
                  <h4 className="text-xl md:text-2xl font-serif font-black text-stone-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" /> {dream.title}
                  </h4>
                  <p className="text-sm text-stone-600 leading-relaxed font-serif italic">
                    &ldquo;{dream.description}&rdquo;
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-12 left-4 right-4 flex justify-between z-20 pointer-events-none">
          <button
            onClick={handlePrev}
            className="p-2 bg-stone-100 hover:bg-rose-500 hover:text-white rounded-full border border-stone-200 shadow-sm transition-all pointer-events-auto cursor-pointer text-stone-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-stone-100 hover:bg-rose-500 hover:text-white rounded-full border border-stone-200 shadow-sm transition-all pointer-events-auto cursor-pointer text-stone-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-1.5 pb-6 bg-white z-10">
          {dreams.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? "bg-rose-500 scale-125 shadow-sm" : "bg-stone-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Underlining Romantic Sentiment */}
      <div className="text-center mt-6 p-4 rounded-xl bg-rose-50/40 border border-rose-200/20 max-w-md mx-auto">
        <p className="text-xs text-rose-700 italic leading-relaxed font-serif">
          &ldquo;Tudo isso fica ainda mais especial quando imagino você ao meu lado construindo cada uma dessas metas.&rdquo;
        </p>
      </div>
    </div>
  );
};
