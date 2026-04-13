import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ShoppingCart, Search, Cpu, User, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const cart = useStore((state) => state.cart);
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const user = useStore((state) => state.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'PC Builder', path: '/builder' },
    { name: 'Credits', path: '/credits' },
    { name: 'Help', path: '/help' },
    { name: 'Live Chat', path: '/support' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-white/10 relative overflow-hidden rounded-none">
      {/* Tech Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(to right, #00BFE6 1px, transparent 1px), linear-gradient(to bottom, #00BFE6 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* Bottom Accent Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-cyan/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 h-10 flex items-center">
            <Logo theme="light" className="h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-[10px] font-black transition-all uppercase tracking-[0.2em] relative py-2",
                  location.pathname === link.path
                    ? "text-cyan"
                    : "text-white/60 hover:text-white"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="p-2 text-white/60 hover:text-cyan transition-colors">
              <Search size={18} />
            </button>
            <Link to="/cart" className="p-2 text-white/60 hover:text-cyan transition-colors relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-cyan text-navy text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <Link to="/dashboard/profile" className="flex items-center gap-3 group">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-cyan transition-colors">
                        {user.username}
                      </span>
                      {user.role === 'owner' && (
                        <span className="text-[8px] font-black bg-cyan text-navy px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                          OWNER
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] font-bold text-cyan/60 uppercase tracking-tighter">
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-9 h-9 bg-slate-800 rounded-sm border border-slate-700 flex items-center justify-center text-cyan font-black text-xs uppercase group-hover:border-cyan transition-all overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-white/5 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                >
                  DASHBOARD
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <Link
                  to="/auth"
                  className="text-white/60 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="px-6 py-2.5 bg-cyan text-navy rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="p-2 text-white relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#00BFE6] text-navy text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0B3B60] border-t border-white/10 p-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold text-white uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block w-full py-3 bg-cyan text-navy text-center rounded-sm font-black uppercase tracking-widest text-xs"
          >
            DASHBOARD
          </Link>
        </div>
      )}
    </header>
  );
};
