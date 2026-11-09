'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  compact?: boolean;
}

export default function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, currentLanguage, languages = [] } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const flag = currentLanguage?.flag || '🇺🇸';
  const code = (currentLanguage?.code || 'EN').toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
        className={`group flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#0B0A10] hover:bg-[#0F0E18] border border-purple-500/20 hover:border-purple-500/50 text-xs font-mono transition-all duration-200 shadow-sm ${
          isOpen ? 'border-purple-500 text-purple-300 ring-1 ring-purple-500/40' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <span className="text-base leading-none select-none">{flag}</span>
        <span className="font-semibold tracking-wider uppercase text-white group-hover:text-purple-300 transition-colors">
          {code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-purple-400' : 'group-hover:text-white'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0F0E18]/95 backdrop-blur-xl border border-purple-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-1.5 border-b border-purple-500/15 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-purple-400" />
              <span>Select Language</span>
            </span>
            <span className="text-purple-300 font-bold">{(languages || []).length}</span>
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
            {(languages || []).map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all duration-150 ${
                    isSelected
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-[#0B0A10]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base select-none">{lang.flag}</span>
                    <div className="text-left">
                      <div className={`leading-none ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                        {lang.name}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-normal">
                        {lang.nativeName}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-purple-900/60 border border-purple-500/60 flex items-center justify-center text-purple-300">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
