
import React, { useState, useEffect } from 'react';
import { DEFAULT_PARAMS } from './constants';
import { GenerationParams, GenerationResult } from './types';
import { generateImage } from './services/modelsLabService';
import KeyModal from './components/KeyModal';
import Controls from './components/Controls';
import Gallery from './components/Gallery';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [params, setParams] = useState<GenerationParams>(DEFAULT_PARAMS);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize: Load key and history from localStorage
  useEffect(() => {
    const storedKey = localStorage.getItem('modelslab_api_key');
    if (storedKey) setApiKey(storedKey);

    const storedHistory = localStorage.getItem('darkgen_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleKeySuccess = (key: string) => {
    setApiKey(key);
    localStorage.setItem('modelslab_api_key', key);
    setShowAuthModal(false);
  };

  const updateHistory = (newHistory: GenerationResult[]) => {
    setHistory(newHistory);
    localStorage.setItem('darkgen_history', JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setShowAuthModal(true);
      return;
    }
    
    // Clear previous state to prevent ghosting or stale images
    setCurrentImage(null);
    setCurrentSeed(null);
    setLoading(true);
    setError(null);

    try {
      const result = await generateImage(apiKey, params);
      
      if (result.images && result.images.length > 0) {
        const resultUrl = result.images[0];
        setCurrentImage(resultUrl);
        setCurrentSeed(result.seed);

        // NOTE: We do NOT update params.seed here anymore. 
        // If the user left it null (random), it stays null for the next run.
        // If the user set a specific number, it stays that number.

        const newItem: GenerationResult = {
          id: Date.now().toString(),
          url: resultUrl,
          // Store the params used for this specific generation, INCLUDING the resolved seed
          params: { ...params, seed: result.seed },
          // Store meta from server (including enhanced prompt if any) for record keeping
          meta: result.meta,
          timestamp: Date.now()
        };

        const newHistory = [newItem, ...history].slice(0, 10); // Keep last 10
        updateHistory(newHistory);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard Shortcut Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt + Enter
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        // Only trigger if not already loading
        if (!loading) {
          handleGenerate();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, apiKey, params]); // Dependencies ensure we have fresh state when triggered

  const handleSelectHistory = (item: GenerationResult) => {
    // When selecting history, we restore the prompt AND the seed used for that image
    setParams(item.params);
    setCurrentImage(item.url);
    setCurrentSeed(item.params.seed);
    setError(null);
  };

  const handleClearHistory = () => {
    // Immediate action, no confirm needed for smoother UX
    updateHistory([]);
    if (!loading) {
      setCurrentImage(null);
      setCurrentSeed(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-blue-500/30 relative">
      
      {showAuthModal && (
        <KeyModal 
          onSuccess={handleKeySuccess} 
          onClose={() => setShowAuthModal(false)}
          selectedModelId={params.model_id}
        />
      )}

      {/* Sidebar Controls */}
      <Controls 
        params={params} 
        onChange={setParams} 
        onSubmit={handleGenerate}
        loading={loading}
      />

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col min-w-0">
        {/* Top Bar for Mobile/Global messages */}
        <div className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 justify-between shrink-0">
           <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
             DarkGen <span className="text-blue-600 font-normal text-xs align-top">STUDIO</span>
           </h1>
           <div className="flex items-center gap-4">
             {apiKey && (
               <button 
                 onClick={() => {
                   setApiKey(null);
                   localStorage.removeItem('modelslab_api_key');
                 }}
                 className="text-xs text-zinc-500 hover:text-white transition-colors"
               >
                 Logout
               </button>
             )}
             {!apiKey && (
                <button 
                onClick={() => setShowAuthModal(true)}
                className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                Login
              </button>
             )}
           </div>
        </div>

        {/* Gallery Area */}
        <Gallery 
          currentImage={currentImage}
          currentSeed={currentSeed}
          history={history}
          loading={loading}
          error={error}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
};

export default App;
