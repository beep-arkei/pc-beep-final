import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, ArrowLeft, Shield, Truck, RotateCcw, CheckCircle2, Loader2, XCircle, Cpu, Star, Award, Package, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { getOptimizedImageUrl, DEFAULT_PLACEHOLDER } from '../lib/storage';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import ReactMarkdown from 'react-markdown';

export const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { user, addToCart } = useStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'specs' | 'warranty' | 'reviews'>('specs');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (data) {
          setProduct(data);
          setActiveImage(data.image_url);

          // Category mapping for complementary items
          const COMPLEMENTARY_MAP: Record<string, string[]> = {
            'CPU': ['Cooling', 'Generic Cooler', 'Thermal Paste', 'Thermal Pad', 'RAM', 'Motherboard'],
            'Motherboard': ['CPU', 'RAM', 'Case', 'Storage'],
            'GPU': ['PSU', 'Monitor', 'DisplayCable'],
            'Case': ['Cooling', 'Case Fan', 'PSU'],
            'Monitor': ['GPU', 'Peripherals', 'Keyboard', 'Mouse'],
            'Storage': ['Motherboard', 'Case'],
            'PSU': ['GPU', 'Case', 'Motherboard'],
            'Cooling': ['CPU', 'Thermal Paste', 'Case'],
            'RAM': ['CPU', 'Motherboard']
          };

          const complementaryCats = COMPLEMENTARY_MAP[data.category] || COMPLEMENTARY_MAP[data.parent_category] || [];

          // Fetch similar products (Substitutes)
          const { data: similar } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .eq('parent_category', data.parent_category)
            .neq('id', data.id)
            .eq('is_unlisted', false)
            .limit(4);
          
          if (similar) setSimilarProducts(similar);

          // Fetch frequently bought together (Complementary)
          if (complementaryCats.length > 0) {
            const { data: frequent } = await supabase
              .from('products')
              .select('*')
              .in('category', complementaryCats)
              .eq('is_unlisted', false)
              .limit(4);
            
            if (frequent) setFrequentlyBoughtTogether(frequent);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex justify-center">
        <Loader2 className="animate-spin text-cyan" size={48} />
      </div>
    );
  }

  if (!product || (product.is_unlisted && !isAdmin)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">Product not found</h2>
        <Link to="/products" className="text-cyan font-bold hover:underline mt-4 inline-block">Back to Catalog</Link>
      </div>
    );
  }

  const gallery = [product.image_url, ...(product.gallery_urls || [])]
    .filter(url => url && url.trim() !== '' && !url.includes('picsum.photos'));

  const hasValidImage = gallery.length > 0;
  const displayImage = activeImage && !activeImage.includes('picsum.photos') ? activeImage : (hasValidImage ? gallery[0] : null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
        <Link to="/" className="hover:text-cyan transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link to="/products" className="hover:text-cyan transition-colors">Catalog</Link>
        <ChevronRight size={10} />
        <span className="text-navy">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="bg-white rounded-sm border border-slate-200 aspect-square flex items-center justify-center overflow-hidden cursor-zoom-in relative"
            >
              {displayImage ? (
                <>
                  <ProductImage 
                    src={displayImage} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-200"
                    width={800}
                    height={800}
                  />
                  {isZooming && (
                    <div 
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{
                        backgroundImage: `url(${displayImage})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: '200%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-200">
                  <Cpu size={120} strokeWidth={1} />
                  <span className="text-sm font-black uppercase tracking-widest mt-4">No Image Available</span>
                </div>
              )}
            </motion.div>
            
            {/* Verified Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-sm">
                <Shield size={14} className="text-green-500" fill="currentColor" fillOpacity={0.2} />
                <span className="text-[10px] font-black text-navy uppercase tracking-widest">Verified Genuine</span>
              </div>
            </div>
          </div>
          
          {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "w-24 h-24 rounded-sm border transition-all shrink-0 overflow-hidden bg-white flex items-center justify-center",
                    (activeImage === img || (!activeImage && idx === 0)) ? "border-cyan ring-1 ring-cyan" : "border-slate-200 hover:border-cyan/50"
                  )}
                >
                  <ProductImage 
                    src={img} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    width={150}
                    height={150}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-navy text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">
                {product.category}
              </span>
              {product.is_deal && (
                <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">
                  Hot Deal
                </span>
              )}
            </div>
            
            <h1 className="text-5xl font-black text-navy uppercase tracking-tighter leading-[0.9] mb-6">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col">
                {product.discount_price ? (
                  <>
                    <div className="text-4xl font-black text-cyan">
                      ₱{product.discount_price.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400 line-through font-bold">
                      ₱{product.price.toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div className="text-4xl font-black text-cyan">
                    ₱{product.price.toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="h-10 w-[1px] bg-slate-200" />

              <div className="flex flex-col">
                <div className={cn(
                  "text-xs font-black uppercase tracking-widest flex items-center gap-2",
                  product.stock_quantity > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {product.stock_quantity > 0 ? (
                    <>
                      <Package size={14} /> 
                      {product.stock_quantity <= 5 ? `Only ${product.stock_quantity} left!` : 'In Stock'}
                    </>
                  ) : (
                    <>
                      <XCircle size={14} /> Out of Stock
                    </>
                  )}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                  Ready for immediate dispatch
                </div>
              </div>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed text-lg max-w-xl">
              {product.description}
            </p>
          </div>

          <div className="flex gap-4 mb-12">
            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock_quantity === 0}
              className="flex-grow py-5 bg-navy text-white font-black rounded-sm flex items-center justify-center gap-4 hover:bg-cyan hover:text-navy transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              <ShoppingCart size={20} /> {product.stock_quantity === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            <button 
              disabled={product.stock_quantity === 0}
              className="px-10 py-5 bg-white border border-navy text-navy font-black rounded-sm hover:bg-slate-50 transition-all disabled:border-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              BUY NOW
            </button>
          </div>

          {/* Tabs */}
          <div className="border border-slate-200 rounded-sm overflow-hidden flex-grow flex flex-col">
            <div className="flex bg-slate-50 border-b border-slate-200">
              {[
                { id: 'specs', label: 'Specifications', icon: <Cpu size={14} /> },
                { id: 'warranty', label: 'Warranty & PH Info', icon: <Shield size={14} /> },
                { id: 'reviews', label: 'Customer Reviews', icon: <Star size={14} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 py-4 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                    activeTab === tab.id 
                      ? "bg-white text-cyan border-b-2 border-cyan" 
                      : "text-slate-400 hover:text-navy hover:bg-slate-100"
                  )}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-8 bg-white min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === 'specs' && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-fit"
                  >
                    {Object.entries(product.specs || {}).map(([key, value]) => (
                      <div key={key} className="border-b border-slate-100 pb-4">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</div>
                        <div className="font-bold text-navy">{value as string}</div>
                      </div>
                    ))}
                    
                    {product.detailed_specs && (
                      <div className="mt-12 pt-12 border-t border-slate-100 w-full col-span-2 text-left">
                        <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Info size={16} className="text-cyan" />
                          Detailed Overview
                        </h4>
                        <div className="text-slate-600 space-y-4 max-w-none text-base leading-relaxed
                          [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-navy [&_h1]:uppercase [&_h1]:tracking-tighter [&_h1]:mb-6 [&_h1]:mt-8
                          [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-navy [&_h2]:uppercase [&_h2]:tracking-tighter [&_h2]:mb-4 [&_h2]:mt-6
                          [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-navy [&_h3]:uppercase [&_h3]:tracking-tighter [&_h3]:mb-3 [&_h3]:mt-4
                          [&_p]:mb-4
                          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4
                          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4
                          [&_li]:text-slate-600
                          [&_strong]:text-navy [&_strong]:font-black
                          [&_blockquote]:border-l-4 [&_blockquote]:border-cyan [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-slate-50 [&_blockquote]:py-2 [&_blockquote]:rounded-r-sm
                          [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-cyan [&_code]:font-mono [&_code]:text-sm
                          [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:rounded-sm [&_pre]:overflow-x-auto [&_pre]:my-6
                          [&_pre_code]:bg-transparent [&_pre_code]:text-white [&_pre_code]:p-0
                        ">
                          <ReactMarkdown>{product.detailed_specs}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {Object.keys(product.specs || {}).length === 0 && !product.detailed_specs && (
                      <div className="col-span-2 text-center py-12 text-slate-400 font-medium">
                        No detailed specifications available for this item.
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'warranty' && (
                  <motion.div
                    key="warranty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-cyan/10 rounded-sm flex items-center justify-center shrink-0">
                        <Shield className="text-cyan" size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-navy text-sm uppercase tracking-tight">1-Year Local Warranty</h4>
                        <p className="text-slate-500 text-sm mt-1">Full coverage for manufacturing defects. Service center located in Tagbilaran City.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-cyan/10 rounded-sm flex items-center justify-center shrink-0">
                        <Truck className="text-cyan" size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-navy text-sm uppercase tracking-tight">Nationwide PH Shipping</h4>
                        <p className="text-slate-500 text-sm mt-1">Insured delivery via LBC or J&T. 3-5 business days for provincial orders.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-cyan/10 rounded-sm flex items-center justify-center shrink-0">
                        <RotateCcw className="text-cyan" size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-navy text-sm uppercase tracking-tight">7-Day Easy Return</h4>
                        <p className="text-slate-500 text-sm mt-1">Change of mind? Return within 7 days in original packaging for a store credit.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-12"
                  >
                    <Star className="mx-auto text-slate-200 mb-4" size={48} />
                    <h4 className="font-black text-navy uppercase tracking-tighter">No reviews yet</h4>
                    <p className="text-slate-400 text-sm mt-2">Be the first to review this high-performance component!</p>
                    <button className="mt-6 px-6 py-3 bg-slate-100 text-navy font-black text-[10px] uppercase tracking-widest rounded-sm hover:bg-slate-200 transition-all">
                      Write a Review
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      {frequentlyBoughtTogether.length > 0 && (
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">FREQUENTLY <span className="text-cyan">BOUGHT TOGETHER</span></h2>
              <p className="text-slate-500 font-medium mt-1">Complete your build with these complementary components.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {frequentlyBoughtTogether.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* See Similar Items */}
      {similarProducts.length > 0 && (
        <section className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">SEE <span className="text-cyan">SIMILAR</span> ITEMS</h2>
              <p className="text-slate-500 font-medium mt-1">Explore other options in this category.</p>
            </div>
            <Link to="/products" className="text-navy font-black text-[10px] uppercase tracking-widest hover:text-cyan transition-colors border-b-2 border-navy hover:border-cyan pb-1">
              View All Components
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
