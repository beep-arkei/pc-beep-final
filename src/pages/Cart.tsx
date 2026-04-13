import React from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { getOptimizedImageUrl } from '../lib/storage';

import { BeepBotMascot } from '../components/BeepBotMascot';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;
  const hasOutOfStockItems = cart.some(item => item.stock_quantity === 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="flex justify-center mb-8">
          <BeepBotMascot variant="sad" size={180} />
        </div>
        <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">My sensors detect an empty cart!</h2>
        <p className="text-slate-500 font-medium mt-4 mb-8">Let’s find some parts and start building your dream PC.</p>
            <Link 
          to="/products" 
          className="px-8 py-4 bg-cyan text-navy font-black rounded-xl hover:bg-cyan/90 transition-all inline-flex items-center gap-3 shadow-lg shadow-cyan/20"
        >
          START SHOPPING <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-navy uppercase tracking-tighter mb-12">
        YOUR <span className="text-cyan">CART</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-6 items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                {item.image_url && !item.image_url.includes('picsum.photos') ? (
                  <img 
                    src={getOptimizedImageUrl(item.image_url, { width: 200, height: 200 })} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (item.image_url && target.src !== item.image_url) {
                        target.src = item.image_url;
                      }
                    }}
                  />
                ) : (
                  <Cpu size={32} className="text-slate-300" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</div>
                <h3 className="font-bold text-navy">{item.name}</h3>
                {item.stock_quantity === 0 && (
                  <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">Out of Stock</div>
                )}
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button 
                      onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:text-cyan transition-colors text-navy"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-navy">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-cyan transition-colors text-navy"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-navy">₱{(item.price * item.quantity).toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 font-bold">₱{item.price.toLocaleString()} each</div>
              </div>
            </div>
          ))}

          <button 
            onClick={clearCart}
            className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Clear Cart
          </button>
        </div>

        <aside>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-8">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600 font-bold text-sm">
                <span>Subtotal</span>
                <span className="text-navy">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-bold text-sm">
                <span>Shipping (PH)</span>
                <span className="text-navy">₱{shipping.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <span className="font-black text-navy uppercase tracking-widest text-xs">Total</span>
                <span className="text-3xl font-black text-cyan">₱{total.toLocaleString()}</span>
              </div>
            </div>

            <Link 
              to={hasOutOfStockItems ? "#" : "/checkout"}
              className={cn(
                "w-full py-4 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-3",
                hasOutOfStockItems 
                  ? "bg-slate-300 cursor-not-allowed shadow-none" 
                  : "bg-navy hover:bg-navy/90 shadow-navy/20"
              )}
              onClick={(e) => hasOutOfStockItems && e.preventDefault()}
            >
              {hasOutOfStockItems ? 'REMOVE OUT OF STOCK ITEMS' : 'PROCEED TO CHECKOUT'} <ArrowRight size={20} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};
