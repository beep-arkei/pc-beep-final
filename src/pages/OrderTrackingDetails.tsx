import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSimulatedTrackingStatus, TrackingStatus } from '../lib/logistics';
import { 
  Package, Truck, MapPin, CheckCircle2, Clock, 
  ChevronLeft, Loader2, AlertCircle, Box, ExternalLink 
} from 'lucide-react';
import { cn } from '../lib/utils';

export const OrderTrackingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [trackingHistory, setTrackingHistory] = useState<TrackingStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
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
          .eq('id', id)
          .single();

        if (fetchError) throw new Error('Order not found');
        setOrder(data);
        setTrackingHistory(getSimulatedTrackingStatus(data.created_at));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan mb-4" size={48} />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Fetching tracking data...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-navy uppercase tracking-tighter mb-4">Tracking <span className="text-red-500">Error</span></h1>
        <p className="text-slate-500 mb-8">{error || 'Could not find the requested order.'}</p>
        <Link to="/track-order" className="px-8 py-4 bg-navy text-white font-black rounded-2xl hover:bg-navy/90 transition-all">BACK TO TRACKING</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/track-order" className="inline-flex items-center gap-2 text-slate-400 hover:text-navy font-black text-xs uppercase tracking-widest mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Order Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</div>
            <h2 className="text-xl font-black text-navy mb-4">#{order.id.slice(0, 8).toUpperCase()}</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                <div className={cn(
                  "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  order.status === 'delivered' ? "bg-green-100 text-green-600" : "bg-cyan/10 text-cyan"
                )}>
                  {order.status.replace('_', ' ')}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On</div>
                <div className="text-sm font-bold text-navy">{new Date(order.created_at).toLocaleDateString()}</div>
              </div>
              {order.tracking_number && (
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">J&T Tracking</div>
                  <div className="text-sm font-black text-navy tracking-widest">{order.tracking_number}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-navy p-6 rounded-3xl text-white shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-tight mb-4">Order <span className="text-cyan">Items</span></h3>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden shrink-0">
                    <img src={item.products?.image_url} alt={item.products?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="text-xs font-bold truncate">{item.products?.name}</div>
                    <div className="text-[10px] text-white/50 font-black uppercase">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tracking Stepper */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-navy uppercase tracking-tighter">Delivery <span className="text-cyan">Progress</span></h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 bg-green-500 rounded-full" /> Simulated Data
              </div>
            </div>

            <div className="relative space-y-8">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />

              {trackingHistory.map((step, idx) => (
                <div key={idx} className="relative flex gap-6">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                    step.isCompleted ? "bg-cyan text-navy shadow-lg shadow-cyan/20" : "bg-white border-2 border-slate-100 text-slate-300"
                  )}>
                    {step.status === "Order Placed" && <Box size={20} />}
                    {step.status === "Preparing to Ship" && <Clock size={20} />}
                    {step.status === "Picked up by Courier" && <Package size={20} />}
                    {step.status === "In Transit" && <Truck size={20} />}
                  </div>

                  <div className="flex-grow pt-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn(
                        "text-sm font-black uppercase tracking-tight",
                        step.isCompleted ? "text-navy" : "text-slate-400"
                      )}>
                        {step.status}
                      </h4>
                      {step.timestamp && (
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                          {new Date(step.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-black text-cyan uppercase tracking-widest mb-2">
                      {step.location}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.tracking_number && (
              <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ExternalLink className="text-cyan" size={20} />
                  </div>
                  <p className="text-xs font-bold text-navy">View detailed tracking on J&T Express official site.</p>
                </div>
                <a 
                  href={`https://www.jtexpress.ph/track-and-trace?waybillNo=${order.tracking_number}&flag=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-navy text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-navy/90 transition-all"
                >
                  OPEN J&T TRACKER
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
