import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Package, Clock, CheckCircle2, AlertCircle, Loader2, Truck, MapPin, ExternalLink, Box, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { OrderStatus } from '../types';

const STATUS_STEPS: { label: string; icon: React.ReactNode; status: OrderStatus }[] = [
  { label: 'Pending', icon: <Clock size={20} />, status: 'pending' },
  { label: 'Packing', icon: <Box size={20} />, status: 'packing' },
  { label: 'Courier Pickup', icon: <Package size={20} />, status: 'courier_pickup' },
  { label: 'In Transit', icon: <Truck size={20} />, status: 'in_transit' },
  { label: 'Out for Delivery', icon: <MapPin size={20} />, status: 'out_for_delivery' },
  { label: 'Delivered', icon: <CheckCircle2 size={20} />, status: 'delivered' }
];

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e?: React.FormEvent, idToTrack?: string) => {
    e?.preventDefault();
    const targetId = idToTrack || orderId.trim();
    if (!targetId) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', targetId)
        .single();

      if (fetchError) throw new Error('Order not found. Please check your Order ID.');
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      handleTrack(undefined, idFromUrl);
    }
  }, [searchParams]);

  const getStatusStep = (status: OrderStatus) => {
    const index = STATUS_STEPS.findIndex(s => s.status === status);
    if (status === 'cancelled' || status === 'refunded') return -1;
    return index !== -1 ? index + 1 : 1;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-navy uppercase tracking-tighter mb-4">
          TRACK YOUR <span className="text-cyan">ORDER</span>
        </h1>
        <p className="text-slate-500 font-medium">Enter your Order ID to see the current status of your build or purchase.</p>
      </div>

      <form onSubmit={handleTrack} className="mb-12">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g., 8-digit code)..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan font-bold text-navy"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-navy text-white font-black rounded-xl hover:bg-navy/90 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'TRACK'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-600 font-bold max-w-xl mx-auto">
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      {order && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Order Header */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order Summary</div>
                <h3 className="text-xl font-black text-navy uppercase tracking-tight">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</div>
                <div className="text-2xl font-black text-cyan">₱{order.total_amount.toLocaleString()}</div>
              </div>
            </div>

            {/* Tracking Info */}
            <div className="px-8 py-6 bg-cyan/5 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan/10 rounded-2xl flex items-center justify-center text-cyan shrink-0">
                  <Truck size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Logistics Status</span>
                  <Link 
                    to={`/track/${order.id}`}
                    className="text-lg font-black text-navy hover:text-cyan transition-colors flex items-center gap-2 group"
                  >
                    View Detailed Progress <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              {order.tracking_number && (
                <a 
                  href={`https://www.jtexpress.ph/track-and-trace?waybillNo=${order.tracking_number}&flag=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-cyan text-navy font-black rounded-xl text-xs text-center hover:bg-cyan/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-cyan/20"
                >
                  Track on J&T Express <ExternalLink size={14} />
                </a>
              )}
            </div>

            <div className="p-8 bg-slate-50/30">
              {order.status === 'cancelled' || order.status === 'refunded' ? (
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-600 font-bold max-w-xl mx-auto">
                  <AlertCircle size={24} />
                  Order {order.status.toUpperCase()}
                  {order.cancellation_reason && <span className="text-xs font-medium block mt-1 opacity-80">Reason: {order.cancellation_reason}</span>}
                </div>
              ) : (
                <div className="relative flex justify-between max-w-4xl mx-auto mb-12 px-4">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-10" />
                  <div 
                    className="absolute top-5 left-8 h-1 bg-cyan transition-all duration-1000 -z-10" 
                    style={{ 
                      width: `${Math.max(0, ((getStatusStep(order.status) - 1) / (STATUS_STEPS.length - 1)) * 100)}%`,
                      maxWidth: 'calc(100% - 64px)'
                    }}
                  />

                  {STATUS_STEPS.map((step, idx) => {
                    const stepNum = idx + 1;
                    const currentStep = getStatusStep(order.status);
                    const isActive = stepNum <= currentStep;
                    
                    return (
                      <div key={step.label} className="flex flex-col items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                          isActive ? "bg-cyan text-navy scale-110 shadow-lg shadow-cyan/20" : "bg-white text-slate-500 border-2 border-slate-200"
                        )}>
                          {step.icon}
                        </div>
                        <span className={cn(
                          "text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-center max-w-[60px] sm:max-w-none",
                          isActive ? "text-navy" : "text-slate-600"
                        )}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-xs font-black text-navy uppercase tracking-widest mb-4">Order Items</h4>
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden">
                        <img src={item.products?.image_url} alt={item.products?.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-navy text-sm">{item.products?.name}</div>
                        <div className="text-xs text-slate-400 font-bold">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold text-navy">₱{(item.price_at_purchase * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
