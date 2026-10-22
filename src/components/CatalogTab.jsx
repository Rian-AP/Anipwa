import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { api } from '../api';
import AnimeCard from './AnimeCard';

export default function CatalogTab({ onSelectAnime, initialGenre = null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSort, setSelectedSort] = useState('rating');
  const [genresList, setGenresList] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load genres once
  useEffect(() => {
    api.getCatalogData()
      .then(res => {
        if (res.genres?.genres) {
          setGenresList(res.genres.genres);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch filtered anime
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = {
      limit: 30,
      sort: selectedSort,
    };

    if (searchQuery.trim()) {
      params.q = searchQuery.trim();
    }
    if (selectedGenre) {
      params.genres = [selectedGenre];
    }
    if (selectedType) {
      params.types = [selectedType];
    }
    if (selectedStatus) {
      params.status = [selectedStatus];
    }

    // Debounce search query
    const timeout = setTimeout(() => {
      api.getAnimeList(params)
        .then(res => {
          if (isMounted) {
            setAnimeList(res || []);
            setLoading(false);
          }
        })
        .catch(err => {
          console.error("Filter error", err);
          if (isMounted) setLoading(false);
        });
    }, searchQuery ? 300 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [searchQuery, selectedGenre, selectedType, selectedStatus, selectedSort]);

  return (
    <div className="px-4 pt-safe pb-nav space-y-4">
      {/* Header title */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Каталог</h1>
      </div>

      {/* iOS Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию аниме..."
          className="w-full bg-zinc-900 text-white text-xs pl-10 pr-9 py-2.5 rounded-xl border border-white/10 outline-none focus:border-[#ff383c]/50 transition-colors"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-700 text-zinc-300 flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Sort Dropdown */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {/* Sort select */}
        <div className="relative flex-shrink-0">
          <select 
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-zinc-900 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-xl border border-white/10 outline-none appearance-none pr-7 cursor-pointer"
          >
            <option value="rating">По рейтингу</option>
            <option value="views">По просмотрам</option>
            <option value="year">По году</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Type select */}
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-zinc-900 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-xl border border-white/10 outline-none cursor-pointer flex-shrink-0"
        >
          <option value="">Все форматы</option>
          <option value="1">Сериалы (ТВ)</option>
          <option value="2">Фильмы</option>
          <option value="7">ONA</option>
          <option value="4">OVA</option>
        </select>

        {/* Status select */}
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-zinc-900 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-xl border border-white/10 outline-none cursor-pointer flex-shrink-0"
        >
          <option value="">Любой статус</option>
          <option value="0">Вышел</option>
          <option value="1">Онгоинг</option>
          <option value="2">Анонс</option>
        </select>
      </div>

      {/* Genre Chips Horizontal Carousel */}
      {genresList.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              !selectedGenre 
                ? 'bg-[#ff383c] text-white shadow-sm' 
                : 'bg-zinc-900 text-zinc-400 border border-white/5 hover:border-white/20'
            }`}
          >
            Все жанры
          </button>
          {genresList.map(g => {
            const isSelected = selectedGenre === g.value || selectedGenre === g.href;
            return (
              <button
                key={g.value}
                onClick={() => setSelectedGenre(isSelected ? null : g.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected 
                    ? 'bg-[#ff383c] text-white shadow-sm' 
                    : 'bg-zinc-900 text-zinc-400 border border-white/5 hover:border-white/20'
                }`}
              >
                {g.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Anime Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#ff383c] border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-500">Поиск тайтлов...</span>
        </div>
      ) : animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-1">
          {animeList.map(anime => (
            <AnimeCard 
              key={anime.anime_id} 
              anime={anime} 
              onClick={onSelectAnime} 
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-2">
          <div className="text-sm font-semibold text-zinc-300">Ничего не найдено</div>
          <div className="text-xs text-zinc-500">Попробуй изменить фильтры или поисковый запрос</div>
        </div>
      )}
    </div>
  );
}
