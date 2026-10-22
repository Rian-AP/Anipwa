import React, { useState } from 'react';
import { Home, Compass, Bookmark, Settings, Sparkles, Moon, Sun } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(false);

  const tabs = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'search', label: 'Поиск', icon: Compass },
    { id: 'library', label: 'Медиатека', icon: Bookmark },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isDark ? 'bg-[#08080A] text-white' : 'bg-[#FAF8FC] text-[#1A1311]'}`}>
      {/* Minimal Top Header */}
      <header className="fixed top-0 left-0 right-0 z-30 pt-safe px-6 h-14 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-[#705094]'}`}>
            LIQUID GLASS LAB
          </span>
        </div>

        {/* Theme Toggle (Light / Dark mode test) */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`pointer-events-auto px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
            isDark 
              ? 'bg-zinc-800/90 text-amber-300 border border-white/10' 
              : 'bg-white/90 text-[#705094] border border-[#8464A5]/20'
          }`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
        </button>
      </header>

      {/* Scrollable Canvas to test glass refraction & blur */}
      <main className="max-w-md mx-auto px-6 pt-24 pb-36 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Тест Liquid Glass
          </h1>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Листай страницу вниз и вверх: обрати внимание, как разноцветные элементы и карточки мягко преломляются и размываются прямо под плавающей капсулой таб-бара.
          </p>
        </div>

        {/* Color spots to test optical blur & transparency */}
        <div className="space-y-4">
          <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
            Фоновые цветовые пятна для проверки размытия
          </span>

          <div className="relative h-44 rounded-3xl overflow-hidden shadow-lg border border-white/20 p-5 flex flex-col justify-end bg-gradient-to-tr from-[#8464A5] via-[#FCB180] to-[#FCA1A9]">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/30 backdrop-blur-md" />
            <span className="text-white text-lg font-bold drop-shadow-md">
              Яркий градиент
            </span>
            <span className="text-white/80 text-xs drop-shadow">
              Проскролль таб-бар поверх этого блока
            </span>
          </div>

          <div className="relative h-44 rounded-3xl overflow-hidden shadow-lg border border-white/20 p-5 flex flex-col justify-end bg-gradient-to-tr from-[#81CEF7] via-[#AAB0FF] to-[#A0D5C2]">
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-indigo-500/30 blur-xl" />
            <span className="text-white text-lg font-bold drop-shadow-md">
              Мятно-лавандовый градиент
            </span>
            <span className="text-white/80 text-xs drop-shadow">
              Проверь четкость нижнего стекла
            </span>
          </div>

          {/* Dummy clean cards */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`p-4 rounded-2xl border transition-all ${
                isDark 
                  ? 'bg-zinc-900/60 border-white/5' 
                  : 'bg-white border-[#8464A5]/15 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8464A5] to-[#FCB180] flex items-center justify-center text-white font-bold text-xs">
                  0{i}
                </div>
                <div>
                  <h4 className="text-xs font-bold">Тестовый блок #{i}</h4>
                  <p className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Скроллится прямо сквозь стекло таб-бара
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ✦ THE FLOATING LIQUID GLASS TAB BAR CAPSULE ✦ */}
      <div className="fixed bottom-6 left-0 right-0 z-40 pointer-events-none px-4">
        <nav 
          style={{
            backdropFilter: 'blur(30px) saturate(200%) contrast(92%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%) contrast(92%)',
          }}
          className={`max-w-[340px] mx-auto pointer-events-auto rounded-[36px] p-2 transition-all duration-300 ${
            isDark 
              ? 'bg-[#1C1C1E]/70 border border-white/15 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.25)]' 
              : 'bg-white/72 border border-white/90 shadow-[0_20px_45px_-10px_rgba(112,80,148,0.22),0_1px_2px_rgba(112,80,148,0.1),inset_0_1.5px_1px_rgba(255,255,255,1)]'
          }`}
        >
          <div className="flex items-center justify-between relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(8);
                    setActiveTab(tab.id);
                  }}
                  className={`relative flex-1 py-2 px-1 rounded-[26px] flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                    isActive 
                      ? (isDark ? 'bg-white/10 shadow-sm' : 'bg-[#8464A5]/12 shadow-sm') 
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Subtle active border glow */}
                  {isActive && (
                    <span 
                      className={`absolute inset-0 rounded-[26px] border pointer-events-none ${
                        isDark ? 'border-white/20' : 'border-[#8464A5]/30'
                      }`} 
                    />
                  )}

                  <div className="relative">
                    <Icon 
                      strokeWidth={isActive ? 2.4 : 1.8}
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive 
                          ? (isDark ? 'text-white' : 'text-[#705094]') 
                          : (isDark ? 'text-zinc-500' : 'text-zinc-400')
                      }`} 
                    />
                    {isActive && (
                      <span 
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                          isDark ? 'bg-white shadow-[0_0_8px_white]' : 'bg-[#705094]'
                        }`} 
                      />
                    )}
                  </div>

                  <span 
                    className={`text-[10px] mt-1 font-semibold tracking-tight transition-colors duration-200 ${
                      isActive 
                        ? (isDark ? 'text-white' : 'text-[#705094]') 
                        : (isDark ? 'text-zinc-500' : 'text-zinc-400')
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
    </div>
  );
}
