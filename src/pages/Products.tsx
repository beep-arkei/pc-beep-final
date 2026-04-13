import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Loader2, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { ProductFilterSidebar, FilterState } from '../components/ProductFilterSidebar';
import { cn } from '../lib/utils';

export const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const { user } = useStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  
  const [filters, setFilters] = useState<FilterState>({
    parentCategories: [],
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    priceRange: [0, 1000000],
    stockStatus: [],
    specs: {}
  });

  // Fetch all products once for sidebar counts
  useEffect(() => {
    const fetchAllProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setAllProducts(data);
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        
        // Parent Categories
        if (filters.parentCategories.length > 0) {
          query = query.in('parent_category', filters.parentCategories);
        }

        // Subcategories
        if (filters.categories.length > 0) {
          query = query.in('category', filters.categories);
        }

        // Brands
        if (filters.brands.length > 0) {
          const brandFilters = filters.brands.map(b => `name.ilike.%${b}%`).join(',');
          query = query.or(brandFilters);
        }

        // Price Range
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);

        // Stock Status
        if (filters.stockStatus.length > 0) {
          const stockFilters = filters.stockStatus.map(status => {
            if (status === 'in_stock') return 'stock_quantity.gt.10';
            if (status === 'low_stock') return 'and(stock_quantity.gt.0,stock_quantity.lte.10)';
            if (status === 'out_of_stock') return 'stock_quantity.eq.0';
            return '';
          }).filter(Boolean).join(',');
          query = query.or(stockFilters);
        }

        // Specs (JSONB)
        Object.entries(filters.specs).forEach(([key, values]) => {
          if (values.length > 0) {
            const specFilters = values.map(v => `specs->>${key}.eq.${v}`).join(',');
            query = query.or(specFilters);
          }
        });
        
        if (search) {
          query = query.ilike('name', `%${search}%`);
        }

        // Apply sorting
        switch (sortBy) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'name_asc':
            query = query.order('name', { ascending: true });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false, nullsFirst: false });
            break;
          default:
            query = query.order('id', { ascending: true });
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [search, filters, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-8 bg-cyan" />
                <span className="text-[10px] font-black text-cyan uppercase tracking-[0.3em]">Premium Hardware</span>
              </div>
              <h1 className="text-5xl font-black text-navy uppercase tracking-tighter leading-none">
                PRODUCT <span className="text-cyan">CATALOG</span>
              </h1>
              <p className="text-slate-500 font-medium mt-4 max-w-xl leading-relaxed">
                Explore our curated selection of high-performance components, peripherals, and systems designed for enthusiasts and professionals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button 
                  onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                    isFilterSidebarOpen ? "bg-navy text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <Filter size={14} />
                  <span>{isFilterSidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
                </button>
              </div>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-navy font-bold text-xs uppercase tracking-widest outline-none focus:ring-2 focus:ring-cyan transition-all shadow-sm cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan/5 blur-xl group-focus-within:bg-cyan/10 transition-all rounded-3xl" />
            <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm group-focus-within:border-cyan transition-all">
              <Search className="ml-6 text-slate-400 group-focus-within:text-cyan transition-colors" size={20} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, brand, or specifications..."
                className="w-full pl-4 pr-6 py-5 bg-transparent text-navy font-medium placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Sidebar Filters */}
          <ProductFilterSidebar 
            products={allProducts}
            filters={filters}
            onFilterChange={setFilters}
            isOpen={isFilterSidebarOpen}
            onToggle={() => setIsFilterSidebarOpen(false)}
            variant="public"
          />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan/20 blur-xl animate-pulse" />
                  <Loader2 className="animate-spin text-cyan relative" size={48} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Synchronizing Inventory</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.filter(p => isAdmin || !p.is_unlisted).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-black text-navy uppercase tracking-tighter mb-2">No matches found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button 
                  onClick={() => setFilters({
                    parentCategories: [],
                    categories: [],
                    brands: [],
                    priceRange: [0, 1000000],
                    stockStatus: [],
                    specs: {}
                  })}
                  className="px-6 py-3 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan transition-all shadow-lg shadow-navy/10"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
