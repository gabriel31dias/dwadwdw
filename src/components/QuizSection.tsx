/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QuizQuestion } from "../types";
import { romanticSynth } from "../utils/audioSynth";
import { HelpCircle, Heart, Lock, Mail, Star, RefreshCw } from "lucide-react";

interface QuizSectionProps {
  quiz: QuizQuestion[];
  secretLetter: {
    title: string;
    content: string;
    unlockedByQuiz: boolean;
  };
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  quiz,
  secretLetter,
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answersStatus, setAnswersStatus] = useState<boolean[]>([]); // track correct/wrong answers
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  const currentQuestion = quiz[currentQuestionIdx];

  const handleOptionClick = (optionIdx: number) => {
    if (isAnswered) return;
    
    setSelectedOptionIdx(optionIdx);
    setIsAnswered(true);

    const correct = optionIdx === currentQuestion.correctIndex;
    const newStatus = [...answersStatus, correct];
    setAnswersStatus(newStatus);

    if (correct) {
      setScore((prev) => prev + 1);
      // Play beautiful audio success chime
      romanticSynth.triggerHeartSound();
    }

    // Wait 2 seconds and proceed
    setTimeout(() => {
      if (currentQuestionIdx + 1 < quiz.length) {
        setCurrentQuestionIdx((prev) => prev + 1);
        setSelectedOptionIdx(null);
        setIsAnswered(false);
      } else {
        setIsQuizCompleted(true);
      }
    }, 2000);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setScore(0);
    setAnswersStatus([]);
    setIsQuizCompleted(false);
    setIsLetterOpen(false);
  };

  return (
    <div id="quiz-root" className="w-full max-w-xl mx-auto p-4 md:p-6 bg-white/80 rounded-3xl border border-stone-200 shadow-xl backdrop-blur-sm">
      
      {/* Current Score Badges */}
      <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-3">
        <span className="text-xs font-serif uppercase tracking-wider text-stone-500 font-bold">
          Love Trivia do Casal
        </span>
        <div className="flex gap-1.5">
          {quiz.map((_, idx) => {
            const answered = idx < answersStatus.length;
            const wasCorrect = answered ? answersStatus[idx] : null;

            return (
              <motion.div
                key={idx}
                initial={{ scale: 0.8 }}
                animate={{ scale: answered ? 1.25 : 1 }}
                className="w-6 h-6 flex items-center justify-center rounded-full"
              >
                {wasCorrect === true && (
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                )}
                {wasCorrect === false && (
                  <Heart className="w-5 h-5 text-stone-300 fill-stone-300" />
                )}
                {wasCorrect === null && (
                  <Heart className="w-5 h-5 text-stone-200 fill-stone-100" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isQuizCompleted ? (
          /* ACTIVE QUESTIONS */
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Question Text */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-rose-500 font-bold">
                Pergunta {currentQuestionIdx + 1} de {quiz.length}
              </span>
              <h4 className="text-xl font-serif font-black text-stone-800 leading-snug">
                {currentQuestion.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let buttonStyle = "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700 hover:border-stone-300";
                
                if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                    buttonStyle = "bg-emerald-50 border-emerald-400 text-emerald-800";
                  } else if (idx === selectedOptionIdx) {
                    buttonStyle = "bg-rose-50 border-rose-400 text-rose-800";
                  } else {
                    buttonStyle = "bg-stone-50/40 border-stone-100 text-stone-300 opacity-40";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full p-4 rounded-xl text-left border text-sm font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer shadow-sm ${buttonStyle}`}
                  >
                    <span className="font-serif">{option}</span>
                    {isAnswered && idx === currentQuestion.correctIndex && (
                      <Heart className="w-4.5 h-4.5 text-emerald-500 fill-emerald-500 animate-bounce" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint Panel */}
            <div className="p-3 bg-[#faf6eb] rounded-xl border border-amber-900/10 flex gap-2.5 items-start text-xs text-stone-600">
              <HelpCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span className="font-serif italic">&ldquo;Dica: {currentQuestion.hint}&rdquo;</span>
            </div>
          </motion.div>
        ) : (
          /* COMPLETION RESULTS & LOVE LETTER */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-6"
          >
            <div className="space-y-2">
              <h4 className="text-3xl font-serif font-black text-stone-800">
                Fim da Brincadeira! 🎉
              </h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto font-serif">
                Você provou sua memória de ouro! Acertou <strong className="text-rose-500 font-bold">{score} de {quiz.length}</strong> recordações sobre nossa linda história!
              </p>
            </div>

            {/* Unlocking Logic for Secret Letter */}
            {score === quiz.length ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: [0, -1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    onClick={() => setIsLetterOpen(true)}
                    className="p-6 bg-rose-50/80 border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-3xl cursor-pointer transition-all flex flex-col items-center gap-3 relative max-w-xs shadow-lg group hover:bg-rose-100/50"
                  >
                    {/* Glowing Envelope / Letter Lock */}
                    <div className="p-4 bg-rose-500 rounded-full text-white shadow-md shadow-rose-300 group-hover:scale-105 transition-transform">
                      <Mail className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-handwritten font-black text-rose-800">
                      {secretLetter.title}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono tracking-widest font-bold uppercase">
                      Toque para Abrir ✉️
                    </span>
                  </motion.div>
                </div>

                {/* Fullscreen Letter Popup */}
                <AnimatePresence>
                  {isLetterOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ y: 50, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 50, scale: 0.95 }}
                        className="bg-[#fcfaf2] text-stone-950 p-8 md:p-12 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl relative border-8 border-double border-stone-200 paper-texture"
                      >
                        {/* Decorative Red Wax Seal */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-700 text-white font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md">
                          <Star className="w-3 h-3 fill-white" /> SELO DE AMOR
                        </div>

                        <div className="font-serif space-y-6">
                          <h3 className="text-3xl font-serif font-black text-stone-900 border-b border-stone-300 pb-3">
                            {secretLetter.title}
                          </h3>
                          <p className="text-stone-800 leading-relaxed text-base md:text-lg whitespace-pre-line text-left italic font-serif">
                            {secretLetter.content}
                          </p>
                        </div>

                        <div className="mt-8 pt-4 border-t border-stone-300 text-right">
                          <button
                            onClick={() => setIsLetterOpen(false)}
                            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-50 font-bold text-xs rounded-full shadow transition-all cursor-pointer font-serif"
                          >
                            Guardar Carta Secreta ✉️
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* LOCKED LETTER (Under 100% Score) */
              <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/80 max-w-md mx-auto space-y-4 shadow-sm">
                <div className="flex justify-center text-stone-400">
                  <div className="p-3 bg-stone-100 rounded-full border border-stone-200">
                    <Lock className="w-8 h-8 text-stone-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h5 className="font-serif font-black text-stone-800 text-lg">
                    Carta Secreta Bloqueada 🔒
                  </h5>
                  <p className="text-xs text-stone-500 font-serif">
                    Você precisa acertar todas as <strong className="text-rose-500 font-bold">{quiz.length}</strong> recordações para derreter meu coração e liberar o envelope oculto!
                  </p>
                </div>
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-full flex items-center gap-1.5 mx-auto shadow-lg shadow-rose-300 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reabrir Quiz e Tentar de Novo
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
