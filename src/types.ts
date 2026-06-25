/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoupleInfo {
  partner1: string;
  partner2: string;
  startDate: string; // Date when they met or started dating: YYYY-MM-DD
  proposalType: "namoro" | "casamento";
  coverPhoto: string;
}

export interface StoryPoint {
  firstContactText: string;
  firstContactDate: string;
  firstContactPhoto: string;
  firstContactChatSnippet?: string; // Captura de tela ou transcrição da conversa
  meetingPlaceCoordinates: {
    lat: number;
    lng: number;
    label: string;
  };
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  photo: string;
}

export interface SpecialMemory {
  id: string;
  category: "kiss" | "trip" | "anniversary" | "unforgettable";
  title: string;
  description: string;
  photo: string;
}

export interface LoveQuality {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface DreamItem {
  id: string;
  title: string;
  description: string;
  photo: string;
  category: "viagem" | "casa" | "meta";
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface AlbumConfig {
  couple: CoupleInfo;
  story: StoryPoint;
  timeline: TimelineEvent[];
  memories: SpecialMemory[];
  qualities: LoveQuality[];
  dreams: DreamItem[];
  quiz: QuizQuestion[];
  secretLetter: {
    title: string;
    content: string;
    unlockedByQuiz: boolean;
  };
  audioTrack: {
    type: "synth" | "url";
    url?: string;
    synthMelodyName?: string;
  };
}

export interface PartnerResponse {
  accepted: boolean | null;
  timestamp?: string;
  message?: string;
}
