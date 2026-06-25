/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CoupleInfo, PartnerResponse } from "../types";
import { romanticSynth } from "../utils/audioSynth";
import { Heart, Sparkles, Send, CheckCircle2 } from "lucide-react";

interface ProposalSectionProps {
  couple: CoupleInfo;
  onSaveResponse: (resp: PartnerResponse) => void;
  savedResponse?: PartnerResponse | null;
}

export const ProposalSection: React.FC<ProposalSectionProps> = ({
  couple,
  onSaveResponse,
  savedResponse,
}) => {
  const [accepted, setAccepted] = useState(false);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubmitted, setReplySubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (savedResponse?.accepted) {
      setAccepted(true);
      if (savedResponse.message) {
        setReplyMessage(savedResponse.message);
        setReplySubmitted(true);
      }
    }
  }, [savedResponse]);

  // Handle the flying "NÃO" button (moves randomly when hovered)
  const handleNoHover = () => {
    // Generate a random translation between -120px and 120px
    const randomX = Math.floor(Math.random() * 240) - 120;
    const randomY = Math.floor(Math.random() * 160) - 80;
    setNoOffset({ x: randomX, y: randomY });
  };

  const handleAccept = () => {
    setAccepted(true);
    romanticSynth.setVolume(1.0); // Pump up the romantic synth volume
    romanticSynth.triggerConfettiExplosion(); // Play explosion audio chord

    // Callback
    onSaveResponse({
      accepted: true,
      timestamp: new Date().toISOString(),
      message: replyMessage,
    });
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReplySubmitted(true);
    onSaveResponse({
      accepted: true,
      timestamp: new Date().toISOString(),
      message: replyMessage,
    });
  };

  // Fireworks and Heart confetti canvas simulation when accepted
  useEffect(() => {
    if (!accepted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class definition
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      isHeart: boolean;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 1.5; // slight upward drift
        this.size = Math.random() * 6 + 3;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.015 + 0.008;
        this.isHeart = Math.random() > 0.4;

        const colors = ["#f43f5e", "#ec4899", "#d946ef", "#e11d48", "#ffccd5", "#fbcfe8"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08; // gravity
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;
        
        if (this.isHeart) {
          c.beginPath();
          const s = this.size * 1.5;
          const topCurveHeight = s * 0.3;
          c.moveTo(this.x, this.y + topCurveHeight);
          c.bezierCurveTo(this.x - s / 2, this.y - topCurveHeight, this.x - s, this.y + topCurveHeight, this.x, this.y + s);
          c.bezierCurveTo(this.x + s, this.y + topCurveHeight, this.x + s / 2, this.y - topCurveHeight, this.x, this.y + topCurveHeight);
          c.closePath();
          c.fill();
        } else {
          c.beginPath();
          c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      }
    }

    const particles: Particle[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Spawn initial explosion bursts
    for (let i = 0; i < 4; i++) {
      const burstX = Math.random() * width;
      const burstY = Math.random() * (height * 0.6);
      for (let p = 0; p < 35; p++) {
        particles.push(new Particle(burstX, burstY));
      }
    }

    // Interval to spawn passive background fireworks
    const spawnTimer = setInterval(() => {
      const bX = Math.random() * width;
      const bY = Math.random() * (height * 0.7);
      for (let p = 0; p < 25; p++) {
        particles.push(new Particle(bX, bY));
      }
    }, 1500);

    const run = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      animationId = requestAnimationFrame(run);
    };

    run();

    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [accepted]);

  return (
    <div id="proposal-section-root" className="relative w-full max-w-2xl mx-auto z-10">
      {/* Absolute fullscreen firework canvas overlay */}
      {accepted && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-40"
        />
      )}

      <AnimatePresence mode="wait">
        {!accepted ? (
          /* THE PROPOSAL OFFER SCREEN */
          <motion.div
            key="ask"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-neutral-950/80 border-2 border-rose-500/25 rounded-3xl p-6 md:p-10 text-center shadow-2xl relative overflow-hidden space-y-8 backdrop-blur-md"
          >
            {/* Soft pink top overlay glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-violet-500 to-rose-500" />

            {/* Couple Cover Photo */}
            <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden border-4 border-rose-500/30 shadow-xl shadow-rose-500/10 relative">
              <img
                src={couple.coverPhoto}
                alt={`${couple.partner1} & ${couple.partner2}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-rose-500/5 mix-blend-color-burn" />
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex justify-center gap-1.5 text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
                <Sparkles className="w-5 h-5" />
                <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {couple.proposalType === "namoro"
                  ? "Quer namorar comigo?"
                  : "Quer se casar comigo?"}
              </h2>

              <p className="text-sm md:text-base text-gray-300 leading-relaxed italic">
                &ldquo;Cada momento ao seu lado fez minha vida mais feliz. Você transformou meus dias e me mostrou o que é amar de verdade. Quer continuar escrevendo nossa história juntos?&rdquo;
              </p>
            </div>

            {/* Dual Option Interactive Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 relative min-h-[80px]">
              {/* Massive Glowing SIM Button */}
              <motion.button
                id="btn-yes-proposal"
                onClick={handleAccept}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white font-black text-lg rounded-full shadow-2xl shadow-rose-500/40 cursor-pointer flex items-center gap-2 border border-white/20 z-10"
              >
                <Heart className="w-6 h-6 fill-white" /> SIM! ❤️
              </motion.button>

              {/* Humorous Flying NO Button */}
              <motion.button
                id="btn-no-proposal"
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                animate={{ x: noOffset.x, y: noOffset.y }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
                className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-gray-400 font-bold text-sm rounded-full border border-gray-800 z-10 shadow cursor-pointer whitespace-nowrap"
              >
                Não 😢
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* THE SUCCESS / ACCEPTED SCREEN */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-950/90 border-2 border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative space-y-8 backdrop-blur-md z-30"
          >
            <div className="flex justify-center text-emerald-400">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20"
              >
                <Heart className="w-12 h-12 fill-emerald-500 text-emerald-500 animate-pulse" />
              </motion.div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                ELA(E) DISSE SIM! 🎉💍
              </h2>
              <p className="text-sm md:text-base text-gray-300 max-w-md mx-auto leading-relaxed">
                O dia mais feliz de todos! Nossos corações agora batem no mesmo compasso oficial. Cada segundo daqui para frente será uma promessa de carinho, cumplicidade e risadas infinitas.
              </p>
            </div>

            {/* Custom Reply Form */}
            {!replySubmitted ? (
              <form
                onSubmit={handleReplySubmit}
                className="bg-neutral-900/60 p-6 rounded-2xl border border-rose-500/10 max-w-md mx-auto space-y-4 text-left"
              >
                <label className="block text-xs font-mono uppercase tracking-wider text-rose-300">
                  Escreva um bilhete de amor para selar esse sim:
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Ex: Sim, mil vezes sim! Mal posso esperar para passar todos os meus dias com você... ❤️"
                  maxLength={500}
                  rows={3}
                  className="w-full p-3 bg-neutral-950 border border-gray-800 focus:border-rose-500 rounded-xl text-sm text-gray-200 outline-none resize-none transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar Resposta de Amor
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/20 max-w-md mx-auto space-y-3 text-center"
              >
                <div className="flex justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h5 className="font-bold text-white text-sm">
                  Bilhete de Amor Registrado com Sucesso!
                </h5>
                <p className="text-xs text-gray-400 italic">
                  &ldquo;{replyMessage}&rdquo;
                </p>
              </motion.div>
            )}

            <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest pt-4">
              Música de Fundo Oficial: Romantic Synth Loop
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
