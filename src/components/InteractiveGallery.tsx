/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SpecialMemory } from "../types";
import { X, Heart, Sparkles } from "lucide-react";

interface InteractiveGalleryProps {
  memories: SpecialMemory[];
}

export const InteractiveGallery: React.FC<InteractiveGalleryProps> = ({
  memories,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<SpecialMemory | null>(null);

  const getRotationClass = (index: number) => {
    const rotations = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2"];
    return rotations[index % rotations.length];
  };

  const getWashiStyle = (index: number) => {
    const tapes = [
      "bg-rose-200/40 border-dashed border-rose-300/30",
      "bg-amber-200/40 border-dashed border-amber-300/30",
      "bg-teal-200/40 border-dashed border-teal-300/30",
      "bg-purple-200/40 border-dashed border-purple-300/30",
    ];
    return tapes[index % tapes.length];
  };

  return (
    <div id="gallery-root" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-2">
        {memories.map((memory, index) => {
          const rotation = getRotationClass(index);
          const washiColor = getWashiStyle(index);
          
          return (
            <motion.div
              key={memory.id}
              id={`gallery-card-${memory.id}`}
              whileHover={{ y: -8, scale: 1.03, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative bg-white text-stone-900 p-4 pb-8 shadow-xl rounded-sm border border-stone-200/60 cursor-pointer transform ${rotation} hover:shadow-2xl transition-all duration-300 flex flex-col justify-between`}
              onClick={() => setSelectedMemory(memory)}
            >
              {/* Semi-transparent tape stuck at the top center */}
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 ${washiColor} border-x rotate-1 z-10 opacity-90 shadow-sm`} />

              {/* Photo Area with a thin frame */}
              <div className="aspect-[4/3] w-full rounded-sm overflow-hidden border border-stone-200 relative group bg-stone-50">
                <img
                  src={memory.photo}
                  alt={memory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Vintage Polaroid chemical overlay */}
                <div className="absolute inset-0 bg-amber-500/5 mix-blend-color-burn" />
                
                {/* Category Stamp overlay */}
                <div className="absolute bottom-2 left-2 z-10">
                  <span className="px-2 py-0.5 bg-black/75 text-[9px] font-mono rounded text-stone-100 uppercase tracking-widest font-semibold border border-stone-600">
                    {memory.category === "kiss" && "Beijo 💋"}
                    {memory.category === "trip" && "Viagem ✈️"}
                    {memory.category === "anniversary" && "Aniversário 🎂"}
                    {memory.category === "unforgettable" && "Inesquecível ✨"}
                  </span>
                </div>
              </div>

              {/* Polaroid bottom annotation margin */}
              <div className="mt-4 text-center">
                <h4 className="text-xl font-handwritten text-stone-800 font-bold leading-tight group-hover:text-rose-600 transition-colors">
                  {memory.title}
                </h4>
                <p className="text-[11px] text-stone-500 font-mono mt-1 font-bold">
                  Clique para ler a história 📖
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Immersion Modal (Vintage diary style) */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            id="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8"
          >
            {/* Close Trigger */}
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 p-3 bg-stone-900/90 hover:bg-rose-600 text-white rounded-full border border-stone-800 transition-all z-50 cursor-pointer shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#faf6eb] text-stone-900 rounded-3xl border-4 border-double border-amber-900/20 max-w-4xl w-full overflow-hidden shadow-2xl relative paper-texture max-h-[90vh] overflow-y-auto"
            >
              {/* Gold edge ornament for the detailed viewer sheet */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-900/10 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-900/10 rounded-tr-lg pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Polaroid photo display on left pane */}
                <div className="p-6 flex flex-col items-center justify-center bg-stone-100/50 border-r border-stone-200">
                  <div className="p-4 pb-12 bg-white text-stone-900 shadow-xl border border-stone-200/80 rounded-sm w-full max-w-md transform -rotate-1">
                    <div className="aspect-[4/3] w-full rounded-sm overflow-hidden border border-stone-200 relative bg-stone-50">
                      <img
                        src={selectedMemory.photo}
                        alt={selectedMemory.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-amber-500/5 mix-blend-color-burn" />
                    </div>
                    <div className="mt-4 text-center font-handwritten text-2xl text-stone-700 font-bold tracking-tight">
                      {selectedMemory.title} ✨
                    </div>
                  </div>
                </div>

                {/* Narrative content on right pane */}
                <div className="p-8 md:p-10 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-full bg-rose-100 border border-rose-200">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                      </span>
                      <span className="text-xs font-mono font-bold tracking-wider text-rose-600 uppercase">
                        Crônica de Amor Selada
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-serif font-black text-stone-900 tracking-tight leading-tight">
                      {selectedMemory.title}
                    </h3>

                    <div className="w-16 h-[1.5px] bg-amber-900/20" />

                    <p className="text-sm md:text-base text-stone-700 leading-relaxed font-serif italic whitespace-pre-wrap">
                      &ldquo;{selectedMemory.description}&rdquo;
                    </p>
                  </div>

                  <div className="pt-8 border-t border-stone-200/80 flex items-center justify-between mt-8">
                    <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-widest">
                      MARCAÇÃO: {selectedMemory.category.toUpperCase()}
                    </span>
                    
                    <button
                      onClick={() => setSelectedMemory(null)}
                      className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-amber-50 font-serif font-semibold text-xs rounded-full shadow-lg transition-all cursor-pointer"
                    >
                      Guardar Foto
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
