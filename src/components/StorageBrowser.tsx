import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Image as ImageIcon, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface StorageBrowserProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export const StorageBrowser: React.FC<StorageBrowserProps> = ({ onSelect, onClose }) => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try listing 'products' folder first
      const { data: productsData, error: productsError } = await supabase.storage
        .from('product-images')
        .list('products', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      // Also try listing the root in case they are there
      const { data: rootData, error: rootError } = await supabase.storage
        .from('product-images')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (productsError && rootError) throw productsError;

      const allFiles: { name: string; url: string }[] = [];

      // Process products folder
      if (productsData) {
        productsData
          .filter(f => f.name !== '.emptyFolderPlaceholder' && f.id !== null) // filter out folders
          .forEach(f => {
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(`products/${f.name}`);
            allFiles.push({ name: f.name, url: publicUrl });
          });
      }

      // Process root folder
      if (rootData) {
        rootData
          .filter(f => f.name !== '.emptyFolderPlaceholder' && f.name !== 'products' && f.id !== null)
          .forEach(f => {
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(f.name);
            allFiles.push({ name: f.name, url: publicUrl });
          });
      }

      setFiles(allFiles);
    } catch (err: any) {
      console.error('Error fetching storage files:', err);
      setError(err.message || 'Failed to load storage files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <ImageIcon size={24} className="text-cyan" />
              Storage <span className="text-cyan">Browser</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Select an existing image from your product-images folder
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchFiles}
              disabled={loading}
              className="p-2 hover:bg-white/5 rounded-sm transition-colors disabled:opacity-50 text-slate-400"
              title="Refresh Files"
            >
              <Loader2 size={20} className={cn(loading && "animate-spin")} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-sm transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-950/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="animate-spin text-cyan mb-4" size={48} />
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Scanning storage...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-sm text-center">
              <p className="text-red-500 font-bold mb-6 text-sm">{error}</p>
              <button 
                onClick={fetchFiles}
                className="px-8 py-3 bg-red-500 text-white font-black rounded-sm hover:bg-red-600 transition-all text-[10px] uppercase tracking-widest"
              >
                Retry
              </button>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-24">
              <ImageIcon size={64} className="text-slate-800 mx-auto mb-6 opacity-20" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No images found in storage.</p>
              <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-widest">Upload images via the product editor first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {files.map((file, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(file.url)}
                  className="group relative aspect-square bg-slate-900 rounded-sm overflow-hidden border border-slate-800 hover:border-cyan transition-all"
                >
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-cyan/0 group-hover:bg-cyan/10 transition-all flex items-center justify-center">
                    <div className="w-10 h-10 bg-cyan text-navy rounded-sm flex items-center justify-center scale-0 group-hover:scale-100 transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                      <Check size={20} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-slate-900/90 backdrop-blur-sm border-t border-slate-800">
                    <p className="text-[8px] text-slate-400 font-mono truncate">{file.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 border border-slate-800 text-slate-400 font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
