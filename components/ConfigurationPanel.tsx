import React from 'react';
import { GenerationConfig, PostPurpose, PostTone, PostFormat } from '../types';
import { PURPOSE_OPTIONS, TONE_OPTIONS, FORMAT_OPTIONS } from '../constants';
import { Settings2, Users, Palette, Type } from 'lucide-react';

interface ConfigurationPanelProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config, setConfig }) => {
  
  const handleChange = (field: keyof GenerationConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const toggleFormat = (format: PostFormat) => {
    const current = config.formatStyles;
    const next = current.includes(format)
      ? current.filter(f => f !== format)
      : [...current, format];
    handleChange('formatStyles', next);
  };

  // Separate Rich Text options from standard formatting
  const richTextOptions = [PostFormat.BoldItalics, PostFormat.UniqueFonts];
  const standardOptions = FORMAT_OPTIONS.filter(f => !richTextOptions.includes(f));

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <div className="p-1.5 bg-indigo-50 rounded-md">
          <Settings2 className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Strategy Configuration</h3>
      </div>

      <div className="p-5 space-y-8">
        
        {/* Section 1: Audience & Context */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3 h-3" /> Audience & Context
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Target Audience</label>
              <input
                type="text"
                value={config.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                className="input-field"
                placeholder="e.g. CTOs, Founders"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Niche / Industry</label>
              <input
                type="text"
                value={config.niche}
                onChange={(e) => handleChange('niche', e.target.value)}
                className="input-field"
                placeholder="e.g. SaaS, FinTech"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Geography</label>
              <input
                type="text"
                value={config.geoDemographics}
                onChange={(e) => handleChange('geoDemographics', e.target.value)}
                className="input-field"
                placeholder="e.g. USA, India, Global"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Language</label>
              <input
                type="text"
                value={config.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="input-field"
                placeholder="e.g. English (US)"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full"></div>

        {/* Section 2: Style & Format */}
        <div className="space-y-4">
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-3 h-3" /> Tone & Style
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Post Goal</label>
              <div className="relative">
                <select
                  value={config.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value as PostPurpose)}
                  className="input-field cursor-pointer"
                >
                  {PURPOSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Voice / Tone</label>
              <div className="relative">
                <select
                  value={config.tone}
                  onChange={(e) => handleChange('tone', e.target.value as PostTone)}
                  className="input-field cursor-pointer"
                >
                  {TONE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-600">Standard Formatting</label>
            <div className="flex flex-wrap gap-2">
              {standardOptions.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => toggleFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    config.formatStyles.includes(fmt)
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Rich Text Options - Highlighted */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <Type className="w-3 h-3 text-indigo-500" /> Rich Text Enhancements
            </label>
            <div className="grid grid-cols-2 gap-3">
              {richTextOptions.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => toggleFormat(fmt)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    config.formatStyles.includes(fmt)
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-200 ring-offset-1'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600'
                  }`}
                >
                  {fmt === PostFormat.BoldItalics && <span className="font-serif italic font-bold text-sm">B / I</span>}
                  {fmt === PostFormat.UniqueFonts && <span className="font-mono text-xs">𝓕𝓸𝓷𝓽𝓼</span>}
                  {fmt}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              Enable these to make your post stand out visually on the LinkedIn feed.
            </p>
          </div>
        </div>
        
        <div className="h-px bg-slate-100 w-full"></div>

        {/* Brand Guidelines */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
             Brand Guidelines (Optional)
          </label>
          <textarea
            value={config.brandGuidelines}
            onChange={(e) => handleChange('brandGuidelines', e.target.value)}
            className="input-field min-h-[80px] resize-none"
            placeholder="Paste brand voice rules, prohibited words, or specific company terminology here..."
          />
        </div>

      </div>
    </div>
  );
};

export default ConfigurationPanel;