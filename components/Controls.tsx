
import React from 'react';
import { Settings2, Wand2, RefreshCw, Dices, X, Palette, Ban, Gauge } from 'lucide-react';
import { GenerationParams, ModelCapabilities } from '../types';
import { AVAILABLE_MODELS, ASPECT_RATIOS, STYLE_MODIFIERS, NEGATIVE_PROMPT_PRESETS, SCHEDULERS } from '../constants';

interface ControlsProps {
  params: GenerationParams;
  onChange: (params: GenerationParams) => void;
  onSubmit: () => void;
  loading: boolean;
}

const Controls: React.FC<ControlsProps> = ({ params, onChange, onSubmit, loading }) => {
  
  const updateParam = <K extends keyof GenerationParams>(key: K, value: GenerationParams[K]) => {
    onChange({ ...params, [key]: value });
  };

  const handleAspectRatio = (width: number, height: number) => {
    onChange({ ...params, width, height });
  };

  const handleNegativePreset = (presetKey: string) => {
    if (presetKey === "None") return;
    
    // Pick a random variation from the preset list to add variety
    const options = NEGATIVE_PROMPT_PRESETS[presetKey as keyof typeof NEGATIVE_PROMPT_PRESETS];
    if (options && options.length > 0) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      updateParam('negative_prompt', randomOption);
    }
  };

  const selectedModel = AVAILABLE_MODELS.find(m => m.id === params.model_id);
  const showOption = (key: keyof ModelCapabilities) => selectedModel?.capabilities?.[key] ?? true;

  // Format the style keys for display (e.g., "sci_fi" -> "Sci Fi")
  const styleOptions = ["None", ...Object.keys(STYLE_MODIFIERS)];
  const formatLabel = (key: string) => {
    if (key === "None") return "None";
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };
  
  const negPresetOptions = ["None", ...Object.keys(NEGATIVE_PROMPT_PRESETS)];

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800 w-full lg:w-80 shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-2 sticky top-0 bg-zinc-900 z-10">
        <Settings2 className="w-5 h-5 text-blue-500" />
        <h2 className="font-semibold text-white">Parameters</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Model</label>
          <select
            value={params.model_id}
            onChange={(e) => updateParam('model_id', e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-md p-2 text-sm text-zinc-200 focus:border-blue-500 outline-none"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Prompts */}
        <div className="space-y-2">
          <label htmlFor="prompt-input" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Prompt</label>
          <textarea
            id="prompt-input"
            name="gen_prompt"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            value={params.prompt}
            onChange={(e) => updateParam('prompt', e.target.value)}
            rows={4}
            className="w-full bg-black border border-zinc-700 rounded-md p-2 text-sm text-zinc-200 focus:border-blue-500 outline-none resize-none"
            placeholder="Describe your image..."
          />
        </div>

        {/* Style Modifier */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3 h-3" /> Style Modifier
          </label>
          <select
            value={params.style_modifier || "None"}
            onChange={(e) => updateParam('style_modifier', e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-md p-2 text-sm text-zinc-200 focus:border-blue-500 outline-none"
          >
            {styleOptions.map((style) => (
              <option key={style} value={style}>{formatLabel(style)}</option>
            ))}
          </select>
        </div>

        {showOption('negativePrompt') && (
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label htmlFor="neg-prompt-input" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Negative Prompt</label>
            </div>
            
            {/* Negative Prompt Preset */}
            <div className="flex items-center gap-2 mb-2">
               <Ban className="w-3 h-3 text-red-400" />
               <select
                onChange={(e) => handleNegativePreset(e.target.value)}
                defaultValue="None"
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-400 focus:border-red-900 focus:text-zinc-200 outline-none"
              >
                <option value="None" disabled>Select Preset (Overwrites below)</option>
                {negPresetOptions.filter(o => o !== "None").map((preset) => (
                  <option key={preset} value={preset}>{formatLabel(preset)}</option>
                ))}
              </select>
            </div>

            <textarea
              id="neg-prompt-input"
              name="gen_negative_prompt"
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              value={params.negative_prompt}
              onChange={(e) => updateParam('negative_prompt', e.target.value)}
              rows={3}
              className="w-full bg-black border border-zinc-700 rounded-md p-2 text-sm text-zinc-200 focus:border-red-900/50 outline-none resize-none"
              placeholder="What to avoid..."
            />
          </div>
        )}

        {/* Aspect Ratio */}
        {showOption('aspectRatio') && (
          <div className="space-y-2">
             <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Aspect Ratio</label>
             <div className="grid grid-cols-3 gap-2">
               {ASPECT_RATIOS.map((ratio) => (
                 <button
                   key={ratio.label}
                   onClick={() => handleAspectRatio(ratio.width, ratio.height)}
                   className={`p-2 text-xs rounded border transition-colors ${
                     params.width === ratio.width && params.height === ratio.height
                       ? 'bg-blue-900/30 border-blue-500 text-blue-400'
                       : 'bg-black border-zinc-700 text-zinc-400 hover:border-zinc-500'
                   }`}
                 >
                   {ratio.label.split(' ')[1]}
                 </button>
               ))}
             </div>
             <div className="flex gap-2 text-xs text-zinc-500">
               <span>W: {params.width}</span>
               <span>H: {params.height}</span>
             </div>
          </div>
        )}

        {/* Sliders */}
        {(showOption('steps') || showOption('guidance')) && (
          <div className="space-y-4">
            {showOption('steps') && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Steps</span>
                  <span>{params.num_inference_steps}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={params.num_inference_steps}
                  onChange={(e) => updateParam('num_inference_steps', parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}

            {showOption('guidance') && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Guidance Scale</span>
                  <span>{params.guidance_scale}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={params.guidance_scale}
                  onChange={(e) => updateParam('guidance_scale', parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>
        )}

        {/* Scheduler */}
        {showOption('scheduler') && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3 h-3" /> Scheduler
            </label>
            <select
              value={params.scheduler || "DPMSolverMultistepScheduler"}
              onChange={(e) => updateParam('scheduler', e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-md p-2 text-sm text-zinc-200 focus:border-blue-500 outline-none"
            >
              {SCHEDULERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Toggles */}
        {showOption('enhancePrompt') && (
          <div className="flex items-center justify-between p-2 bg-black rounded border border-zinc-700">
            <span className="text-sm text-zinc-300">Enhance Prompt</span>
            <button
              onClick={() => updateParam('enhance_prompt', !params.enhance_prompt)}
              className={`w-10 h-5 rounded-full relative transition-colors ${params.enhance_prompt ? 'bg-blue-600' : 'bg-zinc-700'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${params.enhance_prompt ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        )}

         {/* Seed */}
         {showOption('seed') && (
           <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Seed</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={params.seed ?? ''}
                onChange={(e) => updateParam('seed', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Auto (Random)"
                className="w-full bg-black border border-zinc-700 rounded-md p-2 text-sm text-zinc-200 focus:border-blue-500 outline-none"
              />
              
              {params.seed !== null ? (
                <button 
                  onClick={() => updateParam('seed', null)}
                  className="p-2 bg-zinc-800 border border-zinc-700 rounded hover:bg-zinc-700 hover:text-red-400 transition-colors"
                  title="Clear Seed (Use Random)"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => updateParam('seed', Math.floor(Math.random() * 2147483647))}
                  className="p-2 bg-zinc-800 border border-zinc-700 rounded hover:bg-zinc-700 hover:text-blue-400 transition-colors"
                  title="Pick Random Seed"
                >
                  <Dices className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
         )}

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
             <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
             <Wand2 className="w-5 h-5" />
          )}
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
    </div>
  );
};

export default Controls;
