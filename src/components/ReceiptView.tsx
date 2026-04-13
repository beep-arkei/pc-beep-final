import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderItem, Product } from '../types';
import { Printer, X, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReceiptViewProps {
  orderId: string;
  onClose: () => void;
}

interface OrderWithItems extends Order {
  order_items: (OrderItem & { products: Product })[];
  profiles: { username: string; email: string };
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            profiles!orders_user_id_fkey(username, id),
            order_items(
              *,
              products(*)
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;

        // Fetch email from auth if needed, but we can assume profile has it or just use username
        // For security, we might not have direct access to auth.users email here unless we are admin
        // But we can use the profile info.
        
        setOrder(data as any);
      } catch (err: any) {
        console.error('Error fetching receipt:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-12 flex flex-col items-center">
          <Loader2 className="animate-spin text-cyan mb-4" size={48} />
          <p className="font-black text-white uppercase tracking-widest text-[10px]">Generating Receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Error</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-sm transition-colors text-slate-500">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 bg-red-500/5 text-red-500 border border-red-500/10 rounded-sm flex items-center gap-3 mb-8">
            <AlertCircle size={20} />
            <p className="font-bold text-sm">{error || 'Order not found'}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-800 text-white font-black rounded-sm uppercase tracking-widest text-[10px] hover:bg-slate-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const subtotal = order.order_items.reduce((acc, item) => acc + item.price_at_purchase * item.quantity, 0);
  const shipping = order.shipping_fee || 0;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-2xl shadow-2xl relative overflow-hidden print:shadow-none print:rounded-none print:border-none print:bg-white">
        {/* Header Controls */}
        <div className="absolute top-6 right-6 flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="p-3 bg-slate-800 text-slate-400 hover:text-cyan hover:bg-slate-700 rounded-sm transition-all border border-slate-700"
            title="Print Receipt"
          >
            <Printer size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-sm transition-all border border-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 sm:p-12">
          {/* Brand Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="text-4xl font-black text-white tracking-tighter">PC</div>
              <div className="text-4xl font-black text-cyan tracking-tighter">BEEP</div>
            </div>
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Official Purchase Receipt</div>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-2 gap-12 mb-12 pb-12 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Order Number</div>
              <div className="font-mono font-bold text-white text-sm">#{order.id.slice(0, 8).toUpperCase()}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Date Issued</div>
              <div className="font-bold text-white text-sm">{new Date(order.created_at).toLocaleDateString('en-PH', { dateStyle: 'long' })}</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Customer</div>
              <div className="font-bold text-white text-sm uppercase tracking-tight">{order.profiles?.username}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Payment Status</div>
              <div className={cn(
                "inline-flex items-center gap-2 font-black uppercase text-[9px] tracking-widest px-2 py-1 rounded-sm border",
                order.payment_status === 'paid' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}>
                {order.payment_status === 'paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                {order.payment_status}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-800">
                  <th className="text-left pb-4">Description</th>
                  <th className="text-center pb-4">Qty</th>
                  <th className="text-right pb-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {order.order_items.map((item) => (
                  <tr key={item.id} className="print:text-black">
                    <td className="py-6">
                      <div className="font-bold text-white text-sm print:text-black">{item.products?.name}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">Unit Price: ₱{item.price_at_purchase.toLocaleString()}</div>
                    </td>
                    <td className="py-6 text-center font-mono text-sm text-slate-400 print:text-black">{item.quantity}</td>
                    <td className="py-6 text-right font-mono text-sm text-cyan print:text-black font-bold">₱{(item.price_at_purchase * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-sm p-8 space-y-4 print:bg-white print:border-black">
            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-white print:text-black">₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>Shipping Fee</span>
              <span className="text-white print:text-black">₱{shipping.toLocaleString()}</span>
            </div>
            <div className="pt-6 border-t border-slate-800 flex justify-between items-end print:border-black">
              <div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1 print:text-black">Total Amount</div>
                <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Inclusive of all taxes</div>
              </div>
              <div className="text-3xl font-black text-cyan print:text-black">₱{order.total_amount.toLocaleString()}</div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] leading-relaxed">
              Thank you for your purchase!<br />
              PC Beep &bull; Bingag, Dauis, Bohol, Philippines<br />
              pcbeepph@gmail.com
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan opacity-50 print:hidden" />
      </div>
    </div>
  );
};
