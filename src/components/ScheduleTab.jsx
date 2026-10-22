import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Play } from 'lucide-react';
import { api, fixImageUrl } from '../api';

export default function ScheduleTab({ onSelectAnime }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getSchedule()
      .then(res => {
        if (isMounted) {
          setSchedule(res || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load schedule", err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="px-4 pt-safe pb-nav space-y-4">
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Расписание онгоингов</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Свежие серии и даты выхода новых эпизодов
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#ff383c] border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-500">Загрузка расписания...</span>
        </div>
      ) : schedule.length > 0 ? (
        <div className="space-y-3">
          {schedule.map((item, idx) => {
            const posterUrl = fixImageUrl(item.poster?.medium || item.poster?.small || item.poster?.fullsize);
            const episodesCount = item.episodes?.aired || item.episodes?.count || "?";
            const ratingVal = typeof item.rating === 'object' ? item.rating?.average : item.rating;

            return (
              <div
                key={item.anime_id || idx}
                onClick={() => onSelectAnime(item)}
                className="ios-glass-card rounded-2xl p-3 flex gap-3.5 items-center cursor-pointer active:scale-[0.98] transition-all"
              >
                {/* Poster Thumbnail */}
                <div className="w-16 h-22 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800 shadow-md">
                  <img src={posterUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Вышло: {episodesCount} эп.
                    </span>
                    {Number(ratingVal) > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-300">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>{Number(ratingVal).toFixed(1)}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  {item.genres?.[0]?.title && (
                    <p className="text-[11px] text-zinc-400 mt-1 truncate">
                      {item.genres.map(g => g.title).slice(0, 2).join(", ")}
                    </p>
                  )}
                </div>

                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-500 text-xs">
          Расписание временно недоступно
        </div>
      )}
    </div>
  );
}
