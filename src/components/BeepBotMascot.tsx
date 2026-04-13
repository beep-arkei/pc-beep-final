import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface BeepBotMascotProps {
  variant?: 'happy' | 'sad' | 'confused' | 'celebrating' | 'minimal';
  className?: string;
  size?: number;
}

export const BeepBotMascot: React.FC<BeepBotMascotProps> = ({ 
  variant = 'happy', 
  className,
  size = 200 
}) => {
  const colors = {
    body: '#1e293b', // slate-800
    screen: '#0f172a', // slate-900
    accent: '#00e5ff', // cyan
    pink: '#ff00ff', // pink
    glow: 'rgba(0, 229, 255, 0.3)',
    sadGlow: 'rgba(59, 130, 246, 0.3)', // blue
    confusedGlow: 'rgba(245, 158, 11, 0.3)', // amber
    celebratingGlow: 'rgba(168, 85, 247, 0.3)', // purple
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'sad': return { accent: '#3b82f6', glow: colors.sadGlow };
      case 'confused': return { accent: '#f59e0b', glow: colors.confusedGlow };
      case 'celebrating': return { accent: '#a855f7', glow: colors.celebratingGlow };
      default: return { accent: colors.accent, glow: colors.glow };
    }
  };

  const v = getVariantColors();

  const renderFace = () => {
    switch (variant) {
      case 'sad':
        return (
          <g>
            <circle cx="35" cy="45" r="4" fill={v.accent} />
            <circle cx="65" cy="45" r="4" fill={v.accent} />
            <path d="M40 70 Q50 60 60 70" stroke={v.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <motion.path 
              animate={{ y: [0, 5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              d="M35 55 L35 60" stroke={v.accent} strokeWidth="2" strokeLinecap="round" 
            />
          </g>
        );
      case 'confused':
        return (
          <g>
            <circle cx="35" cy="45" r="4" fill={v.accent} />
            <circle cx="65" cy="45" r="4" fill={v.accent} />
            <path d="M45 65 L55 65" stroke={v.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <motion.text 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              x="75" y="35" fill={colors.pink} fontSize="16" fontWeight="black"
            >?</motion.text>
          </g>
        );
      case 'celebrating':
        return (
          <g>
            <path d="M30 45 L40 35 L30 25" stroke={v.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M70 45 L60 35 L70 25" stroke={v.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M35 65 Q50 80 65 65" stroke={v.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -20, x: (i - 2) * 10 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                cx="50" cy="40" r="2" fill={i % 2 === 0 ? colors.pink : v.accent}
              />
            ))}
          </g>
        );
      case 'minimal':
        return (
          <g>
            <circle cx="35" cy="50" r="5" fill={v.accent} />
            <circle cx="65" cy="50" r="5" fill={v.accent} />
          </g>
        );
      default:
        return (
          <g>
            <circle cx="35" cy="45" r="4" fill={v.accent} />
            <circle cx="65" cy="45" r="4" fill={v.accent} />
            <path d="M35 65 Q50 75 65 65" stroke={v.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={v.accent} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Antennae */}
        <line x1="85" y1="40" x2="75" y2="20" stroke={colors.body} strokeWidth="4" strokeLinecap="round" />
        <circle cx="75" cy="20" r="4" fill={colors.pink} filter="url(#glow)" />
        <line x1="115" y1="40" x2="125" y2="20" stroke={colors.body} strokeWidth="4" strokeLinecap="round" />
        <circle cx="125" cy="20" r="4" fill={colors.pink} filter="url(#glow)" />
        <line x1="100" y1="40" x2="100" y2="15" stroke={colors.body} strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="15" r="3" fill={colors.pink} filter="url(#glow)" />

        {/* Head / Monitor */}
        <rect x="50" y="40" width="100" height="80" rx="15" fill={colors.body} stroke="#334155" strokeWidth="2" />
        <rect x="60" y="50" width="80" height="60" rx="8" fill={colors.screen} />
        <rect x="60" y="50" width="80" height="60" rx="8" fill="url(#screenGlow)" />

        {/* Face */}
        <g transform="translate(60, 50) scale(0.8)">
          {renderFace()}
        </g>

        {/* Neck */}
        <rect x="90" y="120" width="20" height="10" fill="#334155" />

        {/* Body */}
        <path d="M70 130 L130 130 L140 170 L60 170 Z" fill={colors.body} stroke="#334155" strokeWidth="2" />
        
        {/* Tech details on body */}
        <rect x="85" y="140" width="10" height="4" rx="1" fill={v.accent} opacity="0.6" />
        <rect x="100" y="140" width="15" height="4" rx="1" fill={colors.pink} opacity="0.6" />
        <circle cx="90" cy="155" r="2" fill={v.accent} />
        <circle cx="100" cy="155" r="2" fill={colors.pink} />
        <circle cx="110" cy="155" r="2" fill={v.accent} />

        {/* Arms */}
        <g>
          <motion.path 
            animate={variant === 'celebrating' ? { rotate: [0, -20, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            d="M70 140 L50 160 L40 180" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" 
          />
          <motion.path 
            animate={variant === 'celebrating' ? { rotate: [0, 20, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            d="M130 140 L150 160 L160 180" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" 
          />
        </g>

        {/* Legs */}
        <rect x="80" y="170" width="12" height="20" rx="4" fill={colors.body} />
        <rect x="108" y="170" width="12" height="20" rx="4" fill={colors.body} />
        <rect x="75" y="190" width="22" height="8" rx="4" fill="#334155" />
        <rect x="103" y="190" width="22" height="8" rx="4" fill="#334155" />
      </svg>

      {/* Glow Effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ backgroundColor: v.accent }}
      />
    </div>
  );
};
