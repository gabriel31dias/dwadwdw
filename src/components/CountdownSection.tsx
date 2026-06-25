/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Play } from "lucide-react";

interface CountdownSectionProps {
  onComplete: () => void;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  onComplete,
}) => {
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!started) return;

    if (count > 0) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      // Complete!
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [started, count, onComplete]);

  return (
    <div id="countdown-root" className="w-full max-w-md mx-auto text-center p-6 space-y-8">
      <AnimatePresence mode="wait">
        {!started ? (
          /* INITIAL MYSTERY PROMPT */
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <span className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-full animate-pulse">
                <Sparkles className="w-8 h-8 text-rose-400" />
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xl md:text-2xl font-bold text-rose-100 tracking-tight leading-snug">
                Existe algo muito importante que eu preciso te perguntar...
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Pressione o botão abaixo para revelar o próximo passo da nossa história.
              </p>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm rounded-full flex items-center gap-2 mx-auto shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" /> Revelar Pergunta ❤️
            </button>
          </motion.div>
        ) : (
          /* ACTIVE ANIMATED COUNTDOWN */
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[160px]"
          >
            <AnimatePresence mode="wait">
              {count > 0 ? (
                <motion.div
                  key={count}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0, 1, 0.8] }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.0, ease: "easeInOut" }}
                  className="text-7xl md:text-8xl font-black text-rose-500 font-mono select-none"
                >
                  {count}
                </motion.div>
              ) : (
                <motion.div
                  key="prepare"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
                >
                  Pronto(a)? ❤️
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
