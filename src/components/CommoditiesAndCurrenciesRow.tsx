import React from 'react';
import { COMMODITIES_SUMMARY, CommodityItem } from '../data/marketsData';

interface CommoditiesAndCurrenciesRowProps {
  onSelectCommodity: (item: CommodityItem) => void;
}

export const CommoditiesAndCurrenciesRow: React.FC<CommoditiesAndCurrenciesRowProps> = ({
  onSelectCommodity,
}) => {
  return (
    <section
      className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-12 md:pb-16"
      data-purpose="commodities-and-forex-summary"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMMODITIES_SUMMARY.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCommodity(item)}
            className="border border-[#e0e3eb] rounded-xl p-4 bg-white hover:shadow-md hover:border-[#e0e3eb]/80 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#787b86] uppercase tracking-wider">
                {item.categoryLabel}
              </span>
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded tabular-nums ${
                  item.isPositive
                    ? 'text-[#089981] bg-[#e6f7f3]'
                    : 'text-[#f23645] bg-[#fef0f1]'
                }`}
              >
                {item.changePercent}
              </span>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <h4 className="font-bold text-[#131722] text-base group-hover:text-[#2962ff] transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-[#787b86] mt-0.5">{item.subName}</p>
              </div>

              <div className="text-right font-mono tabular-nums">
                <span className="font-extrabold text-base text-[#131722] block">
                  {item.price}
                </span>
                <span
                  className={`text-xs font-medium ${
                    item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
