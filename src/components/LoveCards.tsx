/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { LoveQuality } from "../types";
import { Smile, Heart, Sparkles, Sun, HelpCircle } from "lucide-react";

interface LoveCardsProps {
  qualities: LoveQuality[];
}

export const LoveCards: React.FC<LoveCardsProps> = ({ qualities }) => {
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "Smile":
        return <Smile className="w-8 h-8 text-rose-400" />;
      case "Heart":
        return <Heart className="w-8 h-8 text-rose-400 fill-rose-500/20" />;
      case "Sparkles":
        return <Sparkles className="w-8 h-8 text-rose-400" />;
      case "Sun":
        return <Sun className="w-8 h-8 text-rose-400 animate-spin-slow" />;
      default:
        return <HelpCircle className="w-8 h-8 text-rose-400" />;
    }
  };

  return (
    <div id="love-cards-root" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {qualities.map((quality) => {
          const isFlipped = flipped[quality.id] || false;

          return (
            <div
              key={quality.id}
              id={`quality-card-${quality.id}`}
              className="w-full h-72 [perspective:1000px] cursor-pointer group"
              onClick={() => toggleFlip(quality.id)}
            >
              <motion.div
                className="relative w-full h-full preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
              >
                {/* CARD FRONT (Envelope cover style) */}
                <div className="card-face rounded-2xl bg-white border border-stone-200 flex flex-col items-center justify-center p-6 text-center shadow-md overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                  {/* Faux envelope triangular flap visual */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-stone-100 to-white border-b border-stone-200 flex items-center justify-center" />
                  
                  {/* Sealed Wax Stamp or Heart sticker */}
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="relative w-16 h-16 rounded-full bg-rose-500 border-4 border-white flex items-center justify-center mb-3 shadow-md z-10"
                  >
                    <Heart className="w-7 h-7 text-white fill-white animate-pulse" />
                  </motion.div>

                  <span className="text-[10px] font-mono tracking-widest text-rose-500 font-bold uppercase">
                    Carta Selada ✉️
                  </span>
                  
                  <h4 className="text-xl font-handwritten font-black text-stone-800 mt-2">
                    O que eu amo em você...
                  </h4>
                  
                  <p className="text-xs text-stone-500 mt-2 italic font-serif">
                    Toque no envelope para ler ❤️
                  </p>
                </div>

                {/* CARD BACK (Handwritten letter content style) */}
                <div className="card-face card-back rounded-2xl bg-[#fff2f4] border-2 border-rose-300 flex flex-col items-center justify-center p-6 text-center shadow-lg paper-texture">
                  {/* Cute floral paper corner */}
                  <div className="absolute top-3 right-3 text-rose-300">🌸</div>
                  <div className="absolute bottom-3 left-3 text-rose-300">🌸</div>
                  
                  {/* Romantic Icon */}
                  <div className="p-2.5 bg-rose-100 rounded-full border border-rose-200 mb-3">
                    {getIcon(quality.icon)}
                  </div>
                  
                  <h4 className="text-2xl font-handwritten font-black text-rose-600 leading-tight">
                    {quality.title}
                  </h4>
                  
                  <div className="w-12 h-[1px] bg-rose-300/60 my-2.5" />
                  
                  <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-serif italic max-w-xs">
                    &ldquo;{quality.description}&rdquo;
                  </p>
                  
                  <p className="text-[10px] text-rose-400 font-handwritten font-bold mt-4 uppercase tracking-widest">
                    Pressione para fechar ↩️
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
