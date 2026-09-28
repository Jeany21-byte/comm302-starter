import React from 'react';

interface FooterProps {
  onSelectFooterLink: (link: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectFooterLink }) => {
  const links = ['Markets', 'Screeners', 'Heatmaps', 'Economic Calendar', 'News & Ideas'];

  return (
    <footer className="border-t border-[#e0e3eb] bg-white text-xs text-[#787b86] py-8">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
          {links.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => onSelectFooterLink(link)}
              className="hover:text-[#131722] transition-colors cursor-pointer font-medium"
            >
              {link}
            </button>
          ))}
        </div>
        <div className="text-[#787b86] font-normal text-center md:text-right">
          © 2024 TradingView. Select market data provided by ICE Data Services.
        </div>
      </div>
    </footer>
  );
};
