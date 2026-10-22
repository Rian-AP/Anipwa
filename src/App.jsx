import React, { useState } from 'react';
import TabBar from './components/TabBar';
import HomeTab from './components/HomeTab';
import CatalogTab from './components/CatalogTab';
import ScheduleTab from './components/ScheduleTab';
import WatchlistTab from './components/WatchlistTab';
import AnimeDetailsModal from './components/AnimeDetailsModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import { Search } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [catalogGenre, setCatalogGenre] = useState(null);
  const [playerState, setPlayerState] = useState(null);

  const handleOpenAnime = (anime) => {
    setSelectedAnime(anime);
  };

  const handlePlayEpisode = (anime, videos, episodeNumber = 1, dubbing = null) => {
    setPlayerState({
      anime,
      videos,
      initialEpisode: episodeNumber,
      initialDubbing: dubbing
    });
  };

  const handleSelectGenreFromModal = (genreId) => {
    setSelectedAnime(null);
    setCatalogGenre(genreId);
    setActiveTab('catalog');
  };

  return (
    <div className="min-h-screen bg-[#FAF8FC] text-[#1A1311] relative flex flex-col font-sans">
      {/* Top Header with Shiunji Vibrancy Glass */}
      <header className="sticky top-0 left-0 right-0 z-30 liquid-glass-header pt-safe">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="/icon.png" 
              alt="Anipocket" 
              className="w-7 h-7 rounded-lg shadow-sm border border-[#8464A5]/20" 
            />
            <div className="flex flex-col">
              <span className="text-sm font-shiunji-title font-bold tracking-widest text-[#705094] uppercase leading-none">
                ANIPOCKET
              </span>
              <span className="text-[9px] text-zinc-400 font-medium tracking-tight">
                紫雲寺 • SHIUNJI STYLE
              </span>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('catalog')}
            className="w-8 h-8 rounded-full bg-[#8464A5]/10 flex items-center justify-center text-[#705094] active:scale-95 transition-transform"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeTab 
            onSelectAnime={handleOpenAnime} 
            onPlayEpisode={handlePlayEpisode} 
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogTab 
            onSelectAnime={handleOpenAnime} 
            initialGenre={catalogGenre} 
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTab 
            onSelectAnime={handleOpenAnime} 
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistTab 
            onSelectAnime={handleOpenAnime} 
          />
        )}
      </main>

      {/* ✦ Floating Liquid Glass TabBar ✦ */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Anime Details Modal */}
      {selectedAnime && (
        <AnimeDetailsModal 
          animeSummary={selectedAnime}
          onClose={() => setSelectedAnime(null)}
          onPlayEpisode={handlePlayEpisode}
          onSelectAnime={handleOpenAnime}
          onSelectGenre={handleSelectGenreFromModal}
        />
      )}

      {/* Fullscreen Video Player Modal */}
      {playerState && (
        <VideoPlayerModal 
          anime={playerState.anime}
          videos={playerState.videos}
          initialEpisode={playerState.initialEpisode}
          initialDubbing={playerState.initialDubbing}
          onClose={() => setPlayerState(null)}
          onSelectAnime={handleOpenAnime}
        />
      )}
    </div>
  );
}
