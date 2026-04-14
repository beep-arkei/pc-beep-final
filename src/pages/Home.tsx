import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Shield, Zap, PhilippinePeso, Loader2, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { PromoCarousel } from '../components/PromoCarousel';
import { Star, Award, Monitor, MousePointer2 } from 'lucide-react';

import { getOptimizedImageUrl } from '../lib/storage';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [featuredBuild, setFeaturedBuild] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [homeSearch, setHomeSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(homeSearch.trim())}`);
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [newRes, dealRes, topRes, featuredRes] = await Promise.all([
          supabase.from('products').select('*').eq('is_new', true).eq('is_unlisted', false).limit(4),
          supabase.from('products').select('*').eq('is_deal', true).eq('is_unlisted', false).limit(4),
          supabase.from('products').select('*').eq('is_unlisted', false).order('price', { ascending: false }).limit(4),
          supabase.from('products').select('*').eq('id', '98ae69c3-304c-4b0e-ac39-8188b72f67b7').single()
        ]);
        
        if (newRes.data) setNewProducts(newRes.data);
        if (dealRes.data) setDeals(dealRes.data);
        if (topRes.data) setTopRated(topRes.data);
        if (featuredRes.data) setFeaturedBuild(featuredRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-navy">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: `linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)`, 
               backgroundSize: '60px 60px' 
             }} 
        />
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-cyan/10 border border-cyan/20 rounded-sm mb-8"
            >
              <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-cyan uppercase tracking-[0.2em]">Bohol's Premier PC Hub</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase"
            >
              ENGINEERED <br />
              <span className="text-cyan">FOR VICTORY</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-xl text-slate-400 font-medium max-w-xl leading-relaxed"
            >
              High-performance hardware, expert assembly, and AI-guided compatibility for the ultimate gaming experience.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSearch}
              className="mt-10 relative max-w-xl group"
            >
              <div className="absolute inset-0 bg-cyan/20 blur-xl group-focus-within:bg-cyan/40 transition-all duration-500 rounded-full" />
              <div className="relative flex items-center bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-full p-1 pl-6 focus-within:border-cyan/50 transition-all">
                <Search className="text-slate-400 mr-3" size={20} />
                <input 
                  type="text"
                  placeholder="Search for components, PCs, or peripherals..."
                  className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus:ring-0 text-sm font-medium"
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                />
                <button 
                  type="submit"
                  className="px-8 py-3 bg-cyan text-navy font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-white transition-all"
                >
                  Search
                </button>
              </div>
            </motion.form>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 flex flex-wrap gap-6"
            >
              <Link 
                to="/builder" 
                className="px-10 py-5 bg-cyan text-navy font-black rounded-sm flex items-center gap-4 hover:bg-white transition-all group"
              >
                START YOUR BUILD <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/products" 
                className="px-10 py-5 bg-white/5 text-white font-black rounded-sm border border-white/10 hover:bg-white/10 transition-all"
              >
                EXPLORE CATALOG
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promotional Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-800 rounded-sm overflow-hidden">
          <PromoCarousel />
        </div>
      </section>

      {/* Build of the Month */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/2 relative h-[500px] lg:h-auto">
            <img 
              src={getOptimizedImageUrl(featuredBuild?.image_url, { width: 1200, height: 800 })} 
              alt="Beppu's Actual PC Full Setup" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (featuredBuild?.image_url && target.src !== featuredBuild.image_url) {
                  target.src = featuredBuild.image_url;
                }
              }}
            />
            <div className="absolute top-6 left-6">
              <div className="bg-cyan text-navy text-[10px] font-black px-4 py-2 rounded-sm uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <Award size={14} /> Build of the Month
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-cyan" />
              <span className="text-[10px] font-black text-cyan uppercase tracking-[0.2em]">Featured Configuration</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-6">
              BEPPU'S <span className="text-cyan">ACTUAL PC</span> <br /> FULL SETUP
            </h2>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed">
              A balanced powerhouse optimized for high-refresh 1440p gaming and professional workflows. Featuring the latest RDNA 5 architecture and a clean mATX aesthetic.
            </p>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-10">
              <div className="border-l-2 border-cyan pl-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processor</div>
                <div className="text-sm font-bold text-white">Ryzen 5 7500F</div>
              </div>
              <div className="border-l-2 border-cyan pl-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Graphics</div>
                <div className="text-sm font-bold text-white">RX 9070 16GB OC</div>
              </div>
              <div className="border-l-2 border-cyan pl-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Memory</div>
                <div className="text-sm font-bold text-white">32GB Cras V RGB White</div>
              </div>
              <div className="border-l-2 border-cyan pl-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Value</div>
                <div className="text-sm font-bold text-cyan">₱127,850</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/builder" 
                className="inline-flex items-center gap-3 bg-cyan text-navy px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all group"
              >
                Replicate this Build <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="inline-flex items-center gap-3 border border-slate-700 text-slate-400 px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all">
                View Setup Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-navy uppercase tracking-tighter">NEW <span className="text-cyan">ARRIVALS</span></h2>
            <p className="text-slate-500 font-medium mt-2">The latest tech drops in the Philippine market.</p>
          </div>
          <Link to="/products" className="text-navy font-black text-xs uppercase tracking-widest hover:text-cyan transition-colors flex items-center gap-2 pb-1 border-b-2 border-navy hover:border-cyan">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-cyan" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Top Rated Components */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-navy uppercase tracking-tighter">TOP <span className="text-cyan">RATED</span></h2>
            <p className="text-slate-500 font-medium mt-2">Community favorites and expert-recommended parts.</p>
          </div>
          <Link to="/products" className="text-navy font-black text-xs uppercase tracking-widest hover:text-cyan transition-colors flex items-center gap-2 pb-1 border-b-2 border-navy hover:border-cyan">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-cyan" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topRated.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Hot Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-navy uppercase tracking-tighter">HOT <span className="text-cyan">DEALS</span></h2>
            <p className="text-slate-500 font-medium mt-2">Limited time offers on high-end components.</p>
          </div>
          <Link to="/products" className="text-navy font-black text-xs uppercase tracking-widest hover:text-cyan transition-colors flex items-center gap-2 pb-1 border-b-2 border-navy hover:border-cyan">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-cyan" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {deals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Cpu className="text-cyan" size={40} />, 
              title: "Smart Compatibility", 
              desc: "Our AI-driven engine ensures every part fits together perfectly, from socket types to PSU wattage.",
              img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800"
            },
            { 
              icon: <PhilippinePeso className="text-cyan" size={40} />, 
              title: "Best PH Pricing", 
              desc: "We source directly to provide the most competitive rates for the local gaming community.",
              img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
            },
            { 
              icon: <Shield className="text-cyan" size={40} />, 
              title: "Local Warranty", 
              desc: "Full local support and warranty coverage for every component purchased through PC Beep.",
              img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
            }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="relative h-[450px] rounded-sm overflow-hidden group border border-slate-800 bg-navy"
            >
              <div className="absolute inset-0">
                <img 
                  src={f.img} 
                  alt={f.title} 
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 scale-110 group-hover:scale-100" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
              </div>
              
              <div className="relative h-full p-12 flex flex-col justify-end">
                <div className="mb-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-16 h-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm flex items-center justify-center">
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter leading-none">{f.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  {f.desc}
                </p>
                <div className="w-12 h-1 bg-cyan mt-8 transform origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-sm p-16 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
            <Zap size={400} className="text-cyan absolute -top-20 -right-20" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              READY TO UPGRADE <br />
              <span className="text-cyan">YOUR SETUP?</span>
            </h2>
            <p className="mt-6 text-slate-400 font-medium text-lg leading-relaxed">
              Join thousands of Filipino gamers who trust PC Beep for their high-end custom rigs. Expert assembly and local warranty guaranteed.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="px-10 py-5 bg-cyan text-navy font-black rounded-sm hover:bg-white transition-all uppercase tracking-widest text-xs">
                GET STARTED NOW
              </button>
              <button className="px-10 py-5 bg-white/5 text-white font-black rounded-sm border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
                CONTACT SUPPORT
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
