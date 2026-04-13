import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { BeepBotMascot } from '../components/BeepBotMascot';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <BeepBotMascot variant="confused" size={240} />
        </div>
        
        <h1 className="text-6xl font-black text-navy uppercase tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tight mb-8">
          Confused Beep Bot! <span className="text-cyan">Page Not Found</span>
        </h2>
        
        <p className="text-slate-500 font-medium mb-12">
          My sensors can't locate the data you're looking for. It might have been moved or deleted from my database.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-8 py-4 bg-navy text-white font-black rounded-xl hover:bg-navy/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-navy/20"
          >
            <Home size={20} />
            BACK TO HOME
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-slate-100 text-navy font-black rounded-xl hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-3"
          >
            <ArrowLeft size={20} />
            GO BACK
          </button>
        </div>
      </div>
    </div>
  );
};
