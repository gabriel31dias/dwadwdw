/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AlbumConfig } from "../types";
import { encodeAlbum } from "../utils/urlSerializer";
import {
  Settings,
  Heart,
  Calendar,
  Image,
  MapPin,
  HelpCircle,
  Mail,
  Copy,
  Check,
  Share2,
  ChevronRight,
  Eye
} from "lucide-react";

interface CreatorPanelProps {
  config: AlbumConfig;
  onChange: (updatedConfig: AlbumConfig) => void;
  onPreviewToggle: () => void;
}

export const CreatorPanel: React.FC<CreatorPanelProps> = ({
  config,
  onChange,
  onPreviewToggle,
}) => {
  const [activeTab, setActiveTab] = useState<"couple" | "story" | "timeline" | "memories" | "qualities" | "dreams" | "quiz" | "letter">("couple");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleUpdate = (updated: Partial<AlbumConfig>) => {
    onChange({ ...config, ...updated } as AlbumConfig);
  };

  const handleGenerateLink = () => {
    const code = encodeAlbum(config);
    const url = `${window.location.origin}${window.location.pathname}?album=${code}`;
    setShareUrl(url);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
  };

  return (
    <div id="creator-panel-root" className="w-full bg-neutral-950/80 border border-rose-500/10 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-8">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-rose-500/10 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-rose-500" /> Painel de Criação do Álbum
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Personalize cada detalhe da sua história e gere um link único para enviar ao seu amor.
          </p>
        </div>
        
        {/* Live Preview Toggle Button */}
        <button
          onClick={onPreviewToggle}
          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/20 flex items-center gap-1.5 cursor-pointer transition-all self-stretch md:self-auto justify-center"
        >
          <Eye className="w-4 h-4" /> Visualizar Álbum do Casal
        </button>
      </div>

      {/* Share / Generator Section */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-4.5 h-4.5 text-rose-400" />
          <h4 className="font-bold text-sm text-gray-100">Compartilhar com seu Amor</h4>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Após editar os dados nas abas abaixo, clique no botão para gerar o link personalizado. O link conterá todo o seu álbum de fotos e histórias!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={handleGenerateLink}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            Gerar Link Compartilhável ❤️
          </button>
          
          {shareUrl && (
            <div className="flex-1 flex items-center gap-2 bg-neutral-900 border border-gray-800 p-2 rounded-xl">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-gray-400 outline-none px-2 select-all overflow-ellipsis"
              />
              <button
                onClick={handleCopy}
                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-2">
        {(["couple", "story", "timeline", "memories", "qualities", "dreams", "quiz", "letter"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/10"
                : "bg-neutral-900 text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab === "couple" && "Informações do Casal 👩‍❤️‍👨"}
            {tab === "story" && "Como Começou 🗺️"}
            {tab === "timeline" && "Linha do Tempo 📅"}
            {tab === "memories" && "Cartões Especiais 💋"}
            {tab === "qualities" && "O Que Eu Amo ❤️"}
            {tab === "dreams" && "Nossos Sonhos ✈️"}
            {tab === "quiz" && "Quiz 🏆"}
            {tab === "letter" && "Carta Secreta ✉️"}
          </button>
        ))}
      </div>

      {/* Editor Content Area */}
      <div className="space-y-6 pt-2">
        
        {/* TAB 1: COUPLE INFO */}
        {activeTab === "couple" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">
              Detalhes Principais do Casal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Seu Nome (Parceiro 1)</label>
                <input
                  type="text"
                  value={config.couple.partner1}
                  onChange={(e) => handleUpdate({ couple: { ...config.couple, partner1: e.target.value } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Nome do seu Amor (Parceiro 2)</label>
                <input
                  type="text"
                  value={config.couple.partner2}
                  onChange={(e) => handleUpdate({ couple: { ...config.couple, partner2: e.target.value } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" /> Data de Início do Relacionamento
                </label>
                <input
                  type="date"
                  value={config.couple.startDate}
                  onChange={(e) => handleUpdate({ couple: { ...config.couple, startDate: e.target.value } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Tipo de Pedido Final
                </label>
                <select
                  value={config.couple.proposalType}
                  onChange={(e) => handleUpdate({ couple: { ...config.couple, proposalType: e.target.value as "namoro" | "casamento" } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none"
                >
                  <option value="namoro">Pedido de Namoro ❤️</option>
                  <option value="casamento">Pedido de Casamento 💍</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-rose-400" /> URL da Foto de Capa do Casal
                </label>
                <input
                  type="text"
                  value={config.couple.coverPhoto}
                  onChange={(e) => handleUpdate({ couple: { ...config.couple, coverPhoto: e.target.value } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none"
                  placeholder="Link direto de imagem HTTPS (Unsplash, etc.)"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOW IT STARTED */}
        {activeTab === "story" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">
              Como Tudo Começou (Etapa 1)
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Texto contando a história</label>
                <textarea
                  rows={3}
                  value={config.story.firstContactText}
                  onChange={(e) => handleUpdate({ story: { ...config.story, firstContactText: e.target.value } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">Data do Primeiro Contato</label>
                  <input
                    type="date"
                    value={config.story.firstContactDate}
                    onChange={(e) => handleUpdate({ story: { ...config.story, firstContactDate: e.target.value } })}
                    className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">URL da Foto de Primeiro Contato</label>
                  <input
                    type="text"
                    value={config.story.firstContactPhoto}
                    onChange={(e) => handleUpdate({ story: { ...config.story, firstContactPhoto: e.target.value } })}
                    className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Print da Conversa Antiga (Formato Texto Transcrito)</label>
                <textarea
                  rows={3}
                  value={config.story.firstContactChatSnippet || ""}
                  onChange={(e) => handleUpdate({ story: { ...config.story, firstContactChatSnippet: e.target.value } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none resize-none font-mono text-xs"
                  placeholder="Nome 1: Olá!&#10;Nome 2: Oi! 😍"
                />
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-gray-800 space-y-4">
                <h4 className="font-bold text-xs text-gray-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> Configuração do Local do Encontro
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Nome Amigável do Local</label>
                    <input
                      type="text"
                      value={config.story.meetingPlaceCoordinates.label}
                      onChange={(e) =>
                        handleUpdate({
                          story: {
                            ...config.story,
                            meetingPlaceCoordinates: {
                              ...config.story.meetingPlaceCoordinates,
                              label: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={config.story.meetingPlaceCoordinates.lat}
                      onChange={(e) =>
                        handleUpdate({
                          story: {
                            ...config.story,
                            meetingPlaceCoordinates: {
                              ...config.story.meetingPlaceCoordinates,
                              lat: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={config.story.meetingPlaceCoordinates.lng}
                      onChange={(e) =>
                        handleUpdate({
                          story: {
                            ...config.story,
                            meetingPlaceCoordinates: {
                              ...config.story.meetingPlaceCoordinates,
                              lng: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIMELINE */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">
              Eventos dos Primeiros Momentos (Etapa 2)
            </h3>
            <div className="space-y-6">
              {config.timeline.map((event, index) => (
                <div key={event.id} className="p-4 bg-neutral-900 rounded-2xl border border-gray-800 space-y-3 relative">
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-gray-500 uppercase">
                    Momento {index + 1}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Título do Momento</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => {
                          const list = [...config.timeline];
                          list[index].title = e.target.value;
                          handleUpdate({ timeline: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Data</label>
                      <input
                        type="date"
                        value={event.date}
                        onChange={(e) => {
                          const list = [...config.timeline];
                          list[index].date = e.target.value;
                          handleUpdate({ timeline: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-gray-400">URL da Foto</label>
                      <input
                        type="text"
                        value={event.photo}
                        onChange={(e) => {
                          const list = [...config.timeline];
                          list[index].photo = e.target.value;
                          handleUpdate({ timeline: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-gray-400">Descrição do Momento</label>
                      <textarea
                        rows={2}
                        value={event.description}
                        onChange={(e) => {
                          const list = [...config.timeline];
                          list[index].description = e.target.value;
                          handleUpdate({ timeline: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SPECIAL MEMORIES */}
        {activeTab === "memories" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">
              Cartões de Memórias Especiais (Etapa 3)
            </h3>
            <div className="space-y-6">
              {config.memories.map((memory, index) => (
                <div key={memory.id} className="p-4 bg-neutral-900 rounded-2xl border border-gray-800 space-y-3 relative">
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-gray-500 uppercase">
                    Categoria: {memory.category}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Título do Cartão</label>
                      <input
                        type="text"
                        value={memory.title}
                        onChange={(e) => {
                          const list = [...config.memories];
                          list[index].title = e.target.value;
                          handleUpdate({ memories: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">URL da Foto</label>
                      <input
                        type="text"
                        value={memory.photo}
                        onChange={(e) => {
                          const list = [...config.memories];
                          list[index].photo = e.target.value;
                          handleUpdate({ memories: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-gray-400">Texto Contando a História</label>
                      <textarea
                        rows={2}
                        value={memory.description}
                        onChange={(e) => {
                          const list = [...config.memories];
                          list[index].description = e.target.value;
                          handleUpdate({ memories: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: QUALITIES */}
        {activeTab === "qualities" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">
              O Que Eu Amo em Você (Etapa 4)
            </h3>
            <div className="space-y-6">
              {config.qualities.map((qual, index) => (
                <div key={qual.id} className="p-4 bg-neutral-900 rounded-2xl border border-gray-800 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Título da Qualidade</label>
                      <input
                        type="text"
                        value={qual.title}
                        onChange={(e) => {
                          const list = [...config.qualities];
                          list[index].title = e.target.value;
                          handleUpdate({ qualities: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Nome do Ícone Lucide (Smile, Heart, Sparkles, Sun)</label>
                      <input
                        type="text"
                        value={qual.icon}
                        onChange={(e) => {
                          const list = [...config.qualities];
                          list[index].icon = e.target.value;
                          handleUpdate({ qualities: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none font-mono"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-gray-400">Texto Explicativo Emocional</label>
                      <textarea
                        rows={2}
                        value={qual.description}
                        onChange={(e) => {
                          const list = [...config.qualities];
                          list[index].description = e.target.value;
                          handleUpdate({ qualities: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DREAMS */}
        {activeTab === "dreams" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">
              Nossos Sonhos Futuros (Etapa 5)
            </h3>
            <div className="space-y-6">
              {config.dreams.map((dream, index) => (
                <div key={dream.id} className="p-4 bg-neutral-900 rounded-2xl border border-gray-800 space-y-3 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Título do Sonho</label>
                      <input
                        type="text"
                        value={dream.title}
                        onChange={(e) => {
                          const list = [...config.dreams];
                          list[index].title = e.target.value;
                          handleUpdate({ dreams: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Categoria (viagem, casa, meta)</label>
                      <select
                        value={dream.category}
                        onChange={(e) => {
                          const list = [...config.dreams];
                          list[index].category = e.target.value as "viagem" | "casa" | "meta";
                          handleUpdate({ dreams: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      >
                        <option value="viagem">Viagem</option>
                        <option value="casa">Casa</option>
                        <option value="meta">Meta de Relacionamento</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-gray-400">URL da Foto do Sonho</label>
                      <input
                        type="text"
                        value={dream.photo}
                        onChange={(e) => {
                          const list = [...config.dreams];
                          list[index].photo = e.target.value;
                          handleUpdate({ dreams: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-gray-400">Descrição do Sonho / Como Imaginam Isso</label>
                      <textarea
                        rows={2}
                        value={dream.description}
                        onChange={(e) => {
                          const list = [...config.dreams];
                          list[index].description = e.target.value;
                          handleUpdate({ dreams: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: COUPLE QUIZ */}
        {activeTab === "quiz" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">
              Quiz do Casal (Etapa 6)
            </h3>
            <div className="space-y-6">
              {config.quiz.map((q, index) => (
                <div key={q.id} className="p-4 bg-neutral-900 rounded-2xl border border-gray-800 space-y-3 relative">
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-gray-500">
                    Questão {index + 1}
                  </span>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-300 font-semibold">Texto da Pergunta</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const list = [...config.quiz];
                        list[index].question = e.target.value;
                        handleUpdate({ quiz: list });
                      }}
                      className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                    />
                  </div>
                  
                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {q.options.map((option, optIdx) => (
                      <div key={optIdx} className="space-y-1">
                        <label className="text-[9px] text-gray-500">Opção {optIdx + 1}</label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const list = [...config.quiz];
                            list[index].options[optIdx] = e.target.value;
                            handleUpdate({ quiz: list });
                          }}
                          className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Index & Hint */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Qual opção é a correta? (1 a 4)</label>
                      <select
                        value={q.correctIndex}
                        onChange={(e) => {
                          const list = [...config.quiz];
                          list[index].correctIndex = parseInt(e.target.value);
                          handleUpdate({ quiz: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      >
                        <option value={0}>Opção 1</option>
                        <option value={1}>Opção 2</option>
                        <option value={2}>Opção 3</option>
                        <option value={3}>Opção 4</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Dica / Ajuda (Aparece no balão)</label>
                      <input
                        type="text"
                        value={q.hint}
                        onChange={(e) => {
                          const list = [...config.quiz];
                          list[index].hint = e.target.value;
                          handleUpdate({ quiz: list });
                        }}
                        className="w-full p-2 bg-neutral-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SECRET LETTER */}
        {activeTab === "letter" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">
              Carta Secreta Desbloqueável (Prêmio Máximo)
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Título da Carta</label>
                <input
                  type="text"
                  value={config.secretLetter.title}
                  onChange={(e) => handleUpdate({ secretLetter: { ...config.secretLetter, title: e.target.value } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Conteúdo Íntimo da Carta</label>
                <textarea
                  rows={8}
                  value={config.secretLetter.content}
                  onChange={(e) => handleUpdate({ secretLetter: { ...config.secretLetter, content: e.target.value } })}
                  className="w-full p-2.5 bg-neutral-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:border-rose-500 outline-none font-serif leading-relaxed"
                  placeholder="Escreva seus sentimentos profundos aqui..."
                />
              </div>
              
              <div className="p-3.5 bg-yellow-950/15 border border-yellow-500/10 rounded-xl text-xs text-yellow-200/80 leading-relaxed flex items-start gap-2">
                <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Nota sobre a Carta:</strong> Por padrão, a carta virá selada em cera e só poderá ser lida pelo seu parceiro(a) após ele(a) obter um aproveitamento de <strong>100% no quiz</strong>. Isso deixa a descoberta muito mais divertida!
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Underlining bottom helper */}
      <div className="flex justify-between items-center border-t border-gray-900 pt-6">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Nossa História Builder v1.0
        </span>
        <button
          onClick={onPreviewToggle}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/10 flex items-center gap-1 cursor-pointer transition-all"
        >
          Visualizar Álbum Completo <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
