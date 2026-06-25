/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { MapPin, Heart, Compass, Star } from "lucide-react";

interface MeetingMapProps {
  lat: number;
  lng: number;
  label: string;
  startDate: string;
}

export const MeetingMap: React.FC<MeetingMapProps> = ({
  lat,
  lng,
  label,
  startDate,
}) => {
  // Format meeting date beautifully
  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="meeting-map-root" className="relative w-full rounded-2xl bg-neutral-950/60 border border-rose-500/20 p-6 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-rose-500/10 pb-4 mb-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-rose-400 uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Ponto de Encontro Inicial
          </span>
          <h4 className="text-xl font-bold text-gray-100 tracking-tight mt-1">
            {label}
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-gray-400 block uppercase">
            Data de Alinhamento Cósmico
          </span>
          <span className="text-sm font-semibold text-rose-300">
            {formatDate(startDate)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* The Graphic Vector Map */}
        <div className="lg:col-span-2 relative h-[240px] rounded-xl border border-rose-500/15 bg-neutral-900/80 overflow-hidden flex items-center justify-center">
          {/* Concentric Coordinate Rings */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-rose-500/5 flex items-center justify-center pointer-events-none">
            <div className="w-[260px] h-[260px] rounded-full border border-rose-500/5 flex items-center justify-center">
              <div className="w-[160px] h-[160px] rounded-full border border-rose-500/10 flex items-center justify-center">
                <div className="w-[80px] h-[80px] rounded-full border border-rose-500/20" />
              </div>
            </div>
          </div>

          {/* Radar Line Sweep */}
          <motion.div
            className="absolute origin-center w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />

          {/* Stylized Constellations/Map Dots */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Random glowing star dots */}
            <Star className="absolute top-10 left-12 w-2 h-2 text-rose-300/40 animate-pulse" />
            <Star className="absolute bottom-12 left-28 w-1.5 h-1.5 text-rose-300/60" />
            <Star className="absolute top-24 right-16 w-2 h-2 text-rose-400/50 animate-pulse" />
            <Star className="absolute bottom-8 right-24 w-1.5 h-1.5 text-rose-300/30" />
            
            {/* Soft grid lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-rose-500/10" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-rose-500/10" />
          </div>

          {/* Glowing Target Crosshair */}
          <div className="absolute text-center z-10 flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative flex items-center justify-center"
            >
              {/* Outer pulsing ring */}
              <span className="absolute inline-flex h-16 w-16 rounded-full bg-rose-500/10 animate-ping" />
              <span className="absolute inline-flex h-10 w-10 rounded-full bg-rose-500/20 animate-pulse" />
              
              {/* Red glowing Heart Pin */}
              <div className="relative z-10 p-3 bg-rose-600 rounded-full border-2 border-white shadow-lg shadow-rose-500/50">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
            </motion.div>
          </div>

          {/* Coordinate Readout */}
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded border border-rose-500/20 font-mono text-[10px] text-rose-300 z-10">
            COORD: {lat.toFixed(5)}° S, {lng.toFixed(5)}° W
          </div>

          {/* Scale Legend */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded border border-gray-800 font-mono text-[9px] text-gray-400 z-10">
            ESCALA DO AMOR: 1:∞
          </div>
        </div>

        {/* Storytelling Side Panel */}
        <div className="flex flex-col gap-4 text-gray-300">
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-gray-800">
            <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" /> Coordenadas Registradas
            </span>
            <div className="mt-2 font-mono text-xs space-y-1 text-gray-300">
              <div className="flex justify-between">
                <span>Latitude:</span>
                <span className="text-rose-300 font-bold">{lat}°</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="text-rose-300 font-bold">{lng}°</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed italic">
            &ldquo;Os astros dizem que entre os bilhões de planetas no universo, no instante exato de {formatDate(startDate)}, nossos caminhos se cruzaram precisamente neste ponto do mapa.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
