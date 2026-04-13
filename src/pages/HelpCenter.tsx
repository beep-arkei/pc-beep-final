import React, { useState } from 'react';
import { 
  ShieldCheck, Truck, HelpCircle, Search, ChevronRight, 
  MessageSquare, Phone, Mail, MapPin, ExternalLink,
  Cpu, Zap, RefreshCcw, Package, Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I know if the parts I selected are compatible?",
    answer: "Our PC Builder tool has built-in compatibility checking. It automatically filters out incompatible parts (e.g., wrong socket for CPU, insufficient power for GPU). If you're still unsure, you can chat with Beep Bot or our expert technicians.",
    category: "PC Building"
  },
  {
    question: "What is your typical lead time for custom builds?",
    answer: "Standard custom builds take 3-5 business days for assembly, stress testing, and OS optimization. Once testing is complete, we ship immediately.",
    category: "PC Building"
  },
  {
    question: "Do you offer technical support for software issues?",
    answer: "We provide lifetime technical support for hardware issues on all our custom builds. For software issues, we offer assistance with OS installation and driver updates, but third-party software support may be limited.",
    category: "PC Building"
  },
  {
    question: "Can I upgrade my PC in the future without voiding the warranty?",
    answer: "Yes! We encourage upgrades. Opening your case does not void the warranty. However, damage caused by improper installation of third-party components is not covered.",
    category: "PC Building"
  },
  {
    question: "What happens if a part arrives dead on arrival (DOA)?",
    answer: "We stress-test every build before shipping to minimize this. If a component is DOA, contact us within 48 hours for an immediate replacement at no extra cost.",
    category: "Returns"
  },
  {
    question: "Do you ship to remote areas in Mindanao?",
    answer: "Yes, we ship nationwide via J&T Express and LBC. Some remote areas may have longer transit times (7-10 days).",
    category: "Shipping"
  },
  {
    question: "What are your payment options for high-value orders?",
    answer: "For orders above ₱50,000, we require at least a 50% down payment via Bank Transfer or GCash. The remaining can be settled via COD or before final shipment.",
    category: "General"
  },
  {
    question: "Do you provide a physical receipt for warranty claims?",
    answer: "Yes, every order comes with a physical Sales Invoice. We also keep a digital record linked to your account for easy verification.",
    category: "General"
  },
  {
    question: "Is the Windows OS included in the price?",
    answer: "We install Windows 11 Home/Pro (Unactivated) for testing. You can purchase a genuine license key from us during checkout to have it fully activated.",
    category: "PC Building"
  },
  {
    question: "How do I track my order in real-time?",
    answer: "Once shipped, a tracking number will be visible in your Dashboard. You can use our 'Track Order' tool or the courier's website.",
    category: "Shipping"
  },
  {
    question: "What is your return policy for change of mind?",
    answer: "We do not accept returns for change of mind once a custom PC has been assembled. For individual components, returns are accepted within 7 days if unopened.",
    category: "Returns"
  },
  {
    question: "Do you offer home service for repairs?",
    answer: "Currently, we only offer home service within Dauis and Tagbilaran City, Bohol. For other areas, the unit must be shipped to our service center.",
    category: "General"
  },
  {
    question: "Can I provide my own parts for you to build?",
    answer: "Yes, we offer a 'Build-Only' service for a flat fee of ₱1,500. Note that we only provide warranty for the assembly, not the parts you provided.",
    category: "PC Building"
  },
  {
    question: "Are your products brand new or refurbished?",
    answer: "We only sell 100% brand new, authentic products with local manufacturer warranties.",
    category: "General"
  },
  {
    question: "What is 'Stress Testing'?",
    answer: "We run heavy workloads (Prime95, Furmark) for 12-24 hours to ensure your system is stable under maximum load and that cooling is sufficient.",
    category: "PC Building"
  },
  {
    question: "Do you offer bulk discounts for iCafes or Offices?",
    answer: "Yes! We provide special pricing for bulk orders of 5 units or more. Contact our sales team for a custom quote.",
    category: "General"
  },
  {
    question: "How do I clean my PC properly?",
    answer: "We recommend using compressed air every 3-6 months. Avoid using vacuum cleaners or wet cloths on internal components.",
    category: "PC Building"
  },
  {
    question: "What should I do if my PC won't turn on?",
    answer: "First, check the power cable and the switch on the PSU. If it still won't start, contact our support team immediately.",
    category: "General"
  },
  {
    question: "Do you offer installment plans?",
    answer: "We currently support installments via Billease and TendoPay through our online checkout.",
    category: "General"
  },
  {
    question: "Can I pick up my order from your store?",
    answer: "Yes, you can select 'Store Pickup' during checkout. Our shop is located in Bingag, Dauis, Bohol.",
    category: "Shipping"
  }
];

export const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'faq' | 'warranty' | 'shipping'>('faq');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: `linear-gradient(to right, #00BFE6 1px, transparent 1px), linear-gradient(to bottom, #00BFE6 1px, transparent 1px)`, 
               backgroundSize: '40px 40px' 
             }} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">
            HELP <span className="text-cyan">CENTER</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Find answers to technical questions, learn about our policies, or get in touch with our support team.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-sm shadow-xl border border-slate-200 p-2 flex flex-wrap gap-2">
          {[
            { id: 'faq', label: 'FAQ Search', icon: Search },
            { id: 'warranty', label: 'Warranty Policy', icon: ShieldCheck },
            { id: 'shipping', label: 'Shipping Info', icon: Truck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 min-w-[150px] flex items-center justify-center gap-3 py-4 rounded-sm text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-navy text-white shadow-lg" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-navy"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'faq' && (
          <div className="space-y-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for questions (e.g. compatibility, shipping)..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-sm shadow-sm focus:ring-2 focus:ring-cyan outline-none transition-all text-navy font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-sm border border-slate-200 overflow-hidden hover:border-cyan/30 transition-all shadow-sm"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-cyan uppercase tracking-widest">{faq.category}</span>
                      <span className="font-bold text-navy text-sm group-hover:text-cyan transition-colors">{faq.question}</span>
                    </div>
                    <ChevronRight className={cn("text-slate-300 transition-transform", openFaq === index && "rotate-90 text-cyan")} size={18} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            {filteredFaqs.length === 0 && (
              <div className="text-center py-20">
                <HelpCircle size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">No matching questions found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="max-w-4xl mx-auto bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">1-Year Limited <span className="text-cyan">Warranty</span></h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hardware Protection Policy</p>
              </div>
              <ShieldCheck className="text-cyan" size={40} />
            </div>
            <div className="p-8 space-y-8 text-slate-600 leading-relaxed">
              <section className="space-y-4">
                <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                  <Zap size={16} className="text-cyan" /> Coverage Overview
                </h3>
                <p className="text-sm">
                  PC BEEP PH warrants that the hardware components of your custom-built system will be free from defects in materials and workmanship for a period of <strong>one (1) year</strong> from the date of original purchase.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-navy uppercase tracking-widest">What is Covered</h4>
                  <ul className="space-y-3">
                    {[
                      'Defective internal components (CPU, GPU, RAM, etc.)',
                      'Power supply failure under normal use',
                      'Motherboard malfunctions',
                      'Assembly-related issues and cable management',
                      'Initial OS optimization and driver stability'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-cyan rounded-full mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-navy uppercase tracking-widest">What is NOT Covered</h4>
                  <ul className="space-y-3">
                    {[
                      'Software viruses or OS corruption',
                      'Damage from power surges or lightning',
                      'Physical damage or liquid spills',
                      'Unauthorized overclocking damage',
                      'Mining-related hardware degradation'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <section className="bg-navy p-6 rounded-sm text-white space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <RefreshCcw size={16} className="text-cyan" /> RMA Process
                </h3>
                <p className="text-xs opacity-80">
                  To initiate a warranty claim, please contact our support team via the Live Chat or visit our service center. You must provide your original Sales Invoice. We will first attempt to diagnose and fix the issue remotely before requesting a unit return.
                </p>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">Shipping & <span className="text-cyan">Logistics</span></h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nationwide Delivery Information</p>
                </div>
                <Truck className="text-cyan" size={40} />
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { region: 'Bohol (Local)', time: '1-2 Days', cost: 'Free / Low Cost', desc: 'Direct delivery via our own logistics team for Dauis and Tagbilaran.' },
                    { region: 'Visayas', time: '3-5 Days', cost: 'Standard Rates', desc: 'Shipped via J&T Express or LBC with full insurance and double-boxing.' },
                    { region: 'Mindanao', time: '5-8 Days', cost: 'Standard Rates', desc: 'Air or Sea freight options available depending on urgency.' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-4 p-6 bg-slate-50 rounded-sm border border-slate-100">
                      <h3 className="text-sm font-black text-navy uppercase tracking-widest border-b border-slate-200 pb-2">{item.region}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span className="text-slate-400">Transit Time</span>
                          <span className="text-navy">{item.time}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span className="text-slate-400">Shipping Cost</span>
                          <span className="text-cyan">{item.cost}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                      <Package size={18} className="text-cyan" /> Packaging Standard
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      We use a "Double-Box" method for all custom PCs. The internal components are secured with expanding foam (Instapak) to prevent movement during transit. The outer box is reinforced and marked as fragile.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                      <Clock size={18} className="text-cyan" /> Order Processing
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Orders for in-stock components are processed within 24 hours. Custom PC builds require 3-5 business days for assembly and rigorous stress testing before they are cleared for shipping.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-navy p-8 rounded-sm text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center">
                  <MapPin className="text-cyan" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-tight">Store Pickup Available</h4>
                  <p className="text-xs opacity-60">Visit our shop in Bingag, Dauis, Bohol to save on shipping.</p>
                </div>
              </div>
              <button className="px-8 py-3 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                VIEW ON GOOGLE MAPS
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Contact */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-black text-navy uppercase tracking-tighter mb-4">Still Need <span className="text-cyan">Help?</span></h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md">
                Our support team is available Monday to Saturday, 9:00 AM - 6:00 PM. We typically respond to live chat messages within 5 minutes.
              </p>
              <div className="flex gap-4">
                <a href="/support" className="px-6 py-3 bg-navy text-white font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-navy/90 transition-all flex items-center gap-2">
                  <MessageSquare size={14} /> Start Live Chat
                </a>
                <button className="px-6 py-3 border border-slate-200 text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Phone size={14} /> Request Callback
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-navy font-bold">
                  <Phone size={16} className="text-cyan" /> +63 966 339 4164
                </div>
                <div className="flex items-center gap-3 text-sm text-navy font-bold">
                  <Mail size={16} className="text-cyan" /> pcbeepph@gmail.com
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-2">
                {['Track Order', 'PC Builder', 'Product Catalog', 'Terms of Service'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-500 hover:text-cyan transition-colors flex items-center gap-2">
                      <ChevronRight size={12} /> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
