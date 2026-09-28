export type Timeframe = '1D' | '5D' | '1M' | '3M' | '1Y' | '5Y' | 'All';

export type MarketCategory =
  | 'Indices'
  | 'Stocks'
  | 'Crypto'
  | 'Futures & Commodities'
  | 'Forex & Currencies'
  | 'Bonds'
  | 'ETFs'
  | 'Economy';

export interface ChartPoint {
  time: string;
  price: number;
  formattedPrice: string;
  volume?: number;
}

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketInstrument {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  tag: 'INDEX' | 'STOCK' | 'CRYPTO' | 'COMMODITY' | 'ENERGY' | 'CURRENCY' | 'BOND YIELD' | 'ETF' | 'MACRO';
  price: number;
  formattedPrice: string;
  change: number;
  formattedChange: string;
  changePercent: number;
  formattedChangePercent: string;
  isPositive: boolean;
  marketStatus: string;
  badgeLabel?: string;
  badgeBg?: string;
  flag?: string;
  iconType?: string;
  iconBg?: string;
  iconText?: string;
  currencyPrefix?: string;
  currencySuffix?: string;
  high: string;
  low: string;
  open: string;
  prevClose: string;
  volume: string;
  marketCap?: string;
  peRatio?: string;
  week52Range: string;
  chartPoints: Record<Timeframe, ChartPoint[]>;
  candles: CandlePoint[];
}

export interface WorldIndexItem {
  id: string;
  code: string;
  name: string;
  country: string;
  flag: string;
  price: string;
  changePercent: string;
  isPositive: boolean;
  rawPrice: number;
}

export interface StockItem {
  id: string;
  ticker: string;
  name: string;
  price: string;
  changePercent: string;
  isPositive: boolean;
  iconType: string;
  iconBg: string;
  iconText?: string;
  category: 'active' | 'gainers' | 'losers';
  rawPrice: number;
}

export interface CryptoItem {
  id: string;
  ticker: string;
  name: string;
  price: string;
  changePercent: string;
  isPositive: boolean;
  iconSymbol: string;
  iconBg: string;
  isGradientIcon?: boolean;
  rawPrice: number;
}

export interface CommodityItem {
  id: string;
  categoryLabel: string;
  name: string;
  subName: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  rawPrice: number;
}

// Generate realistic chart curve data for timeframes
function generateTimeframePoints(basePrice: number, isGain: boolean): Record<Timeframe, ChartPoint[]> {
  const timeLabels1D = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  const timeLabels5D = ['Mon', 'Tue 10:00', 'Tue 15:00', 'Wed 10:00', 'Wed 15:00', 'Thu 10:00', 'Thu 15:00', 'Fri 10:00', 'Fri 13:00', 'Fri 16:00'];
  const timeLabels1M = ['Week 1', 'Week 1 Fri', 'Week 2 Tue', 'Week 2 Fri', 'Week 3 Tue', 'Week 3 Fri', 'Week 4 Tue', 'Week 4 Fri', 'Today'];
  const timeLabels3M = ['Month 1', 'M1 Mid', 'Month 2', 'M2 Mid', 'Month 3', 'M3 Mid', 'Recent', 'Current'];
  const timeLabels1Y = ['Q1', 'Q1 End', 'Q2 Mid', 'Q2 End', 'Q3 Mid', 'Q3 End', 'Q4 Mid', 'Current'];
  const timeLabels5Y = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Today'];
  const timeLabelsAll = ['2016', '2018', '2020', '2022', '2024', 'Current'];

  const createPoints = (labels: string[], trendFactor: number, volatility: number) => {
    let curr = basePrice * (1 - trendFactor);
    return labels.map((lbl, idx) => {
      const step = trendFactor / (labels.length - 1);
      const noise = (Math.sin(idx * 1.7) * 0.5 + Math.cos(idx * 0.9) * 0.5) * volatility * basePrice;
      curr += basePrice * step + noise * 0.15;
      const finalPrice = Math.max(curr, basePrice * 0.5);
      return {
        time: lbl,
        price: Number(finalPrice.toFixed(2)),
        formattedPrice: finalPrice >= 1000 ? finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : finalPrice.toFixed(2),
        volume: Math.floor(100000 + Math.random() * 500000),
      };
    });
  };

  const dir = isGain ? 1 : -1;

  // Exact 1D points crafted to match the TradingView curve in screenshot
  const pts1D: ChartPoint[] = [
    { time: '09:30', price: Number((basePrice * 0.996).toFixed(2)), formattedPrice: (basePrice * 0.996).toLocaleString() },
    { time: '10:00', price: Number((basePrice * 0.997).toFixed(2)), formattedPrice: (basePrice * 0.997).toLocaleString() },
    { time: '10:30', price: Number((basePrice * 0.995).toFixed(2)), formattedPrice: (basePrice * 0.995).toLocaleString() },
    { time: '11:00', price: Number((basePrice * 0.998).toFixed(2)), formattedPrice: (basePrice * 0.998).toLocaleString() },
    { time: '11:30', price: Number((basePrice * 0.999).toFixed(2)), formattedPrice: (basePrice * 0.999).toLocaleString() },
    { time: '12:00', price: Number((basePrice * 0.9985).toFixed(2)), formattedPrice: (basePrice * 0.9985).toLocaleString() },
    { time: '12:30', price: Number((basePrice * 1.0002).toFixed(2)), formattedPrice: (basePrice * 1.0002).toLocaleString() },
    { time: '13:00', price: Number((basePrice * 1.0012).toFixed(2)), formattedPrice: (basePrice * 1.0012).toLocaleString() },
    { time: '13:30', price: Number((basePrice * 1.0022).toFixed(2)), formattedPrice: (basePrice * 1.0022).toLocaleString() },
    { time: '14:00', price: Number((basePrice * 1.0018).toFixed(2)), formattedPrice: (basePrice * 1.0018).toLocaleString() },
    { time: '14:30', price: Number((basePrice * 1.0025).toFixed(2)), formattedPrice: (basePrice * 1.0025).toLocaleString() },
    { time: '15:00', price: Number((basePrice * 1.0021).toFixed(2)), formattedPrice: (basePrice * 1.0021).toLocaleString() },
    { time: '15:30', price: Number((basePrice * 1.0028).toFixed(2)), formattedPrice: (basePrice * 1.0028).toLocaleString() },
    { time: '16:00', price: basePrice, formattedPrice: basePrice.toLocaleString() },
  ];

  return {
    '1D': pts1D,
    '5D': createPoints(timeLabels5D, dir * 0.015, 0.004),
    '1M': createPoints(timeLabels1M, dir * 0.038, 0.008),
    '3M': createPoints(timeLabels3M, dir * 0.075, 0.012),
    '1Y': createPoints(timeLabels1Y, dir * 0.22, 0.015),
    '5Y': createPoints(timeLabels5Y, dir * 0.85, 0.025),
    'All': createPoints(timeLabelsAll, dir * 1.8, 0.035),
  };
}

function generateCandles(basePrice: number): CandlePoint[] {
  const times = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  let currentOpen = basePrice * 0.995;
  return times.map((time, idx) => {
    const isUp = (idx % 3 !== 1);
    const delta = (Math.random() * 0.003 + 0.001) * basePrice;
    const open = Number(currentOpen.toFixed(2));
    const close = Number((isUp ? open + delta : open - delta).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * 0.002 * basePrice).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * 0.002 * basePrice).toFixed(2));
    currentOpen = close;
    return {
      time,
      open,
      high,
      low,
      close,
      volume: Math.floor(250000 + Math.random() * 800000),
    };
  });
}

// PRIMARY INDICES CHIPS
export const PRIMARY_INDICES: MarketInstrument[] = [
  {
    id: 'sp500',
    symbol: 'S&P 500',
    name: 'S&P 500',
    exchange: 'INDEX:SPX — S&P DOW JONES INDICES',
    tag: 'INDEX',
    price: 5964.38,
    formattedPrice: '5,964.38',
    change: 18.42,
    formattedChange: '+18.42',
    changePercent: 0.31,
    formattedChangePercent: '+0.31%',
    isPositive: true,
    marketStatus: 'Market Open • Real-time USD',
    badgeLabel: '500',
    badgeBg: '#f23645',
    high: '5,972.10',
    low: '5,945.80',
    open: '5,951.20',
    prevClose: '5,945.96',
    volume: '2.48B',
    marketCap: '$46.8T',
    peRatio: '24.2',
    week52Range: '4,682.11 - 6,017.31',
    chartPoints: generateTimeframePoints(5964.38, true),
    candles: generateCandles(5964.38),
  },
  {
    id: 'nasdaq100',
    symbol: 'Nasdaq 100',
    name: 'Nasdaq 100 Index',
    exchange: 'INDEX:NDX — NASDAQ',
    tag: 'INDEX',
    price: 20893.10,
    formattedPrice: '20,893.10',
    change: 87.50,
    formattedChange: '+87.50',
    changePercent: 0.42,
    formattedChangePercent: '+0.42%',
    isPositive: true,
    marketStatus: 'Market Open • Real-time USD',
    badgeLabel: '100',
    badgeBg: '#00a3e0',
    high: '20,950.40',
    low: '20,812.30',
    open: '20,830.00',
    prevClose: '20,805.60',
    volume: '3.12B',
    marketCap: '$21.4T',
    peRatio: '29.8',
    week52Range: '16,280.50 - 21,180.20',
    chartPoints: generateTimeframePoints(20893.10, true),
    candles: generateCandles(20893.10),
  },
  {
    id: 'dow30',
    symbol: 'Dow 30',
    name: 'Dow Jones Industrial Average',
    exchange: 'INDEX:DJI — S&P DOW JONES INDICES',
    tag: 'INDEX',
    price: 43456.20,
    formattedPrice: '43,456.20',
    change: -52.10,
    formattedChange: '-52.10',
    changePercent: -0.12,
    formattedChangePercent: '-0.12%',
    isPositive: false,
    marketStatus: 'Market Open • Real-time USD',
    badgeLabel: '30',
    badgeBg: '#0052cc',
    high: '43,620.00',
    low: '43,390.15',
    open: '43,510.00',
    prevClose: '43,508.30',
    volume: '380M',
    marketCap: '$14.2T',
    peRatio: '21.5',
    week52Range: '37,122.95 - 44,486.07',
    chartPoints: generateTimeframePoints(43456.20, false),
    candles: generateCandles(43456.20),
  },
  {
    id: 'russell2000',
    symbol: 'Russell 2000',
    name: 'Russell 2000 Small-Cap Index',
    exchange: 'INDEX:RUT — FTSE RUSSELL',
    tag: 'INDEX',
    price: 2311.90,
    formattedPrice: '2,311.90',
    change: 19.50,
    formattedChange: '+19.50',
    changePercent: 0.85,
    formattedChangePercent: '+0.85%',
    isPositive: true,
    marketStatus: 'Market Open • Real-time USD',
    badgeLabel: '2K',
    badgeBg: '#f59e0b',
    high: '2,324.40',
    low: '2,298.10',
    open: '2,301.00',
    prevClose: '2,292.40',
    volume: '1.10B',
    marketCap: '$3.1T',
    peRatio: '18.4',
    week52Range: '1,902.40 - 2,442.80',
    chartPoints: generateTimeframePoints(2311.90, true),
    candles: generateCandles(2311.90),
  },
  {
    id: 'nasdaqcomp',
    symbol: 'Nasdaq Comp',
    name: 'Nasdaq Composite',
    exchange: 'INDEX:IXIC — NASDAQ',
    tag: 'INDEX',
    price: 18987.42,
    formattedPrice: '18,987.42',
    change: 104.20,
    formattedChange: '+104.20',
    changePercent: 0.55,
    formattedChangePercent: '+0.55%',
    isPositive: true,
    marketStatus: 'Market Open • Real-time USD',
    badgeLabel: 'IXIC',
    badgeBg: '#6366f1',
    high: '19,045.20',
    low: '18,910.00',
    open: '18,920.00',
    prevClose: '18,883.22',
    volume: '4.85B',
    marketCap: '$28.3T',
    peRatio: '28.1',
    week52Range: '14,477.50 - 19,298.10',
    chartPoints: generateTimeframePoints(18987.42, true),
    candles: generateCandles(18987.42),
  },
  {
    id: 'nysecomp',
    symbol: 'NYSE Comp',
    name: 'NYSE Composite Index',
    exchange: 'INDEX:NYA — NEW YORK STOCK EXCHANGE',
    tag: 'INDEX',
    price: 19820.75,
    formattedPrice: '19,820.75',
    change: 35.60,
    formattedChange: '+35.60',
    changePercent: 0.18,
    formattedChangePercent: '+0.18%',
    isPositive: true,
    marketStatus: 'Market Open • Real-time USD',
    badgeLabel: 'NY',
    badgeBg: '#059669',
    high: '19,880.00',
    low: '19,790.30',
    open: '19,800.00',
    prevClose: '19,785.15',
    volume: '3.60B',
    marketCap: '$32.1T',
    peRatio: '19.9',
    week52Range: '16,740.10 - 20,110.45',
    chartPoints: generateTimeframePoints(19820.75, true),
    candles: generateCandles(19820.75),
  },
];

// WORLD INDICES
export const WORLD_INDICES_ITEMS: WorldIndexItem[] = [
  {
    id: 'ni225',
    code: 'NI225',
    name: 'Nikkei 225',
    country: 'Japan',
    flag: '🇯🇵',
    price: '38,720.50',
    changePercent: '+0.78%',
    isPositive: true,
    rawPrice: 38720.50,
  },
  {
    id: 'ukx',
    code: 'UKX',
    name: 'FTSE 100',
    country: 'United Kingdom',
    flag: '🇬🇧',
    price: '8,245.12',
    changePercent: '-0.22%',
    isPositive: false,
    rawPrice: 8245.12,
  },
  {
    id: 'dax',
    code: 'DAX',
    name: 'DAX 40 Index',
    country: 'Germany',
    flag: '🇩🇪',
    price: '19,418.90',
    changePercent: '+0.44%',
    isPositive: true,
    rawPrice: 19418.90,
  },
  {
    id: 'px1',
    code: 'PX1',
    name: 'CAC 40',
    country: 'France',
    flag: '🇫🇷',
    price: '7,316.30',
    changePercent: '-0.35%',
    isPositive: false,
    rawPrice: 7316.30,
  },
  {
    id: 'hsi',
    code: 'HSI',
    name: 'Hang Seng Index',
    country: 'Hong Kong',
    flag: '🇭🇰',
    price: '19,576.61',
    changePercent: '+1.16%',
    isPositive: true,
    rawPrice: 19576.61,
  },
  {
    id: 'asx200',
    code: 'XJO',
    name: 'S&P/ASX 200',
    country: 'Australia',
    flag: '🇦🇺',
    price: '8,410.20',
    changePercent: '+0.52%',
    isPositive: true,
    rawPrice: 8410.20,
  },
  {
    id: 'nifty50',
    code: 'NIFTY',
    name: 'Nifty 50',
    country: 'India',
    flag: '🇮🇳',
    price: '24,180.75',
    changePercent: '+0.64%',
    isPositive: true,
    rawPrice: 24180.75,
  },
  {
    id: 'tsx',
    code: 'TSX',
    name: 'S&P/TSX Composite',
    country: 'Canada',
    flag: '🇨🇦',
    price: '24,890.30',
    changePercent: '+0.28%',
    isPositive: true,
    rawPrice: 24890.30,
  },
];

// US STOCKS (Active, Gainers, Losers)
export const US_STOCKS_ITEMS: StockItem[] = [
  // Active
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
  {
    id: 'aapl',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: '$228.28',
    changePercent: '+0.48%',
    isPositive: true,
    iconType: 'emoji',
    iconBg: '#000000',
    iconText: '🍎',
    category: 'active',
    rawPrice: 228.28,
  },
  {
    id: 'tsla',
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    price: '$342.03',
    changePercent: '+3.80%',
    isPositive: true,
    iconType: 'badge',
    iconBg: '#e82127',
    iconText: 'T',
    category: 'active',
    rawPrice: 342.03,
  },
  {
    id: 'msft',
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    price: '$415.76',
    changePercent: '-0.31%',
    isPositive: false,
    iconType: 'badge',
    iconBg: '#00a4ef',
    iconText: 'MS',
    category: 'active',
    rawPrice: 415.76,
  },
  {
    id: 'amzn',
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: '$202.61',
    changePercent: '+1.12%',
    isPositive: true,
    iconType: 'badge',
    iconBg: '#ff9900',
    iconText: 'a',
    category: 'active',
    rawPrice: 202.61,
  },
  // Gainers
  {
    id: 'pltr',
    ticker: 'PLTR',
    name: 'Palantir Tech Inc.',
    price: '$64.80',
    changePercent: '+7.45%',
    isPositive: true,
    iconType: 'badge',
    iconBg: '#111827',
    iconText: 'P',
    category: 'gainers',
    rawPrice: 64.80,
  },
  {
    id: 'smci',
    ticker: 'SMCI',
    name: 'Super Micro Computer',
    price: '$33.15',
    changePercent: '+6.90%',
    isPositive: true,
    iconType: 'badge',
    iconBg: '#0284c7',
    iconText: 'S',
    category: 'gainers',
    rawPrice: 33.15,
  },
  {
    id: 'mstr',
    ticker: 'MSTR',
    name: 'MicroStrategy Inc.',
    price: '$388.50',
    changePercent: '+8.92%',
    isPositive: true,
    iconType: 'badge',
    iconBg: '#dc2626',
    iconText: 'M',
    category: 'gainers',
    rawPrice: 388.50,
  },
  {
    id: 'amd',
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    price: '$138.20',
    changePercent: '+4.15%',
    isPositive: true,
    iconType: 'badge',
    iconBg: '#000000',
    iconText: 'AMD',
    category: 'gainers',
    rawPrice: 138.20,
  },
  {
    id: 'coin',
    ticker: 'COIN',
    name: 'Coinbase Global, Inc.',
    price: '$312.40',
    changePercent: '+5.60%',
    isPositive: true,
    iconType: 'badge',
    iconBg: '#0052ff',
    iconText: 'C',
    category: 'gainers',
    rawPrice: 312.40,
  },
  // Losers
  {
    id: 'intc',
    ticker: 'INTC',
    name: 'Intel Corporation',
    price: '$23.60',
    changePercent: '-3.85%',
    isPositive: false,
    iconType: 'badge',
    iconBg: '#0071c5',
    iconText: 'in',
    category: 'losers',
    rawPrice: 23.60,
  },
  {
    id: 'ba',
    ticker: 'BA',
    name: 'Boeing Co.',
    price: '$148.90',
    changePercent: '-2.40%',
    isPositive: false,
    iconType: 'badge',
    iconBg: '#0033a0',
    iconText: 'BA',
    category: 'losers',
    rawPrice: 148.90,
  },
  {
    id: 'nke',
    ticker: 'NKE',
    name: 'NIKE, Inc.',
    price: '$74.10',
    changePercent: '-2.15%',
    isPositive: false,
    iconType: 'badge',
    iconBg: '#111827',
    iconText: '✓',
    category: 'losers',
    rawPrice: 74.10,
  },
  {
    id: 'dis',
    ticker: 'DIS',
    name: 'Walt Disney Co.',
    price: '$112.30',
    changePercent: '-1.85%',
    isPositive: false,
    iconType: 'badge',
    iconBg: '#1e3a8a',
    iconText: 'D',
    category: 'losers',
    rawPrice: 112.30,
  },
];

// CRYPTO
export const CRYPTO_ITEMS: CryptoItem[] = [
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
  {
    id: 'ethusd',
    ticker: 'ETHUSD',
    name: 'Ethereum',
    price: '$3,612.45',
    changePercent: '+3.40%',
    isPositive: true,
    iconSymbol: 'Ξ',
    iconBg: '#627eea',
    rawPrice: 3612.45,
  },
  {
    id: 'solusd',
    ticker: 'SOLUSD',
    name: 'Solana',
    price: '$236.70',
    changePercent: '+4.12%',
    isPositive: true,
    iconSymbol: 'S',
    iconBg: '',
    isGradientIcon: true,
    rawPrice: 236.70,
  },
  {
    id: 'xrpusd',
    ticker: 'XRPUSD',
    name: 'Ripple',
    price: '$1.4820',
    changePercent: '-1.05%',
    isPositive: false,
    iconSymbol: '✕',
    iconBg: '#23292f',
    rawPrice: 1.482,
  },
  {
    id: 'bnbusd',
    ticker: 'BNBUSD',
    name: 'BNB',
    price: '$654.10',
    changePercent: '+0.62%',
    isPositive: true,
    iconSymbol: 'B',
    iconBg: '#f3ba2f',
    rawPrice: 654.10,
  },
  {
    id: 'dogeusd',
    ticker: 'DOGEUSD',
    name: 'Dogecoin',
    price: '$0.3840',
    changePercent: '+5.18%',
    isPositive: true,
    iconSymbol: 'Ð',
    iconBg: '#c2a633',
    rawPrice: 0.384,
  },
  {
    id: 'adausd',
    ticker: 'ADAUSD',
    name: 'Cardano',
    price: '$0.8840',
    changePercent: '+2.10%',
    isPositive: true,
    iconSymbol: '₳',
    iconBg: '#0033ad',
    rawPrice: 0.884,
  },
];

// COMMODITIES & CURRENCIES BOTTOM ROW
export const COMMODITIES_SUMMARY: CommodityItem[] = [
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
  {
    id: 'crude-oil',
    categoryLabel: 'Energy',
    name: 'Crude Oil WTI',
    subName: 'USOIL',
    price: '$68.74',
    change: '-0.80',
    changePercent: '-1.15%',
    isPositive: false,
    rawPrice: 68.74,
  },
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
];

// Helper to convert any item to a full MarketInstrument for the interactive featured chart
export function convertToInstrument(
  item: WorldIndexItem | StockItem | CryptoItem | CommodityItem,
  type: 'INDEX' | 'STOCK' | 'CRYPTO' | 'COMMODITY' | 'ENERGY' | 'CURRENCY' | 'BOND YIELD'
): MarketInstrument {
  const isPos = item.isPositive;
  const priceVal = item.rawPrice;
  const points = generateTimeframePoints(priceVal, isPos);
  const candles = generateCandles(priceVal);

  if ('country' in item) {
    // World index
    return {
      id: item.id,
      symbol: item.code,
      name: item.name,
      exchange: `WORLD INDEX: ${item.country.toUpperCase()}`,
      tag: 'INDEX',
      price: priceVal,
      formattedPrice: item.price,
      change: Number((priceVal * 0.007).toFixed(2)),
      formattedChange: `${isPos ? '+' : '-'}${Math.abs(priceVal * 0.007).toFixed(2)}`,
      changePercent: parseFloat(item.changePercent),
      formattedChangePercent: item.changePercent,
      isPositive: isPos,
      marketStatus: 'Market Open • Real-time',
      flag: item.flag,
      high: (priceVal * 1.008).toFixed(2),
      low: (priceVal * 0.993).toFixed(2),
      open: (priceVal * 0.996).toFixed(2),
      prevClose: (priceVal * (isPos ? 0.992 : 1.008)).toFixed(2),
      volume: '1.8B',
      week52Range: `${(priceVal * 0.8).toFixed(0)} - ${(priceVal * 1.15).toFixed(0)}`,
      chartPoints: points,
      candles,
    };
  }

  if ('ticker' in item && 'iconType' in item) {
    // Stock
    return {
      id: item.id,
      symbol: item.ticker,
      name: item.name,
      exchange: 'NASDAQ / NYSE REAL-TIME',
      tag: 'STOCK',
      price: priceVal,
      formattedPrice: item.price,
      change: Number((priceVal * (parseFloat(item.changePercent) / 100)).toFixed(2)),
      formattedChange: `${isPos ? '+' : ''}${(priceVal * (parseFloat(item.changePercent) / 100)).toFixed(2)}`,
      changePercent: parseFloat(item.changePercent),
      formattedChangePercent: item.changePercent,
      isPositive: isPos,
      marketStatus: 'Market Open • Real-time USD',
      iconType: item.iconType,
      iconBg: item.iconBg,
      iconText: item.iconText,
      high: `$${(priceVal * 1.015).toFixed(2)}`,
      low: `$${(priceVal * 0.985).toFixed(2)}`,
      open: `$${(priceVal * 0.995).toFixed(2)}`,
      prevClose: `$${(priceVal * (isPos ? 0.98 : 1.02)).toFixed(2)}`,
      volume: '42.8M',
      marketCap: '$2.85T',
      peRatio: '32.4',
      week52Range: `$${(priceVal * 0.65).toFixed(2)} - $${(priceVal * 1.12).toFixed(2)}`,
      chartPoints: points,
      candles,
    };
  }

  if ('ticker' in item && 'iconSymbol' in item) {
    // Crypto
    return {
      id: item.id,
      symbol: item.ticker,
      name: item.name,
      exchange: 'CRYPTO SPOT • BINANCE / COINBASE',
      tag: 'CRYPTO',
      price: priceVal,
      formattedPrice: item.price,
      change: Number((priceVal * (parseFloat(item.changePercent) / 100)).toFixed(2)),
      formattedChange: `${isPos ? '+' : ''}${(priceVal * (parseFloat(item.changePercent) / 100)).toFixed(2)}`,
      changePercent: parseFloat(item.changePercent),
      formattedChangePercent: item.changePercent,
      isPositive: isPos,
      marketStatus: '24/7 Trading • Global Crypto Feed',
      iconText: item.iconSymbol,
      iconBg: item.iconBg,
      high: `$${(priceVal * 1.025).toFixed(2)}`,
      low: `$${(priceVal * 0.975).toFixed(2)}`,
      open: `$${(priceVal * 0.99).toFixed(2)}`,
      prevClose: `$${(priceVal * (isPos ? 0.97 : 1.03)).toFixed(2)}`,
      volume: '$18.4B',
      marketCap: '$1.42T',
      week52Range: `$${(priceVal * 0.55).toFixed(2)} - $${(priceVal * 1.1).toFixed(2)}`,
      chartPoints: points,
      candles,
    };
  }

  // Commodity / Currency
  const comm = item as CommodityItem;
  return {
    id: comm.id,
    symbol: comm.subName,
    name: comm.name,
    exchange: `${comm.categoryLabel.toUpperCase()} • CME / ICE DATA SERVICES`,
    tag: comm.categoryLabel.toUpperCase() as any,
    price: priceVal,
    formattedPrice: comm.price,
    change: parseFloat(comm.change),
    formattedChange: comm.change,
    changePercent: parseFloat(comm.changePercent),
    formattedChangePercent: comm.changePercent,
    isPositive: isPos,
    marketStatus: 'Active Session • ICE Real-time',
    high: `${(priceVal * 1.006).toFixed(2)}`,
    low: `${(priceVal * 0.994).toFixed(2)}`,
    open: `${(priceVal * 0.998).toFixed(2)}`,
    prevClose: `${(priceVal * (isPos ? 0.995 : 1.005)).toFixed(2)}`,
    volume: '245K Contracts',
    week52Range: `${(priceVal * 0.82).toFixed(2)} - ${(priceVal * 1.08).toFixed(2)}`,
    chartPoints: points,
    candles,
  };
}
