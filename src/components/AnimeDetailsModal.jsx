import React, { useState, useEffect } from 'react';
import { 
  X, Star, Play, Bookmark, Share2, Calendar, Clock, 
  Users, Film, Tv, Check, ChevronRight, Eye,
  Sparkles, Layers, Award
} from 'lucide-react';
import { api, fixImageUrl, formatDuration, formatSeason } from '../api';
import { storage } from '../storage';

export default function AnimeDetailsModal({ 
  animeSummary, 
  onClose, 
  onPlayEpisode,
  onSelectAnime,
  onSelectGenre
}) {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [selectedDubbing, setSelectedDubbing] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [lists, setLists] = useState(storage.getLists());
  const [showListMenu, setShowListMenu] = useState(false);

  const animeId = animeSummary.anime_id || animeSummary.anime_url;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getAnime(animeId)
      .then(data => {
        if (isMounted) {
          setAnime(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setAnime(animeSummary);
          setLoading(false);
        }
      });

    api.getAnimeVideos(animeSummary.anime_id)
      .then(vids => {
        if (isMounted) {
          setVideos(vids);
          const firstDub = vids[0]?.data?.dubbing;
          if (firstDub) setSelectedDubbing(firstDub);
          setVideosLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setVideosLoading(false);
      });

    return () => { isMounted = false; };
  }, [animeId]);

  const activeAnime = anime || animeSummary;
  const posterFull = fixImageUrl(
    activeAnime.poster?.huge || 
    activeAnime.poster?.mega || 
    activeAnime.poster?.fullsize || 
    activeAnime.poster?.big
  );

  const dubbings = Array.from(new Set(videos.map(v => v.data?.dubbing).filter(Boolean)));
  const currentDub = selectedDubbing || dubbings[0] || "Озвучка";
  const currentEpisodes = videos
    .filter(v => (v.data?.dubbing || "Озвучка") === currentDub)
    .sort((a, b) => Number(a.index || a.number) - Number(b.index || b.number));

  const currentListKey = ['watching', 'planned', 'completed', 'dropped', 'favorites'].find(k => 
    (lists[k] || []).some(item => item.anime_id === activeAnime.anime_id)
  );

  const listLabels = {
    watching: 'Смотрю',
    planned: 'В планах',
    completed: 'Просмотрено',
    dropped: 'Брошено',
    favorites: 'Любимое'
  };

  const handleToggleList = (key) => {
    const updated = storage.toggleList(activeAnime, key);
    setLists({ ...updated });
    setShowListMenu(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8FC] flex flex-col animate-fade-in overflow-y-auto no-scrollbar">
      {/* Top Floating Action Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-safe pb-2 pointer-events-none">
        <button 
          onClick={onClose}
          className="pointer-events-auto w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-[#8464A5]/20 text-[#1A1311] flex items-center justify-center active:scale-90 transition-transform shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Bookmark list dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowListMenu(!showListMenu)}
              className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center active:scale-90 transition-all shadow-md ${
                currentListKey 
                  ? 'bg-[#705094] text-white border-[#705094]' 
                  : 'bg-white/80 text-[#1A1311] border-[#8464A5]/20'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${currentListKey ? 'fill-white' : ''}`} />
            </button>

            {showListMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#8464A5]/20 p-1.5 shadow-2xl z-50 animate-slide-up">
                {Object.entries(listLabels).map(([key, label]) => {
                  const isChecked = currentListKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleToggleList(key)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1311] hover:bg-[#8464A5]/10 active:scale-95 transition-all text-left"
                    >
                      <span>{label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#705094]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Backdrop Banner */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[460px] overflow-hidden bg-white shadow-sm">
        <img 
          src={posterFull} 
          alt={activeAnime.title} 
          className="w-full h-full object-cover filter blur-[2px] scale-105 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8FC] via-white/50 to-transparent" />

        {/* Foreground Poster & Title Info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
          <div className="w-28 sm:w-36 aspect-[3/4.4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white flex-shrink-0 bg-white">
            <img 
              src={posterFull} 
              alt={activeAnime.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 pb-1">
            {activeAnime.top?.global && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8464A5]/15 text-[#705094] border border-[#8464A5]/25 mb-1.5">
                <Award className="w-3 h-3 text-[#705094]" />
                <span>TOP #{activeAnime.top.global}</span>
              </div>
            )}

            <h1 className="text-xl sm:text-2xl font-shiunji-title font-bold text-[#1A1311] leading-tight line-clamp-2">
              {activeAnime.title}
            </h1>

            {activeAnime.other_titles?.[0] && (
              <p className="text-xs text-zinc-500 truncate mt-0.5 font-medium">
                {activeAnime.other_titles[0]}
              </p>
            )}

            {/* Quick meta badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] text-zinc-600 font-semibold">
              {activeAnime.year && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#8464A5]/15 shadow-sm">
                  {activeAnime.year}
                </span>
              )}
              {activeAnime.anime_status?.title && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#8464A5]/15 shadow-sm">
                  {activeAnime.anime_status.title}
                </span>
              )}
              {activeAnime.type?.name && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#8464A5]/15 shadow-sm">
                  {activeAnime.type.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="px-4 py-4 space-y-5 pb-24 max-w-xl mx-auto w-full">
        {/* Watch Button */}
        {videos.length > 0 && (
          <button
            onClick={() => onPlayEpisode(activeAnime, videos, 1, currentDub)}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#705094] hover:bg-[#604280] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#705094]/25 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Смотреть с 1 серии ({currentDub})</span>
          </button>
        )}

        {/* 5-Rating Scores Bar */}
        {activeAnime.rating && (
          <div className="bg-white rounded-2xl p-3.5 border border-[#8464A5]/15 shadow-sm">
            <h4 className="text-xs font-shiunji-title font-bold text-[#705094] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Рейтинги и оценки</span>
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
              <div className="bg-[#FAF8FC] rounded-xl p-2 border border-[#8464A5]/10">
                <div className="text-sm font-bold text-[#705094]">
                  {Number(activeAnime.rating.average || 0).toFixed(1)}
                </div>
                <div className="text-[10px] text-zinc-500 font-medium mt-0.5">YummyAnime</div>
              </div>

              {Number(activeAnime.rating.shikimori_rating || 0) > 0 && (
                <div className="bg-[#FAF8FC] rounded-xl p-2 border border-[#8464A5]/10">
                  <div className="text-sm font-bold text-sky-600">
                    {Number(activeAnime.rating.shikimori_rating).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">Shikimori</div>
                </div>
              )}

              {Number(activeAnime.rating.myanimelist_rating || 0) > 0 && (
                <div className="bg-[#FAF8FC] rounded-xl p-2 border border-[#8464A5]/10">
                  <div className="text-sm font-bold text-indigo-600">
                    {Number(activeAnime.rating.myanimelist_rating).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">MAL</div>
                </div>
              )}

              {Number(activeAnime.rating.kp_rating || 0) > 0 && (
                <div className="bg-[#FAF8FC] rounded-xl p-2 border border-[#8464A5]/10">
                  <div className="text-sm font-bold text-orange-600">
                    {Number(activeAnime.rating.kp_rating).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">Кинопоиск</div>
                </div>
              )}

              {Number(activeAnime.rating.worldart_rating || 0) > 0 && (
                <div className="bg-[#FAF8FC] rounded-xl p-2 border border-[#8464A5]/10">
                  <div className="text-sm font-bold text-emerald-600">
                    {Number(activeAnime.rating.worldart_rating).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">WorldArt</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {activeAnime.description && (
          <div className="bg-white rounded-2xl p-4 border border-[#8464A5]/15 shadow-sm">
            <h4 className="text-xs font-shiunji-title font-bold text-[#705094] uppercase tracking-wider mb-2">
              SYNOPSIS • Описание
            </h4>
            <p className={`text-xs text-[#444444] leading-relaxed font-normal ${descExpanded ? '' : 'line-clamp-4'}`}>
              {activeAnime.description}
            </p>
            {activeAnime.description.length > 200 && (
              <button 
                onClick={() => setDescExpanded(!descExpanded)}
                className="text-xs text-[#705094] font-semibold mt-2"
              >
                {descExpanded ? 'Свернуть' : 'Читать полностью...'}
              </button>
            )}
          </div>
        )}

        {/* Genres Chips */}
        {activeAnime.genres?.length > 0 && (
          <div>
            <h4 className="text-xs font-shiunji-title font-bold text-[#705094] uppercase tracking-wider mb-2">
              GENRES • Жанры
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeAnime.genres.map(genre => (
                <button
                  key={genre.id || genre.alias}
                  onClick={() => {
                    onClose();
                    onSelectGenre && onSelectGenre(genre.id || genre.alias);
                  }}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#705094] border border-[#8464A5]/25 shadow-sm active:scale-95 transition-all"
                >
                  {genre.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episodes Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-shiunji-title font-bold text-[#705094] uppercase tracking-wider">
              EPISODES • Серии ({currentEpisodes.length})
            </h4>

            {dubbings.length > 1 && (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
                {dubbings.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDubbing(d)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                      currentDub === d 
                        ? 'bg-[#705094] text-white shadow-sm' 
                        : 'bg-white text-zinc-600 border border-[#8464A5]/15'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {videosLoading ? (
            <div className="py-8 text-center text-xs text-zinc-400">Загрузка серий...</div>
          ) : currentEpisodes.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {currentEpisodes.map(ep => (
                <button
                  key={ep.video_id}
                  onClick={() => onPlayEpisode(activeAnime, videos, ep.number, currentDub)}
                  className="py-3 px-1 rounded-2xl bg-white border border-[#8464A5]/15 hover:border-[#8464A5]/40 active:scale-95 text-[#1A1311] flex flex-col items-center justify-center shadow-sm transition-all"
                >
                  <span className="text-xs font-bold">{ep.number}</span>
                  <span className="text-[9px] text-zinc-400 mt-0.5 font-medium">серия</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-zinc-400">
              Серии пока не добавлены
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
