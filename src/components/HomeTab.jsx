import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Flame, Film, Tv, Clock, Star, ChevronRight } from 'lucide-react';
import { api, fixImageUrl } from '../api';
import { storage } from '../storage';
import AnimeCard from './AnimeCard';

export default function HomeTab({ onSelectAnime, onPlayEpisode }) {
  const [catalogData, setCatalogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setHistory(storage.getHistory());

    api.getCatalogData()
      .then(data => {
        if (isMounted) {
          setCatalogData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load catalog data", err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const animeList = catalogData?.data || [];
  
  // Featured hero items (top 4 rated/popular)
  const heroItems = animeList.slice(0, 4);
  const currentHero = heroItems[heroIndex] || heroItems[0];

  // Ongoings
  const ongoings = animeList.filter(a => a.anime_status?.alias === 'ongoing');
  
  // Movies
  const movies = animeList.filter(a => a.type?.alias === 'movie');
  
  // Popular series
  const series = animeList.filter(a => a.type?.alias === 'tv' || a.type?.alias === 'ona');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#ff383c] border-t-transparent animate-spin" />
        <span className="text-xs text-zinc-500">Загрузка каталога...</span>
      </div>
    );
  }

  const heroPoster = fixImageUrl(
    currentHero?.poster?.huge || 
    currentHero?.poster?.mega || 
    currentHero?.poster?.fullsize || 
    currentHero?.poster?.big
  );

  return (
    <div className="space-y-6 pb-nav">
      {/* Featured Hero Banner */}
      {currentHero && (
        <div className="relative aspect-[4/3] sm:aspect-[16/8] max-h-[440px] w-full overflow-hidden bg-zinc-950">
          <img 
            src={heroPoster} 
            alt={currentHero.title}
            className="w-full h-full object-cover filter brightness-75 scale-105 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff383c] text-white uppercase tracking-wider">
                Рекомендуем
              </span>
              {currentHero.rating?.average && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>{Number(currentHero.rating.average).toFixed(1)}</span>
                </div>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight line-clamp-2">
              {currentHero.title}
            </h2>

            <p className="text-xs text-zinc-300 line-clamp-2 max-w-lg">
              {currentHero.description}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button 
                onClick={() => onSelectAnime(currentHero)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Смотреть</span>
              </button>

              <button 
                onClick={() => onSelectAnime(currentHero)}
                className="px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-md text-white font-medium text-xs active:scale-95 transition-transform"
              >
                Подробнее
              </button>

              {/* Dots carousel indicators */}
              <div className="flex items-center gap-1.5 ml-auto">
                {heroItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === heroIndex ? 'w-5 bg-[#ff383c]' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching Section (if history exists) */}
      {history.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#ff383c]" />
              <span>Продолжить просмотр</span>
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {history.slice(0, 5).map(item => (
              <div 
                key={item.anime_id}
                onClick={() => onSelectAnime(item)}
                className="flex-shrink-0 w-48 bg-zinc-900 rounded-xl p-2.5 border border-white/5 active:scale-95 transition-all cursor-pointer flex gap-2.5"
              >
                <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                  <img 
                    src={fixImageUrl(item.poster?.small || item.poster?.medium)} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                  <span className="text-[11px] text-[#ff383c] font-medium mt-0.5">
                    Серия {item.episodeNumber}
                  </span>
                  <span className="text-[10px] text-zinc-500 truncate mt-0.5">
                    {item.dubbingName || "Озвучка"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Ongoings Horizontal Scroll */}
      {ongoings.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Горячие онгоинги</span>
            </h3>
            <span className="text-xs text-zinc-500">{ongoings.length} тайтлов</span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {ongoings.map(anime => (
              <AnimeCard 
                key={anime.anime_id} 
                anime={anime} 
                onClick={onSelectAnime} 
                compact={true} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Top Anime Grid */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Лучшее за всё время</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {animeList.slice(0, 8).map(anime => (
            <AnimeCard 
              key={anime.anime_id} 
              anime={anime} 
              onClick={onSelectAnime} 
            />
          ))}
        </div>
      </section>

      {/* Movies Section */}
      {movies.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Film className="w-4 h-4 text-purple-400" />
              <span>Полнометражные фильмы</span>
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {movies.map(anime => (
              <AnimeCard 
                key={anime.anime_id} 
                anime={anime} 
                onClick={onSelectAnime} 
                compact={true} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
