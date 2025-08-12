import React, { useState } from 'react';
import { ChevronDown, Cpu, Sparkles, TestTube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'ollama' | 'test' | 'claude';
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  models?: ModelOption[];
}

const defaultModels: ModelOption[] = [
  {
    id: 'codellama:13b-instruct',
    name: 'CodeLlama 13B',
    provider: 'ollama',
    description: 'Fast local generation',
    icon: <Cpu className="size-4" />,
    available: true
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'claude',
    description: 'Most capable (coming soon)',
    icon: <Sparkles className="size-4" />,
    available: false
  },
  {
    id: 'test-mode',
    name: 'Test Mode',
    provider: 'test',
    description: 'Mock responses for testing',
    icon: <TestTube className="size-4" />,
    available: true
  }
];

export function ModelSelector({ 
  selectedModel, 
  onModelChange, 
  models = defaultModels 
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  
  const handleSelect = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model?.available) {
      onModelChange(modelId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          {currentModel.icon}
          <div className="text-left">
            <div className="text-sm font-medium text-white">{currentModel.name}</div>
            <div className="text-xs text-zinc-500">{currentModel.provider}</div>
          </div>
        </div>
        <ChevronDown className={`size-4 text-zinc-400 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-72 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 py-1">
                  Available Models
                </div>
                
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelect(model.id)}
                    disabled={!model.available}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      model.available
                        ? model.id === selectedModel
                          ? 'bg-purple-600/20 border border-purple-500/50'
                          : 'hover:bg-zinc-700'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${
                        model.available ? 'text-purple-400' : 'text-zinc-600'
                      }`}>
                        {model.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            model.available ? 'text-white' : 'text-zinc-500'
                          }`}>
                            {model.name}
                          </span>
                          {!model.available && (
                            <span className="text-xs bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded">
                              Soon
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {model.description}
                        </div>
                        <div className="text-xs text-zinc-600 mt-1">
                          Provider: {model.provider}
                        </div>
                      </div>
                      {model.id === selectedModel && (
                        <div className="text-purple-400">✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="border-t border-zinc-700 p-3 bg-zinc-900/50">
                <div className="text-xs text-zinc-500">
                  💡 Tip: CodeLlama runs locally via Ollama for fast, private generation
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
