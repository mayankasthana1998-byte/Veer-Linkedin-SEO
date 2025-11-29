import React from 'react';
import { Share2, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 ring-1 ring-slate-900/5">
            <Share2 className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Veer <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">LinkedIn SEO</span>
            </h1>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200 shadow-sm">
           <Sparkles className="w-3.5 h-3.5 text-amber-500" />
           <span className="text-xs font-medium text-slate-600">Powered By Your Linkedin Local Creator</span>
        </div>
      </div>
    </header>
  );
};

export default Header;