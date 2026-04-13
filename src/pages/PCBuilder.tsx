import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Cpu, Layout, Database, Zap, Box, Wind, Plus, Minus, Trash2, CheckCircle2, X, Loader2, Search, Monitor, Shield, MousePointer2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Product, PCBuild } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { generateBuild } from '../services/geminiService';
import { toast } from 'react-hot-toast';
import { getOptimizedImageUrl, DEFAULT_PLACEHOLDER } from '../lib/storage';

const CATEGORIES = [
  { id: 'cpu', name: 'Processor', icon: <Cpu size={20} />, dbCategory: 'CPU' },
  { id: 'motherboard', name: 'Motherboard', icon: <Layout size={20} />, dbCategory: 'Motherboard' },
  { id: 'ram', name: 'Memory (RAM)', icon: <Database size={20} />, dbCategory: 'RAM' },
  { id: 'gpu', name: 'Graphics Card', icon: <Zap size={20} />, dbCategory: 'GPU' },
  { id: 'storage', name: 'Storage', icon: <Box size={20} />, dbCategory: 'Storage', multi: true },
  { id: 'psu', name: 'Power Supply', icon: <Zap size={20} />, dbCategory: 'PSU' },
  { id: 'case', name: 'Casing', icon: <Box size={20} />, dbCategory: 'Case' },
  { id: 'cooler', name: 'Cooling', icon: <Wind size={20} />, dbCategory: 'Cooling', multi: true },
  { id: 'monitor', name: 'Monitor', icon: <Monitor size={20} />, dbCategory: 'Monitor' },
  { id: 'os', name: 'Operating System', icon: <Shield size={20} />, dbCategory: 'Operating System' },
  { id: 'peripherals', name: 'Peripherals', icon: <MousePointer2 size={20} />, dbCategory: 'Peripherals', multi: true },
];

export const PCBuilder: React.FC = () => {
  const { user, pcBuild, addToBuild, removeFromBuild, addSlot, removeSlot, addToCart } = useStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [availableParts, setAvailableParts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [buildName, setBuildName] = useState('');

  const calculateTotal = () => {
    let total = 0;
    Object.values(pcBuild).forEach(val => {
      if (Array.isArray(val)) {
        val.forEach(item => {
          if (item) total += item.price;
        });
      } else if (val) {
        total += val.price;
      }
    });
    return total;
  };

  const totalPrice = calculateTotal();
  
  const fetchParts = async (category: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .or(`category.eq."${category}",parent_category.eq."${category}"`);
      
      switch (sortBy) {
        case 'price_asc': query = query.order('price', { ascending: true }); break;
        case 'price_desc': query = query.order('price', { ascending: false }); break;
        case 'name_asc': query = query.order('name', { ascending: true }); break;
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setAvailableParts(data || []);
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && activeCategory) {
      fetchParts(activeCategory.dbCategory);
    }
  }, [sortBy]);

  const openSelector = (category: typeof CATEGORIES[0], index?: number) => {
    setActiveCategory(category);
    setActiveIndex(index);
    setIsModalOpen(true);
    fetchParts(category.dbCategory);
  };

  const selectPart = (part: Product) => {
    if (activeCategory) {
      addToBuild(part, activeCategory.id as keyof PCBuild, activeIndex);
      setIsModalOpen(false);
    }
  };

  // Basic Compatibility Engine Logic
  const getCompatibilityWarnings = () => {
    const warnings = [];
    
    if (pcBuild.cpu && pcBuild.motherboard) {
      const cpuSocket = pcBuild.cpu.specs?.socket;
      const moboSocket = pcBuild.motherboard.specs?.socket;
      if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
        warnings.push(`Socket Mismatch: ${pcBuild.cpu.name} (${cpuSocket}) is not compatible with ${pcBuild.motherboard.name} (${moboSocket}).`);
      }
    }
    
    let totalWattage = 0;
    Object.values(pcBuild).forEach(val => {
      if (Array.isArray(val)) {
        val.forEach(item => {
          if (item) totalWattage += (item.specs?.wattage || 0);
        });
      } else if (val) {
        totalWattage += (val.specs?.wattage || 0);
      }
    });

    if (pcBuild.psu && totalWattage > (pcBuild.psu.specs?.wattage || 0)) {
      warnings.push(`Insufficient Power: Estimated draw (${totalWattage}W) exceeds PSU capacity (${pcBuild.psu.specs?.wattage}W).`);
    }

    return warnings;
  };

  const warnings = getCompatibilityWarnings();

  const filteredParts = availableParts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAiGenerate = async () => {
    if (isAiGenerating) return;
    setIsAiGenerating(true);
    const loadingToast = toast.loading('Gemini is architecting your build...');

    try {
      // Fetch all products for the catalog
      const { data: allProducts, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_unlisted', false);
      
      if (error) throw error;
      if (!allProducts) throw new Error('No products found in catalog');

      const result = await generateBuild(pcBuild, aiPrompt, allProducts);

      // Update state based on result, respecting existing manual selections
      // We map the IDs back to Product objects
      const productMap = new Map(allProducts.map(p => [p.id, p]));

      Object.entries(result).forEach(([key, value]) => {
        const categoryKey = key as keyof PCBuild;
        
        if (Array.isArray(value)) {
          // For arrays, we need to handle slots
          value.forEach((id, index) => {
            if (id && !pcBuild[categoryKey]?.[index]) {
              const product = productMap.get(id);
              if (product) {
                addToBuild(product, categoryKey, index);
              }
            }
          });
        } else if (value && !pcBuild[categoryKey]) {
          const product = productMap.get(value as string);
          if (product) {
            addToBuild(product, categoryKey);
          }
        }
      });

      toast.success('Build completed by Gemini!', { id: loadingToast });
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast.error('Failed to generate build. Please try again.', { id: loadingToast });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveBuild = async () => {
    if (!user) {
      toast.error('Please login to save your build');
      return;
    }
    if (!buildName.trim()) {
      toast.error('Please enter a name for your build');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('saved_builds')
        .insert({
          user_id: user.id,
          build_name: buildName,
          components_json: pcBuild,
          total_price: totalPrice
        });

      if (error) throw error;

      toast.success('Build saved successfully!');
      setShowSaveModal(false);
      setBuildName('');
    } catch (error) {
      console.error('Error saving build:', error);
      toast.error('Failed to save build');
    } finally {
      setIsSaving(false);
    }
  };

  const renderCategoryRow = (cat: typeof CATEGORIES[0]) => {
    const selected = pcBuild[cat.id as keyof typeof pcBuild];
    
    if (cat.multi && Array.isArray(selected)) {
      return (
        <div key={cat.id} className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="text-navy opacity-50">{cat.icon}</div>
              <span className="text-[10px] font-black text-navy uppercase tracking-widest">{cat.name}</span>
            </div>
            <button 
              onClick={() => addSlot(cat.id as keyof PCBuild)}
              className="flex items-center gap-1 text-[10px] font-black text-cyan uppercase tracking-widest hover:text-navy transition-colors"
            >
              <Plus size={12} /> Add Slot
            </button>
          </div>
          
          <div className="space-y-2">
            {selected.map((item, index) => (
              <div 
                key={`${cat.id}-${index}`}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-sm border transition-all",
                  item ? "bg-white border-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]" : "bg-slate-50 border-slate-200 border-dashed"
                )}
              >
                <div className="flex-1">
                  {item ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-navy text-sm">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">₱{item.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openSelector(cat, index)}
                          className="p-2 text-slate-400 hover:text-cyan transition-colors"
                          title="Change Part"
                        >
                          <Search size={16} />
                        </button>
                        <button 
                          onClick={() => removeFromBuild(cat.id as any, index)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove Part"
                        >
                          <Trash2 size={16} />
                        </button>
                        {selected.length > 1 && (
                          <button 
                            onClick={() => removeSlot(cat.id as keyof PCBuild, index)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remove Slot"
                          >
                            <Minus size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs font-medium italic">Empty Slot</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openSelector(cat, index)}
                          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-800 text-navy rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all"
                        >
                          <Plus size={12} /> Select
                        </button>
                        {selected.length > 1 && (
                          <button 
                            onClick={() => removeSlot(cat.id as keyof PCBuild, index)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const singleSelected = selected as Product | undefined;

    return (
      <div 
        key={cat.id}
        className={cn(
          "flex items-center gap-4 p-4 rounded-sm border transition-all",
          singleSelected ? "bg-white border-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]" : "bg-slate-50 border-slate-200"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-sm flex items-center justify-center",
          singleSelected ? "bg-navy text-white" : "bg-white text-slate-400 border border-slate-100"
        )}>
          {cat.icon}
        </div>
        
        <div className="flex-1">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{cat.name}</div>
          {singleSelected ? (
            <div className="font-bold text-navy text-sm">{singleSelected.name}</div>
          ) : (
            <div className="text-slate-400 text-xs font-medium italic">Not selected</div>
          )}
        </div>

        {singleSelected ? (
          <div className="flex items-center gap-4">
            <span className="font-black text-navy text-sm">₱{singleSelected.price.toLocaleString()}</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => openSelector(cat)}
                className="p-2 text-slate-400 hover:text-cyan transition-colors"
              >
                <Search size={16} />
              </button>
              <button 
                onClick={() => removeFromBuild(cat.id as any)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => openSelector(cat)}
            className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-800 text-navy rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all"
          >
            <Plus size={12} />
            Select
          </button>
        )}
      </div>
    );
  };

  const getSpecsToDisplay = (category: string, specs: any) => {
    if (!specs) return null;
    
    switch (category) {
      case 'CPU':
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cores/Threads</div>
              <div className="text-[10px] font-bold text-navy">{specs.cores || '?'}/{specs.threads || '?'}</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Socket</div>
              <div className="text-[10px] font-bold text-navy">{specs.socket || '?'}</div>
            </div>
          </div>
        );
      case 'GPU':
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">VRAM</div>
              <div className="text-[10px] font-bold text-navy">{specs.vram || '?'}</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Wattage</div>
              <div className="text-[10px] font-bold text-navy">{specs.wattage || '?'}W</div>
            </div>
          </div>
        );
      case 'Motherboard':
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Socket</div>
              <div className="text-[10px] font-bold text-navy">{specs.socket || '?'}</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Form Factor</div>
              <div className="text-[10px] font-bold text-navy">{specs.form_factor || '?'}</div>
            </div>
          </div>
        );
      case 'RAM':
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Type</div>
              <div className="text-[10px] font-bold text-navy">{specs.type || '?'}</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Speed</div>
              <div className="text-[10px] font-bold text-navy">{specs.speed || '?'}</div>
            </div>
          </div>
        );
      case 'Storage':
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Interface</div>
              <div className="text-[10px] font-bold text-navy">{specs.interface || '?'}</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-sm border border-slate-100">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Capacity</div>
              <div className="text-[10px] font-bold text-navy">{specs.capacity || '?'}</div>
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-2 text-[10px] text-slate-500 font-medium italic">
            {Object.entries(specs).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' • ')}
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1 w-full space-y-8">
          <div>
            <h1 className="text-4xl font-black text-navy uppercase tracking-tighter">
              PC <span className="text-cyan">BUILDER</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Assemble your custom rig with our compatibility engine.</p>
          </div>

          {warnings.length > 0 && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl space-y-2">
              <div className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} /> Compatibility Issues Detected
              </div>
              {warnings.map((w, i) => (
                <div key={i} className="text-sm text-red-700 font-medium">• {w}</div>
              ))}
            </div>
          )}

          <div className="space-y-6">
            {/* AI Auto-Builder Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-[4px_4px_0px_0px_rgba(0,229,255,1)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-cyan p-1.5 rounded-sm">
                    <Zap size={16} className="text-navy" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Auto-Builder</h3>
                </div>
                <div className="flex items-center gap-1.5 opacity-50">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Powered by</span>
                  <div className="bg-white/10 px-2 py-0.5 rounded-sm">
                    <span className="text-[8px] font-black text-cyan uppercase tracking-widest">Gemini</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Specify Build Constraints</label>
                  <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., 'Keep it under 80k PHP', 'White aesthetic', 'Focus on 4K video editing'..."
                    className="w-full h-24 bg-navy border border-slate-800 rounded-sm p-3 text-white text-xs font-medium focus:outline-none focus:border-cyan transition-all resize-none placeholder:text-slate-600"
                  />
                </div>
                <button 
                  onClick={handleAiGenerate}
                  disabled={isAiGenerating}
                  className="w-full py-3 bg-cyan text-navy font-black text-[10px] uppercase tracking-widest rounded-sm hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      Let AI Generate the Rest
                    </>
                  )}
                </button>
              </div>
            </div>

            {CATEGORIES.map(renderCategoryRow)}
          </div>
        </div>

        {/* Summary Sidebar */}
        <aside className="w-full md:w-96 sticky top-32">
          <div className="bg-white border border-slate-800 rounded-sm p-8 text-navy shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6 border-b border-slate-800 pb-4">Build Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <span>Compatibility</span>
                <span className={cn(
                  "flex items-center gap-1",
                  warnings.length === 0 ? "text-green-600" : "text-red-600"
                )}>
                  {warnings.length === 0 ? (
                    <>
                      <CheckCircle2 size={12} />
                      Perfect
                    </>
                  ) : (
                    <>
                      <Zap size={12} />
                      Issues Found
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <span>Estimated Wattage</span>
                <span className="text-navy">
                  {(() => {
                    let totalWattage = 0;
                    Object.values(pcBuild).forEach(val => {
                      if (Array.isArray(val)) {
                        val.forEach(item => {
                          if (item) totalWattage += (item.specs?.wattage || 0);
                        });
                      } else if (val) {
                        totalWattage += (val.specs?.wattage || 0);
                      }
                    });
                    return totalWattage;
                  })()}W / {pcBuild.psu?.specs?.wattage || '?'}W
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <div className="flex justify-between items-end">
                <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Total Price</span>
                <span className="text-3xl font-black text-cyan">₱{totalPrice.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => {
                  Object.values(pcBuild).forEach(val => {
                    if (Array.isArray(val)) {
                      val.forEach(item => {
                        if (item) addToCart(item);
                      });
                    } else if (val) {
                      addToCart(val);
                    }
                  });
                  navigate('/cart');
                }}
                disabled={totalPrice === 0}
                className="w-full mt-8 py-4 bg-navy text-white font-black rounded-sm hover:bg-cyan hover:text-navy transition-all uppercase tracking-widest text-xs border border-navy"
              >
                ADD BUILD TO CART
              </button>
              <button 
                onClick={() => setShowSaveModal(true)}
                disabled={totalPrice === 0}
                className="w-full mt-3 py-4 bg-white text-navy font-black rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-xs border border-slate-800 flex items-center justify-center gap-2"
              >
                <Shield size={14} /> SAVE BUILD
              </button>
              <p className="text-center mt-4 text-[9px] text-slate-400 font-black uppercase tracking-widest">
                * Prices include local PH taxes
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Part Selector Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-800"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-navy text-white">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">
                    Select <span className="text-cyan">{activeCategory?.name}</span>
                  </h2>
                  <p className="text-[10px] text-cyan/70 font-black uppercase tracking-widest mt-1">High-Density Component Comparison</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 border-b border-slate-800 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-800 rounded-sm focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan font-bold text-navy text-sm"
                  />
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-800 rounded-sm text-[10px] font-black text-navy outline-none focus:ring-2 focus:ring-cyan uppercase tracking-widest"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A-Z</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                    <Loader2 className="animate-spin mb-4 text-cyan" size={48} />
                    <span className="font-black uppercase tracking-widest text-[10px]">Accessing Database...</span>
                  </div>
                ) : filteredParts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredParts.map((part) => (
                      <div 
                        key={part.id}
                        onClick={() => selectPart(part)}
                        className="group flex flex-col p-4 rounded-sm border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="flex gap-4 mb-4">
                          <div className="w-20 h-20 bg-slate-100 rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                            {part.image_url && !part.image_url.includes('picsum.photos') ? (
                              <img 
                                src={getOptimizedImageUrl(part.image_url, { width: 200, height: 200 })} 
                                alt={part.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Box size={32} className="text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-navy text-sm uppercase tracking-tight leading-none mb-1 group-hover:text-cyan transition-colors truncate">{part.name}</h4>
                            <div className="text-lg font-black text-navy">₱{part.price.toLocaleString()}</div>
                            <div className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest rounded-sm mt-1">
                              In Stock
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-slate-100">
                          {getSpecsToDisplay(activeCategory?.dbCategory || '', part.specs)}
                        </div>

                        <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-navy text-white p-1.5 rounded-sm">
                            <Plus size={16} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 text-slate-400 font-black uppercase tracking-widest text-[10px] border border-dashed border-slate-200 rounded-sm">
                    No components found in this category
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Build Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaveModal(false)}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white border border-slate-800 rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-black text-navy uppercase tracking-tight">Save Your Build</h3>
                <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-navy transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Build Name</label>
                <input 
                  type="text"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  placeholder="e.g., Ultimate Gaming 2024"
                  className="w-full px-4 py-3 bg-white border border-slate-800 rounded-sm focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan font-bold text-navy text-sm mb-6"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveBuild}
                    disabled={isSaving || !buildName.trim()}
                    className="flex-1 py-3 bg-cyan text-navy font-black text-[10px] uppercase tracking-widest rounded-sm hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                    Confirm Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
