import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'icon';
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  showText = true, 
  variant = 'full',
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Stylized P with Circuitry */}
        <path
          d="M20 20H60C75 20 80 30 80 40C80 50 75 60 60 60H40V90"
          stroke={isLight ? "#FFFFFF" : "#002B49"}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M40 60H20V90"
          stroke="#00E5FF"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Circuit nodes */}
        <circle cx="35" cy="35" r="4" fill={isLight ? "#FFFFFF" : "#002B49"} />
        <circle cx="50" cy="45" r="4" fill={isLight ? "#FFFFFF" : "#002B49"} />
        <circle cx="35" cy="55" r="4" fill={isLight ? "#FFFFFF" : "#002B49"} />
        
        {/* Signal Waves */}
        <path
          d="M75 25C85 35 85 55 75 65"
          stroke="#00E5FF"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M85 15C100 30 100 60 85 75"
          stroke="#00E5FF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        {/* Wrench Motif */}
        <path
          d="M60 75L75 90M70 85L80 75"
          stroke="#00E5FF"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span className={cn("text-2xl font-black tracking-tighter", isLight ? "text-white" : "text-navy")}>PC</span>
            <span className="text-2xl font-black text-cyan tracking-tighter ml-1">BEEP</span>
          </div>
          {variant === 'full' && (
            <span className={cn("text-[6px] font-bold tracking-[0.2em] uppercase mt-0.5", isLight ? "text-white/60" : "text-navy")}>
              Computer Parts Retailing & Assembly
            </span>
          )}
        </div>
      )}
    </div>
  );
};
