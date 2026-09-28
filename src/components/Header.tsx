import React, { useState } from 'react';
import { Search, Globe, User, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  activeNav,
  setActiveNav,
  onGetStarted,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const navLinks = ['Products', 'Community', 'Markets', 'Brokers', 'More'];
  const languages = ['EN', 'ES', 'DE', 'FR', 'JA', 'ZH'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e0e3eb]/80 text-sm">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left side: TradingView Logo & Search Bar */}
        <div className="flex items-center gap-6">
          {/* TradingView Geometric Icon Mark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="TradingView Home"
            className="flex items-center text-black hover:opacity-85 transition-opacity shrink-0"
          >
            <svg
              className="w-8 h-6 fill-current text-[#131722]"
              fill="none"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.7 0H0v28h8.7V0z"></path>
              <path d="M19.7 7.2H11V28h8.7V7.2z"></path>
              <path d="M30.7 14.5H22V28h8.7V14.5z"></path>
            </svg>
          </a>

          {/* Search Input Bar with Ctrl+K badge */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center w-56 md:w-68 h-9 pl-3 pr-2.5 rounded-full bg-[#f0f3fa]/90 hover:bg-[#f0f3fa] border border-transparent hover:border-[#e0e3eb] transition-all cursor-pointer text-[#787b86] text-xs text-left group"
          >
            <Search className="w-3.5 h-3.5 text-[#787b86] mr-2.5 shrink-0 group-hover:text-[#131722] transition-colors" />
            <span className="flex-grow font-normal text-[#787b86] group-hover:text-[#131722] transition-colors">
              Search (Ctrl+K)
            </span>
          </button>

          {/* Navigation Links */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-6 text-[14px] font-medium">
            {navLinks.map((link) => {
              const isActive = activeNav === link;
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => setActiveNav(link)}
                  className={`relative py-4 transition-colors font-medium cursor-pointer ${
                    isActive
                      ? 'text-[#2962ff] font-semibold'
                      : 'text-[#131722] hover:text-[#2962ff]'
                  }`}
                >
                  {link}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2962ff] rounded-t-sm"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side Controls: Language, Profile, CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label="Select Language"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#f0f3fa] text-[#131722] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#131722]" />
              <span>{currentLang}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-lg shadow-lg border border-[#e0e3eb] py-1 z-50 animate-in fade-in zoom-in-95">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setCurrentLang(lang);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#f0f3fa] transition-colors ${
                      currentLang === lang ? 'text-[#2962ff] font-bold' : 'text-[#131722]'
                    }`}
                  >
                    {lang === 'EN' && 'English'}
                    {lang === 'ES' && 'Español'}
                    {lang === 'DE' && 'Deutsch'}
                    {lang === 'FR' && 'Français'}
                    {lang === 'JA' && '日本語'}
                    {lang === 'ZH' && '中文'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Icon Button */}
          <button
            type="button"
            onClick={onGetStarted}
            aria-label="User Account Menu"
            className="p-1.5 rounded-full hover:bg-[#f0f3fa] text-[#131722] transition-colors cursor-pointer"
            title="Account"
          >
            <User className="w-4 h-4 text-[#131722]" />
          </button>

          {/* Get Started CTA Gradient Button */}
          <button
            type="button"
            onClick={onGetStarted}
            className="tv-btn-gradient text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
          >
            Get started
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md hover:bg-[#f0f3fa] text-[#131722]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e0e3eb] bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top duration-150">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => {
                  setActiveNav(link);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeNav === link
                    ? 'bg-[#f0f3fa] text-[#2962ff] font-semibold'
                    : 'text-[#131722] hover:bg-[#f0f3fa]'
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
