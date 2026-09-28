import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import {
  PRIMARY_INDICES,
  WORLD_INDICES_ITEMS,
  US_STOCKS_ITEMS,
  CRYPTO_ITEMS,
  COMMODITIES_SUMMARY,
  MarketInstrument,
  convertToInstrument,
} from '../data/marketsData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInstrument: (instrument: MarketInstrument) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectInstrument,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or shortcut
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Aggregate all searchable items
  interface SearchResultItem {
    id: string;
    symbol: string;
    name: string;
    category: string;
    price: string;
    change: string;
    isPositive: boolean;
    instrument: MarketInstrument;
  }

  const allItems: SearchResultItem[] = [
    ...PRIMARY_INDICES.map((item) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      category: 'Indices',
      price: item.formattedPrice,
      change: item.formattedChangePercent,
      isPositive: item.isPositive,
      instrument: item,
    })),
    ...WORLD_INDICES_ITEMS.map((item) => ({
      id: item.id,
      symbol: item.code,
      name: item.name,
      category: 'Indices',
      price: item.price,
      change: item.changePercent,
      isPositive: item.isPositive,
      instrument: convertToInstrument(item, 'INDEX'),
    })),
    ...US_STOCKS_ITEMS.map((item) => ({
      id: item.id,
      symbol: item.ticker,
      name: item.name,
      category: 'Stocks',
      price: item.price,
      change: item.changePercent,
      isPositive: item.isPositive,
      instrument: convertToInstrument(item, 'STOCK'),
    })),
    ...CRYPTO_ITEMS.map((item) => ({
      id: item.id,
      symbol: item.ticker,
      name: item.name,
      category: 'Crypto',
      price: item.price,
      change: item.changePercent,
      isPositive: item.isPositive,
      instrument: convertToInstrument(item, 'CRYPTO'),
    })),
    ...COMMODITIES_SUMMARY.map((item) => ({
      id: item.id,
      symbol: item.subName,
      name: item.name,
      category: item.categoryLabel,
      price: item.price,
      change: item.changePercent,
      isPositive: item.isPositive,
      instrument: convertToInstrument(item, 'COMMODITY'),
    })),
  ];

  // Filter items
  const filtered = allItems.filter((item) => {
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;

    return matchesQuery && matchesCategory;
  });

  const categoryChips = ['All', 'Indices', 'Stocks', 'Crypto', 'Commodity', 'Currency'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e0e3eb]">
          <Search className="w-5 h-5 text-[#787b86] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, or market (e.g. NVDA, Apple, BTC, S&P 500)..."
            className="w-full text-base text-[#131722] placeholder-[#787b86] bg-transparent outline-none font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#f0f3fa] rounded-full text-[#787b86]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-semibold text-[#787b86] bg-[#f0f3fa] rounded border border-[#e0e3eb]">
            ESC
          </span>
        </div>

        {/* Category Pills inside search */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#e0e3eb]/60 bg-[#f8f9fd] overflow-x-auto hide-scrollbar text-xs">
          {categoryChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSelectedCategoryFilter(chip)}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                selectedCategoryFilter === chip
                  ? 'bg-[#131722] text-white shadow-xs'
                  : 'bg-white text-[#787b86] hover:text-[#131722] border border-[#e0e3eb]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#e0e3eb]/50 p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#787b86]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No markets matching "{query}"</p>
              <p className="text-xs mt-1 text-[#787b86]/80">
                Try searching for S&P 500, Nvidia, Bitcoin, or Gold
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id + item.category}
                onClick={() => {
                  onSelectInstrument(item.instrument);
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#f0f3fa] cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                        {item.symbol}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f0f3fa] text-[#787b86]">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs text-[#787b86] truncate max-w-xs sm:max-w-sm">
                      {item.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono tabular-nums">
                    <span className="text-sm font-semibold block text-[#131722]">
                      {item.price}
                    </span>
                    <span
                      className={`text-xs font-bold inline-flex items-center gap-0.5 ${
                        item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {item.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {item.change}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#f8f9fd] border-t border-[#e0e3eb] flex items-center justify-between text-[11px] text-[#787b86]">
          <span>Select any result to view interactive live chart</span>
          <span>Tip: Press Ctrl+K anytime</span>
        </div>
      </div>
    </div>
  );
};
