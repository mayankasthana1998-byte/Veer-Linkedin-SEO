import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Send, RefreshCw, Copy, Check, AlertCircle, Sparkles, X, Linkedin } from 'lucide-react';
import Header from './components/Header';
import ConfigurationPanel from './components/ConfigurationPanel';
import ScoreChart from './components/ScoreChart';
import { GeneratedResult, GenerationConfig } from './types';
import { DEFAULT_CONFIG, MOCK_LOADING_STEPS } from './constants';
import { generateCaption } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>(DEFAULT_CONFIG);
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // 100MB Limit (100 * 1024 * 1024 bytes)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError("File is too large. Please upload a file smaller than 100MB.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const removeFile = () => setFile(null);

  // Generation Logic
  const handleGenerate = async (mode: 'create' | 'refine') => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    // Simulate loading steps for UX
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < MOCK_LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const generatedData = await generateCaption(mode, config, textInput, file);
      setResult(generatedData);
    } catch (err: any) {
      setError("Oops! The AI got confused. Please check your API Key and connection, then try again.");
      console.error(err);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.caption + '\n\n' + result.suggestedHashtags.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Input & Config */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-md">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              Input Data
            </h2>
            
            {/* File Upload Area */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                Media Context (Optional)
              </label>
              {!file ? (
                <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-indigo-200 transition-all text-slate-400 group-hover:text-indigo-500">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-700 font-semibold group-hover:text-indigo-700 transition-colors">Click to upload or drag & drop</p>
                    <p className="text-xs text-slate-500 mt-1">Images or PDFs (Max 100MB)</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                       <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={removeFile} 
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Text Input Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                Draft / Brain Dump
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-32 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none placeholder:text-slate-400"
                placeholder="What's on your mind? Paste a rough draft, a URL, or just a few bullet points about what you want to say..."
              />
            </div>
          </div>

          <ConfigurationPanel config={config} setConfig={setConfig} />

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleGenerate('create')}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/20"
            >
              {loading ? 'Processing...' : <><Sparkles className="w-4 h-4" /> Create Magic</>}
            </button>
            <button
              onClick={() => handleGenerate('refine')}
              disabled={loading || !textInput}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-6 rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:border-slate-300"
            >
              <RefreshCw className="w-4 h-4" /> Refine Draft
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-800 text-sm animate-in fade-in slide-in-from-top-2 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <p>{error}</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Output & Visualization */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-6">
            
            {loading ? (
              <div className="h-[600px] glass-panel rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-8 animate-pulse bg-white">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
                  <div className="w-24 h-24 border-4 border-t-indigo-600 rounded-full animate-spin absolute inset-0"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-indigo-500 animate-bounce" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Crafting Your Post</h3>
                  <p className="text-indigo-600 font-medium bg-indigo-50 px-4 py-1.5 rounded-full inline-block text-sm border border-indigo-100">
                    {MOCK_LOADING_STEPS[loadingStep]}
                  </p>
                </div>
              </div>
            ) : result ? (
              <>
                {/* Result Card */}
                <div className="glass-panel rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ring-1 ring-black/5">
                  {/* Top Bar: Score & Content */}
                  <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100">
                    <div className="md:col-span-2 p-6 md:p-8 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                           <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                           LinkedIn Preview
                        </h3>
                        <div className="flex gap-2">
                           <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-200">Optimized</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative group transition-colors hover:border-indigo-200 hover:bg-indigo-50/10">
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={handleCopy} className="p-2 bg-white shadow-sm border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all" title="Copy text">
                             {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap text-slate-800 leading-relaxed text-sm md:text-base font-sans">
                          {result.caption}
                        </p>
                        <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
                           <p className="text-indigo-600 text-sm font-semibold">
                             {result.suggestedHashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')}
                           </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-center">
                        <p className="text-xs text-slate-400 font-medium">Generated with Gemini 2.5 Flash</p>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all shadow-md"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy Post'}
                        </button>
                      </div>
                    </div>
                    
                    {/* Score Gauge */}
                    <div className="p-6 md:p-8 bg-slate-50 border-l border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider z-10">Viral Potential</h4>
                      <div className="scale-110 z-10">
                         <ScoreChart score={result.seoScore} />
                      </div>
                      <div className="mt-4 text-center z-10">
                        <p className="text-xs text-slate-500">Based on engagement metrics</p>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="p-6 bg-indigo-50/50 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Why this works
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.critique.map((point, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                          <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                          </div>
                          <span className="leading-snug">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Empty State
              <div className="h-[600px] border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-white/50 hover:bg-white transition-all">
                 <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                    <div className="absolute inset-0 rounded-full bg-white opacity-50 blur-xl"></div>
                    <Sparkles className="w-12 h-12 text-slate-300 relative z-10" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Optimize</h3>
                 <p className="text-slate-500 max-w-sm mt-2 text-base leading-relaxed">
                   Upload your media or paste a draft to generate a high-performing LinkedIn post tailored to your brand voice.
                 </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;