import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showBadge = true,
  href = '/',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* SIM Card Styled Icon */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center text-white shadow-md shadow-slate-950/25 group-hover:scale-105 transition-all duration-200 overflow-hidden shrink-0`}
      >
        {/* Angled notch in top-right */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-slate-200 rounded-bl-sm" />
        {/* Microchip icon inside */}
        <div className="w-4 h-4 rounded-[3px] bg-slate-300/90 border border-white/70 flex items-center justify-center shadow-inner">
          <div className="w-2 h-2 rounded-[1.5px] border border-slate-950/60 bg-white" />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
            SIM<span className="text-blue-950">10</span>
          </span>
          {showBadge && (
            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
              Live
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-slate-500 -mt-0.5 hidden sm:inline tracking-tight">
          Virtual Numbers & SMS OTP
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
