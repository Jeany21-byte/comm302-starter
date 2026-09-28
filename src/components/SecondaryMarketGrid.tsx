import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  WORLD_INDICES_ITEMS,
  US_STOCKS_ITEMS,
  CRYPTO_ITEMS,
  WorldIndexItem,
  StockItem,
  CryptoItem,
} from '../data/marketsData';

interface SecondaryMarketGridProps {
  onSelectWorldIndex: (item: WorldIndexItem) => void;
  onSelectStock: (item: StockItem) => void;
  onSelectCrypto: (item: CryptoItem) => void;
  onOpenMoreWorldIndices: () => void;
  onOpenMoreStocks: () => void;
  onOpenMoreCrypto: () => void;
}

export const SecondaryMarketGrid: React.FC<SecondaryMarketGridProps> = ({
  onSelectWorldIndex,
  onSelectStock,
  onSelectCrypto,
  onOpenMoreWorldIndices,
  onOpenMoreStocks,
  onOpenMoreCrypto,
}) => {
  const [stockTab, setStockTab] = useState<'active' | 'gainers' | 'losers'>('active');

  const visibleStocks = US_STOCKS_ITEMS.filter((s) => s.category === stockTab).slice(0, 5);

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 md:py-8" data-purpose="multi-market-overview-grid">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: World Major Indices */}
        <div
          className="border border-[#e0e3eb] rounded-2xl p-5 bg-white flex flex-col justify-between shadow-xs hover:border-[#e0e3eb]/90 transition-all"
          data-purpose="world-indices-card"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb]/50">
              <button
                type="button"
                onClick={onOpenMoreWorldIndices}
                className="group inline-flex items-center gap-1 font-bold text-lg text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
              >
                <span>World Indices</span>
                <ChevronRight className="w-4 h-4 text-[#787b86] group-hover:text-[#2962ff] transition-colors" />
              </button>
              <span className="text-xs text-[#787b86]">Global markets</span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-[#e0e3eb]/40 mt-1">
              {WORLD_INDICES_ITEMS.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectWorldIndex(item)}
                  className="py-3 flex items-center justify-between hover:bg-[#f0f3fa]/60 px-1.5 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold select-none shadow-2xs">
                      {item.flag}
                    </span>
                    <div>
                      <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors block leading-none">
                        {item.code}
                      </span>
                      <span className="text-xs text-[#787b86] mt-0.5 block">{item.name}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="text-sm font-semibold block text-[#131722]">
                      {item.price}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {item.changePercent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMoreWorldIndices}
            className="mt-4 pt-3 text-xs font-semibold text-[#2962ff] hover:text-[#1e53e5] flex items-center justify-center gap-1 border-t border-[#e0e3eb]/50 transition-colors cursor-pointer w-full"
          >
            <span>More World Indices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 2: Trending US Stocks */}
        <div
          className="border border-[#e0e3eb] rounded-2xl p-5 bg-white flex flex-col justify-between shadow-xs hover:border-[#e0e3eb]/90 transition-all"
          data-purpose="trending-stocks-card"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb]/50">
              <button
                type="button"
                onClick={onOpenMoreStocks}
                className="group inline-flex items-center gap-1 font-bold text-lg text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
              >
                <span>US Stocks</span>
                <ChevronRight className="w-4 h-4 text-[#787b86] group-hover:text-[#2962ff] transition-colors" />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStockTab('active')}
                  className={`font-semibold cursor-pointer transition-colors ${
                    stockTab === 'active'
                      ? 'text-[#2962ff] underline underline-offset-4 decoration-2'
                      : 'text-[#787b86] hover:text-[#131722]'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStockTab('gainers')}
                  className={`font-semibold cursor-pointer transition-colors ${
                    stockTab === 'gainers'
                      ? 'text-[#2962ff] underline underline-offset-4 decoration-2'
                      : 'text-[#787b86] hover:text-[#131722]'
                  }`}
                >
                  Gainers
                </button>
                <button
                  type="button"
                  onClick={() => setStockTab('losers')}
                  className={`font-semibold cursor-pointer transition-colors ${
                    stockTab === 'losers'
                      ? 'text-[#2962ff] underline underline-offset-4 decoration-2'
                      : 'text-[#787b86] hover:text-[#131722]'
                  }`}
                >
                  Losers
                </button>
              </div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-[#e0e3eb]/40 mt-1">
              {visibleStocks.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectStock(item)}
                  className="py-3 flex items-center justify-between hover:bg-[#f0f3fa]/60 px-1.5 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs select-none"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      {item.iconText}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors block leading-none">
                        {item.ticker}
                      </span>
                      <span className="text-xs text-[#787b86] mt-0.5 block">{item.name}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="text-sm font-semibold block text-[#131722]">
                      {item.price}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {item.changePercent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMoreStocks}
            className="mt-4 pt-3 text-xs font-semibold text-[#2962ff] hover:text-[#1e53e5] flex items-center justify-center gap-1 border-t border-[#e0e3eb]/50 transition-colors cursor-pointer w-full"
          >
            <span>More Trending Stocks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 3: Crypto Markets Snapshot */}
        <div
          className="border border-[#e0e3eb] rounded-2xl p-5 bg-white flex flex-col justify-between shadow-xs hover:border-[#e0e3eb]/90 transition-all"
          data-purpose="crypto-market-card"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb]/50">
              <button
                type="button"
                onClick={onOpenMoreCrypto}
                className="group inline-flex items-center gap-1 font-bold text-lg text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
              >
                <span>Crypto</span>
                <ChevronRight className="w-4 h-4 text-[#787b86] group-hover:text-[#2962ff] transition-colors" />
              </button>
              <span className="text-xs text-[#787b86]">24h volume</span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-[#e0e3eb]/40 mt-1">
              {CRYPTO_ITEMS.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectCrypto(item)}
                  className="py-3 flex items-center justify-between hover:bg-[#f0f3fa]/60 px-1.5 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs select-none ${
                        item.isGradientIcon
                          ? 'bg-gradient-to-tr from-[#9945FF] to-[#14F195]'
                          : ''
                      }`}
                      style={{
                        backgroundColor: item.isGradientIcon ? undefined : item.iconBg,
                      }}
                    >
                      {item.iconSymbol}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors block leading-none">
                        {item.ticker}
                      </span>
                      <span className="text-xs text-[#787b86] mt-0.5 block">{item.name}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="text-sm font-semibold block text-[#131722]">
                      {item.price}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {item.changePercent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMoreCrypto}
            className="mt-4 pt-3 text-xs font-semibold text-[#2962ff] hover:text-[#1e53e5] flex items-center justify-center gap-1 border-t border-[#e0e3eb]/50 transition-colors cursor-pointer w-full"
          >
            <span>More Crypto Coins</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
