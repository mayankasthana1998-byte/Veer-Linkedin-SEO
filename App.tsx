import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Send, RefreshCw, Copy, Check, AlertCircle, Sparkles } from 'lucide-react';
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
      setFile(e.target.files[0]);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Input & Config */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="text-indigo-400" /> Content Input
            </h2>
            
            {/* File Upload Area */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Upload Image or PDF (Optional)
              </label>
              {!file ? (
                <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 hover:border-indigo-500 transition-colors group cursor-pointer bg-slate-900/50">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-indigo-400" />
                    </div>
                    <p className="text-sm text-slate-300 font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF (Max 10MB)</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <button onClick={removeFile} className="text-slate-400 hover:text-red-400 text-xs font-medium">Remove</button>
                </div>
              )}
            </div>

            {/* Text Input Area */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Caption / Context Notes
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Paste your rough draft here, or simply describe what you want the post to be about..."
              />
            </div>
          </div>

          <ConfigurationPanel config={config} setConfig={setConfig} />

          <div className="flex gap-4">
            <button
              onClick={() => handleGenerate('create')}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Thinking...' : <><Send className="w-4 h-4" /> Create New</>}
            </button>
            <button
              onClick={() => handleGenerate('refine')}
              disabled={loading || !textInput}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl border border-slate-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refine Draft
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Output & Visualization */}
        <div className="lg:col-span-7">
          <div className="sticky top-28 space-y-6">
            
            {loading ? (
              <div className="h-[600px] bg-slate-800/40 border border-slate-700 rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-6 animate-pulse">
                <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Optimizing Content</h3>
                  <p className="text-indigo-300 font-medium">{MOCK_LOADING_STEPS[loadingStep]}</p>
                </div>
              </div>
            ) : result ? (
              <>
                {/* Result Card */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                  {/* Top Bar: Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-700">
                    <div className="md:col-span-2 p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Optimized Caption</h3>
                      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                        <p className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm md:text-base font-sans">
                          {result.caption}
                        </p>
                        <div className="mt-6 pt-4 border-t border-slate-700/50">
                           <p className="text-indigo-400 text-sm font-medium">
                             {result.suggestedHashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')}
                           </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 rounded-lg text-sm font-medium transition-colors border border-indigo-500/20"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                      </div>
                    </div>
                    
                    {/* Score Gauge */}
                    <div className="p-6 bg-slate-900/30 border-l border-slate-700 flex flex-col items-center justify-center">
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Algorithm Score</h4>
                      <ScoreChart score={result.seoScore} />
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="p-6 bg-indigo-900/10">
                    <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-3">AI Analysis & Why This Works</h4>
                    <ul className="space-y-2">
                      {result.critique.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              // Empty State
              <div className="h-[500px] border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center p-8 opacity-50">
                 <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-slate-500" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-300">Ready to Optimize</h3>
                 <p className="text-slate-500 max-w-sm mt-2">
                   Upload your media or paste a draft to generate a high-performing LinkedIn post tailored to your brand.
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