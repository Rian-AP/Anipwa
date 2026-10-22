import React, { useState, useEffect } from 'react';
import { 
  X, Star, Play, Bookmark, Share2, Calendar, Clock, 
  Users, Film, Tv, Check, ChevronRight, Eye, ShieldAlert,
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

  // Load complete anime details and videos
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
        console.error("Failed to load details, fallback to summary", err);
        if (isMounted) {
          setAnime(animeSummary);
          setLoading(false);
        }
      });

    // Load videos
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

  // Group videos by dubbing
  const dubbings = Array.from(new Set(videos.map(v => v.data?.dubbing).filter(Boolean)));
  const currentDub = selectedDubbing || dubbings[0] || "Озвучка";
  const currentEpisodes = videos
    .filter(v => (v.data?.dubbing || "Озвучка") === currentDub)
    .sort((a, b) => Number(a.index || a.number) - Number(b.index || b.number));

  // Determine current list status
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeAnime.title,
          text: `Смотри аниме "${activeAnime.title}" в Anipocket!`,
          url: window.location.href,
        });
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in overflow-y-auto no-scrollbar">
      {/* Top Floating Action Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-safe pb-2 pointer-events-none">
        <button 
          onClick={onClose}
          className="pointer-events-auto w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pointer-events-auto flex items-center gap-2">
          {navigator.share && (
            <button 
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Bookmark list dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowListMenu(!showListMenu)}
              className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center active:scale-90 transition-all shadow-lg ${
                currentListKey 
                  ? 'bg-[#ff383c] text-white border-[#ff383c]' 
                  : 'bg-black/60 text-white border-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${currentListKey ? 'fill-white' : ''}`} />
            </button>

            {showListMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-1.5 shadow-2xl z-50 animate-slide-up">
                {Object.entries(listLabels).map(([key, label]) => {
                  const isChecked = currentListKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleToggleList(key)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-white/10 active:scale-95 transition-all text-left"
                    >
                      <span>{label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#ff383c]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Backdrop Banner */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[460px] overflow-hidden bg-zinc-950">
        <img 
          src={posterFull} 
          alt={activeAnime.title} 
          className="w-full h-full object-cover filter blur-[2px] scale-105 opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        {/* Foreground Poster & Title Info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
          <div className="w-28 sm:w-36 aspect-[3/4.2] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 flex-shrink-0 bg-zinc-900">
            <img 
              src={posterFull} 
              alt={activeAnime.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 pb-1">
            {/* Top global badge */}
            {activeAnime.top?.global && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-1.5">
                <Award className="w-3 h-3 text-amber-400" />
                <span>ТОП #{activeAnime.top.global}</span>
              </div>
            )}

            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight line-clamp-2">
              {activeAnime.title}
            </h1>

            {activeAnime.other_titles?.[0] && (
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                {activeAnime.other_titles[0]}
              </p>
            )}

            {/* Quick meta badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-zinc-300">
              {activeAnime.year && (
                <span className="px-1.5 py-0.5 rounded-md bg-white/10 font-medium">
                  {activeAnime.year}
                </span>
              )}
              {activeAnime.anime_status?.title && (
                <span className="px-1.5 py-0.5 rounded-md bg-white/10 font-medium">
                  {activeAnime.anime_status.title}
                </span>
              )}
              {activeAnime.type?.name && (
                <span className="px-1.5 py-0.5 rounded-md bg-white/10 font-medium">
                  {activeAnime.type.name}
                </span>
              )}
              {activeAnime.min_age?.title && (
                <span className="px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-300 font-semibold border border-red-500/30">
                  {activeAnime.min_age.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="px-4 py-4 space-y-5 pb-24">
        {/* Watch Button Call-to-action */}
        {videos.length > 0 && (
          <button
            onClick={() => onPlayEpisode(activeAnime, videos, 1, currentDub)}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#ff383c] hover:bg-[#ff2428] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Смотреть с 1 серии ({currentDub})</span>
          </button>
        )}

        {/* All Ratings Section (Shikimori, MAL, Кинопоиск, WorldArt, Yummy) */}
        {activeAnime.rating && (
          <div className="ios-glass-card rounded-2xl p-3">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Оценки и рейтинги</span>
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
              {/* YummyAnime */}
              <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                <div className="text-sm font-bold text-amber-300">
                  {Number(activeAnime.rating.average || 0).toFixed(1)}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">YummyAnime</div>
                {activeAnime.rating.counters ? (
                  <div className="text-[9px] text-zinc-500">{activeAnime.rating.counters} голосов</div>
                ) : null}
              </div>

              {/* Shikimori */}
              {Number(activeAnime.rating.shikimori_rating || 0) > 0 && (
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                  <div className="text-sm font-bold text-sky-400">
                    {Number(activeAnime.rating.shikimori_rating).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Shikimori</div>
                </div>
              )}

              {/* MyAnimeList */}
              {Number(activeAnime.rating.myanimelist_rating || 0) > 0 && (
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                  <div className="text-sm font-bold text-indigo-400">
                    {Number(activeAnime.rating.myanimelist_rating).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">MAL</div>
                </div>
              )}

              {/* Кинопоиск */}
              {Number(activeAnime.rating.kp_rating || 0) > 0 && (
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                  <div className="text-sm font-bold text-orange-400">
                    {Number(activeAnime.rating.kp_rating).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Кинопоиск</div>
                </div>
              )}

              {/* WorldArt */}
              {Number(activeAnime.rating.worldart_rating || 0) > 0 && (
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                  <div className="text-sm font-bold text-emerald-400">
                    {Number(activeAnime.rating.worldart_rating).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">WorldArt</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Synopsis / Description */}
        {activeAnime.description && (
          <div className="ios-glass-card rounded-2xl p-4">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Описание
            </h4>
            <p className={`text-xs sm:text-sm text-zinc-300 leading-relaxed ${descExpanded ? '' : 'line-clamp-4'}`}>
              {activeAnime.description}
            </p>
            {activeAnime.description.length > 200 && (
              <button 
                onClick={() => setDescExpanded(!descExpanded)}
                className="text-xs text-[#ff383c] font-medium mt-1.5"
              >
                {descExpanded ? 'Свернуть' : 'Читать полностью...'}
              </button>
            )}
          </div>
        )}

        {/* Genres Chips */}
        {activeAnime.genres?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Жанры
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeAnime.genres.map(genre => (
                <button
                  key={genre.id || genre.alias}
                  onClick={() => {
                    onClose();
                    onSelectGenre && onSelectGenre(genre.id || genre.alias);
                  }}
                  className="px-2.5 py-1 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 border border-white/5 active:scale-95 hover:border-white/20 transition-all"
                >
                  {genre.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Specifications & Metadata Grid */}
        <div className="ios-glass-card rounded-2xl p-4 space-y-2.5 text-xs">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Информация о тайтле
          </h4>

          {/* Season & Year */}
          {(activeAnime.season || activeAnime.year) && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Сезон и год</span>
              <span className="text-white font-medium">
                {formatSeason(activeAnime.season)} {activeAnime.year}
              </span>
            </div>
          )}

          {/* Episodes */}
          {activeAnime.episodes?.count && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Эпизоды</span>
              <span className="text-white font-medium">
                {activeAnime.episodes.aired ? `${activeAnime.episodes.aired} из ${activeAnime.episodes.count}` : activeAnime.episodes.count}
              </span>
            </div>
          )}

          {/* Duration */}
          {activeAnime.duration ? (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Длительность</span>
              <span className="text-white font-medium">
                {formatDuration(activeAnime.duration)}
              </span>
            </div>
          ) : null}

          {/* Source */}
          {activeAnime.original && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Первоисточник</span>
              <span className="text-white font-medium">{activeAnime.original}</span>
            </div>
          )}

          {/* Studios */}
          {activeAnime.studios?.length > 0 && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Студия</span>
              <span className="text-white font-medium">
                {activeAnime.studios.map(s => s.title).join(", ")}
              </span>
            </div>
          )}

          {/* Creators / Directors */}
          {activeAnime.creators?.length > 0 && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Режиссёр</span>
              <span className="text-white font-medium truncate max-w-[200px]">
                {activeAnime.creators.map(c => c.title).join(", ")}
              </span>
            </div>
          )}

          {/* Translates / Dubbing types */}
          {activeAnime.translates?.length > 0 && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Переводы</span>
              <span className="text-white font-medium">
                {activeAnime.translates.map(t => t.title).join(", ")}
              </span>
            </div>
          )}

          {/* Views */}
          {activeAnime.views && (
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Просмотры</span>
              <span className="text-white font-medium">
                {Number(activeAnime.views).toLocaleString('ru-RU')}
              </span>
            </div>
          )}
        </div>

        {/* Viewing Order (Франшиза и порядок просмотра) */}
        {activeAnime.viewing_order?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#ff383c]" />
              <span>Порядок просмотра франшизы</span>
            </h4>
            <div className="space-y-2">
              {activeAnime.viewing_order.map((item, idx) => {
                const isCurrent = item.anime_id === activeAnime.anime_id;
                const posterUrl = fixImageUrl(item.poster?.small || item.poster?.medium);
                return (
                  <div
                    key={item.anime_id || idx}
                    onClick={() => {
                      if (!isCurrent) {
                        onSelectAnime(item);
                      }
                    }}
                    className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${
                      isCurrent 
                        ? 'bg-[#ff383c]/10 border-[#ff383c]/40' 
                        : 'bg-zinc-900/60 border-white/5 hover:border-white/20 cursor-pointer active:scale-[0.98]'
                    }`}
                  >
                    <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                      <img src={posterUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-semibold text-[#ff383c]">
                          {item.data?.text || `Часть ${idx + 1}`}
                        </span>
                        {item.year ? <span className="text-[10px] text-zinc-500">• {item.year}</span> : null}
                      </div>
                      <h5 className="text-xs font-medium text-white truncate">
                        {item.title}
                      </h5>
                    </div>
                    {!isCurrent && <ChevronRight className="w-4 h-4 text-zinc-500" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Episodes Section with Dubbing Switcher */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Серии ({currentEpisodes.length})
            </h4>

            {/* Dubbing Selector Pills */}
            {dubbings.length > 1 && (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
                {dubbings.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDubbing(d)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap ${
                      currentDub === d 
                        ? 'bg-[#ff383c] text-white' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {videosLoading ? (
            <div className="py-8 text-center text-xs text-zinc-500">Загрузка серий...</div>
          ) : currentEpisodes.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {currentEpisodes.map(ep => (
                <button
                  key={ep.video_id}
                  onClick={() => onPlayEpisode(activeAnime, videos, ep.number, currentDub)}
                  className="py-3 px-1 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/20 active:scale-95 text-white flex flex-col items-center justify-center transition-all"
                >
                  <span className="text-xs font-semibold">{ep.number}</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">серия</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-zinc-500">
              Видео для этого тайтла пока не добавлены
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
