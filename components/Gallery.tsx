import React, { useState, useEffect } from 'react';
import { Download, Copy, Trash2, Clock, Image as ImageIcon, ExternalLink, RefreshCw, AlertCircle, Hash } from 'lucide-react';
import { GenerationResult } from '../types';

interface GalleryProps {
  currentImage: string | null;
  currentSeed: number | null;
  history: GenerationResult[];
  loading: boolean;
  error: string | null;
  onSelectHistory: (item: GenerationResult) => void;
  onClearHistory: () => void;
}

// Sub-component to handle individual image loading states with retry logic
const ImageWithFallback: React.FC<{ src: string; alt: string; className?: string; isThumbnail?: boolean }> = ({ src, alt, className, isThumbnail }) => {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setError(false);
    setRetryCount(0);
    setIsLoading(true);
    
    // Add cache buster only if it's not a thumbnail (history items are static)
    // and if the URL doesn't already have query params
    let finalSrc = src;
    if (!isThumbnail && !src.includes('?')) {
       finalSrc = `${src}?t=${Date.now()}`;
    }
    setImgSrc(finalSrc);
  }, [src, isThumbnail]);

  const handleError = () => {
    if (!isThumbnail && retryCount < 3) {
      console.log(`Image load failed, retrying (${retryCount + 1}/3)...`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImgSrc(`${src}?retry=${retryCount}&t=${Date.now()}`);
      }, 1500);
    } else {
      setIsLoading(false);
      setError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className={`${className} bg-zinc-900 border border-red-900/30 flex flex-col items-center justify-center p-2 text-center`}>
        <ImageIcon className={`text-zinc-700 ${isThumbnail ? 'w-6 h-6' : 'w-12 h-12 mb-2'}`} />
        {!isThumbnail && (
          <>
            <p className="text-zinc-500 text-sm mb-2">Failed to load image</p>
            <a 
              href={src} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 text-xs hover:text-blue-400 flex items-center gap-1"
            >
              Open Link <ExternalLink className="w-3 h-3" />
            </a>
          </>
        )}
        {isThumbnail && <span className="text-[8px] text-zinc-600">Error</span>}
      </div>
    );
  }

  return (
    <div className="relative contents">
      <img 
        src={imgSrc} 
        alt={alt} 
        className={`${className} ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'} transition-all duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
    </div>
  );
};

const Gallery: React.FC<GalleryProps> = ({ currentImage, currentSeed, history, loading, error, onSelectHistory, onClearHistory }) => {
  
  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `darkgen-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download image", err);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
      {/* Main Display Area */}
      <div className="flex-1 p-6 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 z-10">
             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-blue-400 font-mono animate-pulse">Constructing visuals...</p>
          </div>
        ) : error ? (
          <div className="max-w-md w-full bg-zinc-900/90 border border-red-900/50 rounded-lg p-6 flex flex-col items-center text-center shadow-2xl backdrop-blur-sm">
             <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
             <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
             <p className="text-zinc-400 text-sm">{error}</p>
          </div>
        ) : currentImage ? (
          <div className="relative group max-h-full max-w-full flex justify-center shadow-2xl shadow-blue-900/10">
            <ImageWithFallback 
              key={currentImage}
              src={currentImage} 
              alt="Generated Result" 
              className="max-h-[80vh] max-w-full object-contain border border-zinc-800 rounded-sm"
            />
            
            {/* Image Overlay with Actions & Info */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {currentSeed !== null && (
                <div className="bg-black/80 text-zinc-300 px-3 py-1.5 rounded backdrop-blur-md border border-zinc-700 flex items-center gap-2 text-xs font-mono shadow-lg mb-1">
                  <Hash className="w-3 h-3 text-blue-500" />
                  Seed: {currentSeed}
                </div>
              )}
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(currentImage, Date.now().toString())}
                  className="bg-black/80 hover:bg-blue-600 text-white p-2 rounded backdrop-blur-md border border-zinc-700 transition-colors shadow-lg"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <a 
                  href={currentImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/80 hover:bg-blue-600 text-white p-2 rounded backdrop-blur-md border border-zinc-700 transition-colors shadow-lg"
                  title="Open in New Tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-zinc-600 flex flex-col items-center">
            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
            <p>Ready to generate</p>
          </div>
        )}
      </div>

      {/* History Strip */}
      <div className="h-48 bg-zinc-950 border-t border-zinc-800 shrink-0 flex flex-col">
        <div className="px-4 py-2 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 z-10">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Recent Generations</span>
          </div>
          {history.length > 0 && (
             <button 
               onClick={onClearHistory}
               className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-900/10 transition-colors"
             >
               <Trash2 className="w-3 h-3" /> Clear
             </button>
          )}
        </div>
        
        <div className="flex-1 overflow-x-auto p-4 flex gap-4 custom-scrollbar">
          {history.length === 0 ? (
            <div className="w-full flex items-center justify-center text-zinc-700 text-sm italic">
              No history yet. Create something amazing.
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectHistory(item)}
                className="relative shrink-0 w-32 group cursor-pointer"
              >
                <ImageWithFallback 
                  src={item.url} 
                  alt={item.params.prompt.substring(0, 20)} 
                  isThumbnail={true}
                  className="w-32 h-32 object-cover rounded border border-zinc-800 group-hover:border-blue-500 transition-colors"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Copy className="w-6 h-6 text-white" />
                </div>
                <div className="mt-1 text-[10px] text-zinc-500 truncate">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;