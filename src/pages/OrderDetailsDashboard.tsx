import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  CreditCard, 
  User, 
  Calendar, 
  ExternalLink,
  MapPin,
  FileText,
  AlertCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order, OrderItem, Product, Profile, ActivityLog } from '../types';
import { cn } from '../lib/utils';
import { getOptimizedImageUrl } from '../lib/storage';
import { toast } from 'react-hot-toast';

export const OrderDetailsDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<(Order & { profiles: Profile | null, fulfiller?: Profile | null }) | null>(null);
  const [items, setItems] = useState<(OrderItem & { products: Product | null })[]>([]);
  const [timeline, setTimeline] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      // Fetch order with profile
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, profiles:profiles!orders_user_id_fkey(*), fulfiller:profiles!orders_fulfilled_by_fkey(*)')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch order items with products
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, products(*)')
        .eq('order_id', id);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

      // Fetch status timeline from activity logs
      const { data: logsData, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('details', `Updated order ${id} status`) // This is a bit fragile, but works if we follow the pattern
        .or(`action.eq.ORDER_STATUS_UPDATE,action.eq.ORDER_CREATED`)
        .order('created_at', { ascending: false });

      // If the specific detail check above is too strict, we can try a broader search
      // or just rely on the fact that we log status updates.
      // Let's also search for logs that mention the order ID in details
      const { data: allLogs, error: allLogsError } = await supabase
        .from('activity_logs')
        .select('*')
        .ilike('details', `%${id}%`)
        .order('created_at', { ascending: false });

      if (!allLogsError) {
        setTimeline(allLogs || []);
      }

    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-cyan" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <AlertCircle className="text-red-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-navy mb-2">Order Not Found</h1>
        <p className="text-slate-500 mb-6 text-center">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/admin" className="px-6 py-3 bg-navy text-white font-bold rounded-xl hover:bg-navy/90 transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled': return <XCircle className="text-red-500" size={20} />;
      case 'packing': return <Package className="text-blue-500" size={20} />;
      case 'in_transit': return <Truck className="text-cyan" size={20} />;
      default: return <Clock className="text-slate-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return "bg-green-100 text-green-600";
      case 'packing': return "bg-blue-100 text-blue-600";
      case 'courier_pickup': return "bg-purple-100 text-purple-600";
      case 'in_transit': return "bg-cyan/10 text-cyan";
      case 'out_for_delivery': return "bg-orange-100 text-orange-600";
      case 'cancelled': return "bg-red-100 text-red-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin" 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-black text-navy uppercase tracking-tight">
                  Order <span className="text-cyan">#{order.id.slice(0, 8)}</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                    getStatusColor(order.status)
                  )}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                to={`/track/${order.id}`}
                className="px-4 py-2 bg-navy text-white font-bold rounded-lg text-xs flex items-center gap-2 hover:bg-navy/90 transition-all"
              >
                <Truck size={14} /> INTERNAL TRACKING
              </Link>
              {order.tracking_number && (
                <a 
                  href={`https://www.jtexpress.ph/track-and-trace?waybillNo=${order.tracking_number}&flag=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-cyan/10 text-cyan font-bold rounded-lg text-xs flex items-center gap-2 hover:bg-cyan/20 transition-all"
                >
                  <Truck size={14} /> J&T TRACKING
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Order Details & Items */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Items Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-black text-navy uppercase tracking-widest text-sm flex items-center gap-2">
                  <Package size={18} className="text-cyan" />
                  Order Items
                </h2>
                <span className="text-xs font-bold text-slate-400">{items.length} Items</span>
              </div>
              <div className="divide-y divide-slate-50">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                      {item.products?.image_url ? (
                        <img 
                          src={getOptimizedImageUrl(item.products.image_url, { width: 100, height: 100 })} 
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Package size={24} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-navy text-sm">{item.products?.name || 'Unknown Product'}</h3>
                      <p className="text-xs text-slate-500 mt-1">{item.products?.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-navy text-sm">₱{item.price_at_purchase.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 mt-1">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 p-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-black text-navy tracking-tighter">₱{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment & Shipping Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-black text-navy uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                  <CreditCard size={18} className="text-cyan" />
                  Payment Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Method</span>
                    <span className="text-sm font-bold text-navy uppercase">{order.payment_method || 'COD'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                      order.payment_status === 'paid' ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                    )}>
                      {order.payment_status || 'unpaid'}
                    </span>
                  </div>
                  
                  {order.payment_proof_url && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Payment Proof</span>
                      <a 
                        href={order.payment_proof_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group"
                      >
                        <img 
                          src={order.payment_proof_url} 
                          alt="Payment Proof" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink className="text-white" size={24} />
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-black text-navy uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                  <Truck size={18} className="text-cyan" />
                  Shipping Info
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Courier</span>
                    <span className="text-sm font-bold text-navy uppercase">J&T Express</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tracking #</span>
                    <span className="text-sm font-mono font-bold text-cyan">{order.tracking_number || 'Not Assigned'}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-slate-400 shrink-0" size={16} />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Delivery Address</span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {/* We don't have a specific address field in orders yet, 
                              usually it would be in a separate shipping_addresses table or part of order_metadata */}
                          Refer to customer profile for primary address.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Timeline */}
          <div className="space-y-8">
            
            {/* Customer Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-black text-navy uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                <User size={18} className="text-cyan" />
                Customer Info
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan/10 rounded-full flex items-center justify-center text-cyan font-black text-lg">
                  {order.profiles?.username?.charAt(0).toUpperCase() || 'G'}
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm">{order.profiles?.username || 'Guest User'}</h3>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{order.profiles?.role || 'buyer'}</p>
                </div>
              </div>
              <Link 
                to={`/dashboard/customers/${order.user_id}`}
                className="w-full py-3 bg-slate-50 border border-slate-200 text-navy font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
              >
                VIEW FULL PROFILE
                <ExternalLink size={14} />
              </Link>
            </div>

            {/* Fulfiller Card */}
            {order.fulfiller && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-black text-navy uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                  <ShieldCheck size={18} className="text-cyan" />
                  Processed By
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                    {order.fulfiller.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-sm">{order.fulfiller.username}</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{order.fulfiller.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-black text-navy uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                <Clock size={18} className="text-cyan" />
                Status Timeline
              </h2>
              <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {timeline.length > 0 ? timeline.map((log, index) => (
                  <div key={log.id} className="relative pl-8">
                    <div className={cn(
                      "absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
                      index === 0 ? "bg-cyan" : "bg-slate-200"
                    )} />
                    <div>
                      <h4 className="text-xs font-bold text-navy uppercase tracking-tight">{log.action.replace('_', ' ')}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{log.details}</p>
                      <span className="text-[9px] text-slate-400 font-bold uppercase mt-1 block">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-400 italic">No timeline data available</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
