import React from 'react';
import { GenerationConfig, PostPurpose, PostTone, PostFormat } from '../types';
import { PURPOSE_OPTIONS, TONE_OPTIONS, FORMAT_OPTIONS } from '../constants';
import { Settings2, Target, Type, MapPin, Building2, Palette } from 'lucide-react';

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

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Strategy Configuration</h3>
      </div>

      {/* Target & Niche */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Target className="w-4 h-4" /> Target Audience
          </label>
          <input
            type="text"
            value={config.targetAudience}
            onChange={(e) => handleChange('targetAudience', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. CTOs, Founders"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Niche / Industry
          </label>
          <input
            type="text"
            value={config.niche}
            onChange={(e) => handleChange('niche', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. SaaS, FinTech"
          />
        </div>
      </div>

      {/* Purpose & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Goal / Purpose</label>
          <select
            value={config.purpose}
            onChange={(e) => handleChange('purpose', e.target.value as PostPurpose)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {PURPOSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Voice / Tone</label>
          <select
            value={config.tone}
            onChange={(e) => handleChange('tone', e.target.value as PostTone)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {TONE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      {/* Geo & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
             <MapPin className="w-4 h-4" /> Geography
          </label>
          <input
            type="text"
            value={config.geoDemographics}
            onChange={(e) => handleChange('geoDemographics', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. North America, India"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Type className="w-4 h-4" /> Language
          </label>
          <input
            type="text"
            value={config.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. English, Spanish"
          />
        </div>
      </div>

      {/* Formatting Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300">Formatting Styles</label>
        <div className="flex flex-wrap gap-2">
          {FORMAT_OPTIONS.map(fmt => (
            <button
              key={fmt}
              onClick={() => toggleFormat(fmt)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                config.formatStyles.includes(fmt)
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-indigo-500/50'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Guidelines */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Brand Guidelines (Optional)
        </label>
        <textarea
          value={config.brandGuidelines}
          onChange={(e) => handleChange('brandGuidelines', e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
          placeholder="Paste brand voice rules, prohibited words, or specific company terminology here..."
        />
      </div>
    </div>
  );
};

export default ConfigurationPanel;
