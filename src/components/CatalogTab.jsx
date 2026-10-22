import React, { useState, useEffect } from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
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

  useEffect(() => {
    api.getCatalogData()
      .then(res => {
        if (res.genres?.genres) {
          setGenresList(res.genres.genres);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = {
      limit: 30,
      sort: selectedSort,
    };

    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (selectedGenre) params.genres = [selectedGenre];
    if (selectedType) params.types = [selectedType];
    if (selectedStatus) params.status = [selectedStatus];

    const timeout = setTimeout(() => {
      api.getAnimeList(params)
        .then(res => {
          if (isMounted) {
            setAnimeList(res || []);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }, searchQuery ? 300 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [searchQuery, selectedGenre, selectedType, selectedStatus, selectedSort]);

  return (
    <div className="px-4 pt-safe pb-nav space-y-4 max-w-xl mx-auto">
      <div className="pt-2">
        <h1 className="text-2xl font-shiunji-title font-bold text-[#1A1311] tracking-wide">
          CATALOG • Каталог
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">Поиск и фильтрация коллекции</p>
      </div>

      {/* iOS Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8464A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию аниме..."
          className="w-full bg-white text-[#1A1311] text-xs pl-10 pr-9 py-2.5 rounded-2xl border border-[#8464A5]/20 shadow-sm outline-none focus:border-[#705094] transition-colors"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <div className="relative flex-shrink-0">
          <select 
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-white text-[#1A1311] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#8464A5]/20 shadow-sm outline-none appearance-none pr-7 cursor-pointer"
          >
            <option value="rating">По рейтингу</option>
            <option value="views">По просмотрам</option>
            <option value="year">По году</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-[#8464A5] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-white text-[#1A1311] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#8464A5]/20 shadow-sm outline-none cursor-pointer flex-shrink-0"
        >
          <option value="">Все форматы</option>
          <option value="1">Сериалы (ТВ)</option>
          <option value="2">Фильмы</option>
          <option value="7">ONA</option>
          <option value="4">OVA</option>
        </select>

        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white text-[#1A1311] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#8464A5]/20 shadow-sm outline-none cursor-pointer flex-shrink-0"
        >
          <option value="">Любой статус</option>
          <option value="0">Вышел</option>
          <option value="1">Онгоинг</option>
          <option value="2">Анонс</option>
        </select>
      </div>

      {/* Genre Pills */}
      {genresList.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              !selectedGenre 
                ? 'bg-[#705094] text-white shadow-sm' 
                : 'bg-white text-zinc-600 border border-[#8464A5]/20 shadow-sm'
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
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected 
                    ? 'bg-[#705094] text-white shadow-sm' 
                    : 'bg-white text-zinc-600 border border-[#8464A5]/20 shadow-sm'
                }`}
              >
                {g.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#8464A5] border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Поиск...</span>
        </div>
      ) : animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-1">
          {animeList.map(anime => (
            <AnimeCard 
              key={anime.anime_id} 
              anime={anime} 
              onClick={onSelectAnime} 
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-1">
          <div className="text-sm font-semibold text-zinc-600">Ничего не найдено</div>
          <div className="text-xs text-zinc-400">Попробуй изменить фильтры</div>
        </div>
      )}
    </div>
  );
}
