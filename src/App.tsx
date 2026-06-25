/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlbumConfig, PartnerResponse, TimelineEvent } from "./types";
import { defaultAlbumConfig } from "./defaultData";
import { decodeAlbum } from "./utils/urlSerializer";
import { romanticSynth } from "./utils/audioSynth";

// Component imports
import { StarsBackground } from "./components/StarsBackground";
import { RelationshipTree } from "./components/RelationshipTree";
import { MeetingMap } from "./components/MeetingMap";
import { InteractiveGallery } from "./components/InteractiveGallery";
import { LoveCards } from "./components/LoveCards";
import { DreamsSection } from "./components/DreamsSection";
import { QuizSection } from "./components/QuizSection";
import { CountdownSection } from "./components/CountdownSection";
import { ProposalSection } from "./components/ProposalSection";
import { CreatorPanel } from "./components/CreatorPanel";

// Lucide Icons
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Settings,
  X
} from "lucide-react";

export default function App() {
  const [config, setConfig] = useState<AlbumConfig>(defaultAlbumConfig);
  const [mode, setMode] = useState<"viewer" | "creator">("viewer");
  const [currentStage, setCurrentStage] = useState(0); // 0 (Welcome) to 8 (Proposal)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.5);
  const [savedResponse, setSavedResponse] = useState<PartnerResponse | null>(null);

  // Load custom album from URL parameter if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const albumParam = params.get("album");
    if (albumParam) {
      const decoded = decodeAlbum(albumParam);
      if (decoded) {
        setConfig(decoded);
        setMode("viewer");
      }
    } else {
      // If no custom album parameter is loaded, let them view the default album and offer a customization toggle
      setMode("viewer");
    }

    // Check localStorage for saved response from partner
    const saved = localStorage.getItem("nossa_historia_response");
    if (saved) {
      try {
        setSavedResponse(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      romanticSynth.stop();
      setIsPlayingAudio(false);
    } else {
      romanticSynth.start();
      romanticSynth.setVolume(audioVolume);
      setIsPlayingAudio(true);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAudioVolume(vol);
    romanticSynth.setVolume(vol);
  };

  const handleSavePartnerResponse = (response: PartnerResponse) => {
    setSavedResponse(response);
    localStorage.setItem("nossa_historia_response", JSON.stringify(response));

    // In a full production build, we could write this response to Firestore here if configured.
    // For now, saving in localStorage is safe, robust, and maintains immediate offline feedback.
  };

  // Helper to change stage and play interactive chime
  const navigateStage = (target: number) => {
    if (target >= 0 && target <= 8) {
      setCurrentStage(target);
      romanticSynth.triggerHeartSound();
      
      // Auto-start music if they step forward from Welcome screen (Stage 0) and it isn't playing yet
      if (target > 0 && !isPlayingAudio) {
        romanticSynth.start();
        romanticSynth.setVolume(audioVolume);
        setIsPlayingAudio(true);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative min-h-screen text-gray-100 flex flex-col font-sans overflow-x-hidden selection:bg-rose-500/30 selection:text-white">
      {/* Immersive Space Twinkling Star background with Floating Hearts */}
      <StarsBackground intensity={70} showHearts={currentStage >= 4} />

      {/* Persistent Audio Controller top-right */}
      <div id="audio-controller-bar" className="fixed top-4 right-4 z-40 flex items-center gap-3 p-2 bg-neutral-950/80 border border-rose-500/10 rounded-2xl shadow-xl backdrop-blur-md">
        <button
          onClick={handleAudioToggle}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isPlayingAudio ? "bg-rose-600 text-white" : "bg-neutral-900 text-gray-400 hover:text-white"
          }`}
          title="Música de Fundo"
        >
          {isPlayingAudio ? (
            <Volume2 className="w-4.5 h-4.5 animate-pulse" />
          ) : (
            <VolumeX className="w-4.5 h-4.5" />
          )}
        </button>
        {isPlayingAudio && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioVolume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 accent-rose-500 h-1 rounded-lg cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          />
        )}
      </div>

      {/* Main Mode Toggle Floating Badge at top-left (Only visible on initial root page) */}
      <div className="fixed top-4 left-4 z-40 flex gap-2">
        {mode === "viewer" ? (
          <button
            onClick={() => setMode("creator")}
            className="px-4 py-2 bg-neutral-950/80 hover:bg-rose-600 hover:text-white text-gray-300 font-bold text-xs rounded-xl border border-rose-500/15 flex items-center gap-1.5 cursor-pointer shadow-xl transition-all backdrop-blur-md"
          >
            <Settings className="w-4 h-4 text-rose-400" /> Customizar Álbum
          </button>
        ) : (
          <button
            onClick={() => setMode("viewer")}
            className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl border border-rose-500/25 flex items-center gap-1.5 cursor-pointer shadow-xl transition-all backdrop-blur-md"
          >
            <X className="w-4 h-4" /> Fechar Customizador
          </button>
        )}
      </div>

      {/* Main Application Content Wrapper */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-20 relative z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* CREATOR PANEL MODE */}
          {mode === "creator" ? (
            <motion.div
              key="creator"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              className="w-full"
            >
              <CreatorPanel
                config={config}
                onChange={setConfig}
                onPreviewToggle={() => setMode("viewer")}
              />
            </motion.div>
          ) : (
            
            /* VIEWER MODE (ROMANTIC ALBUM EXPERIENCES) */
            <motion.div
              key={`stage-${currentStage}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center space-y-8"
            >
              
              {/* STAGE 0: TELA DE BOAS-VINDAS (Closed Luxury Album Cover) */}
              {currentStage === 0 && (
                <div id="welcome-screen-container" className="relative w-full max-w-xl mx-auto">
                  {/* Embossed Leather Spine / Hardback cover effect */}
                  <div className="relative bg-gradient-to-br from-[#3b0d14] via-[#24060b] to-[#0f0204] border-4 border-amber-600/30 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl shadow-rose-950/50 overflow-hidden border-double">
                    
                    {/* Golden filigree corner ornaments */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/40 rounded-tl-xl pointer-events-none" />
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/40 rounded-tr-xl pointer-events-none" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/40 rounded-bl-xl pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/40 rounded-br-xl pointer-events-none" />

                    {/* Subtle leather texture highlight */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
                    
                    {/* Golden vintage oval frame surrounding the portrait */}
                    <div className="relative w-52 h-52 md:w-60 md:h-60 mx-auto rounded-3xl overflow-hidden border-[6px] border-amber-500/30 shadow-2xl shadow-black/80 mb-8 p-1 bg-neutral-950/20">
                      {/* Physical paper photo corners holding the photo inside */}
                      <div className="absolute top-1 left-1 w-5 h-5 bg-[#1e1315] border-r border-b border-amber-500/30 rotate-45 z-10" />
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#1e1315] border-l border-b border-amber-500/30 -rotate-45 z-10" />
                      <div className="absolute bottom-1 left-1 w-5 h-5 bg-[#1e1315] border-r border-t border-amber-500/30 -rotate-45 z-10" />
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#1e1315] border-l border-t border-amber-500/30 rotate-45 z-10" />
                      
                      <img
                        src={config.couple.coverPhoto}
                        alt="Capa do Casal"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>

                    <div className="space-y-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold block">
                        ✨ Álbum de Recordações do Casal ✨
                      </span>
                      
                      <h1 className="text-4xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 tracking-wide">
                        {config.couple.partner1} &amp; {config.couple.partner2}
                      </h1>
                      
                      <div className="w-24 h-[1px] bg-amber-500/30 mx-auto my-1" />
                      
                      <p className="text-sm md:text-base text-stone-200/90 leading-relaxed font-serif italic max-w-sm mx-auto">
                        &ldquo;Prepare-se para folhear as páginas do nosso amor e reviver nossos instantes eternos ❤️&rdquo;
                      </p>
                    </div>

                    <div className="mt-8">
                      <motion.button
                        onClick={() => navigateStage(1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-sm rounded-full shadow-xl shadow-amber-950/50 flex items-center gap-2 mx-auto cursor-pointer border border-amber-200/30 transition-all"
                      >
                        Abrir Nosso Álbum ❤️ <ChevronRight className="w-4.5 h-4.5" />
                      </motion.button>
                    </div>

                    {/* Gold book buckle design */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-12 bg-amber-500/20 border-l border-y border-amber-500/30 rounded-l-md pointer-events-none" />
                  </div>
                </div>
              )}

              {/* STAGES 1 - 8: THE OPEN ALBUM PAGES */}
              {currentStage > 0 && (
                <div className="w-full max-w-4xl relative">
                  {/* Hardback leather cover edge showing behind the open pages */}
                  <div className="bg-[#1c0a0c] border-[10px] border-amber-950/40 rounded-[2.5rem] shadow-2xl p-2 md:p-4 overflow-hidden relative">
                    
                    {/* Open Scrapbook Page Sheet */}
                    <div className="w-full bg-[#fcf9f2] text-stone-900 rounded-[1.8rem] p-6 md:p-10 pl-14 md:pl-20 shadow-inner relative paper-texture">
                      
                      {/* Realistic Spiral Binder Metal Rings & Punches on the Left Page Edge */}
                      <div className="absolute left-4 top-0 bottom-0 w-8 flex flex-col justify-around py-8 pointer-events-none z-20">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-1.5 -ml-1">
                            {/* Realistic hole punch */}
                            <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 shadow-inner border border-stone-400/40" />
                            {/* Curved silver wire binder loop */}
                            <div className="w-7 h-2.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 rounded-full shadow-md border-y border-stone-500/30 -ml-2.5" />
                          </div>
                        ))}
                      </div>

                      {/* Header Scrapbook tape for title decoration */}
                      <div className="absolute top-3 right-8 scrapbook-tape px-4 py-1.5 text-[11px] font-handwritten text-stone-800 font-bold opacity-80 shadow-sm">
                        Coleção de Instantes ✨
                      </div>

                      {/* PAGE CONTENT */}

                      {/* STAGE 1: COMO TUDO COMEÇOU */}
                      {currentStage === 1 && (
                        <div id="first-meet-container" className="space-y-8 animate-fade-in">
                          <div className="space-y-1 border-b border-stone-300/60 pb-3">
                            <span className="text-xs font-mono uppercase text-rose-600 font-bold">Etapa 1: Nostalgia</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight leading-none">
                              Como Tudo Começou
                            </h2>
                            <span className="font-handwritten text-xl text-stone-500 block">
                              Registrando o primeiro passo do nosso amor
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Story writing side */}
                            <div className="space-y-5">
                              <div className="flex items-center gap-2 text-rose-600">
                                <Calendar className="w-4.5 h-4.5" />
                                <span className="text-xs font-mono font-bold">DATA DE ORIGEM: {formatDate(config.story.firstContactDate)}</span>
                              </div>
                              
                              <p className="text-sm md:text-base text-stone-800 leading-relaxed font-serif whitespace-pre-wrap italic bg-white/40 p-4 rounded-xl border border-stone-200/50">
                                &ldquo;{config.story.firstContactText}&rdquo;
                              </p>
                              
                              {/* Chat message as a yellow sticky post-it note with a scrapbook tape */}
                              {config.story.firstContactChatSnippet && (
                                <div className="relative pt-4 pb-2 px-1">
                                  {/* Washi tape on top of the sticky note */}
                                  <div className="absolute -top-1 left-12 w-24 h-4.5 scrapbook-tape-right z-10 opacity-90" />
                                  
                                  <div className="p-4 bg-yellow-50/90 text-stone-800 rounded-xl shadow-md border-l-4 border-yellow-400 font-mono text-xs space-y-1 transform rotate-1 hover:rotate-0 transition-transform">
                                    <span className="text-[9px] font-mono font-bold text-amber-700 block uppercase mb-1">
                                      📟 Transcrição do Papo Antigo:
                                    </span>
                                    {config.story.firstContactChatSnippet.split("\n").map((line, idx) => (
                                      <div key={idx} className="border-b border-amber-200/30 pb-0.5 last:border-0">{line}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Polaroid image side */}
                            <div className="flex flex-col items-center">
                              {/* Washi tape at top of the polaroid */}
                              <div className="w-20 h-5 bg-rose-200/40 border-dashed border-x border-rose-300/30 shadow-sm rotate-3 -mb-3 z-10" />
                              
                              {/* Classic polaroid frame wrapper */}
                              <div className="p-4 pb-10 bg-white text-stone-900 shadow-xl border border-stone-200/50 rounded-sm transform rotate-1 hover:rotate-0 transition-all duration-500 w-full max-w-sm">
                                <div className="aspect-[4/3] w-full rounded-sm overflow-hidden border border-stone-100 relative group">
                                  <img
                                    src={config.story.firstContactPhoto}
                                    alt="Primeiro Contato"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                </div>
                                <div className="mt-4 text-center font-handwritten text-2xl text-stone-700 font-bold tracking-tight">
                                  Onde tudo se iluminou ✨
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Meeting Location with scrapbook stamp style */}
                          <div className="border-t border-stone-300/60 pt-6 space-y-3">
                            <h4 className="font-serif font-black text-stone-900 text-lg flex items-center gap-1.5">
                              <MapPin className="w-5 h-5 text-rose-500" /> Coordenadas do Encontro
                            </h4>
                            <p className="text-xs text-stone-500">
                              O ponto físico no mapa onde nossas coordenadas colidiram para sempre:
                            </p>
                            <MeetingMap
                              lat={config.story.meetingPlaceCoordinates.lat}
                              lng={config.story.meetingPlaceCoordinates.lng}
                              label={config.story.meetingPlaceCoordinates.label}
                              startDate={config.couple.startDate}
                            />
                          </div>

                          {/* Action Navigation */}
                          <div className="flex justify-end pt-4">
                            <button
                              onClick={() => navigateStage(2)}
                              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              Ver Próxima Página <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 2: TIMELINE */}
                      {currentStage === 2 && (
                        <div id="first-moments-container" className="space-y-8 animate-fade-in">
                          <div className="space-y-1 border-b border-stone-300/60 pb-3">
                            <span className="text-xs font-mono uppercase text-rose-600 font-bold">Etapa 2: Crônicas</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight leading-none">
                              Nossos Primeiros Passos
                            </h2>
                            <span className="font-handwritten text-xl text-stone-500 block">
                              Rabiscos de uma linda linha do tempo
                            </span>
                          </div>

                          {/* Vertical scrapbooking timeline */}
                          <div className="relative border-l-2 border-stone-300/80 pl-6 space-y-12 py-4">
                            
                            {config.timeline.map((event, index) => {
                              const isEven = index % 2 === 0;
                              return (
                                <motion.div
                                  key={event.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.15 }}
                                  className="relative group"
                                >
                                  {/* Scrapbook pin point */}
                                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-rose-500 border-4 border-[#fcf9f2] shadow-md z-10 group-hover:scale-125 transition-transform" />
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                    
                                    {/* Polaroid snippet within timeline */}
                                    <div className="md:col-span-5 flex flex-col items-center">
                                      <div className="p-3 pb-7 bg-white text-stone-900 shadow-md border border-stone-200/50 rounded-sm transform group-hover:rotate-1 transition-transform w-full max-w-[200px]">
                                        <div className="aspect-[1/1] w-full rounded-sm overflow-hidden border border-stone-100">
                                          <img
                                            src={event.photo}
                                            alt={event.title}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="mt-2 text-center font-handwritten text-base text-stone-600 font-bold leading-none">
                                          Momentos Felizes ❤️
                                        </div>
                                      </div>
                                    </div>

                                    {/* Date & Descriptions */}
                                    <div className="md:col-span-7 space-y-2">
                                      <span className="px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-700 font-mono text-[10px] rounded-full font-bold uppercase tracking-wider inline-block">
                                        {formatDate(event.date)}
                                      </span>
                                      
                                      <h4 className="font-serif font-black text-lg text-stone-900 group-hover:text-rose-700 transition-colors">
                                        {event.title}
                                      </h4>
                                      
                                      <p className="text-sm text-stone-600 leading-relaxed font-serif italic">
                                        &ldquo;{event.description}&rdquo;
                                      </p>
                                    </div>

                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Action Navigation */}
                          <div className="flex justify-between border-t border-stone-300/60 pt-6">
                            <button
                              onClick={() => navigateStage(1)}
                              className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" /> Página Anterior
                            </button>
                            <button
                              onClick={() => navigateStage(3)}
                              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              Ver Nossos Cartões <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 3: MEMÓRIAS ESPECIAIS (Scrapbook Interactive Gallery) */}
                      {currentStage === 3 && (
                        <div id="special-memories-container" className="space-y-8 animate-fade-in">
                          <div className="space-y-1 border-b border-stone-300/60 pb-3">
                            <span className="text-xs font-mono uppercase text-rose-600 font-bold">Etapa 3: Scrapbook</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight leading-none">
                              Nossos Cartões Especiais
                            </h2>
                            <span className="font-handwritten text-xl text-stone-500 block">
                              Mergulhe nas fotos e histórias coladas no álbum
                            </span>
                          </div>

                          <InteractiveGallery memories={config.memories} />

                          {/* Action Navigation */}
                          <div className="flex justify-between border-t border-stone-300/60 pt-6">
                            <button
                              onClick={() => navigateStage(2)}
                              className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" /> Página Anterior
                            </button>
                            <button
                              onClick={() => navigateStage(4)}
                              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              O Que Eu Amo em Você <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 4: O QUE EU AMO EM VOCÊ */}
                      {currentStage === 4 && (
                        <div id="love-qualities-container" className="space-y-8 animate-fade-in">
                          <div className="space-y-1 border-b border-stone-300/60 pb-3">
                            <span className="text-xs font-mono uppercase text-rose-600 font-bold">Etapa 4: Sentimentos</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight leading-none">
                              O Que Eu Amo em Você
                            </h2>
                            <span className="font-handwritten text-xl text-stone-500 block">
                              Cartas manuscritas e colagens de sentimentos
                            </span>
                          </div>

                          <LoveCards qualities={config.qualities} />

                          {/* Action Navigation */}
                          <div className="flex justify-between border-t border-stone-300/60 pt-6">
                            <button
                              onClick={() => navigateStage(3)}
                              className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" /> Página Anterior
                            </button>
                            <button
                              onClick={() => navigateStage(5)}
                              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              Nossos Sonhos de Futuro <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 5: NOSSOS SONHOS */}
                      {currentStage === 5 && (
                        <div id="dreams-container" className="space-y-8 animate-fade-in">
                          <div className="space-y-1 border-b border-stone-300/60 pb-3">
                            <span className="text-xs font-mono uppercase text-rose-600 font-bold">Etapa 5: O Amanhã</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight leading-none">
                              Nossos Sonhos Futuros
                            </h2>
                            <span className="font-handwritten text-xl text-stone-500 block">
                              Metas e bilhetes de viagem que vamos riscar juntos
                            </span>
                          </div>

                          <DreamsSection dreams={config.dreams} />

                          {/* Action Navigation */}
                          <div className="flex justify-between border-t border-stone-300/60 pt-6">
                            <button
                              onClick={() => navigateStage(4)}
                              className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" /> Página Anterior
                            </button>
                            <button
                              onClick={() => navigateStage(6)}
                              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              Testar Memória no Quiz <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 6: QUIZ DO CASAL */}
                      {currentStage === 6 && (
                        <div id="quiz-container" className="space-y-8 animate-fade-in">
                          <div className="space-y-1 border-b border-stone-300/60 pb-3">
                            <span className="text-xs font-mono uppercase text-rose-600 font-bold">Etapa 6: Brincadeira</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight leading-none">
                              Quiz do Casal
                            </h2>
                            <span className="font-handwritten text-xl text-stone-500 block">
                              Acerte tudo para desbloquear uma carta secreta selada!
                            </span>
                          </div>

                          <QuizSection quiz={config.quiz} secretLetter={config.secretLetter} />

                          {/* Action Navigation */}
                          <div className="flex justify-between border-t border-stone-300/60 pt-6">
                            <button
                              onClick={() => navigateStage(5)}
                              className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" /> Página Anterior
                            </button>
                            <button
                              onClick={() => navigateStage(7)}
                              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              O Próximo Capítulo... <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 7: CONTAGEM REGRESSIVA */}
                      {currentStage === 7 && (
                        <div id="countdown-container" className="space-y-8 animate-fade-in">
                          <div className="space-y-1 border-b border-stone-300/60 pb-3 text-center">
                            <span className="text-xs font-mono uppercase text-rose-600 font-bold">Transição</span>
                            <h2 className="text-3xl font-serif font-black text-stone-900 tracking-tight">
                              Segundos para o Infinito
                            </h2>
                            <span className="font-handwritten text-xl text-stone-500 block">
                              O tempo para antes de darmos o passo definitivo
                            </span>
                          </div>

                          <div className="max-w-md mx-auto bg-white/50 p-6 rounded-2xl border border-stone-200">
                            <CountdownSection onComplete={() => navigateStage(8)} />
                          </div>
                        </div>
                      )}

                      {/* STAGE 8: O PEDIDO */}
                      {currentStage === 8 && (
                        <div id="proposal-container" className="space-y-8 animate-fade-in">
                          <div className="space-y-1 border-b border-stone-300/60 pb-3 text-center">
                            <span className="text-xs font-mono uppercase text-rose-600 font-bold">O Destino</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-rose-800 tracking-tight leading-none">
                              {config.couple.proposalType === "namoro" ? "Pedido de Namoro" : "Pedido de Casamento"}
                            </h2>
                            <span className="font-handwritten text-2xl text-rose-600 block">
                              O fim do álbum e o início da nossa eternidade... ❤️
                            </span>
                          </div>

                          <div className="w-full">
                            <ProposalSection
                              couple={config.couple}
                              onSaveResponse={handleSavePartnerResponse}
                              savedResponse={savedResponse}
                            />
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Bottom Viewer Navigation Controls Bar */}
                  <div id="viewer-navigation-bar" className="w-full max-w-xl mx-auto mt-6 flex flex-col gap-4">
                    {/* Progress Indicator dots */}
                    <div className="flex justify-between items-center px-4">
                      <button
                        onClick={() => navigateStage(currentStage - 1)}
                        className="px-4 py-2 bg-neutral-950/80 hover:bg-rose-500/20 text-gray-400 hover:text-white rounded-xl border border-gray-900 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-lg"
                      >
                        <ChevronLeft className="w-4 h-4" /> Anterior
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: 9 }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => navigateStage(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                              idx === currentStage ? "bg-amber-400 scale-125 shadow shadow-amber-400/50" : "bg-neutral-800 hover:bg-rose-500/40"
                            }`}
                            title={`Ir para etapa ${idx}`}
                          />
                        ))}
                      </div>

                      {currentStage < 8 ? (
                        <button
                          onClick={() => navigateStage(currentStage + 1)}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-lg"
                        >
                          Próximo <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="w-20" /> /* empty spacer */
                      )}
                    </div>

                    {/* Premium growing tree widget */}
                    <div className="pt-2">
                      <RelationshipTree currentStage={currentStage} totalStages={8} />
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Bottom Credits */}
      <footer className="py-6 border-t border-rose-500/5 text-center relative z-10 bg-black/30 backdrop-blur-sm mt-auto">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1">
          Feito com <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" /> por {config.couple.partner1} para {config.couple.partner2}
        </span>
      </footer>
    </div>
  );
}
