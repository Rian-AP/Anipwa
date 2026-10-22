import React from 'react';
import { Star, Play } from 'lucide-react';
import { fixImageUrl } from '../api';

export default function AnimeCard({ anime, onClick, compact = false }) {
  if (!anime) return null;

  const posterUrl = fixImageUrl(
    anime.poster?.medium || 
    anime.poster?.big || 
    anime.poster?.small || 
    anime.poster?.fullsize
  );

  const ratingVal = typeof anime.rating === 'object' 
    ? (anime.rating?.average || anime.rating?.shikimori_rating || 0)
    : (anime.rating || 0);

  const formattedRating = Number(ratingVal).toFixed(1);

  return (
    <div 
      onClick={() => {
        if (navigator.vibrate) navigator.vibrate(8);
        onClick(anime);
      }}
      className="group cursor-pointer flex flex-col flex-shrink-0 transition-transform duration-200 active:scale-[0.97]"
      style={{ width: compact ? '140px' : '100%' }}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4.4] w-full rounded-2xl overflow-hidden bg-zinc-100 shadow-[0_8px_24px_-6px_rgba(112,80,148,0.12)] border border-[#8464A5]/15">
        <img 
          src={posterUrl} 
          alt={anime.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Soft atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 opacity-70 group-hover:opacity-85 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-1">
          {Number(ratingVal) > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#705094] shadow-sm">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{formattedRating}</span>
            </div>
          )}

          {anime.type?.shortname && (
            <div className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 uppercase tracking-widest ml-auto">
              {anime.type.shortname}
            </div>
          )}
        </div>

        {/* Hover play button */}
        <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#705094] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md">
          <Play className="w-4 h-4 fill-white ml-0.5" />
        </div>

        {/* Episodes badge */}
        {anime.episodes?.count && (
          <div className="absolute bottom-2 left-2 text-[10px] text-white/95 font-medium drop-shadow-sm">
            {anime.episodes.aired ? `${anime.episodes.aired} / ${anime.episodes.count} эп.` : `${anime.episodes.count} эп.`}
          </div>
        )}
      </div>

      {/* Info details */}
      <div className="mt-2.5 flex flex-col">
        <h4 className="text-[13px] font-semibold text-[#1A1311] line-clamp-2 leading-snug group-hover:text-[#705094] transition-colors">
          {anime.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-500 font-medium">
          {anime.year ? <span>{anime.year}</span> : null}
          {anime.year && anime.genres?.[0]?.title && <span>•</span>}
          {anime.genres?.[0]?.title && (
            <span className="truncate text-[#8464A5]">{anime.genres[0].title}</span>
          )}
        </div>
      </div>
    </div>
  );
}
