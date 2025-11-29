import React from 'react';
import { Share2, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Share2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Veer <span className="text-indigo-400">LinkedIn SEO</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Algorithm-Optimized Content Generator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
           <Sparkles className="w-4 h-4 text-amber-400" />
           <span className="text-xs font-medium text-slate-300">Powered By Your Linkedin Local Creator</span>
        </div>
      </div>
    </header>
  );
};

export default Header;