import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShoppingBag, CreditCard, Truck, CheckCircle2, AlertCircle, FileText, MapPin, Plus, Home, Briefcase, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { ReceiptView } from '../components/ReceiptView';
import { calculateShipping } from '../lib/shipping';
import { PhoneVerificationModal } from '../components/PhoneVerificationModal';
import { BeepBotMascot } from '../components/BeepBotMascot';
import { UserAddress } from '../types';
import { AddressForm } from './AddressDashboard';
import { toast } from 'react-hot-toast';

export const Checkout: React.FC = () => {
  const { cart, user, clearCart } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [shippingDetails, setShippingDetails] = useState<{ fee: number; region: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'gcash' | 'maya' | 'crypto'>('cod');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = shippingDetails?.fee || 0;
  const total = subtotal + shippingFee;

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAddresses(data || []);
      
      // Pre-select default address
      const defaultAddr = data?.find(a => a.is_default) || data?.[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        const details = calculateShipping(Number(defaultAddr.lat), Number(defaultAddr.lng));
        setShippingDetails(details);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [user, cart, navigate, orderSuccess]);

  const handleAddressSelect = (addr: UserAddress) => {
    setSelectedAddressId(addr.id);
    const details = calculateShipping(Number(addr.lat), Number(addr.lng));
    setShippingDetails(details);
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    
    // Check for phone verification first
    if (!user.phone_verified) {
      setShowPhoneVerify(true);
      return;
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) {
      setError('Please select a shipping address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          order_type: 'buy',
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'unpaid' : 'paid',
          shipping_address: `${selectedAddress.street_address}, ${selectedAddress.barangay}, ${selectedAddress.city}, ${selectedAddress.province}, ${selectedAddress.postal_code}`,
          shipping_fee: shippingFee,
          latitude: selectedAddress.lat,
          longitude: selectedAddress.lng,
          special_instructions: specialInstructions
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success
      setLastOrderId(order.id);
      setOrderSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="flex justify-center mb-8">
          <BeepBotMascot variant="celebrating" size={200} />
        </div>
        <h2 className="text-4xl font-black text-navy uppercase tracking-tighter mb-4">Order Placed Successfully!</h2>
        <p className="text-slate-500 font-medium mb-12">
          Beep Bot is celebrating! We've received your order and are processing it with maximum efficiency.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setShowReceipt(true)}
            className="px-8 py-4 bg-cyan text-navy font-black rounded-none hover:bg-white transition-all shadow-lg shadow-cyan/20 border border-cyan flex items-center justify-center gap-2"
          >
            <FileText size={20} />
            VIEW RECEIPT
          </button>
          <button 
            onClick={() => navigate(`/track/${lastOrderId}`)}
            className="px-8 py-4 bg-navy text-white font-black rounded-none hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 flex items-center justify-center gap-2"
          >
            <Truck size={20} />
            TRACK ORDER
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-slate-100 text-navy font-black rounded-none hover:bg-slate-200 transition-all border border-slate-200"
          >
            MY ORDERS
          </button>
        </div>

        {showReceipt && lastOrderId && (
          <ReceiptView orderId={lastOrderId} onClose={() => setShowReceipt(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-navy uppercase tracking-tighter mb-12">
        CHECK<span className="text-cyan">OUT</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-none border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-none flex items-center justify-center">
                  <Truck className="text-navy" size={20} />
                </div>
                <h3 className="text-xl font-black text-navy uppercase tracking-tight">Shipping Address</h3>
              </div>
              <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="flex items-center gap-2 text-[10px] font-black text-cyan hover:text-navy uppercase tracking-widest transition-colors"
              >
                <Plus size={14} /> Add New Address
              </button>
            </div>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => handleAddressSelect(addr)}
                    className={cn(
                      "p-4 border transition-all text-left relative group",
                      selectedAddressId === addr.id 
                        ? "border-cyan bg-cyan/5" 
                        : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-slate-100 flex items-center justify-center text-slate-500">
                        {addr.label === 'Home' ? <Home size={12} /> : <Briefcase size={12} />}
                      </div>
                      <span className="text-[10px] font-black text-navy uppercase tracking-widest">{addr.label}</span>
                      {addr.is_default && (
                        <span className="text-[8px] font-black bg-cyan/20 text-cyan px-1.5 py-0.5 rounded-none uppercase tracking-widest">Default</span>
                      )}
                    </div>
                    <div className="font-bold text-navy text-sm mb-1">{addr.full_name}</div>
                    <div className="text-xs text-slate-500 line-clamp-2 mb-2">{addr.street_address}, {addr.barangay}, {addr.city}</div>
                    <div className="text-[10px] font-bold text-slate-400">{addr.phone}</div>
                    
                    <div className={cn(
                      "absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-all",
                      selectedAddressId === addr.id ? "border-cyan bg-cyan" : "border-slate-200"
                    )}>
                      {selectedAddressId === addr.id && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-0.5" />}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-none">
                <MapPin className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No addresses saved yet</p>
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="mt-4 text-cyan font-black text-[10px] uppercase tracking-widest hover:underline"
                >
                  Add your first address
                </button>
              </div>
            )}

            {shippingDetails && (
              <div className="mt-8 p-4 bg-cyan/5 border border-cyan/20 rounded-none flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-cyan uppercase tracking-widest">Detected Region</p>
                  <p className="text-sm font-black text-navy uppercase">{shippingDetails.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-cyan uppercase tracking-widest">Shipping Fee</p>
                  <p className="text-sm font-black text-navy uppercase">₱{shippingDetails.fee}</p>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white p-8 rounded-none border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-slate-100 rounded-none flex items-center justify-center">
                <CreditCard className="text-navy" size={20} />
              </div>
              <h3 className="text-xl font-black text-navy uppercase tracking-tight">Payment Method</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when you receive', icon: <Truck size={20} /> },
                { id: 'card', name: 'Credit/Debit Card', desc: 'Visa, Mastercard, JCB', icon: <CreditCard size={20} /> },
                { id: 'gcash', name: 'GCash', desc: 'Philippine E-Wallet', icon: <ShoppingBag size={20} /> },
                { id: 'maya', name: 'Maya', desc: 'Philippine E-Wallet', icon: <ShoppingBag size={20} /> },
                { id: 'crypto', name: 'Cryptocurrency', desc: 'BTC, ETH, USDT', icon: <ShoppingBag size={20} /> },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={cn(
                    "p-4 rounded-none border-2 transition-all text-left flex items-center justify-between group",
                    paymentMethod === method.id 
                      ? "border-cyan bg-cyan/5" 
                      : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-none flex items-center justify-center transition-colors",
                      paymentMethod === method.id ? "bg-white text-cyan shadow-sm" : "bg-slate-50 text-slate-400 group-hover:text-navy"
                    )}>
                      {method.icon}
                    </div>
                    <div>
                      <div className={cn(
                        "font-black uppercase tracking-tight text-sm",
                        paymentMethod === method.id ? "text-navy" : "text-slate-500"
                      )}>
                        {method.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        {method.desc}
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all",
                    paymentMethod === method.id ? "border-cyan bg-cyan" : "border-slate-200"
                  )}>
                    {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full m-auto mt-1" />}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <div className="bg-white rounded-none p-8 border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-8">Order Summary</h3>
            
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-navy text-sm line-clamp-1">{item.name}</div>
                    <div className="text-xs text-slate-700 font-bold">x{item.quantity}</div>
                  </div>
                  <div className="font-bold text-navy text-sm">₱{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 pt-8 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Special Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Leave at the front desk, call upon arrival..."
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm focus:border-cyan outline-none transition-all rounded-none resize-none"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 mb-8 pt-8 border-t border-slate-100">
              <div className="flex justify-between text-slate-700 font-bold text-sm">
                <span>Subtotal</span>
                <span className="text-navy">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-bold text-sm">
                <span>Shipping</span>
                <span className="text-navy">₱{shippingFee.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <span className="font-black text-navy uppercase tracking-widest text-xs">Total</span>
                <span className="text-3xl font-black text-cyan">₱{total.toLocaleString()}</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-none text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 bg-navy text-white font-black rounded-none hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : (!user?.phone_verified ? 'VERIFY PHONE TO ORDER' : 'PLACE ORDER')}
            </button>
          </div>
        </aside>
      </div>

      {showPhoneVerify && (
        <PhoneVerificationModal 
          onSuccess={() => {
            setShowPhoneVerify(false);
            handlePlaceOrder();
          }}
          onClose={() => setShowPhoneVerify(false)}
        />
      )}

      {isAddressModalOpen && (
        <AddressForm 
          onClose={() => setIsAddressModalOpen(false)} 
          onSuccess={fetchAddresses} 
        />
      )}
    </div>
  );
};
