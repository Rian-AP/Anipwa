import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Flame, Film, Tv, Clock, Star, ChevronRight, Info } from 'lucide-react';
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
  const heroItems = animeList.slice(0, 5);
  const currentHero = heroItems[heroIndex] || heroItems[0];
  const ongoings = animeList.filter(a => a.anime_status?.alias === 'ongoing');
  const movies = animeList.filter(a => a.type?.alias === 'movie');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#8464A5] border-t-transparent animate-spin" />
        <span className="text-xs text-zinc-500 font-medium">Загрузка коллекции...</span>
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
    <div className="space-y-7 pb-nav">
      {/* ✦ Shiunji Editorial Key Visual Hero ✦ */}
      {currentHero && (
        <div className="relative w-full aspect-[4/3.8] sm:aspect-[16/8] max-h-[460px] overflow-hidden bg-white shadow-sm border-b border-[#8464A5]/10">
          <img 
            src={heroPoster} 
            alt={currentHero.title}
            className="w-full h-full object-cover filter brightness-[0.92] transition-all duration-700" 
          />
          {/* Dual layered gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-transparent" />

          {/* Vertical Editorial Accent (Inspired by Shiunji Side Text) */}
          <div className="absolute top-4 right-4 writing-vertical-lr text-[10px] font-bold tracking-[0.2em] text-[#705094] uppercase select-none opacity-80 hidden sm:block">
            ANIPOCKET • CURATED SELECTION
          </div>

          {/* Hero Content Information */}
          <div className="absolute bottom-5 left-4 right-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8464A5] text-white tracking-widest uppercase shadow-sm">
                FEATURED
              </span>
              {currentHero.rating?.average && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#705094] bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-sm">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{Number(currentHero.rating.average).toFixed(1)}</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-shiunji-title font-bold text-[#1A1311] leading-tight line-clamp-2">
              {currentHero.title}
            </h2>

            <p className="text-xs text-[#555555] line-clamp-2 max-w-lg leading-relaxed font-normal">
              {currentHero.description}
            </p>

            {/* Action buttons in Shiunji style */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => onSelectAnime(currentHero)}
                className="px-6 py-2.5 rounded-full bg-[#705094] hover:bg-[#604280] text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-[#705094]/20 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Смотреть</span>
              </button>

              <button 
                onClick={() => onSelectAnime(currentHero)}
                className="px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#1A1311] font-semibold text-xs border border-[#8464A5]/20 active:scale-95 transition-all shadow-sm"
              >
                О тайтле
              </button>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5 ml-auto">
                {heroItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === heroIndex ? 'w-5 bg-[#705094]' : 'w-1.5 bg-[#8464A5]/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching Section */}
      {history.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-shiunji-title font-bold text-[#1A1311] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8464A5]" />
              <span>CONTINUE WATCHING • История</span>
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {history.slice(0, 6).map(item => (
              <div 
                key={item.anime_id}
                onClick={() => onSelectAnime(item)}
                className="flex-shrink-0 w-52 bg-white rounded-2xl p-2.5 border border-[#8464A5]/15 shadow-sm active:scale-95 transition-all cursor-pointer flex gap-3 items-center"
              >
                <div className="w-14 h-18 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 shadow-sm">
                  <img 
                    src={fixImageUrl(item.poster?.small || item.poster?.medium)} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#1A1311] truncate">{item.title}</h4>
                  <span className="text-[11px] text-[#705094] font-bold mt-0.5 block">
                    Серия {item.episodeNumber}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate mt-0.5 block">
                    {item.dubbingName || "Озвучка"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ongoing Broadcasts (Shiunji ON AIR style) */}
      {ongoings.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-shiunji-title font-bold text-[#1A1311] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#8464A5]" />
                <span>ON AIR • Горячие онгоинги</span>
              </h3>
              <p className="text-[11px] text-zinc-500 font-medium">Новые эпизоды этой недели</p>
            </div>
            <span className="text-xs text-[#8464A5] font-semibold">{ongoings.length} тайтлов</span>
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

      {/* Top Anime Collection */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-shiunji-title font-bold text-[#1A1311] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8464A5]" />
              <span>TOP RATED • Золотая коллекция</span>
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium">Шедевры с наивысшими оценками зрителей</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {animeList.slice(0, 8).map(anime => (
            <AnimeCard 
              key={anime.anime_id} 
              anime={anime} 
              onClick={onSelectAnime} 
            />
          ))}
        </div>
      </section>

      {/* Movies section */}
      {movies.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-shiunji-title font-bold text-[#1A1311] flex items-center gap-2">
                <Film className="w-4 h-4 text-[#8464A5]" />
                <span>CINEMA • Полнометражные фильмы</span>
              </h3>
            </div>
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
