import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  Copy, 
  Trash2, 
  Code, 
  Calendar,
  Tag,
  Save,
  FolderOpen,
  Plus
} from 'lucide-react';
import { componentManager, type SavedComponent } from '@/services/componentManager';
import { useCrystalStore } from '@/stores/crystalStore';

export function ComponentLibrary() {
  const [components, setComponents] = useState<SavedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<SavedComponent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [componentName, setComponentName] = useState('');
  
  const { lastGeneration } = useCrystalStore();

  // Load components on mount
  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setIsLoading(true);
    try {
      const loaded = await componentManager.loadComponents();
      setComponents(loaded);
    } catch (error) {
      console.error('Failed to load components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCurrentGeneration = async () => {
    if (!lastGeneration || !componentName.trim()) return;
    
    try {
      const saved = await componentManager.saveComponent(
        componentName,
        lastGeneration.code,
        lastGeneration.explanation || 'Generated component',
        'amethyst'
      );
      
      // Reload components
      await loadComponents();
      setShowSaveDialog(false);
      setComponentName('');
      
      // Select the newly saved component
      setSelectedComponent(saved);
    } catch (error) {
      console.error('Failed to save component:', error);
    }
  };

  const handleCopyCode = async (component: SavedComponent) => {
    await navigator.clipboard.writeText(component.code);
    setCopiedId(component.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteComponent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return;
    
    try {
      await componentManager.deleteComponent(id);
      await loadComponents();
      if (selectedComponent?.id === id) {
        setSelectedComponent(null);
      }
    } catch (error) {
      console.error('Failed to delete component:', error);
    }
  };

  const filteredComponents = searchQuery
    ? components.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
      )
    : components;

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="size-6 text-purple-400" />
            Component Library
          </h2>
          
          {lastGeneration && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Save className="size-4" />
              Save Last Generation
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components by name, description, or tags..."
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Components List */}
        <div className="w-1/3 border-r border-zinc-800 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-zinc-500">
              Loading components...
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="p-6 text-center">
              <FolderOpen className="size-12 mx-auto mb-3 text-zinc-600" />
              <p className="text-zinc-500">No components found</p>
              <p className="text-sm text-zinc-600 mt-1">
                {searchQuery ? 'Try a different search' : 'Generate and save some components'}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredComponents.map((component) => (
                <motion.button
                  key={component.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedComponent(component)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                    selectedComponent?.id === component.id
                      ? 'bg-purple-600/20 border border-purple-500/50'
                      : 'bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800'
                  }`}
                >
                  <div className="font-medium text-white mb-1">{component.name}</div>
                  <div className="text-xs text-zinc-400 line-clamp-2 mb-2">
                    {component.description}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Calendar className="size-3" />
                    {new Date(component.timestamp).toLocaleDateString()}
                    <span className="ml-auto text-purple-400">{component.crystal}</span>
                  </div>
                  {component.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {component.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Component Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedComponent ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedComponent.name}
                </h3>
                <p className="text-zinc-400">{selectedComponent.description}</p>
                
                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleCopyCode(selectedComponent)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                  >
                    {copiedId === selectedComponent.id ? (
                      <>✓ Copied!</>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        Copy Code
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteComponent(selectedComponent.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg transition-colors"
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </button>
                </div>
                
                {/* Tags */}
                {selectedComponent.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-4">
                    <Tag className="size-4 text-zinc-500" />
                    <div className="flex flex-wrap gap-1">
                      {selectedComponent.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Code Display */}
              <div className="bg-black/50 rounded-lg border border-zinc-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Code className="size-4 text-purple-400" />
                    <span className="text-sm text-zinc-300">{selectedComponent.fileName}</span>
                  </div>
                  <span className="text-xs text-zinc-500">TypeScript + React</span>
                </div>
                <pre className="p-4 text-sm text-zinc-300 overflow-x-auto">
                  <code>{selectedComponent.code}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <Package className="size-16 mx-auto mb-4 opacity-50" />
                <p>Select a component to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-800 border border-purple-500/30 rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Save Component</h3>
              <input
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="Enter component name..."
                className="w-full px-4 py-2 bg-black/30 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 mb-4"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveCurrentGeneration}
                  disabled={!componentName.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Plus className="size-4 inline mr-2" />
                  Save Component
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
