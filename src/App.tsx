/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PrimaryIndicesSection } from './components/PrimaryIndicesSection';
import { SecondaryMarketGrid } from './components/SecondaryMarketGrid';
import { CommoditiesAndCurrenciesRow } from './components/CommoditiesAndCurrenciesRow';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { FullChartModal } from './components/FullChartModal';
import { ExplorerModal, ExplorerType } from './components/ExplorerModal';
import { AccountModal } from './components/AccountModal';
import {
  PRIMARY_INDICES,
  MarketCategory,
  MarketInstrument,
  WorldIndexItem,
  StockItem,
  CryptoItem,
  CommodityItem,
  convertToInstrument,
} from './data/marketsData';

export default function App() {
  const [activeNav, setActiveNav] = useState('Markets');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('Indices');
  const [selectedRegion, setSelectedRegion] = useState('everywhere');

  // Currently active instrument for the main chart
  const [currentInstrument, setCurrentInstrument] = useState<MarketInstrument>(PRIMARY_INDICES[0]);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFullChartOpen, setIsFullChartOpen] = useState(false);
  const [explorerType, setExplorerType] = useState<ExplorerType | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Watchlist state stored in localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_user_watchlist');
      return saved ? JSON.parse(saved) : ['sp500', 'nvda', 'btcusd'];
    } catch {
      return ['sp500', 'nvda', 'btcusd'];
    }
  });

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('tv_user_watchlist', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  // Switch category handling
  const handleSelectCategory = (cat: MarketCategory) => {
    setSelectedCategory(cat);
    if (cat === 'Indices') {
      setCurrentInstrument(PRIMARY_INDICES[0]);
    } else if (cat === 'Stocks') {
      // Find NVDA
      const nvdaStock = convertToInstrument(
        {
          id: 'nvda',
          ticker: 'NVDA',
          name: 'NVIDIA Corporation',
          price: '$141.95',
          changePercent: '+2.25%',
          isPositive: true,
          iconType: 'badge',
          iconBg: '#76b900',
          iconText: 'NV',
          category: 'active',
          rawPrice: 141.95,
        },
        'STOCK'
      );
      setCurrentInstrument(nvdaStock);
    } else if (cat === 'Crypto') {
      const btcCrypto = convertToInstrument(
        {
          id: 'btcusd',
          ticker: 'BTCUSD',
          name: 'Bitcoin',
          price: '$95,840.00',
          changePercent: '+1.94%',
          isPositive: true,
          iconSymbol: '₿',
          iconBg: '#f7931a',
          rawPrice: 95840.00,
        },
        'CRYPTO'
      );
      setCurrentInstrument(btcCrypto);
    } else if (cat === 'Futures & Commodities') {
      const goldComm = convertToInstrument(
        {
          id: 'gold',
          categoryLabel: 'Commodity',
          name: 'Gold',
          subName: 'XAU / USD',
          price: '$2,684.20',
          change: '+12.10',
          changePercent: '+0.45%',
          isPositive: true,
          rawPrice: 2684.20,
        },
        'COMMODITY'
      );
      setCurrentInstrument(goldComm);
    } else if (cat === 'Forex & Currencies') {
      const eurComm = convertToInstrument(
        {
          id: 'eurusd',
          categoryLabel: 'Currency',
          name: 'Euro / US Dollar',
          subName: 'EURUSD',
          price: '1.0542',
          change: '+0.0019',
          changePercent: '+0.18%',
          isPositive: true,
          rawPrice: 1.0542,
        },
        'CURRENCY'
      );
      setCurrentInstrument(eurComm);
    } else if (cat === 'Bonds') {
      const bondComm = convertToInstrument(
        {
          id: 'us10y',
          categoryLabel: 'Bond Yield',
          name: 'US 10-Year',
          subName: 'US10Y Yield',
          price: '4.385%',
          change: '+0.036',
          changePercent: '+0.82%',
          isPositive: true,
          rawPrice: 4.385,
        },
        'BOND YIELD'
      );
      setCurrentInstrument(bondComm);
    } else {
      // Default to SP500
      setCurrentInstrument(PRIMARY_INDICES[0]);
    }
  };

  // Subtle real-time tick pulse simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInstrument((prev) => {
        // Small random tick: -0.05% to +0.05%
        const deltaFactor = 1 + (Math.random() - 0.48) * 0.0006;
        const newPrice = Number((prev.price * deltaFactor).toFixed(2));
        const diff = Number((newPrice - prev.price).toFixed(2));
        if (Math.abs(diff) < 0.01) return prev;

        const newFormatted =
          newPrice >= 1000
            ? newPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : newPrice.toFixed(2);

        return {
          ...prev,
          price: newPrice,
          formattedPrice: prev.currencyPrefix
            ? `${prev.currencyPrefix}${newFormatted}`
            : prev.tag === 'STOCK' || prev.tag === 'CRYPTO'
            ? `$${newFormatted}`
            : newFormatted,
        };
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Handlers for switching instrument from subcomponents
  const handleSelectWorldIndex = (item: WorldIndexItem) => {
    const inst = convertToInstrument(item, 'INDEX');
    setCurrentInstrument(inst);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSelectStock = (item: StockItem) => {
    const inst = convertToInstrument(item, 'STOCK');
    setCurrentInstrument(inst);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSelectCrypto = (item: CryptoItem) => {
    const inst = convertToInstrument(item, 'CRYPTO');
    setCurrentInstrument(inst);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSelectCommodity = (item: CommodityItem) => {
    const inst = convertToInstrument(item, item.categoryLabel.toUpperCase() as any);
    setCurrentInstrument(inst);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSelectFooterLink = (link: string) => {
    if (link === 'Screeners') setExplorerType('screeners');
    else if (link === 'Heatmaps') setExplorerType('heatmaps');
    else if (link === 'Economic Calendar') setExplorerType('economic-calendar');
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#131722] selection:bg-[#2962ff]/15 selection:text-[#131722]">
      {/* 1. Main Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        activeNav={activeNav}
        setActiveNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'Community' || nav === 'Products' || nav === 'Brokers') {
            setIsAccountOpen(true);
          }
        }}
        onGetStarted={() => setIsAccountOpen(true)}
      />

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <HeroSection
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* 3. Primary Indices Widget with Interactive Featured Chart */}
        <PrimaryIndicesSection
          currentInstrument={currentInstrument}
          onSelectInstrument={(inst) => setCurrentInstrument(inst)}
          onOpenFullChart={() => setIsFullChartOpen(true)}
          onOpenSectionList={() => setExplorerType('world-indices')}
        />

        {/* 4. Secondary Market Grid (World Indices, US Stocks, Crypto) */}
        <SecondaryMarketGrid
          onSelectWorldIndex={handleSelectWorldIndex}
          onSelectStock={handleSelectStock}
          onSelectCrypto={handleSelectCrypto}
          onOpenMoreWorldIndices={() => setExplorerType('world-indices')}
          onOpenMoreStocks={() => setExplorerType('us-stocks')}
          onOpenMoreCrypto={() => setExplorerType('crypto')}
        />

        {/* 5. Commodities and Currencies Row */}
        <CommoditiesAndCurrenciesRow onSelectCommodity={handleSelectCommodity} />
      </main>

      {/* 6. Main Footer */}
      <Footer onSelectFooterLink={handleSelectFooterLink} />

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectInstrument={(inst) => {
          setCurrentInstrument(inst);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
      />

      <FullChartModal
        instrument={currentInstrument}
        isOpen={isFullChartOpen}
        onClose={() => setIsFullChartOpen(false)}
        isWatchlisted={watchlist.includes(currentInstrument.id)}
        onToggleWatchlist={toggleWatchlist}
      />

      <ExplorerModal
        type={explorerType}
        isOpen={explorerType !== null}
        onClose={() => setExplorerType(null)}
        onSelectInstrument={(inst) => {
          setCurrentInstrument(inst);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        userEmail="reasonjean04@gmail.com"
      />
    </div>
  );
}
