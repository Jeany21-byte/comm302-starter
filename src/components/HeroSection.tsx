import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { MarketCategory } from '../data/marketsData';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  selectedRegion: string;
  onSelectRegion: (reg: string) => void;
}

const CATEGORIES: MarketCategory[] = [
  'Indices',
  'Stocks',
  'Crypto',
  'Futures & Commodities',
  'Forex & Currencies',
  'Bonds',
  'ETFs',
  'Economy',
];

const REGIONS = [
  { id: 'everywhere', label: 'Markets, everywhere' },
  { id: 'us', label: 'Markets, United States' },
  { id: 'europe', label: 'Markets, Europe' },
  { id: 'asia', label: 'Markets, Asia-Pacific' },
  { id: 'americas', label: 'Markets, Americas' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentRegionLabel =
    REGIONS.find((r) => r.id === selectedRegion)?.label || 'Markets, everywhere';

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-8 md:pt-10 pb-4 text-center" data-purpose="hero-title">
      {/* Title matching TradingView layout with dropdown arrow */}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="Choose market region or category"
          className="inline-flex items-center gap-2 group cursor-pointer focus:outline-none select-none"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#131722]">
            {currentRegionLabel}
          </h1>
          <ChevronDown
            className={`w-6 h-6 md:w-7 md:h-7 text-[#131722] transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
            }`}
          />
        </button>

        {/* Region selector popover */}
        {dropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-xl shadow-xl border border-[#e0e3eb] py-2 z-30 text-left animate-in fade-in zoom-in-95">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
              Select Market Region
            </div>
            {REGIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => {
                  onSelectRegion(region.id);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs md:text-sm font-medium hover:bg-[#f0f3fa] transition-colors ${
                  selectedRegion === region.id ? 'text-[#2962ff] font-bold bg-[#f0f3fa]/50' : 'text-[#131722]'
                }`}
              >
                <span>{region.label.replace('Markets, ', '')}</span>
                {selectedRegion === region.id && <Check className="w-4 h-4 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter Pills Navigation */}
      <div
        className="mt-6 md:mt-8 flex items-center justify-start md:justify-center gap-2 overflow-x-auto hide-scrollbar pb-2 px-1"
        data-purpose="market-category-tabs"
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#131722] text-white shadow-sm ring-1 ring-[#131722]'
                  : 'bg-[#f0f3fa] text-[#131722] hover:bg-[#e0e3eb]/80'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
};
