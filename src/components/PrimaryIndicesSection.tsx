import React, { useState, useRef, useMemo } from 'react';
import { ChevronRight, ExternalLink, CandlestickChart, TrendingUp } from 'lucide-react';
import {
  PRIMARY_INDICES,
  MarketInstrument,
  Timeframe,
  ChartPoint,
} from '../data/marketsData';

interface PrimaryIndicesSectionProps {
  currentInstrument: MarketInstrument;
  onSelectInstrument: (instrument: MarketInstrument) => void;
  onOpenFullChart: (instrument: MarketInstrument) => void;
  onOpenSectionList?: () => void;
}

const TIMEFRAMES: Timeframe[] = ['1D', '5D', '1M', '3M', '1Y', '5Y', 'All'];

export const PrimaryIndicesSection: React.FC<PrimaryIndicesSectionProps> = ({
  currentInstrument,
  onSelectInstrument,
  onOpenFullChart,
  onOpenSectionList,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [chartMode, setChartMode] = useState<'line' | 'candle'>('line');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Active chart data based on timeframe
  const points: ChartPoint[] = useMemo(() => {
    return (
      currentInstrument.chartPoints[selectedTimeframe] ||
      currentInstrument.chartPoints['1D']
    );
  }, [currentInstrument, selectedTimeframe]);

  // SVG dimensions
  const svgWidth = 1000;
  const svgHeight = 240;
  const paddingX = 0;
  const paddingY = 24;

  const minPrice = useMemo(
    () => Math.min(...points.map((p) => p.price)),
    [points]
  );
  const maxPrice = useMemo(
    () => Math.max(...points.map((p) => p.price)),
    [points]
  );
  const priceRange = maxPrice - minPrice || 1;

  // Compute SVG coordinates
  const svgPoints = useMemo(() => {
    return points.map((p, idx) => {
      const x = paddingX + (idx / (points.length - 1)) * (svgWidth - 2 * paddingX);
      const y =
        svgHeight -
        paddingY -
        ((p.price - minPrice) / priceRange) * (svgHeight - 2 * paddingY);
      return { x, y, point: p };
    });
  }, [points, minPrice, priceRange, svgWidth, svgHeight]);

  const polylineCoords = useMemo(() => {
    return svgPoints.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  }, [svgPoints]);

  const polygonCoords = useMemo(() => {
    if (svgPoints.length === 0) return '';
    const first = svgPoints[0];
    const last = svgPoints[svgPoints.length - 1];
    return `0,${svgHeight - 10} 0,${first.y.toFixed(1)} ${polylineCoords} ${last.x.toFixed(1)},${svgHeight - 10}`;
  }, [svgPoints, polylineCoords, svgHeight]);

  // Hover position
  const activeHoverPoint = hoverIndex !== null ? svgPoints[hoverIndex] : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartContainerRef.current) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const index = Math.round(ratio * (points.length - 1));
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Determine if overall change for this timeframe is positive
  const isGain = useMemo(() => {
    if (points.length < 2) return currentInstrument.isPositive;
    return points[points.length - 1].price >= points[0].price;
  }, [points, currentInstrument.isPositive]);

  const primaryColor = isGain ? '#089981' : '#f23645';
  const gradientId = `chartGradient-${currentInstrument.id}-${isGain ? 'green' : 'red'}`;

  // Displayed live values (hovered or latest)
  const displayPrice = activeHoverPoint
    ? activeHoverPoint.point.formattedPrice
    : currentInstrument.formattedPrice;

  const displayChange = activeHoverPoint
    ? (
        ((activeHoverPoint.point.price - points[0].price) / points[0].price) *
        100
      ).toFixed(2)
    : currentInstrument.formattedChangePercent;

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-4" data-purpose="primary-indices-section">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onOpenSectionList}
          className="group inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 text-[#787b86] group-hover:text-[#2962ff] transition-colors" />
        </button>
      </div>

      {/* Index Chips / Selector as seen in screenshot */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6"
        data-purpose="index-selector-chips"
      >
        {PRIMARY_INDICES.map((idxItem) => {
          const isSelected = currentInstrument.id === idxItem.id;
          return (
            <div
              key={idxItem.id}
              onClick={() => onSelectInstrument(idxItem)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border shadow-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#f0f3fa] border-[#e0e3eb] ring-1 ring-[#2962ff]/40 shadow-sm'
                  : 'bg-white hover:bg-[#f0f3fa] border-[#e0e3eb]/70 hover:border-[#e0e3eb]'
              }`}
            >
              <span
                className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-xs"
                style={{ backgroundColor: idxItem.badgeBg }}
              >
                {idxItem.badgeLabel}
              </span>
              <div className="truncate">
                <span className="block text-sm font-bold text-[#131722] truncate">
                  {idxItem.symbol}
                </span>
                <span
                  className={`block text-xs font-semibold font-mono tabular-nums ${
                    idxItem.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {idxItem.formattedPrice} {idxItem.formattedChangePercent}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* S&P 500 / Active Instrument Detailed Interactive Card & Mini Chart */}
      <div
        className="border border-[#e0e3eb] rounded-2xl p-4 sm:p-6 bg-white shadow-xs"
        data-purpose="featured-index-chart-card"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e0e3eb]/60">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded ${
                  currentInstrument.tag === 'INDEX'
                    ? 'bg-[#f23645]/10 text-[#f23645]'
                    : currentInstrument.tag === 'CRYPTO'
                    ? 'bg-[#f7931a]/10 text-[#f7931a]'
                    : 'bg-[#2962ff]/10 text-[#2962ff]'
                }`}
              >
                {currentInstrument.tag}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#131722]">
                {currentInstrument.name}
              </h2>
              <span className="text-xs text-[#787b86] font-medium">
                {currentInstrument.exchange}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mt-2 font-mono tabular-nums">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#131722]">
                {displayPrice}
              </span>
              <span
                className={`text-sm sm:text-base font-bold ${
                  isGain ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {activeHoverPoint
                  ? `${isGain ? '+' : ''}${displayChange}%`
                  : `${currentInstrument.formattedChange} (${currentInstrument.formattedChangePercent})`}
              </span>
              <span className="text-xs text-[#787b86] font-sans font-medium">
                {activeHoverPoint ? `Point in time: ${activeHoverPoint.point.time}` : currentInstrument.marketStatus}
              </span>
            </div>
          </div>

          {/* Chart Controls & Timeframe selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Line vs Candle */}
            <div className="flex items-center bg-[#f0f3fa] rounded-lg p-0.5 text-xs mr-1">
              <button
                type="button"
                onClick={() => setChartMode('line')}
                className={`p-1.5 rounded transition-colors ${
                  chartMode === 'line'
                    ? 'bg-white text-[#131722] shadow-xs'
                    : 'text-[#787b86] hover:text-[#131722]'
                }`}
                title="Line Area Chart"
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setChartMode('candle')}
                className={`p-1.5 rounded transition-colors ${
                  chartMode === 'candle'
                    ? 'bg-white text-[#131722] shadow-xs'
                    : 'text-[#787b86] hover:text-[#131722]'
                }`}
                title="Candlestick Chart"
              >
                <CandlestickChart className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timeframe selector tabs */}
            <div className="flex items-center bg-[#f0f3fa] rounded-lg p-1 text-xs font-medium">
              {TIMEFRAMES.map((tf) => {
                const isActive = selectedTimeframe === tf;
                return (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white font-semibold text-[#131722] shadow-xs'
                        : 'text-[#787b86] hover:text-[#131722]'
                    }`}
                  >
                    {tf}
                  </button>
                );
              })}
            </div>

            {/* Full chart view button */}
            <button
              type="button"
              onClick={() => onOpenFullChart(currentInstrument)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[#e0e3eb] text-[#131722] hover:bg-[#f0f3fa] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Full chart view</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#787b86]" />
            </button>
          </div>
        </div>

        {/* Realistic Interactive SVG Area Chart */}
        <div className="pt-6" data-purpose="chart-container">
          <div
            ref={chartContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="h-64 w-full relative cursor-crosshair select-none"
          >
            {chartMode === 'line' ? (
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 240">
                <defs>
                  <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={primaryColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal grid lines matching screenshot */}
                <line
                  stroke="#f0f3fa"
                  strokeDasharray="4"
                  strokeWidth="1"
                  x1="0"
                  x2="1000"
                  y1="40"
                  y2="40"
                />
                <line
                  stroke="#f0f3fa"
                  strokeDasharray="4"
                  strokeWidth="1"
                  x1="0"
                  x2="1000"
                  y1="100"
                  y2="100"
                />
                <line
                  stroke="#f0f3fa"
                  strokeDasharray="4"
                  strokeWidth="1"
                  x1="0"
                  x2="1000"
                  y1="160"
                  y2="160"
                />
                <line
                  stroke="#f0f3fa"
                  strokeWidth="1"
                  x1="0"
                  x2="1000"
                  y1="220"
                  y2="220"
                />

                {/* Area fill */}
                <polygon fill={`url(#${gradientId})`} points={polygonCoords} />

                {/* Price Line */}
                <polyline
                  fill="none"
                  points={polylineCoords}
                  stroke={primaryColor}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />

                {/* Pulsing Active Price Dot at the tip */}
                {svgPoints.length > 0 && (
                  <>
                    <circle
                      cx={svgPoints[svgPoints.length - 1].x}
                      cy={svgPoints[svgPoints.length - 1].y}
                      fill={primaryColor}
                      r="4.5"
                      className="animate-pulse"
                    />
                    <circle
                      cx={svgPoints[svgPoints.length - 1].x}
                      cy={svgPoints[svgPoints.length - 1].y}
                      fill={primaryColor}
                      fillOpacity="0.3"
                      r="8"
                    />
                  </>
                )}

                {/* Interactive Crosshair and Hover Indicator */}
                {activeHoverPoint && (
                  <g>
                    {/* Vertical guideline */}
                    <line
                      x1={activeHoverPoint.x}
                      x2={activeHoverPoint.x}
                      y1="0"
                      y2="220"
                      stroke="#787b86"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    {/* Target dot */}
                    <circle
                      cx={activeHoverPoint.x}
                      cy={activeHoverPoint.y}
                      r="6"
                      fill="#ffffff"
                      stroke={primaryColor}
                      strokeWidth="2.5"
                    />
                  </g>
                )}
              </svg>
            ) : (
              /* Candlestick view mode */
              <div className="h-full w-full flex items-end justify-between px-2 pt-4 pb-4">
                {currentInstrument.candles.map((candle, cIdx) => {
                  const isGreen = candle.close >= candle.open;
                  const cColor = isGreen ? '#089981' : '#f23645';
                  const top = Math.min(candle.open, candle.close);
                  const bottom = Math.max(candle.open, candle.close);
                  const heightPercent = Math.max(
                    6,
                    Math.abs(candle.close - candle.open) * 0.08
                  );

                  return (
                    <div
                      key={cIdx}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* High-Low Wick */}
                      <div
                        className="w-0.5 bg-[#787b86]"
                        style={{ height: `${Math.random() * 40 + 20}px` }}
                      ></div>
                      {/* Body */}
                      <div
                        className="w-3 rounded-xs transition-transform group-hover:scale-110"
                        style={{
                          height: `${heightPercent}px`,
                          backgroundColor: cColor,
                        }}
                      ></div>
                      {/* Tooltip on hover */}
                      <div className="hidden group-hover:block absolute -top-12 z-20 bg-[#131722] text-white text-[10px] py-1 px-2 rounded font-mono whitespace-nowrap shadow-md">
                        {candle.time}: O {candle.open} | C {candle.close}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Hover Tooltip Card */}
            {activeHoverPoint && chartMode === 'line' && (
              <div
                className="absolute top-2 pointer-events-none bg-[#131722] text-white text-xs py-1.5 px-3 rounded-lg shadow-lg font-mono tabular-nums transition-all duration-75"
                style={{
                  left: `${Math.min(
                    88,
                    Math.max(12, (activeHoverPoint.x / svgWidth) * 100)
                  )}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="font-bold text-white flex items-center gap-2">
                  <span>{activeHoverPoint.point.formattedPrice}</span>
                  <span
                    className={
                      activeHoverPoint.point.price >= points[0].price
                        ? 'text-[#089981]'
                        : 'text-[#f23645]'
                    }
                  >
                    {(
                      ((activeHoverPoint.point.price - points[0].price) /
                        points[0].price) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
                <div className="text-[10px] text-[#787b86] font-sans">
                  {activeHoverPoint.point.time}
                </div>
              </div>
            )}

            {/* Time labels matching the screenshot */}
            <div className="flex justify-between items-center text-[11px] text-[#787b86] font-medium pt-2 font-mono">
              <span>09:30</span>
              <span className="hidden sm:inline">10:30</span>
              <span>11:30</span>
              <span className="hidden sm:inline">12:30</span>
              <span>13:30</span>
              <span className="hidden sm:inline">14:30</span>
              <span>15:30</span>
              <span>16:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
