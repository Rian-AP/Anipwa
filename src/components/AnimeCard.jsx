import React from 'react';
import { Star, Play, Film, Tv } from 'lucide-react';
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
      onClick={() => onClick(anime)}
      className="group cursor-pointer flex flex-col flex-shrink-0 transition-transform duration-200 active:scale-[0.96]"
      style={{ width: compact ? '135px' : '100%' }}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4.2] w-full rounded-2xl overflow-hidden bg-zinc-900 shadow-lg border border-white/5">
        <img 
          src={posterUrl} 
          alt={anime.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-1">
          {/* Rating Badge */}
          {Number(ratingVal) > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-300/20">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span>{formattedRating}</span>
            </div>
          )}

          {/* Type / Status badge */}
          {anime.type?.shortname && (
            <div className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 uppercase tracking-wider ml-auto">
              {anime.type.shortname}
            </div>
          )}
        </div>

        {/* Bottom hover play button */}
        <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md">
          <Play className="w-4 h-4 fill-white ml-0.5" />
        </div>

        {/* Episodes badge if ongoing */}
        {anime.episodes?.count && (
          <div className="absolute bottom-2 left-2 text-[11px] text-zinc-300 font-medium">
            {anime.episodes.aired ? `${anime.episodes.aired} / ${anime.episodes.count} эп.` : `${anime.episodes.count} эп.`}
          </div>
        )}
      </div>

      {/* Info details */}
      <div className="mt-2 flex flex-col">
        <h4 className="text-[13px] font-medium text-white line-clamp-2 leading-tight group-hover:text-red-400 transition-colors">
          {anime.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400">
          {anime.year ? <span>{anime.year}</span> : null}
          {anime.year && anime.genres?.[0]?.title && <span>•</span>}
          {anime.genres?.[0]?.title && (
            <span className="truncate">{anime.genres[0].title}</span>
          )}
        </div>
      </div>
    </div>
  );
}
