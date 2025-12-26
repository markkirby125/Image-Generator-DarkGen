import React, { useState } from 'react';
import { Key, Lock, Loader2, AlertCircle, X } from 'lucide-react';
import { verifyApiKey } from '../services/modelsLabService';

interface KeyModalProps {
  onSuccess: (key: string) => void;
  onClose?: () => void;
  selectedModelId?: string;
}

const KeyModal: React.FC<KeyModalProps> = ({ onSuccess, onClose, selectedModelId }) => {
  const [inputKey, setInputKey] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setVerifying(true);
    setError(null);

    const result = await verifyApiKey(inputKey, selectedModelId);

    if (result.success) {
      onSuccess(inputKey);
    } else {
      setError(result.error || "Invalid API Key or connection failed. Please check your key.");
    }
    setVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-8 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-zinc-400 text-center text-sm">
            Please enter your ModelsLab API Key to proceed with generation.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter API Key"
              className="w-full bg-black border border-zinc-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-600"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="break-words">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={verifying || !inputKey}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Unlock & Generate"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a 
            href="https://modelslab.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Don't have a key? Get one at ModelsLab
          </a>
        </div>
      </div>
    </div>
  );
};

export default KeyModal;