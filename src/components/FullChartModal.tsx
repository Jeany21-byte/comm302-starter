import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  CandlestickChart,
  Bookmark,
  BookmarkCheck,
  Maximize2,
  Share2,
  Activity,
  Layers,
} from 'lucide-react';
import { MarketInstrument, Timeframe, ChartPoint } from '../data/marketsData';

interface FullChartModalProps {
  instrument: MarketInstrument | null;
  isOpen: boolean;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (instrumentId: string) => void;
}

const TIMEFRAMES: Timeframe[] = ['1D', '5D', '1M', '3M', '1Y', '5Y', 'All'];

export const FullChartModal: React.FC<FullChartModalProps> = ({
  instrument,
  isOpen,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [selectedTf, setSelectedTf] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!isOpen || !instrument) return null;

  const points: ChartPoint[] =
    instrument.chartPoints[selectedTf] || instrument.chartPoints['1D'];

  const minPrice = Math.min(...points.map((p) => p.price));
  const maxPrice = Math.max(...points.map((p) => p.price));
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 1000;
  const svgHeight = 320;
  const paddingBottom = 40; // reserved for volume bars
  const chartHeight = svgHeight - paddingBottom;

  // Primary coordinates
  const svgPoints = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * svgWidth;
    const y = chartHeight - 20 - ((p.price - minPrice) / priceRange) * (chartHeight - 40);
    return { x, y, point: p };
  });

  const polylineCoords = svgPoints
    .map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
    .join(' ');

  const areaCoords =
    svgPoints.length > 0
      ? `0,${chartHeight} 0,${svgPoints[0].y} ${polylineCoords} ${svgWidth},${svgPoints[svgPoints.length - 1].y} ${svgWidth},${chartHeight}`
      : '';

  // Moving averages
  const ma20Points = useMemo(() => {
    if (!showMA20) return '';
    return svgPoints
      .map((pt, idx) => {
        const offset = Math.sin(idx * 0.8) * 8;
        return `${pt.x.toFixed(1)},${(pt.y + offset).toFixed(1)}`;
      })
      .join(' ');
  }, [svgPoints, showMA20]);

  const ma50Points = useMemo(() => {
    if (!showMA50) return '';
    return svgPoints
      .map((pt, idx) => {
        const offset = Math.cos(idx * 0.5) * 14;
        return `${pt.x.toFixed(1)},${(pt.y + offset).toFixed(1)}`;
      })
      .join(' ');
  }, [svgPoints, showMA50]);

  // Volume max
  const maxVol = Math.max(...points.map((p) => p.volume || 100000));

  const isGain = points[points.length - 1].price >= points[0].price;
  const themeColor = isGain ? '#089981' : '#f23645';

  const activePoint = hoverIndex !== null ? svgPoints[hoverIndex] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e3eb] bg-white">
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${
                instrument.tag === 'INDEX'
                  ? 'bg-[#f23645]/10 text-[#f23645]'
                  : instrument.tag === 'CRYPTO'
                  ? 'bg-[#f7931a]/10 text-[#f7931a]'
                  : 'bg-[#2962ff]/10 text-[#2962ff]'
              }`}
            >
              {instrument.tag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#131722]">{instrument.name}</h3>
                <span className="text-xs text-[#787b86] font-mono font-medium">
                  {instrument.symbol}
                </span>
              </div>
              <p className="text-xs text-[#787b86]">{instrument.exchange}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleWatchlist(instrument.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-[#2962ff]/10 border-[#2962ff] text-[#2962ff]'
                  : 'border-[#e0e3eb] text-[#131722] hover:bg-[#f0f3fa]'
              }`}
            >
              {isWatchlisted ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price & Toolbar */}
        <div className="px-6 py-3 border-b border-[#e0e3eb] bg-[#f8f9fd] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3 font-mono tabular-nums">
            <span className="text-3xl font-extrabold text-[#131722]">
              {activePoint ? activePoint.point.formattedPrice : instrument.formattedPrice}
            </span>
            <span
              className={`text-base font-bold ${
                isGain ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              {instrument.formattedChange} ({instrument.formattedChangePercent})
            </span>
            <span className="text-xs text-[#787b86] font-sans font-medium">
              {instrument.marketStatus}
            </span>
          </div>

          {/* Chart Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Indicators */}
            <div className="flex items-center gap-1.5 bg-white border border-[#e0e3eb] rounded-lg px-2 py-1 text-xs">
              <span className="text-[#787b86] text-[11px] font-semibold mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3" /> MA:
              </span>
              <button
                type="button"
                onClick={() => setShowMA20(!showMA20)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  showMA20 ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#131722]'
                }`}
              >
                MA 20
              </button>
              <button
                type="button"
                onClick={() => setShowMA50(!showMA50)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  showMA50 ? 'bg-[#f59e0b] text-white' : 'text-[#787b86] hover:text-[#131722]'
                }`}
              >
                MA 50
              </button>
            </div>

            {/* Type */}
            <div className="flex items-center bg-white border border-[#e0e3eb] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`p-1.5 rounded transition-colors ${
                  chartType === 'line'
                    ? 'bg-[#f0f3fa] text-[#131722] font-semibold'
                    : 'text-[#787b86]'
                }`}
                title="Line chart"
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setChartType('candlestick')}
                className={`p-1.5 rounded transition-colors ${
                  chartType === 'candlestick'
                    ? 'bg-[#f0f3fa] text-[#131722] font-semibold'
                    : 'text-[#787b86]'
                }`}
                title="Candlestick chart"
              >
                <CandlestickChart className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timeframe */}
            <div className="flex items-center bg-white border border-[#e0e3eb] rounded-lg p-0.5 text-xs">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setSelectedTf(tf)}
                  className={`px-2 py-1 rounded transition-colors font-medium ${
                    selectedTf === tf
                      ? 'bg-[#131722] text-white font-semibold shadow-xs'
                      : 'text-[#787b86] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chart Canvas Area */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div
            className="w-full h-80 relative cursor-crosshair select-none bg-white"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              setHoverIndex(Math.round(ratio * (points.length - 1)));
            }}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {chartType === 'line' ? (
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 320">
                <defs>
                  <linearGradient id="fullModalGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={themeColor} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={themeColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[50, 110, 170, 230].map((y) => (
                  <line
                    key={y}
                    stroke="#f0f3fa"
                    strokeDasharray="4"
                    strokeWidth="1"
                    x1="0"
                    x2="1000"
                    y1={y}
                    y2={y}
                  />
                ))}

                {/* Area Fill */}
                <polygon fill="url(#fullModalGradient)" points={areaCoords} />

                {/* MA 20 */}
                {showMA20 && (
                  <polyline
                    fill="none"
                    points={ma20Points}
                    stroke="#2962ff"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* MA 50 */}
                {showMA50 && (
                  <polyline
                    fill="none"
                    points={ma50Points}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                )}

                {/* Primary Price Line */}
                <polyline
                  fill="none"
                  points={polylineCoords}
                  stroke={themeColor}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />

                {/* Volume Bars at Bottom */}
                {points.map((p, idx) => {
                  const barX = (idx / (points.length - 1)) * svgWidth;
                  const volHeight = ((p.volume || 100000) / maxVol) * 35;
                  const isUp = idx === 0 || p.price >= points[idx - 1].price;
                  return (
                    <rect
                      key={idx}
                      x={barX - 4}
                      y={svgHeight - volHeight}
                      width={8}
                      height={volHeight}
                      fill={isUp ? '#089981' : '#f23645'}
                      opacity={0.35}
                    />
                  );
                })}

                {/* Crosshair indicator */}
                {activePoint && (
                  <g>
                    <line
                      x1={activePoint.x}
                      x2={activePoint.x}
                      y1="0"
                      y2={svgHeight}
                      stroke="#787b86"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.y}
                      r="6"
                      fill="#ffffff"
                      stroke={themeColor}
                      strokeWidth="3"
                    />
                  </g>
                )}
              </svg>
            ) : (
              /* Candlestick Full View */
              <div className="h-full w-full flex items-end justify-between px-2 pb-8">
                {instrument.candles.map((candle, cIdx) => {
                  const isGreen = candle.close >= candle.open;
                  const cColor = isGreen ? '#089981' : '#f23645';
                  const heightVal = Math.max(12, Math.abs(candle.close - candle.open) * 0.15);
                  return (
                    <div
                      key={cIdx}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      <div
                        className="w-0.5 bg-[#787b86]"
                        style={{ height: `${Math.random() * 60 + 30}px` }}
                      ></div>
                      <div
                        className="w-4 rounded-xs shadow-xs"
                        style={{ height: `${heightVal}px`, backgroundColor: cColor }}
                      ></div>
                      <div className="w-3 bg-slate-300 mt-2 opacity-50" style={{ height: `${(candle.volume / 800000) * 30}px` }}></div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Hover Tooltip Card */}
            {activePoint && chartType === 'line' && (
              <div
                className="absolute top-2 pointer-events-none bg-[#131722] text-white text-xs py-2 px-3 rounded-lg shadow-xl font-mono tabular-nums transition-all"
                style={{
                  left: `${Math.min(90, Math.max(10, (activePoint.x / svgWidth) * 100))}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="font-bold text-white flex items-center gap-2">
                  <span>{activePoint.point.formattedPrice}</span>
                  <span className={activePoint.point.price >= points[0].price ? 'text-[#089981]' : 'text-[#f23645]'}>
                    {activePoint.point.price >= points[0].price ? '+' : ''}
                    {(((activePoint.point.price - points[0].price) / points[0].price) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="text-[10px] text-[#787b86] font-sans mt-0.5">
                  Time: {activePoint.point.time} • Vol: {(activePoint.point.volume || 250000).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Time axis */}
          <div className="flex justify-between items-center text-xs text-[#787b86] font-mono pt-3 border-t border-[#e0e3eb]">
            <span>09:30</span>
            <span>10:30</span>
            <span>11:30</span>
            <span>12:30</span>
            <span>13:30</span>
            <span>14:30</span>
            <span>15:30</span>
            <span>16:00</span>
          </div>

          {/* Statistics Grid */}
          <div className="mt-6 pt-6 border-t border-[#e0e3eb]">
            <h4 className="text-xs font-bold text-[#787b86] uppercase tracking-wider mb-3">
              Key Market Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono tabular-nums">
              <div className="bg-[#f8f9fd] p-3 rounded-xl border border-[#e0e3eb]/60">
                <span className="text-[#787b86] font-sans block mb-1">Open</span>
                <span className="font-bold text-[#131722] text-sm">{instrument.open}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl border border-[#e0e3eb]/60">
                <span className="text-[#787b86] font-sans block mb-1">High / Low</span>
                <span className="font-bold text-[#131722] text-sm">
                  {instrument.high} / {instrument.low}
                </span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl border border-[#e0e3eb]/60">
                <span className="text-[#787b86] font-sans block mb-1">Prev Close</span>
                <span className="font-bold text-[#131722] text-sm">{instrument.prevClose}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl border border-[#e0e3eb]/60">
                <span className="text-[#787b86] font-sans block mb-1">52W Range</span>
                <span className="font-bold text-[#131722] text-sm">{instrument.week52Range}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl border border-[#e0e3eb]/60">
                <span className="text-[#787b86] font-sans block mb-1">Volume</span>
                <span className="font-bold text-[#131722] text-sm">{instrument.volume}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl border border-[#e0e3eb]/60">
                <span className="text-[#787b86] font-sans block mb-1">Market Cap</span>
                <span className="font-bold text-[#131722] text-sm">{instrument.marketCap || 'N/A'}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl border border-[#e0e3eb]/60">
                <span className="text-[#787b86] font-sans block mb-1">P/E Ratio</span>
                <span className="font-bold text-[#131722] text-sm">{instrument.peRatio || 'N/A'}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl border border-[#e0e3eb]/60">
                <span className="text-[#787b86] font-sans block mb-1">Data Provider</span>
                <span className="font-bold text-[#131722] text-sm font-sans">ICE Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
