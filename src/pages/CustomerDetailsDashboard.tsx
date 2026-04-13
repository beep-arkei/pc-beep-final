import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  ShoppingBag, 
  CreditCard, 
  Calendar, 
  ExternalLink,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  AlertCircle,
  Mail,
  Shield
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order, Profile } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export const CustomerDetailsDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch order history
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

    } catch (error: any) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to load customer details');
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

  const totalSpend = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

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
                  Customer <span className="text-cyan">Profile</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} />
                    {profile ? `Joined ${new Date(profile.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}` : 'Profile Missing'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Stats */}
          <div className="space-y-8">
            
            {/* Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-24 h-24 bg-cyan/10 rounded-full flex items-center justify-center text-cyan font-black text-3xl mx-auto mb-6">
                {profile?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <h2 className="text-2xl font-black text-navy uppercase tracking-tighter mb-1">{profile?.username || 'Unknown User'}</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                  profile?.role === 'owner' ? "bg-purple-100 text-purple-600" :
                  profile?.role === 'admin' ? "bg-cyan/10 text-cyan" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {profile?.role || 'buyer'}
                </span>
              </div>
              
              {profile?.bio && (
                <p className="text-sm text-slate-500 leading-relaxed italic mb-8">
                  "{profile.bio}"
                </p>
              )}

              {!profile && (
                <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-left">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-2">
                    <AlertCircle size={14} />
                    Profile Sync Issue
                  </div>
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    This user exists in Auth but their profile record is missing. They can fix this by logging in, or you can run the seed script.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</div>
                  <div className="text-xl font-black text-navy">{orders.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Delivered</div>
                  <div className="text-xl font-black text-green-500">{deliveredOrders}</div>
                </div>
              </div>
            </div>

            {/* Financial Stats Card */}
            <div className="bg-navy rounded-3xl p-8 text-white shadow-xl shadow-navy/20">
              <h3 className="text-[10px] font-bold text-cyan uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={14} />
                Financial Summary
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Spend (PHP)</div>
                  <div className="text-3xl font-black tracking-tighter">₱{totalSpend.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Average Order Value</div>
                  <div className="text-xl font-bold tracking-tight">
                    ₱{orders.length > 0 ? (totalSpend / orders.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-black text-navy uppercase tracking-widest text-sm flex items-center gap-2">
                  <ShoppingBag size={18} className="text-cyan" />
                  Order History
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                      <th className="py-4 px-8">Order ID</th>
                      <th className="py-4 px-8">Date</th>
                      <th className="py-4 px-8">Amount</th>
                      <th className="py-4 px-8">Status</th>
                      <th className="py-4 px-8 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.length > 0 ? orders.map((order) => (
                      <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-8 font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}</td>
                        <td className="py-4 px-8 text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-8 font-bold text-navy text-sm">₱{order.total_amount.toLocaleString()}</td>
                        <td className="py-4 px-8">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                            getStatusColor(order.status)
                          )}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-8 text-right">
                          <Link 
                            to={`/dashboard/orders/${order.id}`}
                            className="p-2 text-slate-400 hover:text-cyan transition-colors inline-block"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 italic text-sm">
                          No orders found for this customer.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
