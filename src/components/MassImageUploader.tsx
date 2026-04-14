import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle, Loader2, Image as ImageIcon, Trash2, Save, ChevronDown, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import imageCompression from 'browser-image-compression';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface StagedFile {
  id: string;
  file: File;
  preview: string;
  matchedProductId: string | null;
  imageType: 'thumbnail' | 'gallery';
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  progress: number;
}

export const MassImageUploader: React.FC = () => {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [products, setProducts] = useState<Pick<Product, 'id' | 'name'>[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({ success: 0, fail: 0, total: 0 });
  const [activeSelectorId, setActiveSelectorId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('id, name');
      if (data) setProducts(data as Pick<Product, 'id' | 'name'>[]);
      if (error) console.error('Error fetching products for matching:', error);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeSelectorId && !(e.target as HTMLElement).closest('.relative')) {
        setActiveSelectorId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSelectorId]);

  const smartMatch = useCallback((fileName: string): { productId: string | null, type: 'thumbnail' | 'gallery' } => {
    const lowerName = fileName.toLowerCase();
    let type: 'thumbnail' | 'gallery' = 'thumbnail';
    
    if (lowerName.includes('gallery') || lowerName.includes('extra') || /_\d+/.test(lowerName)) {
      type = 'gallery';
    }

    // Try matching by ID (UUID)
    const uuidMatch = fileName.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    if (uuidMatch) {
      const matched = products.find(p => p.id === uuidMatch[0]);
      if (matched) return { productId: matched.id, type };
    }

    // Try matching by Name (fuzzy-ish)
    const cleanName = lowerName.replace(/(_thumb|_gallery|_\d+|\.jpg|\.png|\.webp|\.jpeg)/g, '').replace(/[-_]/g, ' ').trim();
    const matchedByName = products.find(p => 
      p.name.toLowerCase().includes(cleanName) || cleanName.includes(p.name.toLowerCase())
    );

    return { productId: matchedByName?.id || null, type };
  }, [products]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newStagedFiles: StagedFile[] = acceptedFiles.map(file => {
      const { productId, type } = smartMatch(file.name);
      return {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        matchedProductId: productId,
        imageType: type,
        status: 'pending',
        progress: 0
      };
    });
    setStagedFiles(prev => [...prev, ...newStagedFiles]);
  }, [smartMatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  const removeFile = (id: string) => {
    setStagedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const updateStagedFile = (id: string, updates: Partial<StagedFile>) => {
    setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const commitUploads = async () => {
    const filesToUpload = stagedFiles.filter(f => f.status === 'pending' && f.matchedProductId);
    if (filesToUpload.length === 0) {
      toast.error('No matched files to upload. Please assign products manually.');
      return;
    }

    setIsUploading(true);
    setStats({ success: 0, fail: 0, total: filesToUpload.length });

    for (const staged of filesToUpload) {
      updateStagedFile(staged.id, { status: 'uploading' });
      
      try {
        // 1. Compression
        const compressedFile = await imageCompression(staged.file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });

        // 2. Upload to Storage
        const fileExt = staged.file.name.split('.').pop();
        const fileName = `${staged.imageType}-${Date.now()}.${fileExt}`;
        const filePath = `products/${staged.matchedProductId}/${staged.imageType}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, compressedFile, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // 3. Update Database
        if (staged.imageType === 'thumbnail') {
          await supabase.from('products').update({ image_url: publicUrl }).eq('id', staged.matchedProductId);
        } else {
          const { data: product } = await supabase.from('products').select('gallery_urls').eq('id', staged.matchedProductId).single();
          const currentGallery = product?.gallery_urls || [];
          await supabase.from('products').update({ 
            gallery_urls: [...currentGallery, publicUrl] 
          }).eq('id', staged.matchedProductId);
        }

        updateStagedFile(staged.id, { status: 'success', progress: 100 });
        setStats(prev => ({ ...prev, success: prev.success + 1 }));
      } catch (error: any) {
        console.error('Upload failed:', error);
        updateStagedFile(staged.id, { status: 'error', error: error.message });
        setStats(prev => ({ ...prev, fail: prev.fail + 1 }));
      }
    }

    setIsUploading(false);
    toast.success('Batch processing complete!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Mass Image Uploader</h2>
          <p className="text-slate-500 text-sm">Drop images and we'll match them to your inventory.</p>
        </div>
        <div className="flex items-center gap-4">
          {stats.total > 0 && (
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <span className="text-emerald-500">Success: {stats.success}</span>
              <span className="text-rose-500">Fail: {stats.fail}</span>
              <span className="text-slate-400">Total: {stats.total}</span>
            </div>
          )}
          <button
            onClick={commitUploads}
            disabled={isUploading || stagedFiles.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-cyan text-navy font-black text-xs uppercase tracking-widest rounded-sm hover:bg-white transition-all disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            Commit to Cloud
          </button>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-sm p-12 flex flex-col items-center justify-center transition-all cursor-pointer",
          isDragActive ? "border-cyan bg-cyan/5" : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn("mb-4 transition-colors", isDragActive ? "text-cyan" : "text-slate-600")} size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
          {isDragActive ? "Drop files here" : "Drag & drop product images or click to browse"}
        </p>
        <p className="text-slate-600 text-xs mt-2 uppercase tracking-tighter font-medium">
          Supports JPG, PNG, WebP. Smart matching by filename.
        </p>
      </div>

      {stagedFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stagedFiles.map((staged) => (
            <div key={staged.id} className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden group relative">
              <div className="aspect-video relative overflow-hidden bg-black">
                <img src={staged.preview} className="w-full h-full object-contain" alt="Preview" />
                <button
                  onClick={() => removeFile(staged.id)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white hover:bg-rose-500 transition-colors rounded-sm opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
                
                {staged.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                    <Loader2 className="animate-spin text-cyan mb-2" size={24} />
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-cyan h-full transition-all duration-300" style={{ width: `${staged.progress}%` }} />
                    </div>
                  </div>
                )}

                {staged.status === 'success' && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                      <Check size={20} />
                    </div>
                  </div>
                )}

                {staged.status === 'error' && (
                  <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center p-4 text-center">
                    <div className="bg-rose-500 text-white p-2 rounded-full shadow-lg mb-2">
                      <X size={20} />
                    </div>
                    <p className="text-[10px] text-white font-bold uppercase">{staged.error}</p>
                  </div>
                )}
              </div>

              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-mono text-slate-500 truncate flex-1">{staged.file.name}</p>
                  <select
                    value={staged.imageType}
                    onChange={(e) => updateStagedFile(staged.id, { imageType: e.target.value as any })}
                    className="bg-slate-950 border border-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 py-1 outline-none focus:border-cyan"
                  >
                    <option value="thumbnail">Thumbnail</option>
                    <option value="gallery">Gallery</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Matched Product</p>
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setActiveSelectorId(activeSelectorId === staged.id ? null : staged.id);
                        setProductSearch('');
                      }}
                      className={cn(
                        "w-full bg-slate-950 border px-2 py-1.5 text-[10px] font-bold outline-none transition-colors text-left flex justify-between items-center group",
                        staged.matchedProductId ? "border-slate-800 text-white" : "border-rose-500/50 text-rose-400"
                      )}
                    >
                      <span className="truncate">
                        {products.find(p => p.id === staged.matchedProductId)?.name || "Manual Assignment Required"}
                      </span>
                      <ChevronDown size={10} className={cn("transition-transform", activeSelectorId === staged.id && "rotate-180")} />
                    </button>
                    
                    {activeSelectorId === staged.id && (
                      <div className="absolute z-50 bottom-full left-0 right-0 mb-1 bg-slate-900 border border-slate-800 shadow-2xl max-h-64 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-slate-800 bg-slate-950">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600" size={10} />
                            <input 
                              autoFocus
                              type="text"
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              placeholder="Search products..."
                              className="w-full bg-slate-900 border border-slate-800 pl-7 pr-2 py-1.5 text-[10px] outline-none focus:border-cyan text-white"
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scrollbar bg-slate-950">
                          <button
                            onClick={() => { updateStagedFile(staged.id, { matchedProductId: null }); setActiveSelectorId(null); setProductSearch(''); }}
                            className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 text-rose-500 border-b border-slate-900"
                          >
                            Clear Assignment
                          </button>
                          {products
                            .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                            .map(p => (
                              <button
                                key={p.id}
                                onClick={() => { updateStagedFile(staged.id, { matchedProductId: p.id }); setActiveSelectorId(null); setProductSearch(''); }}
                                className={cn(
                                  "w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-white/5 transition-colors",
                                  staged.matchedProductId === p.id ? "text-cyan bg-cyan/5" : "text-slate-400"
                                )}
                              >
                                {p.name}
                              </button>
                            ))
                          }
                          {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                            <div className="px-3 py-4 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                              No products found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!staged.matchedProductId && (
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertCircle size={10} />
                    <span className="text-[9px] font-black uppercase tracking-widest">No match found</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
