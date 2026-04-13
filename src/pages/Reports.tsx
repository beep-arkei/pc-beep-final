import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order, Product, ActivityLog, Profile } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  format, startOfDay, endOfDay, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, startOfYear, endOfYear, 
  isWithinInterval, parseISO, subDays 
} from 'date-fns';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, Calendar, 
  ChevronDown, Filter, Download, Loader2, Package, Activity, Search 
} from 'lucide-react';
import { cn } from '../lib/utils';

type DatePreset = 'today' | 'week' | 'month' | 'year' | 'custom';

export const Reports: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<(ActivityLog & { profiles: Profile | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [datePreset, setDatePreset] = useState<DatePreset>('month');
  const [customRange, setCustomRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activitySort, setActivitySort] = useState('newest');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: ordersData } = await supabase.from('orders').select('*');
      const { data: productsData } = await supabase.from('products').select('*');
      
      let query = supabase
        .from('activity_logs')
        .select('*, profiles(*)');
      
      switch (activitySort) {
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        case 'oldest': query = query.order('created_at', { ascending: true }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      const { data: activitiesData } = await query;

      setOrders(ordersData || []);
      setProducts(productsData || []);
      setActivities(activitiesData || []);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activitySort]);

  const getInterval = () => {
    const now = new Date();
    switch (datePreset) {
      case 'today': return { start: startOfDay(now), end: endOfDay(now) };
      case 'week': return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month': return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'year': return { start: startOfYear(now), end: endOfYear(now) };
      case 'custom': return { start: startOfDay(parseISO(customRange.start)), end: endOfDay(parseISO(customRange.end)) };
    }
  };

  const interval = getInterval();
  const filteredOrders = orders.filter(o => 
    isWithinInterval(parseISO(o.created_at), interval)
  );

  const filteredActivities = activities.filter(a => {
    const matchesInterval = isWithinInterval(parseISO(a.created_at), interval);
    const matchesSearch = 
      a.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesInterval && matchesSearch;
  });

  // Revenue Data for Line Chart
  const revenueByDate = filteredOrders.reduce((acc: any, order) => {
    const date = format(parseISO(order.created_at), 'MMM dd');
    acc[date] = (acc[date] || 0) + order.total_amount;
    return acc;
  }, {});

  const revenueChartData = Object.entries(revenueByDate).map(([date, amount]) => ({
    date,
    revenue: amount
  })).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  // Top Products Data
  // Since we don't have order_items here, we'd ideally fetch them. 
  // For now, let's assume we fetch them or just show order counts if items aren't available.
  // Actually, I'll fetch order_items for better reporting.

  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      const { data: items } = await supabase
        .from('order_items')
        .select('product_id, quantity, products(name)');
      
      if (!items) return;

      const productCounts = items.reduce((acc: any, item: any) => {
        const name = item.products?.name || 'Unknown';
        acc[name] = (acc[name] || 0) + item.quantity;
        return acc;
      }, {});

      const sortedProducts = Object.entries(productCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);

      setTopProducts(sortedProducts);
    };

    fetchTopProducts();
  }, [filteredOrders]);

  const COLORS = ['#00E5FF', '#002B49', '#3B82F6', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan" size={48} />
      </div>
    );
  }

  const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white uppercase tracking-tighter">
            BUSINESS <span className="text-cyan">INTELLIGENCE</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Real-time analytics and performance reporting.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-white dark:bg-navy p-1 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex">
            {(['today', 'week', 'month', 'year', 'custom'] as DatePreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => setDatePreset(preset)}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                  datePreset === preset ? "bg-navy dark:bg-cyan text-white" : "text-slate-400 hover:text-navy dark:hover:text-white"
                )}
              >
                {preset}
              </button>
            ))}
          </div>

          {datePreset === 'custom' && (
            <div className="flex gap-2">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                className="px-3 py-2 bg-white dark:bg-navy border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan text-navy dark:text-white"
              />
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                className="px-3 py-2 bg-white dark:bg-navy border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan text-navy dark:text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-navy p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
            <DollarSign size={20} />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</div>
          <div className="text-2xl font-black text-navy dark:text-white mt-1">₱{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-navy p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag size={20} />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Orders</div>
          <div className="text-2xl font-black text-navy dark:text-white mt-1">{totalOrders}</div>
        </div>
        <div className="bg-white dark:bg-navy p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 bg-cyan/10 text-cyan rounded-xl flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Order Value</div>
          <div className="text-2xl font-black text-navy dark:text-white mt-1">₱{avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-white dark:bg-navy p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
            <Activity size={20} />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee Actions</div>
          <div className="text-2xl font-black text-navy dark:text-white mt-1">{filteredActivities.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-navy p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest mb-8">Revenue Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  tickFormatter={(value) => `₱${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#002B49',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#00E5FF' }}
                  formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00E5FF" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#00E5FF', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-navy p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest mb-8">Top Products</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-[120px]">{p.name}</span>
                </div>
                <span className="text-[10px] font-black text-navy dark:text-white">{p.count} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Activity */}
      <div className="bg-white dark:bg-navy rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest">Employee Activity Log</h3>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-cyan text-navy dark:text-white"
              />
            </div>
            <select 
              value={activitySort}
              onChange={(e) => setActivitySort(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-navy dark:text-white outline-none focus:ring-2 focus:ring-cyan"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <button className="text-[10px] font-black text-cyan uppercase tracking-widest hover:underline flex items-center gap-2">
              <Download size={14} /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="py-4 px-8">Employee</th>
                <th className="py-4 px-8">Action</th>
                <th className="py-4 px-8">Details</th>
                <th className="py-4 px-8">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-navy dark:bg-cyan text-white rounded-full flex items-center justify-center text-[10px] font-black">
                          {log.profiles?.username?.[0].toUpperCase() || 'E'}
                        </div>
                        <div className="font-bold text-navy dark:text-white text-sm">{log.profiles?.username || 'Unknown'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <span className="text-[10px] font-black text-cyan uppercase tracking-widest bg-cyan/10 px-2 py-1 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-xs text-slate-500 dark:text-slate-400 font-medium">{log.details}</td>
                    <td className="py-4 px-8 text-xs text-slate-400 font-bold">
                      {format(parseISO(log.created_at), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest">
                    No activity recorded for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
