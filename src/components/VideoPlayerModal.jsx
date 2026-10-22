import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, FastForward, Play, ListVideo, Layers } from 'lucide-react';
import { storage } from '../storage';

export default function VideoPlayerModal({ 
  anime, 
  videos = [], 
  initialEpisode = 1,
  initialDubbing = null,
  onClose,
  onSelectAnime
}) {
  if (!anime || !videos.length) return null;

  // Extract unique dubbing options
  const dubbings = Array.from(new Set(videos.map(v => v.data?.dubbing).filter(Boolean)));
  const defaultDubbing = initialDubbing || dubbings[0] || "Озвучка";

  const [currentDubbing, setCurrentDubbing] = useState(defaultDubbing);
  
  // Filter videos for current dubbing
  const currentDubbingVideos = videos.filter(v => (v.data?.dubbing || "Озвучка") === currentDubbing);
  
  // Available episodes for this dubbing sorted by index / number
  const episodes = currentDubbingVideos.sort((a, b) => (Number(a.index || a.number) - Number(b.index || b.number)));

  // Current active video
  const [currentVideo, setCurrentVideo] = useState(() => {
    return episodes.find(e => Number(e.number) === Number(initialEpisode)) || episodes[0];
  });

  // Track episode change & save to history
  useEffect(() => {
    if (currentVideo && anime) {
      storage.addHistory(anime, currentVideo.number, currentDubbing);
    }
  }, [currentVideo, currentDubbing, anime]);

  const currentIndex = episodes.findIndex(e => e.video_id === currentVideo?.video_id);
  const prevVideo = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextVideo = currentIndex >= 0 && currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
      {/* Top Bar (iOS frosted header) */}
      <div className="ios-glass border-b border-white/10 px-4 pt-safe pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="overflow-hidden">
            <h3 className="text-sm font-semibold text-white truncate leading-tight">
              {anime.title}
            </h3>
            <p className="text-[11px] text-zinc-400 truncate">
              Серия {currentVideo?.number || 1} • {currentDubbing}
            </p>
          </div>
        </div>

        {/* Quick Dubbing Switcher */}
        {dubbings.length > 1 && (
          <div className="relative">
            <select
              value={currentDubbing}
              onChange={(e) => {
                const newDub = e.target.value;
                setCurrentDubbing(newDub);
                const matchingVids = videos.filter(v => (v.data?.dubbing || "Озвучка") === newDub);
                if (matchingVids.length) {
                  // try keep same episode number or fallback to first
                  const sameEp = matchingVids.find(v => v.number === currentVideo?.number) || matchingVids[0];
                  setCurrentVideo(sameEp);
                }
              }}
              className="bg-zinc-800 text-xs font-medium text-white px-2.5 py-1.5 rounded-lg border border-white/15 outline-none appearance-none pr-7 cursor-pointer"
            >
              {dubbings.map(d => (
                <option key={d} value={d} className="bg-zinc-900 text-white">
                  {d}
                </option>
              ))}
            </select>
            <Layers className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Video Container (16:9 iframe) */}
      <div className="relative aspect-video w-full bg-black shadow-2xl">
        {currentVideo?.iframe_url ? (
          <iframe
            key={currentVideo.video_id}
            src={currentVideo.iframe_url}
            title={`${anime.title} - Серия ${currentVideo.number}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
            <Play className="w-8 h-8 opacity-40" />
            <span className="text-xs">Видео недоступно</span>
          </div>
        )}
      </div>

      {/* Episode Navigation Buttons & Skip buttons */}
      <div className="px-4 py-2.5 bg-zinc-950/80 border-b border-white/5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <button
            disabled={!prevVideo}
            onClick={() => prevVideo && setCurrentVideo(prevVideo)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              prevVideo 
                ? 'bg-zinc-800 text-white active:scale-95' 
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Пред. серия</span>
          </button>

          <button
            disabled={!nextVideo}
            onClick={() => nextVideo && setCurrentVideo(nextVideo)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              nextVideo 
                ? 'bg-[#ff383c] text-white active:scale-95 shadow-sm' 
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span>След. серия</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Skip opening / ending info badge */}
        {currentVideo?.skips?.opening && (
          <div className="flex items-center gap-1 text-[11px] text-amber-300/90 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20 whitespace-nowrap">
            <FastForward className="w-3.5 h-3.5" />
            <span>Опенинг: {Math.floor(currentVideo.skips.opening.time / 60)}:{String(currentVideo.skips.opening.time % 60).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {/* Episode Selection List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <ListVideo className="w-4 h-4 text-zinc-400" />
            <span>Все серии ({episodes.length})</span>
          </h4>
          <span className="text-[11px] text-zinc-500">
            {currentVideo?.data?.player || "Плеер Aksor"}
          </span>
        </div>

        {/* Grid of episodes */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pb-8">
          {episodes.map((ep) => {
            const isSelected = ep.video_id === currentVideo?.video_id;
            return (
              <button
                key={ep.video_id}
                onClick={() => setCurrentVideo(ep)}
                className={`py-2.5 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all duration-150 active:scale-95 border ${
                  isSelected
                    ? 'bg-[#ff383c] text-white border-[#ff383c] shadow-md shadow-red-500/20'
                    : 'bg-zinc-900/90 text-zinc-300 border-white/5 hover:bg-zinc-800'
                }`}
              >
                <span>{ep.number}</span>
                {ep.duration ? (
                  <span className={`text-[9px] font-normal mt-0.5 ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                    {Math.round(ep.duration / 60)}м
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
