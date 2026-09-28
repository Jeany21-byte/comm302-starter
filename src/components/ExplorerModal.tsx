import React, { useState } from 'react';
import { X, Search, ArrowUpDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import {
  WORLD_INDICES_ITEMS,
  US_STOCKS_ITEMS,
  CRYPTO_ITEMS,
  PRIMARY_INDICES,
  MarketInstrument,
  convertToInstrument,
} from '../data/marketsData';

export type ExplorerType = 'world-indices' | 'us-stocks' | 'crypto' | 'screeners' | 'heatmaps' | 'economic-calendar';

interface ExplorerModalProps {
  type: ExplorerType | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectInstrument: (instrument: MarketInstrument) => void;
}

export const ExplorerModal: React.FC<ExplorerModalProps> = ({
  type,
  isOpen,
  onClose,
  onSelectInstrument,
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'symbol' | 'price' | 'change'>('change');
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen || !type) return null;

  let title = 'Market Explorer';
  let subtitle = 'Comprehensive overview and analytics';
  let rawItems: {
    id: string;
    symbol: string;
    name: string;
    price: string;
    rawPrice: number;
    change: string;
    isPositive: boolean;
    instrument: MarketInstrument;
    badge?: string;
  }[] = [];

  if (type === 'world-indices') {
    title = 'World Major Indices';
    subtitle = 'Tracking global equity benchmarks across Europe, Asia-Pacific, and Americas';
    rawItems = WORLD_INDICES_ITEMS.map((item) => ({
      id: item.id,
      symbol: item.code,
      name: `${item.flag} ${item.name} (${item.country})`,
      price: item.price,
      rawPrice: item.rawPrice,
      change: item.changePercent,
      isPositive: item.isPositive,
      instrument: convertToInstrument(item, 'INDEX'),
    }));
  } else if (type === 'us-stocks' || type === 'screeners') {
    title = type === 'screeners' ? 'US Stocks Screener' : 'US Market Movers & Trending Stocks';
    subtitle = 'Top volume, gainers, and active equities across NASDAQ and NYSE';
    rawItems = US_STOCKS_ITEMS.map((item) => ({
      id: item.id,
      symbol: item.ticker,
      name: item.name,
      price: item.price,
      rawPrice: item.rawPrice,
      change: item.changePercent,
      isPositive: item.isPositive,
      badge: item.category.toUpperCase(),
      instrument: convertToInstrument(item, 'STOCK'),
    }));
  } else if (type === 'crypto') {
    title = 'Cryptocurrency Market Overview';
    subtitle = '24-hour trading volumes, market cap rankings, and real-time spot prices';
    rawItems = CRYPTO_ITEMS.map((item) => ({
      id: item.id,
      symbol: item.ticker,
      name: `${item.iconSymbol} ${item.name}`,
      price: item.price,
      rawPrice: item.rawPrice,
      change: item.changePercent,
      isPositive: item.isPositive,
      instrument: convertToInstrument(item, 'CRYPTO'),
    }));
  } else if (type === 'heatmaps') {
    title = 'Market Performance Heatmap';
    subtitle = 'Sector and instrument performance visualizer';
    rawItems = [
      ...PRIMARY_INDICES.map((item) => ({
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        price: item.formattedPrice,
        rawPrice: item.price,
        change: item.formattedChangePercent,
        isPositive: item.isPositive,
        instrument: item,
      })),
      ...US_STOCKS_ITEMS.map((item) => ({
        id: item.id,
        symbol: item.ticker,
        name: item.name,
        price: item.price,
        rawPrice: item.rawPrice,
        change: item.changePercent,
        isPositive: item.isPositive,
        instrument: convertToInstrument(item, 'STOCK'),
      })),
    ];
  } else if (type === 'economic-calendar') {
    title = 'Economic Calendar';
    subtitle = 'Key macroeconomic data releases, interest rate decisions, and inflation prints';
  }

  // Filter
  const filtered = rawItems.filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  filtered.sort((a, b) => {
    let factor = sortAsc ? 1 : -1;
    if (sortField === 'symbol') {
      return a.symbol.localeCompare(b.symbol) * factor;
    }
    if (sortField === 'price') {
      return (a.rawPrice - b.rawPrice) * factor;
    }
    // change
    const chA = parseFloat(a.change);
    const chB = parseFloat(b.change);
    return (chA - chB) * factor;
  });

  const toggleSort = (field: 'symbol' | 'price' | 'change') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e3eb]">
          <div>
            <h3 className="text-xl font-bold text-[#131722]">{title}</h3>
            <p className="text-xs text-[#787b86] mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'economic-calendar' ? (
          /* Economic calendar presentation */
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="bg-[#f8f9fd] p-4 rounded-xl border border-[#e0e3eb]">
              <div className="text-xs font-bold text-[#2962ff] uppercase tracking-wider mb-2">
                This Week's High-Impact Releases
              </div>
              <div className="divide-y divide-[#e0e3eb] text-sm">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#131722]">US Non-Farm Payrolls (NFP)</span>
                    <span className="text-xs text-[#787b86] block">Bureau of Labor Statistics • 08:30 ET</span>
                  </div>
                  <div className="text-right font-mono tabular-nums text-xs">
                    <span className="font-bold text-[#131722]">Forecast: 185K</span>
                    <span className="text-[#787b86] block">Previous: 215K</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#131722]">Federal Reserve FOMC Rate Decision</span>
                    <span className="text-xs text-[#787b86] block">Federal Reserve Board • 14:00 ET</span>
                  </div>
                  <div className="text-right font-mono tabular-nums text-xs">
                    <span className="font-bold text-[#089981]">Target: 4.50% - 4.75%</span>
                    <span className="text-[#787b86] block">Prior: 4.75% - 5.00%</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#131722]">Consumer Price Index (CPI YoY)</span>
                    <span className="text-xs text-[#787b86] block">US Dept of Commerce • 08:30 ET</span>
                  </div>
                  <div className="text-right font-mono tabular-nums text-xs">
                    <span className="font-bold text-[#131722]">Expected: +2.6%</span>
                    <span className="text-[#787b86] block">Prior: +2.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search and filter bar */}
            <div className="px-6 py-3 border-b border-[#e0e3eb] bg-[#f8f9fd] flex items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#787b86] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter items..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#e0e3eb] rounded-lg text-xs outline-none focus:border-[#2962ff]"
                />
              </div>
              <span className="text-xs text-[#787b86] font-medium hidden sm:inline">
                {filtered.length} instruments available
              </span>
            </div>

            {/* Table */}
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e0e3eb] text-[11px] font-bold text-[#787b86] uppercase bg-white sticky top-0">
                    <th
                      className="py-3 px-6 cursor-pointer hover:text-[#131722]"
                      onClick={() => toggleSort('symbol')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Symbol / Name</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-6 text-right cursor-pointer hover:text-[#131722]"
                      onClick={() => toggleSort('price')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Last Price</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-6 text-right cursor-pointer hover:text-[#131722]"
                      onClick={() => toggleSort('change')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>24h Change</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e3eb]/60 text-sm">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => {
                        onSelectInstrument(item.instrument);
                        onClose();
                      }}
                      className="hover:bg-[#f0f3fa]/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#f0f3fa] text-[#787b86]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#787b86] mt-0.5">{item.name}</div>
                      </td>
                      <td className="py-3 px-6 text-right font-mono tabular-nums font-semibold text-[#131722]">
                        {item.price}
                      </td>
                      <td className="py-3 px-6 text-right font-mono tabular-nums">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-xs ${
                            item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {item.isPositive ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          {item.change}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs font-semibold text-[#2962ff] group-hover:underline inline-flex items-center gap-0.5">
                          View Chart <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f8f9fd] border-t border-[#e0e3eb] flex items-center justify-between text-xs text-[#787b86]">
          <span>Click any row to display on the primary interactive chart</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white border border-[#e0e3eb] rounded-lg font-medium text-[#131722] hover:bg-[#f0f3fa]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
