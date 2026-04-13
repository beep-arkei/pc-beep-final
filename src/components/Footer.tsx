import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Logo className="brightness-0 invert" variant="icon" />
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              PC Beep is your premier destination for high-performance computer parts and custom PC assembly in the Philippines.
            </p>
            <div className="flex gap-4 mt-6">
              <Facebook size={20} className="text-slate-400 hover:text-cyan cursor-pointer" />
              <Twitter size={20} className="text-slate-400 hover:text-cyan cursor-pointer" />
              <Instagram size={20} className="text-slate-400 hover:text-cyan cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/products" className="hover:text-cyan">Shop All Parts</Link></li>
              <li><Link to="/builder" className="hover:text-cyan">PC Builder</Link></li>
              <li><Link to="/credits" className="hover:text-cyan">Credits</Link></li>
              <li><a href="#" className="hover:text-cyan">Build Gallery</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/track-order" className="hover:text-cyan">Track Order</Link></li>
              <li><Link to="/support#warranty" className="hover:text-cyan">Warranty Policy</Link></li>
              <li><Link to="/support#shipping" className="hover:text-cyan">Shipping Info</Link></li>
              <li><Link to="/support#faqs" className="hover:text-cyan">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-cyan" />
                +63 966 339 4164
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-cyan" />
                pcbeepph@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-cyan" />
                Barangay Cogon, Tagbilaran City, Bohol
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs uppercase tracking-widest font-bold">
          <p>© 2026 PC BEEP PHILIPPINES. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
