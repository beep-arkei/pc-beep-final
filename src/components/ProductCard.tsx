import React from 'react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { ShoppingCart, Cpu, Info, Flame, Sparkles, BatteryLow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { getOptimizedImageUrl, DEFAULT_PLACEHOLDER } from '../lib/storage';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  isBuildMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, isBuildMode }) => {
  const addToCart = useStore((state) => state.addToCart);

  const hasValidImage = product.image_url && 
    product.image_url.trim() !== '' && 
    !product.image_url.includes('picsum.photos');

  const optimizedImageUrl = hasValidImage
    ? getOptimizedImageUrl(product.image_url, { width: 400, height: 400 })
    : null;

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-geometric group rounded-sm"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-slate-100 flex items-center justify-center rounded-none">
          {optimizedImageUrl ? (
            <img
              src={optimizedImageUrl}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                isOutOfStock && "grayscale opacity-50"
              )}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (product.image_url && target.src !== product.image_url) {
                  target.src = product.image_url;
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300">
              <Cpu size={48} strokeWidth={1} />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-2">No Image</span>
            </div>
          )}

          {/* High-Impact Badges */}
          <div className="absolute top-0 left-0 right-0 p-3 flex flex-wrap gap-2 pointer-events-none">
            {product.is_deal && (
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <Flame size={10} fill="currentColor" />
                Hot Deal
              </div>
            )}
            {product.is_new && (
              <div className="bg-cyan text-navy text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                <Sparkles size={10} fill="currentColor" />
                New Arrival
              </div>
            )}
            {isOutOfStock && (
              <div className="bg-slate-900/90 text-white text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-sm">
                <BatteryLow size={10} />
                Out of Stock
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="bg-navy/80 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest border border-white/10">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
      
      <div className={cn("p-4", (isOutOfStock || product.is_unlisted) && "opacity-60")}>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-navy line-clamp-2 min-h-[2.75rem] pb-1 hover:text-cyan transition-colors leading-tight" title={product.name}>
            {product.name}
          </h3>
        </Link>
        <p className="text-slate-500 text-xs mt-1 line-clamp-2 h-8">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {product.discount_price ? (
              <>
                <span className="text-lg font-black text-cyan">
                   ₱{product.discount_price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₱{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-black text-cyan">
                ₱{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {isBuildMode ? (
              <button
                onClick={() => onSelect?.(product)}
                className="p-2 bg-cyan text-navy rounded-sm hover:bg-cyan/90 transition-colors"
                title="Add to Build"
              >
                <Cpu size={18} />
              </button>
            ) : (
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock_quantity === 0}
                className="p-2 bg-navy text-white rounded-sm hover:bg-navy/90 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                title={product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              >
                <ShoppingCart size={18} />
              </button>
            )}
            <button className="p-2 bg-slate-100 text-slate-600 rounded-sm hover:bg-slate-200 transition-colors">
              <Info size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
