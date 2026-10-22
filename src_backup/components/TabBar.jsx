import React from 'react';
import { Compass, Calendar, Bookmark, Sparkles } from 'lucide-react';

export default function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Featured', icon: Sparkles, sub: 'トップ' },
    { id: 'catalog', label: 'Catalog', icon: Compass, sub: '作品一覧' },
    { id: 'schedule', label: 'On Air', icon: Calendar, sub: '放送日程' },
    { id: 'watchlist', label: 'Library', icon: Bookmark, sub: 'マイリスト' },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 pointer-events-none px-4">
      <nav className="max-w-[360px] mx-auto pointer-events-auto rounded-[32px] liquid-glass-tabbar px-2 py-2">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(10);
                  onTabChange(tab.id);
                }}
                className={`relative flex-1 py-1.5 px-2 rounded-[24px] flex flex-col items-center justify-center transition-all duration-300 active:scale-95 ${
                  isActive 
                    ? 'bg-[#8464A5]/12 shadow-sm' 
                    : 'hover:bg-black/[0.03]'
                }`}
              >
                {/* Active Soft Light Aura */}
                {isActive && (
                  <span className="absolute inset-0 rounded-[24px] border border-[#8464A5]/25 pointer-events-none" />
                )}

                <div className="relative">
                  <Icon 
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-[#705094]' : 'text-zinc-500'
                    }`} 
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#705094]" />
                  )}
                </div>

                <span 
                  className={`text-[10px] mt-1 font-semibold tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-[#705094]' : 'text-zinc-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
