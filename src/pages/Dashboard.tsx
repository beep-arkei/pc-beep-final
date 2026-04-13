import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { User as UserIcon, Package, Settings, LogOut, ChevronRight, Clock, ShieldCheck, Loader2, FileText, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ReceiptView } from '../components/ReceiptView';
import { RefundRequestModal } from '../components/RefundRequestModal';
import { toast } from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { user, setUser } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    try {
      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profile) setUser(profile);

      // Fetch Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      setOrders(ordersData || []);

      // Fetch Saved Builds
      const { data: buildsData } = await supabase
        .from('saved_builds')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      setSavedBuilds(buildsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate, setUser]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', cancellation_reason: 'Cancelled by user' })
        .eq('id', orderId);
        
      if (error) throw error;
      fetchUserData();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order.');
    }
  };

  const handleRequestRefund = (orderId: string) => {
    setRefundOrderId(orderId);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/auth');
  };

  const handleDeleteBuild = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this build?')) return;
    try {
      const { error } = await supabase.from('saved_builds').delete().eq('id', id);
      if (error) throw error;
      setSavedBuilds(prev => prev.filter(b => b.id !== id));
      toast.success('Build deleted');
    } catch (error) {
      console.error('Error deleting build:', error);
      toast.error('Failed to delete build');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <UserIcon size={18} /> },
    { id: 'addresses', name: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'orders', name: 'My Orders', icon: <Package size={18} /> },
    { id: 'builds', name: 'Saved Builds', icon: <Settings size={18} /> },
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const isOwner = user?.role === 'owner';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
        <Loader2 className="animate-spin text-cyan" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-80px)] -mt-12 -ml-4 lg:-ml-0">
          <div className="p-8 bg-navy text-white mb-4 rounded-none">
            <div className="w-12 h-12 bg-cyan rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <UserIcon size={24} />
            </div>
            <div className="font-bold truncate">{user?.username || 'User'}</div>
            <div className="text-[10px] font-bold text-cyan uppercase tracking-widest">{user?.role || 'Buyer'} Account</div>
          </div>

          <div className="space-y-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'profile') {
                    navigate('/dashboard/profile');
                  } else if (tab.id === 'addresses') {
                    navigate('/dashboard/addresses');
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={cn(
                  "sidebar-link rounded-none",
                  activeTab === tab.id && "sidebar-link-active"
                )}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  {tab.name}
                </div>
                <ChevronRight size={16} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
              </button>
            ))}

            <div className="my-4 border-t border-slate-100" />

            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="sidebar-link rounded-none text-cyan"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />
                  Admin Dashboard
                </div>
              </button>
            )}

            {isOwner && (
              <button 
                onClick={() => navigate('/owner')}
                className="sidebar-link rounded-none text-purple-500"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />
                  Owner Dashboard
                </div>
              </button>
            )}

            <button 
              onClick={handleLogout}
              className="sidebar-link rounded-none text-red-500 mt-auto"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                Logout
              </div>
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {activeTab === 'orders' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">Order <span className="text-cyan">History</span></h2>
              <div className="space-y-4">
                {orders.length > 0 ? orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <Package size={32} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                        <div className="font-bold text-navy mt-1">{order.order_type === 'build' ? 'Custom PC Build' : 'Product Purchase'}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1",
                            order.status === 'completed' ? "bg-green-50 text-green-500" : 
                            order.status === 'cancelled' ? "bg-red-50 text-red-500" :
                            order.status === 'refund_requested' ? "bg-purple-50 text-purple-500" :
                            "bg-orange-50 text-orange-500"
                          )}>
                            {order.status.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {order.cancellation_reason && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg text-[10px] font-bold text-red-600 border border-red-100">
                            REASON: {order.cancellation_reason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <div className="text-xl font-black text-navy">₱{order.total_amount.toLocaleString()}</div>
                      <div className="flex flex-col gap-2 mt-4">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-[10px] font-black text-red-500 hover:underline uppercase tracking-widest"
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <button 
                            onClick={() => handleRequestRefund(order.id)}
                            className="text-[10px] font-black text-purple-500 hover:underline uppercase tracking-widest"
                          >
                            Request Refund
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/track/${order.id}`)}
                          className="text-[10px] font-black text-cyan hover:underline uppercase tracking-widest"
                        >
                          Track Order
                        </button>
                        <button 
                          onClick={() => setSelectedOrderId(order.id)}
                          className="text-[10px] font-black text-slate-500 hover:text-navy hover:underline uppercase tracking-widest flex items-center justify-end gap-1"
                        >
                          <FileText size={10} />
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No orders found
                  </div>
                )}
              </div>
              {selectedOrderId && (
                <ReceiptView orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
              )}
              {refundOrderId && (
                <RefundRequestModal 
                  orderId={refundOrderId} 
                  onClose={() => setRefundOrderId(null)} 
                  onSuccess={fetchUserData} 
                />
              )}
            </div>
          )}

          {activeTab === 'builds' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">Saved <span className="text-cyan">Builds</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => navigate('/builder')}
                  className="bg-white p-8 rounded-sm border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-cyan transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-sm flex items-center justify-center text-slate-500 group-hover:bg-cyan/10 group-hover:text-cyan transition-colors mb-4">
                    <Settings size={24} />
                  </div>
                  <div className="font-bold text-slate-600 group-hover:text-navy transition-colors uppercase tracking-widest text-[10px]">Start New Build</div>
                </div>

                {savedBuilds.map((build) => (
                  <div key={build.id} className="bg-white border border-slate-800 rounded-sm p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-navy uppercase tracking-tight text-lg">{build.build_name}</h3>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saved on {new Date(build.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-xl font-black text-cyan">₱{build.total_price.toLocaleString()}</div>
                    </div>

                    <div className="flex-grow space-y-2 mb-6">
                      {Object.entries(build.components_json).map(([key, val]: [string, any]) => {
                        if (!val) return null;
                        const items = Array.isArray(val) ? val.filter(Boolean) : [val];
                        if (items.length === 0) return null;
                        
                        return (
                          <div key={key} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            <span className="text-cyan">/</span>
                            <span className="truncate">{items[0].name} {items.length > 1 ? `(+${items.length - 1} more)` : ''}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => {
                          const { loadBuild } = useStore.getState();
                          loadBuild(build.components_json);
                          navigate('/builder');
                        }}
                        className="py-2 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-cyan hover:text-navy transition-all"
                      >
                        Edit Build
                      </button>
                      <button 
                        onClick={() => handleDeleteBuild(build.id)}
                        className="py-2 border border-red-200 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-red-50 transition-all"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => {
                          const { addToCart } = useStore.getState();
                          Object.values(build.components_json).forEach((val: any) => {
                            if (Array.isArray(val)) {
                              val.forEach(item => { if (item) addToCart(item); });
                            } else if (val) {
                              addToCart(val);
                            }
                          });
                          toast.success('Build added to cart!');
                          navigate('/cart');
                        }}
                        className="col-span-2 py-3 bg-cyan text-navy text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white transition-all border border-cyan"
                      >
                        Add All to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
