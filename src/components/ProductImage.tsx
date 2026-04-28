import React, { useState } from 'react';
import { getOptimizedImageUrl, DEFAULT_PLACEHOLDER } from '../lib/storage';
import { cn } from '../lib/utils';
import { Box, Cpu } from 'lucide-react';

interface ProductImageProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  showIconFallback?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  className, 
  containerClassName,
  width = 400,
  height = 400,
  loading = 'lazy',
  showIconFallback = true
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  // We use the src directly first if it's already a placeholder or icon should be shown
  const firstTry = getOptimizedImageUrl(src, { width, height });

  const handleError = () => {
    if (errorCount === 0 && src && firstTry !== src) {
      // Try original URL next
      setErrorCount(1);
      setCurrentSrc(src);
    } else if (errorCount < 2) {
      // Try placeholder last
      setErrorCount(2);
      setCurrentSrc(DEFAULT_PLACEHOLDER);
    } else {
      // Give up
      setErrorCount(3);
    }
  };

  const finalSrc = currentSrc || firstTry;

  if (errorCount >= 3 || (!src && !showIconFallback)) {
    return (
      <div className={cn("bg-slate-100 flex flex-col items-center justify-center text-slate-300", containerClassName || className)}>
        <Cpu size={Math.min(width, height) / 4} strokeWidth={1} />
      </div>
    );
  }

  if (!src && showIconFallback) {
    return (
      <div className={cn("bg-slate-100 flex flex-col items-center justify-center text-slate-300", containerClassName || className)}>
        <Box size={Math.min(width, height) / 4} strokeWidth={1} />
        <span className="text-[8px] font-black uppercase tracking-widest mt-1">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
};
