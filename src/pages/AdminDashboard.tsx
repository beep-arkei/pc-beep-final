import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, BarChart3, Plus, Search, Edit, Trash2, Loader2, CheckCircle, CheckCircle2, Clock, XCircle, RefreshCw, Truck, CreditCard, Ban, Box, MapPin, Upload, Image as ImageIcon, X, Eye, FileText, ShieldAlert, MessageSquare, Bot, User, Send, ChevronUp, ChevronDown, ShieldCheck, AlertTriangle, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { logActivity } from '../lib/activity';
import { useStore } from '../store/useStore';
import { Product, Order, Profile, Chat, ChatMessage, Refund, RefundStatus, Promotion } from '../types';
import { uploadToSupabase, getOptimizedImageUrl, DEFAULT_PLACEHOLDER, uploadPromotionBanner } from '../lib/storage';
import { ProductImage } from '../components/ProductImage';
import { StorageBrowser } from '../components/StorageBrowser';
import { ReceiptView } from '../components/ReceiptView';
import { Reports } from './Reports';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useRef } from 'react';

import { ProductFilterSidebar, FilterState } from '../components/ProductFilterSidebar';
import { MassImageUploader } from '../components/MassImageUploader';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // For count calculations
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    parentCategories: [],
    categories: [],
    brands: [],
    priceRange: [0, 1000000],
    stockStatus: [],
    specs: {}
  });
  const [orders, setOrders] = useState<(Order & { profiles: { username: string } | null })[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [employees, setEmployees] = useState<(Profile & { email?: string; totalSales?: number })[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [refunds, setRefunds] = useState<(Refund & { orders: Order | null, profiles: Profile | null })[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  const fetchEmployees = async () => {
    if (user?.role !== 'owner') return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/owner/employees', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch employees');
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('refunds')
        .select('*, orders:order_id(*), profiles:user_id(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRefunds(data || []);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast.error('Failed to fetch refunds');
    } finally {
      setLoading(false);
    }
  };
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const [adminMessage, setAdminMessage] = useState('');
  const adminMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    adminMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chats' && selectedChatId) {
      scrollToBottom();
    }
  }, [chatMessages, activeTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productSort, setProductSort] = useState('newest');
  const [orderSort, setOrderSort] = useState('newest');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortData = (data: any[]) => {
    if (!sortField || !sortOrder) return data;
    return [...data].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortField.includes('.')) {
        const parts = sortField.split('.');
        valA = a[parts[0]]?.[parts[1]];
        valB = b[parts[0]]?.[parts[1]];
      }

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [employeeSaving, setEmployeeSaving] = useState(false);

  const handleSaveEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmployeeSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const url = editingEmployee 
        ? `/api/owner/employees/${editingEmployee.id}` 
        : '/api/owner/employees';
      
      const method = editingEmployee ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save employee');
      }

      toast.success(editingEmployee ? 'Employee updated!' : 'Employee added!');
      setIsEmployeeModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast.error(error.message);
    } finally {
      setEmployeeSaving(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this employee? This action cannot be undone.')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`/api/owner/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete employee');
      }

      toast.success('Employee removed successfully');
      fetchEmployees();
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      toast.error(error.message);
    }
  };
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Partial<Promotion> | null>(null);
  const [promoImageUrl, setPromoImageUrl] = useState('');
  const [uploadingPromo, setUploadingPromo] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [productSpecs, setProductSpecs] = useState<{key: string, value: string}[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showStorageBrowser, setShowStorageBrowser] = useState<'main' | 'gallery' | null>(null);
  const [seeding, setSeeding] = useState(false);

  const [dbRole, setDbRole] = useState<string | null>(null);

  const handleSavePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const promoData = {
      image_url: promoImageUrl,
      redirect_link: formData.get('redirect_link') as string || null,
      display_order: Number(formData.get('display_order')),
      is_active: formData.get('is_active') === 'on'
    };

    try {
      if (editingPromotion?.id) {
        const { error } = await supabase
          .from('promotions')
          .update(promoData)
          .eq('id', editingPromotion.id);
        
        if (error) throw error;
        toast.success('Promotion updated!');
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert([promoData]);
        
        if (error) throw error;
        toast.success('Promotion added!');
      }
      
      setIsPromotionModalOpen(false);
      setEditingPromotion(null);
      setPromoImageUrl('');
      fetchPromotions();
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      toast.error(`Failed to save promotion: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Promotion deleted');
      fetchPromotions();
    } catch (error: any) {
      console.error('Error deleting promotion:', error);
      toast.error('Failed to delete promotion');
    }
  };

  const handlePromoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPromo(true);
    try {
      const url = await uploadPromotionBanner(file);
      setPromoImageUrl(url);
    } catch (error: any) {
      console.error('Error uploading promo image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingPromo(false);
    }
  };

  const handleRunSeed = async () => {
    setSeeding(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/api/dev/seed-accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to run seed script');
      
      toast.success('System repair completed successfully!');
      fetchCustomers();
    } catch (error: any) {
      console.error('Seed error:', error);
      toast.error(error.message);
    } finally {
      setSeeding(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Also verify user role in DB
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();
      
      if (profileData) {
        setDbRole(profileData.role);
      }

      // Fetch all products once for counts if not already fetched
      if (allProducts.length === 0) {
        const { data: allData } = await supabase.from('products').select('*');
        if (allData) setAllProducts(allData);
      }

      let query = supabase.from('products').select('*');
      
      // Apply Advanced Filters
      const filterClauses = [];
      if (filters.parentCategories.length > 0) {
        filterClauses.push(`parent_category.in.(${filters.parentCategories.map(p => `"${p}"`).join(',')})`);
      }
      if (filters.categories.length > 0) {
        filterClauses.push(`category.in.(${filters.categories.map(c => `"${c}"`).join(',')})`);
      }
      
      if (filterClauses.length > 0) {
        query = query.or(filterClauses.join(','));
      }

      if (filters.brands.length > 0) {
        const brandFilters = filters.brands.map(b => `name.ilike.%${b}%`).join(',');
        query = query.or(brandFilters);
      }

      if (filters.stockStatus.length > 0) {
        const stockClauses = [];
        if (filters.stockStatus.includes('in_stock')) stockClauses.push('stock_quantity.gt.10');
        if (filters.stockStatus.includes('low_stock')) stockClauses.push('and(stock_quantity.lte.10,stock_quantity.gt.0)');
        if (filters.stockStatus.includes('out_of_stock')) stockClauses.push('stock_quantity.eq.0');
        
        if (stockClauses.length > 0) {
          query = query.or(stockClauses.join(','));
        }
      }

      if (filters.priceRange[0] > 0) {
        query = query.gte('price', filters.priceRange[0]);
      }
      if (filters.priceRange[1] < 1000000) {
        query = query.lte('price', filters.priceRange[1]);
      }

      // JSONB Specs Filtering
      Object.entries(filters.specs).forEach(([key, values]) => {
        if (values.length > 0) {
          const specClauses = values.map(v => `specs->>${key}.eq.${v}`).join(',');
          query = query.or(specClauses);
        }
      });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (showLowStockOnly) {
        query = query.lte('stock_quantity', 10);
      }
      
      switch (productSort) {
        case 'price_asc': query = query.order('price', { ascending: true }); break;
        case 'price_desc': query = query.order('price', { ascending: false }); break;
        case 'name_asc': query = query.order('name', { ascending: true }); break;
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase.from('orders').select('*, profiles:profiles!orders_user_id_fkey(username)');
      
      switch (orderSort) {
        case 'amount_asc': query = query.order('total_amount', { ascending: true }); break;
        case 'amount_desc': query = query.order('total_amount', { ascending: false }); break;
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        case 'oldest': query = query.order('created_at', { ascending: true }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*, profiles:profiles!chats_user_id_fkey(username)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    setChatLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setChatMessages(data || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const claimTicket = async (chatId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('chats')
        .update({ 
          assigned_admin_id: user.id,
          is_ai_active: false 
        })
        .eq('id', chatId);
      
      if (error) throw error;
      toast.success('Ticket claimed successfully!');
      fetchChats();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleAi = async (chatId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ is_ai_active: active })
        .eq('id', chatId);
      
      if (error) throw error;
      toast.success(active ? 'Beep Bot is now active' : 'Beep Bot is now disabled');
      fetchChats();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resolveTicket = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to resolve this ticket? This will close the conversation.')) return;
    
    try {
      const { error } = await supabase
        .from('chats')
        .update({ status: 'closed' })
        .eq('id', chatId);
      
      if (error) throw error;
      
      // Send a final system message
      await supabase.from('chat_messages').insert({
        chat_id: chatId,
        role: 'admin',
        text: 'This support ticket has been marked as RESOLVED. If you need further assistance, please start a new ticket. Thank you!'
      });

      toast.success('Ticket resolved successfully');
      fetchChats();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const sendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessage.trim() || !selectedChatId || !user) return;

    const messageText = adminMessage.trim();
    setAdminMessage('');

    // Optimistic update
    const optimisticMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      chat_id: selectedChatId,
      sender_id: user.id,
      role: 'admin',
      text: messageText,
      created_at: new Date().toISOString(),
      status: 'sending'
    };

    setChatMessages(prev => [...prev, optimisticMessage]);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: selectedChatId,
          sender_id: user.id,
          role: 'admin',
          text: messageText
        });
      
      if (error) throw error;
      
      // Update optimistic message to 'sent'
      setChatMessages(prev => prev.map(m => 
        (m.text === messageText && m.status === 'sending') ? { ...m, status: 'sent' } : m
      ));
    } catch (error: any) {
      console.error('Admin chat error:', error);
      setChatMessages(prev => prev.map(m => 
        (m.text === messageText && m.status === 'sending') ? { ...m, status: 'error' } : m
      ));
      toast.error(error.message);
    }
  };

  const [bucketsStatus, setBucketsStatus] = useState<Record<string, boolean>>({});
  const [availableBuckets, setAvailableBuckets] = useState<string[]>([]);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const [rlsError, setRlsError] = useState<boolean>(false);

  const getProjectId = () => {
    const url = supabase.storage.from('test').getPublicUrl('test').data.publicUrl;
    return url.split('//')[1]?.split('.')[0] || 'iqbrcgkxdembjeckelda';
  };

  const checkBuckets = async () => {
    try {
      const requiredBuckets = ['product-images', 'chat-attachments', 'refund-evidence'];
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) throw listError;

      const status: Record<string, boolean> = {};
      const foundBuckets = buckets?.map(b => b.name) || [];
      setAvailableBuckets(foundBuckets);

      requiredBuckets.forEach(name => {
        status[name] = foundBuckets.includes(name);
      });

      setBucketsStatus(status);
      
      const missing = requiredBuckets.filter(name => !status[name]);
      if (missing.length > 0) {
        setBucketError(`Missing buckets: ${missing.join(', ')}. Please create them.`);
      } else {
        setBucketError(null);
      }
    } catch (error: any) {
      console.error('Error checking buckets:', error);
      setBucketError(error.message || 'Unknown error checking storage.');
    }
  };

  const handleCreateBuckets = async () => {
    setLoading(true);
    setRlsError(false);
    try {
      const bucketsToCreate = [
        { name: 'product-images', public: true },
        { name: 'chat-attachments', public: true },
        { name: 'refund-evidence', public: true }
      ];

      for (const bucket of bucketsToCreate) {
        const { error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (error && !error.message?.includes('already exists')) {
          throw error;
        }
      }
      
      toast.success('All storage buckets verified/created!');
      checkBuckets();
    } catch (error: any) {
      console.error('Error creating buckets:', error);
      if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
        setRlsError(true);
        setBucketError('Permission denied by RLS policy. You must enable bucket creation in Supabase SQL Editor.');
      } else {
        toast.error(`Failed to create buckets: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Route Guard: Prevent non-owners from accessing restricted tabs
    const restrictedTabs = ['employees', 'reports', 'system'];
    if (restrictedTabs.includes(activeTab) && user?.role !== 'owner') {
      setActiveTab('products');
      toast.error('Unauthorized: Owner access required');
    }

    if (activeTab === 'products') {
      fetchProducts();
      checkBuckets();
    }
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'customers') fetchCustomers();
    if (activeTab === 'chats') fetchChats();
    if (activeTab === 'refunds') fetchRefunds();
    if (activeTab === 'employees') fetchEmployees();
    if (activeTab === 'promotions') fetchPromotions();
  }, [activeTab, productSort, orderSort, filters, searchTerm, showLowStockOnly]);

  const updateRefundStatus = async (refundId: string, status: RefundStatus, orderId: string) => {
    try {
      const { error: refundError } = await supabase
        .from('refunds')
        .update({ status })
        .eq('id', refundId);
      
      if (refundError) throw refundError;

      // Also update order status
      const orderStatus = status === 'approved' ? 'refunded' : 'delivered';
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: orderStatus })
        .eq('id', orderId);
      
      if (orderError) throw orderError;

      toast.success(`Refund ${status} successfully`);
      fetchRefunds();
    } catch (error: any) {
      console.error('Error updating refund status:', error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedChatId) {
      // Create a single channel for this chat
      const channel = supabase
        .channel(`admin_chat:${selectedChatId}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `chat_id=eq.${selectedChatId}`
        }, (payload) => {
          const newMessage = payload.new as ChatMessage;
          setChatMessages(prev => {
            // Replace optimistic message if it exists
            const optimisticIdx = prev.findIndex(m => 
              m.role === newMessage.role && 
              m.text === newMessage.text && 
              (m.status === 'sending' || m.status === 'sent')
            );

            if (optimisticIdx !== -1) {
              const newMsgs = [...prev];
              newMsgs[optimisticIdx] = { ...newMessage, status: 'sent' };
              return newMsgs;
            }

            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to chat messages: ${selectedChatId}`);
            // Fetch initial messages AFTER subscription is active to prevent missing messages
            fetchChatMessages(selectedChatId);
          }
        });
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChatId]);

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      stock_quantity: Number(formData.get('stock_quantity')),
      category: formData.get('category') as string,
      parent_category: formData.get('parent_category') as string,
      image_url: mainImageUrl,
      gallery_urls: galleryUrls,
      is_new: formData.get('is_new') === 'on',
      is_deal: formData.get('is_deal') === 'on',
      is_unlisted: formData.get('is_unlisted') === 'on',
      discount_price: formData.get('discount_price') ? Number(formData.get('discount_price')) : null,
      promotion_label: formData.get('promotion_label') as string || null,
      detailed_specs: formData.get('detailed_specs') as string || null,
      specs: productSpecs.reduce((acc, curr) => {
        if (curr.key.trim()) {
          acc[curr.key.trim()] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>)
    };

    try {
      console.log('Attempting to save product:', { id: editingProduct?.id, ...productData });
      console.log('Current user role in state:', user?.role);
      console.log('Current user role in DB:', dbRole);
      
      if (editingProduct?.id) {
        const { data, error, status, statusText } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select();
        
        if (error) {
          console.error('Supabase Update Error:', error);
          throw error;
        }
        
        console.log('Update response:', { status, statusText, data });
        
        if (!data || data.length === 0) {
          const msg = dbRole !== 'admin' && dbRole !== 'owner' 
            ? `Your role in the database is "${dbRole}", but "admin" or "owner" is required to save. Please try logging out and back in.`
            : 'No product was updated. The ID might be invalid or database permissions (RLS) are blocking the update.';
          throw new Error(msg);
        }
      } else {
        const { data, error, status, statusText } = await supabase
          .from('products')
          .insert([productData])
          .select();
        
        if (error) {
          console.error('Supabase Insert Error:', error);
          throw error;
        }
        
        console.log('Insert response:', { status, statusText, data });
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      // Force a fresh fetch by adding a timestamp
      await fetchProducts();
      alert('Product saved successfully!');
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error.message || 'Check RLS policies.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClearPlaceholders = async () => {
    if (!window.confirm('This will remove all "picsum.photos" URLs from all products in the database. Continue?')) return;
    
    setLoading(true);
    try {
      // Get all products with picsum URLs
      const { data: productsToUpdate, error: fetchError } = await supabase
        .from('products')
        .select('id, image_url')
        .ilike('image_url', '%picsum.photos%');

      if (fetchError) throw fetchError;

      if (!productsToUpdate || productsToUpdate.length === 0) {
        alert('No products with placeholder URLs found.');
        return;
      }

      console.log(`Clearing placeholders for ${productsToUpdate.length} products...`);

      // Update them one by one or in bulk if possible
      // Supabase doesn't support bulk update with different values easily, 
      // but here we are setting them all to empty string.
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: '' })
        .ilike('image_url', '%picsum.photos%');

      if (updateError) throw updateError;

      alert(`Successfully cleared placeholders for ${productsToUpdate.length} products.`);
      fetchProducts();
    } catch (error: any) {
      console.error('Error clearing placeholders:', error);
      alert(`Failed to clear placeholders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Check RLS policies.');
    }
  };

  const user = useStore((state) => state.user);

  const generateTrackingNumber = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], reason?: string) => {
    try {
      const updateData: any = { status };
      if (reason) updateData.cancellation_reason = reason;
      
      // Track who fulfilled/updated the order
      if (user && (user.role === 'admin' || user.role === 'owner')) {
        updateData.fulfilled_by = user.id;
      }
      
      // Find the current order in our state to check existing fields
      const currentOrder = orders.find(o => o.id === orderId);
      
      // Generate tracking number when transitioning to packing
      if (status === 'packing') {
        // Verification: Ensure tracking_number isn't overwritten if it already exists
        if (currentOrder && !currentOrder.tracking_number) {
          updateData.tracking_number = generateTrackingNumber();
        }
      }

      // If confirming payment (packing starts), set payment_status to paid if it was pending
      if (status === 'packing') {
        updateData.payment_status = 'paid';
        updateData.payment_verified_at = new Date().toISOString();
        
        // Auto-decrement stock upon payment confirmation/packing
        // Note: This logic is separate from the order update transaction in the client-side implementation
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', orderId);
          
        if (itemsError) throw itemsError;
        
        for (const item of items) {
          const { data: product, error: prodError } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single();
            
          if (prodError) throw prodError;
          
          const newStock = Math.max(0, product.stock_quantity - item.quantity);
          
          await supabase
            .from('products')
            .update({ stock_quantity: newStock })
            .eq('id', item.product_id);
        }
      }

      // Single transaction update for the orders table (status + tracking_number)
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
      
      if (error) throw error;

      // Log activity
      if (user) {
        await logActivity(user.id, 'ORDER_UPDATE', `Updated order #${orderId.slice(0, 8)} to ${status}`);
      }

      setOrders(orders.map(o => o.id === orderId ? { ...o, ...updateData } : o));
      setShowCancelModal(null);
      setCancellationReason('');
      
      if (updateData.tracking_number) {
        toast.success(`Order updated! Tracking: ${updateData.tracking_number}`, {
          duration: 5000,
          icon: '📦'
        });
      } else {
        toast.success(`Order updated to ${status.replace('_', ' ')}`);
      }

      // Trigger e-receipt if payment was just verified
      if (status === 'packing') {
        fetch('/api/send-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
        }).catch(err => console.error('Failed to send receipt:', err));
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      if (error.code === 'PGRST204' || error.message?.includes('PGRST204')) {
        toast.error('Database Schema Out of Sync', {
          description: 'The tracking_number column might be missing. Please refresh the schema cache.',
        } as any);
      } else {
        toast.error(error.message || 'Failed to update order status.');
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setMainImageUrl('');
    setGalleryUrls([]);
    setProductSpecs([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    // Clear picsum URLs from the editing state
    const cleanImageUrl = product.image_url && !product.image_url.includes('picsum.photos') ? product.image_url : '';
    setMainImageUrl(cleanImageUrl);
    setGalleryUrls(product.gallery_urls?.filter(url => !url.includes('picsum.photos')) || []);
    
    // Convert Record specs to Array for editing
    const specsArray = Object.entries(product.specs || {}).map(([key, value]) => ({
      key,
      value: String(value)
    }));
    setProductSpecs(specsArray);
    setIsModalOpen(true);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    try {
      const url = await uploadToSupabase(file);
      setMainImageUrl(url);
    } catch (error) {
      console.error('Error uploading main image:', error);
      alert('Failed to upload image.');
    } finally {
      setUploadingMain(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploadPromises = files.map((file: File) => uploadToSupabase(file));
      const urls = await Promise.all(uploadPromises);
      setGalleryUrls(prev => [...prev, ...urls]);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      alert('Failed to upload some images.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const filteredProducts = sortData(products);

  const filteredOrders = sortData(orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.profiles?.username.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const filteredCustomers = sortData(customers.filter(c => 
    c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const filteredRefunds = sortData(refunds.filter(r => 
    r.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.profiles?.username.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const filteredEmployees = sortData(employees.filter(e => 
    e.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const sidebarTabs = [
    { id: 'products', name: 'Products', icon: <Package size={18} /> },
    { id: 'orders', name: 'Orders', icon: <ShoppingCart size={18} /> },
    { id: 'refunds', name: 'Refunds', icon: <RefreshCw size={18} /> },
    { id: 'customers', name: 'Customers', icon: <Users size={18} /> },
    { id: 'chats', name: 'Support Chats', icon: <MessageSquare size={18} /> },
    { id: 'reports', name: 'Revenue Metrics', icon: <BarChart3 size={18} />, ownerOnly: true },
    { id: 'promotions', name: 'Promotions', icon: <ImageIcon size={18} /> },
    { id: 'mass-upload', name: 'Mass Upload', icon: <Upload size={18} /> },
    { id: 'employees', name: 'Employee Management', icon: <ShieldCheck size={18} />, ownerOnly: true },
    { id: 'system', name: 'System', icon: <ShieldAlert size={18} />, ownerOnly: true },
  ];

  const SortableHeader = ({ label, field, className }: { label: string, field: string, className?: string }) => (
    <th 
      className={cn("py-5 px-6 cursor-pointer hover:text-cyan transition-colors group", className)}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        <div className="flex flex-col">
          <ChevronUp size={10} className={cn("transition-colors", sortField === field && sortOrder === 'asc' ? "text-cyan" : "text-slate-600")} />
          <ChevronDown size={10} className={cn("transition-colors", sortField === field && sortOrder === 'desc' ? "text-cyan" : "text-slate-600")} />
        </div>
      </div>
    </th>
  );

  const stats = [
    { name: 'Total Products', value: products.length.toString(), icon: <Package size={20} />, color: 'bg-blue-500' },
    { name: 'Active Orders', value: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length.toString(), icon: <ShoppingCart size={20} />, color: 'bg-cyan' },
    { name: 'Total Customers', value: customers.length.toString(), icon: <Users size={20} />, color: 'bg-navy' },
    { name: 'Revenue (Total)', value: `₱${orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}`, icon: <BarChart3 size={20} />, color: 'bg-green-500' },
  ];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      {/* Persistent Left Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">
            ADMIN <span className="text-cyan">PRO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Management Suite</p>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          {sidebarTabs.map((tab) => {
            if (tab.ownerOnly && user?.role !== 'owner') return null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 text-sm font-bold transition-all relative group",
                  activeTab === tab.id 
                    ? "text-cyan bg-cyan/5" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("transition-colors", activeTab === tab.id ? "text-cyan" : "text-slate-500 group-hover:text-slate-300")}>
                    {tab.icon}
                  </span>
                  {tab.name}
                </div>
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-sm flex items-center justify-center text-cyan font-black text-xs border border-slate-700">
              {user?.username?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white truncate">{user?.username}</p>
                {user?.role === 'owner' && (
                  <span className="text-[8px] font-black bg-cyan text-navy px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                    OWNER
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header / Top Bar */}
        <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest">{activeTab}</h2>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-xs focus:ring-1 focus:ring-cyan outline-none text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeTab === 'products' && (
              <>
                <button 
                  onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 font-black rounded-sm text-[10px] uppercase tracking-widest transition-all",
                    isFilterSidebarOpen ? "bg-cyan/10 text-cyan border border-cyan/20" : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
                  )}
                >
                  <Filter size={14} />
                  <span>Filters</span>
                </button>
                <div className="flex items-center gap-2 mr-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Low Stock Only</label>
                  <button 
                    onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative",
                      showLowStockOnly ? "bg-cyan" : "bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      showLowStockOnly ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
                <button 
                  onClick={handleClearPlaceholders}
                  className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all"
                >
                  Clear Placeholders
                </button>
                <button 
                  onClick={openAddModal}
                  className="px-4 py-2 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-cyan/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                >
                  Add Product
                </button>
              </>
            )}
            {activeTab === 'promotions' && (
              <button 
                onClick={() => {
                  setEditingPromotion(null);
                  setPromoImageUrl('');
                  setIsPromotionModalOpen(true);
                }}
                className="px-4 py-2 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-cyan/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                Add Promotion
              </button>
            )}
            <button 
              onClick={() => {
                if (activeTab === 'products') fetchProducts();
                if (activeTab === 'orders') fetchOrders();
                if (activeTab === 'refunds') fetchRefunds();
                if (activeTab === 'customers') fetchCustomers();
                if (activeTab === 'chats') fetchChats();
                if (activeTab === 'employees') fetchEmployees();
                if (activeTab === 'promotions') fetchPromotions();
              }}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        <div className="p-8 flex gap-8">
          {activeTab === 'products' && (
            <ProductFilterSidebar 
              products={products}
              filters={filters}
              onFilterChange={setFilters}
              isOpen={isFilterSidebarOpen}
              onToggle={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
              variant="admin"
            />
          )}

          <div className="flex-1 flex flex-col gap-8 min-w-0">
            {/* Storage Warning */}
            {bucketError && activeTab === 'products' && (
            <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-sm">
              <div className="flex items-center gap-4 mb-4">
                <AlertTriangle className="text-amber-500" size={24} />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Storage Configuration Required</h3>
                  <p className="text-xs text-slate-400 mt-1">{bucketError}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleCreateBuckets}
                  disabled={loading}
                  className="px-6 py-2 bg-amber-500 text-navy text-[10px] font-black rounded-sm hover:bg-amber-400 transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                  Auto-Create Buckets
                </button>
                
                {rlsError && (
                  <div className="w-full mt-4 p-4 bg-slate-950 rounded-sm border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      RLS Error detected. Please run this in your Supabase SQL Editor:
                      <code className="block mt-2 p-2 bg-black text-cyan font-mono lowercase">
                        insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true), ('chat-attachments', 'chat-attachments', true), ('refund-evidence', 'refund-evidence', true);
                      </code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

            {/* Content Panels */}
            <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
            <div className="p-0">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-cyan" size={32} />
                  </div>
                ) : activeTab === 'products' ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 bg-slate-900/50">
                        <SortableHeader label="Product" field="name" className="pl-8" />
                        <SortableHeader label="Category" field="category" />
                        <SortableHeader label="Price" field="price" />
                        <SortableHeader label="Stock" field="stock_quantity" />
                        <th className="py-5 px-6 text-right pr-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                          <td className="py-5 px-6 pl-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-sm shrink-0 overflow-hidden flex items-center justify-center border border-slate-700">
                                <ProductImage 
                                  src={product.image_url} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                  width={100}
                                  height={100}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">{product.name}</span>
                                {product.is_unlisted && (
                                  <span className="text-[8px] font-black bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-sm uppercase tracking-widest w-fit mt-1 border border-slate-700">
                                    Unlisted
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-sm border border-slate-700 uppercase tracking-widest">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-5 px-6 font-mono text-sm text-cyan">₱{product.price.toLocaleString()}</td>
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                product.stock_quantity > 10 ? "bg-green-500" : product.stock_quantity > 0 ? "bg-orange-500" : "bg-red-500"
                              )} />
                              <span className={cn(
                                "text-sm font-bold",
                                product.stock_quantity <= 5 ? "text-red-400" : "text-slate-300"
                              )}>
                                {product.stock_quantity}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-right pr-8">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openEditModal(product)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan hover:bg-cyan/10 rounded-sm border border-transparent hover:border-cyan/20 transition-all"
                              >
                                <Edit size={12} />
                                <span>Edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-sm border border-transparent hover:border-red-500/20 transition-all"
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : activeTab === 'orders' ? (
                  <>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 bg-slate-900/50">
                          <SortableHeader label="Order ID" field="id" className="pl-8" />
                          <SortableHeader label="Customer" field="profiles.username" />
                          <SortableHeader label="Amount" field="total_amount" />
                          <SortableHeader label="Status" field="status" />
                          <th className="py-5 px-6 text-right pr-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                            <td className="py-5 px-6 pl-8 font-mono text-xs text-slate-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                            <td className="py-5 px-6 font-bold text-white text-sm">{order.profiles?.username || 'Guest'}</td>
                            <td className="py-5 px-6 font-mono text-sm text-cyan">₱{order.total_amount.toLocaleString()}</td>
                            <td className="py-5 px-6">
                              <div className="flex flex-col">
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm w-fit border",
                                  order.status === 'delivered' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                  order.status === 'packing' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                  order.status === 'courier_pickup' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                  order.status === 'in_transit' ? "bg-cyan/10 text-cyan border-cyan/20" :
                                  order.status === 'out_for_delivery' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                  order.status === 'cancelled' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                  order.status === 'refund_requested' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                  order.status === 'refunded' ? "bg-slate-800 text-slate-400 border-slate-700" :
                                  "bg-slate-800 text-slate-400 border-slate-700"
                                )}>
                                  {order.status.replace('_', ' ')}
                                </span>
                                {order.tracking_number && (
                                  <span className="text-[8px] font-mono text-slate-500 uppercase mt-1">
                                    J&T: {order.tracking_number}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-5 px-6 text-right pr-8">
                              <div className="flex justify-end gap-2">
                                <Link 
                                  to={`/dashboard/orders/${order.id}`}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 rounded-sm border border-transparent hover:border-white/20 transition-all"
                                >
                                  <Eye size={12} />
                                  <span>Details</span>
                                </Link>

                                {order.status === 'pending' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'packing')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan hover:bg-cyan/10 rounded-sm border border-transparent hover:border-cyan/20 transition-all"
                                  >
                                    <ShieldCheck size={12} />
                                    <span>Verify</span>
                                  </button>
                                )}

                                {order.status === 'packing' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'courier_pickup')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan hover:bg-cyan/10 rounded-sm border border-transparent hover:border-cyan/20 transition-all"
                                  >
                                    <Box size={12} />
                                    <span>Pack</span>
                                  </button>
                                )}

                                {order.status === 'courier_pickup' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'in_transit')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan hover:bg-cyan/10 rounded-sm border border-transparent hover:border-cyan/20 transition-all"
                                  >
                                    <Truck size={12} />
                                    <span>Ship</span>
                                  </button>
                                )}

                                 {order.status === 'in_transit' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'out_for_delivery')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan hover:bg-cyan/10 rounded-sm border border-transparent hover:border-cyan/20 transition-all"
                                  >
                                    <MapPin size={12} />
                                    <span>Deliver</span>
                                  </button>
                                )}

                                {order.status === 'out_for_delivery' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-green-500 hover:bg-green-500/10 rounded-sm border border-transparent hover:border-green-500/20 transition-all"
                                  >
                                    <CheckCircle2 size={12} />
                                    <span>Complete</span>
                                  </button>
                                )}

                                {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'refunded' && (
                                  <button 
                                    onClick={() => setShowCancelModal(order.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-sm border border-transparent hover:border-red-500/20 transition-all"
                                  >
                                    <Ban size={12} />
                                    <span>Cancel</span>
                                  </button>
                                )}

                                <button 
                                  onClick={() => setSelectedOrderId(order.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 rounded-sm border border-transparent hover:border-white/20 transition-all"
                                >
                                  <FileText size={12} />
                                  <span>Receipt</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selectedOrderId && (
                      <ReceiptView orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
                    )}
                  </>
                ) : activeTab === 'refunds' ? (
                  <div className="divide-y divide-slate-800">
                    {filteredRefunds.length > 0 ? filteredRefunds.map((refund) => (
                      <div key={refund.id} className="p-8 hover:bg-white/5 transition-colors flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex gap-6">
                            <div className="w-14 h-14 bg-slate-800 rounded-sm flex items-center justify-center text-slate-600 border border-slate-700">
                              <RefreshCw size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-white uppercase tracking-tighter">Order #{refund.orders?.id.slice(0, 8).toUpperCase()}</span>
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border",
                                  refund.status === 'approved' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                  refund.status === 'rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                  "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                )}>
                                  {refund.status}
                                </span>
                              </div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                Customer: {refund.profiles?.username} • {new Date(refund.created_at).toLocaleDateString()}
                              </div>
                              <div className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                Reason: <span className="text-red-400">{refund.reason_code.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-xl font-black text-white font-mono">₱{refund.orders?.total_amount.toLocaleString()}</div>
                            {refund.status === 'pending' && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => updateRefundStatus(refund.id, 'rejected', refund.order_id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all"
                                >
                                  <XCircle size={14} /> Reject
                                </button>
                                <button 
                                  onClick={() => updateRefundStatus(refund.id, 'approved', refund.order_id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-green-500/20 transition-all"
                                >
                                  <CheckCircle2 size={14} /> Approve
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-slate-950 p-6 rounded-sm border border-slate-800">
                          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 block">Explanation</label>
                          <p className="text-sm text-slate-400 leading-relaxed italic">"{refund.explanation}"</p>
                        </div>

                        {refund.evidence_urls && refund.evidence_urls.length > 0 && (
                          <div>
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 block">Evidence Photos</label>
                            <div className="flex gap-3 overflow-x-auto pb-4">
                              {refund.evidence_urls.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-32 h-32 rounded-sm overflow-hidden border border-slate-800 shrink-0 hover:border-cyan transition-colors group relative">
                                  <img src={url} alt="Evidence" className="w-full h-full object-cover group-hover:opacity-80 transition-all" />
                                  <div className="absolute inset-0 bg-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-24 text-slate-600 font-bold uppercase tracking-widest text-xs">
                        No refund requests found
                      </div>
                    )}
                  </div>
                ) : activeTab === 'customers' ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 bg-slate-900/50">
                        <SortableHeader label="Username" field="username" className="pl-8" />
                        <SortableHeader label="Role" field="role" />
                        <SortableHeader label="Joined" field="created_at" />
                        <th className="py-5 px-6 text-right pr-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="group hover:bg-white/5 transition-colors">
                          <td className="py-5 px-6 pl-8 font-bold text-white text-sm">{customer.username}</td>
                          <td className="py-5 px-6">
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border",
                              customer.role === 'owner' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                              customer.role === 'admin' ? "bg-cyan/10 text-cyan border-cyan/20" :
                              "bg-slate-800 text-slate-400 border-slate-700"
                            )}>
                              {customer.role}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-xs text-slate-500 font-mono">{new Date(customer.created_at).toLocaleDateString()}</td>
                          <td className="py-5 px-6 text-right pr-8">
                            <Link 
                              to={`/dashboard/customers/${customer.id}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan hover:bg-cyan/10 rounded-sm border border-transparent hover:border-cyan/20 transition-all inline-flex"
                            >
                              <Eye size={12} />
                              <span>Profile</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : activeTab === 'employees' ? (
                  <>
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Employee <span className="text-cyan">Management</span></h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manage admin access and track performance</p>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingEmployee(null);
                          setIsEmployeeModalOpen(true);
                        }}
                        className="px-6 py-3 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-cyan/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                      >
                        <Plus size={16} /> HIRE EMPLOYEE
                      </button>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 bg-slate-900/50">
                          <SortableHeader label="Employee" field="username" className="pl-8" />
                          <SortableHeader label="Role" field="role" />
                          <SortableHeader label="Sales" field="totalSales" />
                          <SortableHeader label="Joined" field="created_at" />
                          <th className="py-5 px-6 text-right pr-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {filteredEmployees.map((employee) => (
                          <tr key={employee.id} className="group hover:bg-white/5 transition-colors">
                            <td className="py-5 px-6 pl-8">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-800 rounded-sm flex items-center justify-center text-slate-500 border border-slate-700 font-black text-xs uppercase">
                                  {employee.username.slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-sm">{employee.username}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">{employee.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border bg-cyan/10 text-cyan border-cyan/20">
                                {employee.role}
                              </span>
                            </td>
                            <td className="py-5 px-6 font-mono text-sm text-cyan">₱{(employee.totalSales || 0).toLocaleString()}</td>
                            <td className="py-5 px-6 text-xs text-slate-500 font-mono">{new Date(employee.created_at).toLocaleDateString()}</td>
                            <td className="py-5 px-6 text-right pr-8">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    setEditingEmployee(employee);
                                    setIsEmployeeModalOpen(true);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan hover:bg-cyan/10 rounded-sm border border-slate-800 hover:border-cyan/20 transition-all"
                                >
                                  <Edit size={12} />
                                  <span>EDIT ROLE</span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-sm border border-slate-800 hover:border-red-500/20 transition-all"
                                >
                                  <Trash2 size={12} />
                                  <span>FIRE EMPLOYEE</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : activeTab === 'promotions' ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 bg-slate-900/50">
                        <th className="py-5 px-6 pl-8">Banner</th>
                        <th className="py-5 px-6">Link</th>
                        <th className="py-5 px-6">Order</th>
                        <th className="py-5 px-6">Status</th>
                        <th className="py-5 px-6 text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {promotions.map((promo) => (
                        <tr key={promo.id} className="group hover:bg-white/5 transition-colors">
                          <td className="py-5 px-6 pl-8">
                            <div className="w-40 h-16 bg-slate-800 rounded-sm overflow-hidden border border-slate-700">
                              <img src={promo.image_url} alt="Promo" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <span className="text-xs text-slate-400 truncate max-w-[200px] block">
                              {promo.redirect_link || 'No link'}
                            </span>
                          </td>
                          <td className="py-5 px-6 font-mono text-sm text-cyan">{promo.display_order}</td>
                          <td className="py-5 px-6">
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border",
                              promo.is_active ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-slate-800 text-slate-400 border-slate-700"
                            )}>
                              {promo.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-right pr-8">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingPromotion(promo);
                                  setPromoImageUrl(promo.image_url);
                                  setIsPromotionModalOpen(true);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan hover:bg-cyan/10 rounded-sm border border-transparent hover:border-cyan/20 transition-all"
                              >
                                <Edit size={12} />
                                <span>Edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeletePromotion(promo.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-sm border border-transparent hover:border-red-500/20 transition-all"
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : activeTab === 'chats' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
                    {/* Chat List */}
                    <div className="border-r border-slate-800 space-y-1 overflow-y-auto max-h-[600px] p-4">
                      <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-4">Support Tickets</h3>
                      {chats.length === 0 ? (
                        <div className="text-center py-12 text-slate-600 text-xs font-bold uppercase tracking-widest">
                          No active tickets
                        </div>
                      ) : (
                        chats.map((chat) => (
                          <button
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={cn(
                              "w-full p-4 rounded-sm border transition-all text-left group",
                              selectedChatId === chat.id 
                                ? "border-cyan/30 bg-cyan/5" 
                                : "border-transparent hover:bg-white/5"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className={cn(
                                "font-bold text-sm uppercase tracking-tight transition-colors",
                                selectedChatId === chat.id ? "text-cyan" : "text-slate-300 group-hover:text-white"
                              )}>
                                {chat.profiles?.username || 'Guest'}
                              </span>
                              <span className={cn(
                                "text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest border",
                                chat.assigned_admin_id ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              )}>
                                {chat.assigned_admin_id ? 'Claimed' : 'Open'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                              {chat.is_ai_active ? (
                                <><Bot size={10} className="text-cyan" /> Beep Bot Active</>
                              ) : (
                                <><User size={10} className="text-slate-400" /> Human Agent</>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Chat Window */}
                    <div className="lg:col-span-2 flex flex-col h-[600px] bg-slate-950/50">
                      {selectedChatId ? (
                        <>
                          {/* Chat Header */}
                          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-800 rounded-sm flex items-center justify-center border border-slate-700">
                                <MessageSquare className="text-cyan" size={20} />
                              </div>
                              <div>
                                <div className="font-black text-white text-sm uppercase tracking-widest">
                                  {chats.find(c => c.id === selectedChatId)?.profiles?.username}
                                </div>
                                <div className="text-[9px] font-mono text-slate-600 uppercase">
                                  Ticket ID: {selectedChatId.slice(0, 8).toUpperCase()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {chats.find(c => c.id === selectedChatId)?.assigned_admin_id ? (
                                <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Assist</span>
                                    <button
                                      onClick={() => toggleAi(selectedChatId, !chats.find(c => c.id === selectedChatId)?.is_ai_active)}
                                      className={cn(
                                        "w-10 h-5 rounded-full transition-all relative",
                                        chats.find(c => c.id === selectedChatId)?.is_ai_active ? "bg-cyan" : "bg-slate-700"
                                      )}
                                    >
                                      <div className={cn(
                                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                        chats.find(c => c.id === selectedChatId)?.is_ai_active ? "left-6" : "left-1"
                                      )} />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => resolveTicket(selectedChatId)}
                                    className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-black rounded-sm hover:bg-green-500/20 transition-all flex items-center gap-2 uppercase tracking-widest"
                                  >
                                    <CheckCircle2 size={12} /> Resolve
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => claimTicket(selectedChatId)}
                                  className="px-6 py-2 bg-cyan text-navy text-[10px] font-black rounded-sm hover:bg-cyan/90 transition-all uppercase tracking-widest"
                                >
                                  Claim Ticket
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Messages Area */}
                          <div className="flex-grow overflow-y-auto p-8 space-y-6">
                            {chatLoading ? (
                              <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-cyan" size={24} />
                              </div>
                            ) : (
                              chatMessages.map((msg) => (
                                <div 
                                  key={msg.id}
                                  className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={cn(
                                    "max-w-[80%] p-4 rounded-sm text-sm border relative",
                                    msg.role === 'admin' 
                                      ? 'bg-slate-800 border-slate-700 text-white' 
                                      : msg.role === 'bot'
                                        ? 'bg-cyan/5 border-cyan/20 text-cyan'
                                        : 'bg-slate-900 border-slate-800 text-slate-300'
                                  )}>
                                    <div className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-50 flex items-center gap-2">
                                      {msg.role === 'bot' && <Bot size={10} />}
                                      {msg.role}
                                    </div>
                                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                    {msg.status === 'sending' && (
                                      <div className="absolute -bottom-4 right-0 text-[8px] font-black uppercase tracking-widest text-slate-600 animate-pulse">
                                        Sending...
                                      </div>
                                    )}
                                    {msg.status === 'error' && (
                                      <div className="absolute -bottom-4 right-0 text-[8px] font-black uppercase tracking-widest text-red-500">
                                        Failed
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                            <div ref={adminMessagesEndRef} />
                          </div>

                          {/* Input Area */}
                          <div className="p-6 bg-slate-900/50 border-t border-slate-800">
                            {chats.find(c => c.id === selectedChatId)?.status === 'closed' ? (
                              <div className="p-4 bg-slate-950 rounded-sm text-center text-[10px] font-black text-slate-600 uppercase tracking-widest border border-dashed border-slate-800">
                                This ticket has been resolved and is read-only.
                              </div>
                            ) : (
                              <form onSubmit={sendAdminMessage} className="flex gap-3">
                                <input
                                  type="text"
                                  value={adminMessage}
                                  onChange={(e) => setAdminMessage(e.target.value)}
                                  placeholder="Type your response..."
                                  className="flex-grow px-6 py-4 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white placeholder:text-slate-600"
                                />
                                <button
                                  type="submit"
                                  disabled={!adminMessage.trim() || !selectedChatId}
                                  className="w-14 h-14 bg-cyan text-navy rounded-sm flex items-center justify-center hover:bg-cyan/90 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                                >
                                  <Send size={20} />
                                </button>
                              </form>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-700">
                          <MessageSquare size={64} className="mb-6 opacity-10" />
                          <p className="font-black uppercase tracking-widest text-xs">Select a ticket to begin</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeTab === 'mass-upload' ? (
                  <div className="p-8">
                    <MassImageUploader />
                  </div>
                ) : activeTab === 'reports' ? (
                  <Reports />
                ) : activeTab === 'system' ? (
                  <div className="p-24 text-center">
                    <div className="max-w-md mx-auto">
                      <ShieldAlert className="text-amber-500 mx-auto mb-8" size={64} />
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">System <span className="text-cyan">Maintenance</span></h2>
                      <p className="text-slate-500 text-sm mb-12 leading-relaxed">
                        Critical tools for database integrity and profile synchronization.
                      </p>
                      
                      <div className="space-y-6">
                        <button 
                          onClick={handleRunSeed}
                          disabled={seeding}
                          className="w-full py-5 bg-slate-800 text-white font-black rounded-sm border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 uppercase tracking-widest text-xs"
                        >
                          {seeding ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                          Repair User Profiles
                        </button>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                          Fixes missing profiles and syncs roles for all accounts.
                        </p>

                        <div className="pt-6 border-t border-slate-800">
                          <button 
                            onClick={handleCreateBuckets}
                            disabled={loading}
                            className="w-full py-5 bg-slate-800 text-white font-black rounded-sm border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 uppercase tracking-widest text-xs"
                          >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                            Repair Storage Buckets
                          </button>
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-4">
                            Verifies and creates all required storage buckets for products, chat, and refunds.
                          </p>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
                          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-sm text-left">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                              <ShieldAlert size={14} className="text-amber-500" />
                              Database RLS Repair
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-4">
                              If you see "Row-Level Security" errors, copy and run this SQL in your Supabase SQL Editor:
                            </p>
                            <div className="relative">
                              <pre className="p-4 bg-black text-cyan font-mono text-[9px] overflow-x-auto rounded-sm border border-slate-800 max-h-60">
{`-- 1. Robust Admin Check Function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());

-- 4. Orders Policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
CREATE POLICY "Admins can update all orders" ON orders FOR UPDATE USING (is_admin());

-- 5. Refunds Policies
DROP POLICY IF EXISTS "Users can view their own refunds" ON refunds;
CREATE POLICY "Users can view their own refunds" ON refunds FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create their own refunds" ON refunds;
CREATE POLICY "Users can create their own refunds" ON refunds FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all refunds" ON refunds;
CREATE POLICY "Admins can view all refunds" ON refunds FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins can update all refunds" ON refunds;
CREATE POLICY "Admins can update all refunds" ON refunds FOR UPDATE USING (is_admin());

-- 6. Order Items Policies
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (is_admin());`}
                              </pre>
                              <button 
                                onClick={() => {
                                  const sql = `-- 1. Robust Admin Check Function\nCREATE OR REPLACE FUNCTION is_admin()\nRETURNS BOOLEAN AS $$\nBEGIN\n  RETURN EXISTS (\n    SELECT 1 FROM public.profiles\n    WHERE id = auth.uid()\n    AND role IN ('admin', 'owner')\n  );\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;\n\n-- 2. Enable RLS on all tables\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE products ENABLE ROW LEVEL SECURITY;\nALTER TABLE orders ENABLE ROW LEVEL SECURITY;\nALTER TABLE order_items ENABLE ROW LEVEL SECURITY;\nALTER TABLE refunds ENABLE ROW LEVEL SECURITY;\n\n-- 3. Profiles Policies\nDROP POLICY IF EXISTS "Users can view their own profile" ON profiles;\nCREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);\nDROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;\nCREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());\n\n-- 4. Orders Policies\nDROP POLICY IF EXISTS "Users can view their own orders" ON orders;\nCREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);\nDROP POLICY IF EXISTS "Admins can view all orders" ON orders;\nCREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (is_admin());\nDROP POLICY IF EXISTS "Admins can update all orders" ON orders;\nCREATE POLICY "Admins can update all orders" ON orders FOR UPDATE USING (is_admin());\n\n-- 5. Refunds Policies\nDROP POLICY IF EXISTS "Users can view their own refunds" ON refunds;\nCREATE POLICY "Users can view their own refunds" ON refunds FOR SELECT USING (auth.uid() = user_id);\nDROP POLICY IF EXISTS "Users can create their own refunds" ON refunds;\nCREATE POLICY "Users can create their own refunds" ON refunds FOR INSERT WITH CHECK (auth.uid() = user_id);\nDROP POLICY IF EXISTS "Admins can view all refunds" ON refunds;\nCREATE POLICY "Admins can view all refunds" ON refunds FOR SELECT USING (is_admin());\nDROP POLICY IF EXISTS "Admins can update all refunds" ON refunds;\nCREATE POLICY "Admins can update all refunds" ON refunds FOR UPDATE USING (is_admin());\n\n-- 6. Order Items Policies\nDROP POLICY IF EXISTS "Users can view their own order items" ON order_items;\nCREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (\n  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())\n);\nDROP POLICY IF EXISTS "Admins can view all order items" ON order_items;\nCREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (is_admin());`;
                                  navigator.clipboard.writeText(sql);
                                  toast.success('SQL copied to clipboard!');
                                }}
                                className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-sm transition-all"
                                title="Copy SQL"
                              >
                                <FileText size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Cancel <span className="text-red-500">Order</span></h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Please provide a reason for cancelling this order. This will be visible to the customer.</p>
            <textarea 
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="e.g. Item out of stock, Customer request..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none resize-none mb-6 text-white placeholder:text-slate-700"
              rows={4}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCancelModal(null)}
                className="flex-1 py-3 border border-slate-800 text-slate-400 font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Back
              </button>
              <button 
                onClick={() => handleUpdateOrderStatus(showCancelModal, 'cancelled', cancellationReason)}
                disabled={!cancellationReason.trim()}
                className="flex-1 py-3 bg-red-500 text-white font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Modal */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                  {editingEmployee ? 'Edit' : 'Add'} <span className="text-cyan">Employee</span>
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {editingEmployee ? 'Update employee credentials' : 'Create a new admin account'}
                </p>
              </div>
              <button 
                onClick={() => setIsEmployeeModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-sm transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSaveEmployee} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Username</label>
                  <input 
                    name="username"
                    required
                    defaultValue={editingEmployee?.username}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    defaultValue={editingEmployee?.email}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {editingEmployee ? 'New Password (Optional)' : 'Password'}
                  </label>
                  <input 
                    name="password"
                    type="password"
                    required={!editingEmployee}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bio / Notes</label>
                  <textarea 
                    name="bio"
                    defaultValue={editingEmployee?.bio}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none resize-none text-white"
                    placeholder="Employee background or responsibilities..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="flex-1 py-4 border border-slate-800 text-slate-400 font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={employeeSaving}
                    className="flex-1 py-4 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-cyan/90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2"
                  >
                    {employeeSaving && <Loader2 className="animate-spin" size={14} />}
                    {editingEmployee ? 'Update' : 'Create'} Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  {editingProduct ? 'Edit' : 'Add'} <span className="text-cyan">Product</span>
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product Name</label>
                    <input 
                      name="name"
                      defaultValue={editingProduct?.name}
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                    <select 
                      name="category"
                      defaultValue={editingProduct?.category}
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    >
                      <option value="CPU">CPU</option>
                      <option value="GPU">GPU</option>
                      <option value="Motherboard">Motherboard</option>
                      <option value="RAM">RAM</option>
                      <option value="Storage">Storage</option>
                      <option value="PSU">PSU</option>
                      <option value="Case">Case</option>
                      <option value="Cooler">Cooler</option>
                      <option value="Peripherals">Peripherals</option>
                      <option value="Gaming Laptops">Gaming Laptops</option>
                      <option value="Office Laptops">Office Laptops</option>
                      <option value="Student Laptops">Student Laptops</option>
                      <option value="Gaming PCs">Gaming PCs</option>
                      <option value="Workstations">Workstations</option>
                      <option value="Budget PCs">Budget PCs</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Parent Category</label>
                    <select 
                      name="parent_category"
                      defaultValue={editingProduct?.parent_category || 'Core Components'}
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    >
                      <option value="Core Components">Core Components</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Pre-built PCs">Pre-built PCs</option>
                      <option value="Peripherals">Peripherals</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price (₱)</label>
                    <input 
                      name="price"
                      type="number"
                      defaultValue={editingProduct?.price}
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stock Quantity</label>
                    <input 
                      name="stock_quantity"
                      type="number"
                      defaultValue={editingProduct?.stock_quantity}
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Main Product Image</label>
                    <div className="flex flex-col gap-4">
                      {mainImageUrl && (
                        <div className="relative w-full h-40 bg-slate-950 rounded-sm overflow-hidden border border-slate-800">
                          <ProductImage 
                            src={mainImageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                          <button 
                            type="button"
                            onClick={() => setMainImageUrl('')}
                            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 backdrop-blur-sm text-red-500 rounded-full hover:bg-slate-900 transition-all shadow-sm"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      <label className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-sm cursor-pointer transition-all",
                        mainImageUrl ? "border-slate-800 hover:border-cyan" : "border-slate-800 hover:border-cyan bg-slate-950/50"
                      )}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingMain ? (
                            <Loader2 className="animate-spin text-cyan mb-2" size={24} />
                          ) : (
                            <Upload className="text-slate-600 mb-2" size={24} />
                          )}
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                            {uploadingMain ? 'Uploading...' : 'Upload Main Image'}
                          </p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleMainImageUpload}
                          disabled={uploadingMain}
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowStorageBrowser('main')}
                        className="w-full py-3 bg-slate-800 text-white font-black rounded-sm text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all border border-slate-700"
                      >
                        <ImageIcon size={14} />
                        Browse Storage
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Specifications</label>
                  <div className="space-y-4 p-6 bg-slate-950/50 border border-slate-800 rounded-sm">
                    {productSpecs.map((spec, idx) => (
                      <div key={idx} className="flex gap-4">
                        <input 
                          type="text"
                          value={spec.key}
                          onChange={(e) => {
                            const newSpecs = [...productSpecs];
                            newSpecs[idx].key = e.target.value;
                            setProductSpecs(newSpecs);
                          }}
                          placeholder="Spec Name (e.g. Socket)"
                          className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-xs focus:ring-1 focus:ring-cyan outline-none text-white font-bold"
                        />
                        <input 
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = [...productSpecs];
                            newSpecs[idx].value = e.target.value;
                            setProductSpecs(newSpecs);
                          }}
                          placeholder="Value (e.g. AM5)"
                          className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-xs focus:ring-1 focus:ring-cyan outline-none text-white"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            setProductSpecs(productSpecs.filter((_, i) => i !== idx));
                          }}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setProductSpecs([...productSpecs, { key: "", value: "" }])}
                      className="w-full py-3 border border-dashed border-slate-800 rounded-sm text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-cyan hover:text-cyan transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Add Specification
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detailed Specifications (Markdown Support)</label>
                  <textarea 
                    name="detailed_specs"
                    defaultValue={editingProduct?.detailed_specs}
                    rows={6}
                    placeholder="Technical details, dimensions, warranties, etc. (Supports Markdown)"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none resize-none text-white font-mono"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    name="description"
                    defaultValue={editingProduct?.description}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none resize-none text-white"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gallery Images</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {galleryUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square bg-slate-950 rounded-sm overflow-hidden border border-slate-800">
                        <ProductImage 
                          src={url} 
                          alt={`Gallery ${index}`} 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 p-1 bg-slate-900/80 backdrop-blur-sm text-red-500 rounded-full hover:bg-slate-900 transition-all shadow-sm"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-800 rounded-sm cursor-pointer hover:border-cyan hover:bg-white/5 transition-all">
                      {uploadingGallery ? (
                        <Loader2 className="animate-spin text-cyan" size={20} />
                      ) : (
                        <Plus className="text-slate-600" size={20} />
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleGalleryUpload}
                        disabled={uploadingGallery}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Promotion Label</label>
                    <input 
                      name="promotion_label"
                      defaultValue={editingProduct?.promotion_label || ''}
                      placeholder="e.g. Hot Deal"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white placeholder:text-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Discount Price (₱)</label>
                    <input 
                      name="discount_price"
                      type="number"
                      defaultValue={editingProduct?.discount_price || ''}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      name="is_new"
                      type="checkbox"
                      defaultChecked={editingProduct?.is_new}
                      className="w-5 h-5 rounded-sm border-slate-800 bg-slate-950 text-cyan focus:ring-1 focus:ring-cyan focus:ring-offset-slate-900"
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      name="is_deal"
                      type="checkbox"
                      defaultChecked={editingProduct?.is_deal}
                      className="w-5 h-5 rounded-sm border-slate-800 bg-slate-950 text-cyan focus:ring-1 focus:ring-cyan focus:ring-offset-slate-900"
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">On Sale</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      name="is_unlisted"
                      type="checkbox"
                      defaultChecked={editingProduct?.is_unlisted}
                      className="w-5 h-5 rounded-sm border-slate-800 bg-slate-950 text-slate-600 focus:ring-1 focus:ring-slate-600 focus:ring-offset-slate-900"
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Unlisted</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-8">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-slate-800 text-slate-400 font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-4 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-cyan/90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="animate-spin" size={14} />}
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Storage Browser Modal */}
      {showStorageBrowser && (
        <StorageBrowser 
          onSelect={(url) => {
            if (showStorageBrowser === 'main') {
              setMainImageUrl(url);
            } else {
              setGalleryUrls(prev => [...prev, url]);
            }
            setShowStorageBrowser(null);
          }}
          onClose={() => setShowStorageBrowser(null)}
        />
      )}
      {/* Promotion Modal */}
      {isPromotionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                  {editingPromotion ? 'Edit' : 'Add'} <span className="text-cyan">Promotion</span>
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Manage homepage banners and links
                </p>
              </div>
              <button 
                onClick={() => setIsPromotionModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-sm transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSavePromotion} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Banner Image</label>
                  <div className="flex flex-col gap-4">
                    {promoImageUrl && (
                      <div className="relative w-full h-32 bg-slate-950 rounded-sm overflow-hidden border border-slate-800">
                        <img src={promoImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setPromoImageUrl('')}
                          className="absolute top-2 right-2 p-1.5 bg-slate-900/80 backdrop-blur-sm text-red-500 rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handlePromoImageUpload}
                        className="hidden" 
                        id="promo-upload"
                      />
                      <label 
                        htmlFor="promo-upload"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-800 rounded-sm cursor-pointer hover:border-cyan/50 hover:bg-cyan/5 transition-all"
                      >
                        {uploadingPromo ? (
                          <Loader2 className="animate-spin text-cyan" size={24} />
                        ) : (
                          <>
                            <Upload className="text-slate-600 mb-2" size={20} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Banner (1920x600 recommended)</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Redirect Link (Optional)</label>
                  <input 
                    name="redirect_link"
                    defaultValue={editingPromotion?.redirect_link}
                    placeholder="/products/category/gpu or https://..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Display Order</label>
                    <input 
                      name="display_order"
                      type="number"
                      defaultValue={editingPromotion?.display_order || 0}
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                    <div className="flex items-center gap-3 h-[46px]">
                      <input 
                        type="checkbox" 
                        name="is_active" 
                        defaultChecked={editingPromotion ? editingPromotion.is_active : true}
                        className="w-5 h-5 rounded-sm bg-slate-950 border-slate-800 text-cyan focus:ring-cyan focus:ring-offset-slate-900"
                      />
                      <span className="text-xs font-bold text-slate-400">Active</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsPromotionModalOpen(false)}
                    className="flex-1 py-4 border border-slate-800 text-slate-400 font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving || !promoImageUrl}
                    className="flex-1 py-4 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-cyan/90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="animate-spin" size={14} />}
                    {editingPromotion ? 'Update' : 'Create'} Promotion
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
