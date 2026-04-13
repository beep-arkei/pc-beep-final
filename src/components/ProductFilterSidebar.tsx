import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Check, Filter, X, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { Product } from '../types';

export interface FilterState {
  parentCategories: string[];
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  stockStatus: string[];
  specs: Record<string, string[]>;
}

interface ProductFilterSidebarProps {
  products: Product[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
  variant?: 'admin' | 'public';
}

const CATEGORY_HIERARCHY: Record<string, string[]> = {
  'Components': ['CPU', 'GPU', 'Motherboard', 'RAM', 'SSD', 'HDD', 'PSU', 'Case', 'Cooling'],
  'Peripherals': ['Monitor', 'Keyboard', 'Mouse', 'Headset'],
  'Systems': ['Gaming Laptops', 'Office Laptops', 'Student Laptops', 'Gaming PCs', 'Workstations', 'Budget PCs'],
  'Accessories': ['Networking', 'Cables and Hubs', 'Furniture & Extras']
};

const BRANDS = [
  'ASUS', 'MSI', 'Gigabyte', 'Intel', 'AMD', 'NVIDIA', 'Corsair', 'Razer', 'Logitech', 
  'Samsung', 'Western Digital', 'Seagate', 'NZXT', 'Lian Li', 'Noctua', 'DeepCool', 
  'Cooler Master', 'Zotac', 'Palit', 'Galax', 'TeamGroup', 'G.Skill', 'Kingston', 
  'Crucial', 'Aorus', 'SteelSeries', 'HyperX', 'BenQ', 'ViewSonic', 'Acer', 'HP', 
  'Dell', 'Lenovo', 'TP-Link', 'D-Link', 'Fantech', 'Rakk', 'Tecware'
];

const CATEGORY_FEATURES: Record<string, { label: string, key: string, options: string[] }[]> = {
  'CPU': [
    { label: 'Socket Type', key: 'socket', options: ['AM4', 'AM5', 'LGA1700', 'LGA1200'] },
    { label: 'Cores', key: 'cores', options: ['4', '6', '8', '12', '16', '24', '32'] }
  ],
  'GPU': [
    { label: 'VRAM', key: 'vram', options: ['8GB', '10GB', '12GB', '16GB', '20GB', '24GB'] },
    { label: 'Fan Count', key: 'fans', options: ['1', '2', '3'] }
  ],
  'Motherboard': [
    { label: 'Socket Type', key: 'socket', options: ['AM4', 'AM5', 'LGA1700', 'LGA1200'] },
    { label: 'Form Factor', key: 'form_factor', options: ['ATX', 'Micro-ATX', 'Mini-ITX'] }
  ],
  'RAM': [
    { label: 'Type', key: 'type', options: ['DDR4', 'DDR5'] },
    { label: 'Capacity', key: 'capacity', options: ['8GB', '16GB', '32GB', '64GB'] }
  ]
};

const GENERAL_FEATURES = [
  { label: 'Color', key: 'color', options: ['Black', 'White', 'RGB', 'Silver'] },
  { label: 'Form Factor', key: 'form_factor', options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'SFX'] }
];

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  products,
  filters,
  onFilterChange,
  isOpen,
  onToggle,
  variant = 'public'
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    stock: true,
    price: true,
    general: true
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleToggleParentCategory = (parent: string) => {
    const newParents = filters.parentCategories.includes(parent)
      ? filters.parentCategories.filter(p => p !== parent)
      : [...filters.parentCategories, parent];
    onFilterChange({ ...filters, parentCategories: newParents });
  };

  const handleToggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleToggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleToggleStock = (status: string) => {
    const newStock = filters.stockStatus.includes(status)
      ? filters.stockStatus.filter(s => s !== status)
      : [...filters.stockStatus, status];
    onFilterChange({ ...filters, stockStatus: newStock });
  };

  const handleToggleSpec = (key: string, value: string) => {
    const currentValues = filters.specs[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      specs: {
        ...filters.specs,
        [key]: newValues
      }
    });
  };

  // Calculate counts for badges
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    
    products.forEach(p => {
      // Parent Category counts
      if (p.parent_category) {
        c[`parent_${p.parent_category}`] = (c[`parent_${p.parent_category}`] || 0) + 1;
      }
      // Category counts
      c[`cat_${p.category}`] = (c[`cat_${p.category}`] || 0) + 1;
      
      // Brand counts (assuming brand is in name or we extract it)
      const brand = BRANDS.find(b => p.name.toLowerCase().includes(b.toLowerCase()));
      if (brand) {
        c[`brand_${brand}`] = (c[`brand_${brand}`] || 0) + 1;
      }
      
      // Stock counts
      if (p.stock_quantity === 0) c['stock_out'] = (c['stock_out'] || 0) + 1;
      else if (p.stock_quantity <= 10) c['stock_low'] = (c['stock_low'] || 0) + 1;
      else c['stock_in'] = (c['stock_in'] || 0) + 1;
      
      // Spec counts
      if (p.specs) {
        Object.entries(p.specs).forEach(([key, val]) => {
          if (typeof val === 'string' || typeof val === 'number') {
            c[`spec_${key}_${val}`] = (c[`spec_${key}_${val}`] || 0) + 1;
          }
        });
      }
    });
    
    return c;
  }, [products]);

  const activeCategoryFeatures = useMemo(() => {
    const features: { label: string, key: string, options: string[] }[] = [];
    filters.categories.forEach(cat => {
      if (CATEGORY_FEATURES[cat]) {
        features.push(...CATEGORY_FEATURES[cat]);
      }
    });
    // Deduplicate features by key
    return Array.from(new Map(features.map(f => [f.key, f])).values());
  }, [filters.categories]);

  const FilterGroup = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <div className={cn(
      "border-b transition-colors",
      variant === 'admin' ? "border-slate-800" : "border-slate-100"
    )}>
      <button
        onClick={() => toggleGroup(id)}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-colors",
          variant === 'admin' ? "hover:bg-white/5" : "hover:bg-slate-50"
        )}
      >
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest",
          variant === 'admin' ? "text-slate-400" : "text-slate-500"
        )}>{title}</span>
        {expandedGroups[id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {expandedGroups[id] && (
        <div className="p-4 pt-0 flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );

  const Checkbox = ({ label, checked, onChange, count }: { label: string, checked: boolean, onChange: () => void, count?: number }) => (
    <button
      onClick={onChange}
      className="flex items-center justify-between group py-1"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-4 h-4 border transition-all flex items-center justify-center rounded-sm",
          checked 
            ? "bg-cyan border-cyan text-white" 
            : variant === 'admin' 
              ? "border-slate-700 group-hover:border-slate-500" 
              : "border-slate-200 group-hover:border-slate-400 bg-white"
        )}>
          {checked && <Check size={12} strokeWidth={4} />}
        </div>
        <span className={cn(
          "text-xs font-bold transition-colors",
          checked 
            ? variant === 'admin' ? "text-white" : "text-navy"
            : variant === 'admin' ? "text-slate-500 group-hover:text-slate-300" : "text-slate-600 group-hover:text-navy"
        )}>
          {label}
        </span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={cn(
          "text-[9px] font-black px-1.5 py-0.5 rounded-sm",
          variant === 'admin' 
            ? "text-slate-600 bg-slate-950 border border-slate-800" 
            : "text-slate-400 bg-slate-50 border border-slate-100"
        )}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className={cn(
      "flex flex-col transition-all duration-300 overflow-hidden shrink-0",
      variant === 'admin' ? "bg-slate-900 border-r border-slate-800" : "bg-white border border-slate-200 rounded-2xl shadow-sm",
      isOpen ? variant === 'admin' ? "w-64" : "w-full lg:w-72" : "w-0 border-0"
    )}>
      <div className={cn(
        "p-4 border-b flex items-center justify-between",
        variant === 'admin' ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-slate-50/50"
      )}>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-cyan" />
          <span className={cn(
            "text-xs font-black uppercase tracking-widest",
            variant === 'admin' ? "text-white" : "text-navy"
          )}>Filters</span>
        </div>
        <button onClick={onToggle} className="text-slate-500 hover:text-navy transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <FilterGroup id="categories" title="Categories">
          {Object.entries(CATEGORY_HIERARCHY).map(([parent, subs]) => (
            <div key={parent} className="mb-4 last:mb-0">
              <Checkbox
                label={parent}
                checked={filters.parentCategories.includes(parent)}
                onChange={() => handleToggleParentCategory(parent)}
                count={counts[`parent_${parent}`]}
              />
              <div className={cn(
                "flex flex-col gap-1 pl-4 mt-1 border-l ml-2",
                variant === 'admin' ? "border-slate-800" : "border-slate-100"
              )}>
                {subs.map(cat => (
                  <Checkbox
                    key={cat}
                    label={cat}
                    checked={filters.categories.includes(cat)}
                    onChange={() => handleToggleCategory(cat)}
                    count={counts[`cat_${cat}`]}
                  />
                ))}
              </div>
            </div>
          ))}
        </FilterGroup>

        <FilterGroup id="brands" title="Brands">
          {BRANDS.map(brand => (
            <Checkbox
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => handleToggleBrand(brand)}
              count={counts[`brand_${brand}`]}
            />
          ))}
        </FilterGroup>

        <FilterGroup id="stock" title="Stock Status">
          <Checkbox
            label="In Stock"
            checked={filters.stockStatus.includes('in_stock')}
            onChange={() => handleToggleStock('in_stock')}
            count={counts['stock_in']}
          />
          <Checkbox
            label="Low Stock"
            checked={filters.stockStatus.includes('low_stock')}
            onChange={() => handleToggleStock('low_stock')}
            count={counts['stock_low']}
          />
          <Checkbox
            label="Out of Stock"
            checked={filters.stockStatus.includes('out_of_stock')}
            onChange={() => handleToggleStock('out_of_stock')}
            count={counts['stock_out']}
          />
        </FilterGroup>

        <FilterGroup id="price" title="Price Range">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className={cn(
                  "text-[8px] font-black uppercase tracking-widest mb-1",
                  variant === 'admin' ? "text-slate-600" : "text-slate-400"
                )}>Min (₱)</p>
                <input 
                  type="number" 
                  value={filters.priceRange[0]}
                  onChange={(e) => onFilterChange({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                  className={cn(
                    "w-full rounded-sm px-2 py-1.5 text-[10px] font-mono outline-none transition-colors",
                    variant === 'admin' 
                      ? "bg-slate-950 border border-slate-800 text-cyan focus:border-cyan/50" 
                      : "bg-white border border-slate-200 text-navy focus:border-cyan"
                  )}
                />
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-[8px] font-black uppercase tracking-widest mb-1",
                  variant === 'admin' ? "text-slate-600" : "text-slate-400"
                )}>Max (₱)</p>
                <input 
                  type="number" 
                  value={filters.priceRange[1]}
                  onChange={(e) => onFilterChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                  className={cn(
                    "w-full rounded-sm px-2 py-1.5 text-[10px] font-mono outline-none transition-colors",
                    variant === 'admin' 
                      ? "bg-slate-950 border border-slate-800 text-cyan focus:border-cyan/50" 
                      : "bg-white border border-slate-200 text-navy focus:border-cyan"
                  )}
                />
              </div>
            </div>
            <div className="flex gap-1">
              {[1000, 5000, 10000, 50000].map(val => (
                <button
                  key={val}
                  onClick={() => onFilterChange({ ...filters, priceRange: [0, val] })}
                  className={cn(
                    "flex-1 py-1 text-[8px] font-black border transition-all uppercase tracking-tighter rounded-sm",
                    variant === 'admin'
                      ? "text-slate-500 border-slate-800 hover:border-cyan/30 hover:text-cyan"
                      : "text-slate-400 border-slate-100 hover:border-cyan/30 hover:text-cyan bg-slate-50"
                  )}
                >
                  &lt;{val/1000}k
                </button>
              ))}
            </div>
          </div>
        </FilterGroup>

        {/* Dynamic Category Features */}
        {activeCategoryFeatures.map(feature => (
          <FilterGroup key={feature.key} id={`feature_${feature.key}`} title={feature.label}>
            {feature.options.map(opt => (
              <Checkbox
                key={opt}
                label={opt}
                checked={(filters.specs[feature.key] || []).includes(opt)}
                onChange={() => handleToggleSpec(feature.key, opt)}
                count={counts[`spec_${feature.key}_${opt}`]}
              />
            ))}
          </FilterGroup>
        ))}

        {/* General Hardware Features */}
        <FilterGroup id="general" title="General Specs">
          {GENERAL_FEATURES.map(feature => (
            <div key={feature.key} className="mb-4 last:mb-0">
              <p className={cn(
                "text-[9px] font-bold uppercase tracking-widest mb-2",
                variant === 'admin' ? "text-slate-600" : "text-slate-400"
              )}>{feature.label}</p>
              <div className="flex flex-col gap-1">
                {feature.options.map(opt => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    checked={(filters.specs[feature.key] || []).includes(opt)}
                    onChange={() => handleToggleSpec(feature.key, opt)}
                    count={counts[`spec_${feature.key}_${opt}`]}
                  />
                ))}
              </div>
            </div>
          ))}
        </FilterGroup>
      </div>

      <div className={cn(
        "p-4 border-t",
        variant === 'admin' ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50/50"
      )}>
        <button
          onClick={() => onFilterChange({
            parentCategories: [],
            categories: [],
            brands: [],
            priceRange: [0, 1000000],
            stockStatus: [],
            specs: {}
          })}
          className={cn(
            "w-full py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
            variant === 'admin' ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-navy"
          )}
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};
