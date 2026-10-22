import React from 'react';
import { Home, Compass, Calendar, Bookmark } from 'lucide-react';

export default function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'catalog', label: 'Каталог', icon: Compass },
    { id: 'schedule', label: 'Онгоинги', icon: Calendar },
    { id: 'watchlist', label: 'Моё', icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 ios-glass border-t border-white/10 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-14 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-full transition-transform active:scale-90"
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-[#ff383c]' : 'text-zinc-400'
                  }`} 
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff383c]" />
                )}
              </div>
              <span 
                className={`text-[10px] mt-1 tracking-tight font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#ff383c] font-semibold' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
