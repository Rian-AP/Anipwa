import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Trash2, Play, Heart } from 'lucide-react';
import { storage } from '../storage';
import AnimeCard from './AnimeCard';

export default function WatchlistTab({ onSelectAnime }) {
  const [activeSubTab, setActiveSubTab] = useState('history');
  const [lists, setLists] = useState(storage.getLists());
  const [history, setHistory] = useState(storage.getHistory());

  useEffect(() => {
    setLists(storage.getLists());
    setHistory(storage.getHistory());
  }, [activeSubTab]);

  const subTabs = [
    { id: 'history', label: 'История' },
    { id: 'watching', label: 'Смотрю' },
    { id: 'planned', label: 'В планах' },
    { id: 'favorites', label: 'Любимое' },
    { id: 'completed', label: 'Просмотрено' },
  ];

  const handleClearHistory = () => {
    if (confirm("Очистить историю просмотров?")) {
      storage.clearHistory();
      setHistory([]);
    }
  };

  const currentList = activeSubTab === 'history' ? history : (lists[activeSubTab] || []);

  return (
    <div className="px-4 pt-safe pb-nav space-y-4">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Мой список</h1>
        {activeSubTab === 'history' && history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium active:scale-95 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Очистить</span>
          </button>
        )}
      </div>

      {/* Segmented iOS Style Switcher */}
      <div className="flex bg-zinc-900/90 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content list */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-1">
          {currentList.map((item, idx) => (
            <div key={item.anime_id || idx} className="relative">
              <AnimeCard anime={item} onClick={onSelectAnime} />
              {activeSubTab === 'history' && item.episodeNumber && (
                <div className="text-[11px] font-semibold text-[#ff383c] mt-0.5">
                  Серия {item.episodeNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-zinc-500 mb-3">
            {activeSubTab === 'history' ? <Clock className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
          </div>
          <div className="text-sm font-semibold text-zinc-300">
            {activeSubTab === 'history' ? 'История пуста' : 'Список пуст'}
          </div>
          <div className="text-xs text-zinc-500 max-w-xs mx-auto">
            {activeSubTab === 'history' 
              ? 'Начни смотреть любое аниме, и оно появится здесь автоматически' 
              : 'Добавляй аниме в закладки, чтобы не потерять'}
          </div>
        </div>
      )}
    </div>
  );
}
