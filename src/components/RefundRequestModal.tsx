import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadRefundEvidence } from '../lib/storage';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface RefundRequestModalProps {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({ orderId, onClose, onSuccess }) => {
  const [reason, setReason] = useState<'wrong_item' | 'damaged' | 'not_as_described' | 'other'>('wrong_item');
  const [explanation, setExplanation] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      toast.error('Please provide an explanation');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Upload evidence
      const evidenceUrls: string[] = [];
      for (const file of files) {
        const url = await uploadRefundEvidence(file);
        evidenceUrls.push(url);
      }

      // 2. Submit refund request via API (to bypass RLS issues)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Session expired');

      const response = await fetch('/api/refunds/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          orderId,
          reason,
          explanation,
          evidenceUrls
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit refund request');

      toast.success('Refund request submitted successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error submitting refund:', error);
      toast.error(error.message || 'Failed to submit refund request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-sm border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-navy text-white">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter">Request <span className="text-cyan">Refund</span></h3>
            <p className="text-[10px] font-bold text-cyan uppercase tracking-widest">Order #{orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-sm transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reason for Refund</label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none"
            >
              <option value="wrong_item">Wrong Item Received</option>
              <option value="damaged">Item Damaged / Defective</option>
              <option value="not_as_described">Not as Described</option>
              <option value="other">Other Reason</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Detailed Explanation</label>
            <textarea 
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Please describe the issue in detail..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Evidence Photos (Max 5)</label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {previews.map((url, i) => (
                <div key={i} className="aspect-square relative rounded-sm overflow-hidden border border-slate-200 group">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {files.length < 5 && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-400 hover:border-cyan hover:text-cyan transition-all"
                >
                  <Upload size={20} />
                  <span className="text-[8px] font-black mt-1">UPLOAD</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*"
              multiple
            />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Upload clear photos of the item and its packaging.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-slate-200 text-slate-500 font-black rounded-sm text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-navy text-white font-black rounded-sm text-xs uppercase tracking-widest hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
