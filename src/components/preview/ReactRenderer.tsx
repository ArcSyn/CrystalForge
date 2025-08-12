import { useState, useEffect } from 'react';
import { Eye, Code, Copy, Check, Edit, Save, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactRendererProps {
  code: string;
  className?: string;
  onCodeUpdate?: (newCode: string) => void;
}

// Pre-built component templates that we know work
const SAMPLE_COMPONENTS = {
  Hero: () => (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-xl">
      <h1 className="text-4xl font-bold mb-4">Hero Section</h1>
      <p className="text-lg mb-6">Your generated component will appear here</p>
      <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
        Get Started
      </button>
    </div>
  ),
  
  Card: ({ title = "Card Title", description = "Card description" }: { title?: string; description?: string }) => (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
      <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
        Learn More
      </button>
    </div>
  ),
  
  Button: ({ children = "Click Me", variant = "primary", size = "md", onClick }: { children?: string; variant?: string; size?: string; onClick?: () => void }) => {
    const variants = {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white',
      secondary: 'bg-zinc-700 hover:bg-zinc-600 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    return (
      <button
        onClick={onClick}
        className={`${variants[variant as keyof typeof variants] || variants.primary} ${sizes[size as keyof typeof sizes] || sizes.md} font-medium rounded-lg transition-all duration-200 active:scale-95`}
      >
        {children}
      </button>
    );
  }
};

export function ReactRenderer({ code: initialCode, className = '', onCodeUpdate }: ReactRendererProps) {
  const [code, setCode] = useState(initialCode);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(initialCode);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [componentProps, setComponentProps] = useState<Record<string, any>>({
    children: "Click Me",
    title: "Sample Title",
    description: "Sample description text",
    variant: "primary",
    size: "md"
  });

  useEffect(() => {
    setCode(initialCode);
    setEditedCode(initialCode);
  }, [initialCode]);

  // Detect component type from code
  const detectComponentType = (): keyof typeof SAMPLE_COMPONENTS => {
    const codeLower = code.toLowerCase();
    if (codeLower.includes('hero') || codeLower.includes('banner')) return 'Hero';
    if (codeLower.includes('card') || codeLower.includes('tile')) return 'Card';
    if (codeLower.includes('button') || codeLower.includes('btn')) return 'Button';
    return 'Hero'; // Default
  };

  const componentType = detectComponentType();
  const ComponentToRender = SAMPLE_COMPONENTS[componentType] || SAMPLE_COMPONENTS.Hero;

  const handleSaveEdit = () => {
    setCode(editedCode);
    setIsEditing(false);
    if (onCodeUpdate) {
      onCodeUpdate(editedCode);
    }
  };

  const handleCancelEdit = () => {
    setEditedCode(code);
    setIsEditing(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract component name
  const getComponentName = () => {
    const match = code.match(/(?:const|function|class)\s+(\w+)/);
    return match?.[1] || 'Component';
  };

  const componentName = getComponentName();

  return (
    <div className={`${className} bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-purple-500/20 overflow-hidden`}>
      {/* Header */}
      <div className="bg-zinc-800/50 border-b border-zinc-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-zinc-300">Component Preview</span>
          <span className="text-xs text-zinc-500">({componentName})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`p-1.5 rounded transition-colors ${
              showCode 
                ? 'bg-purple-600 text-white' 
                : 'hover:bg-zinc-700 text-zinc-400'
            }`}
            title="Toggle code view"
          >
            <Code className="w-4 h-4" />
          </button>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
              title="Edit code"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={copyCode}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex h-[600px]">
        {/* Code Editor Panel */}
        <AnimatePresence>
          {(showCode || isEditing) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: showCode || isEditing ? '50%' : 0, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-zinc-700 bg-black/50"
            >
              {isEditing ? (
                <div className="h-full flex flex-col">
                  <div className="p-2 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Editing {componentName}.tsx</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    className="flex-1 p-4 bg-black text-emerald-300 font-mono text-sm resize-none focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <pre className="p-4 text-sm text-emerald-300 font-mono">
                    <code>{code}</code>
                  </pre>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Panel */}
        <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-zinc-900 to-zinc-800">
          <div className="h-full flex flex-col items-center justify-center">
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-400">
                  <p className="font-medium mb-1">Simplified Preview Mode</p>
                  <p className="text-xs text-yellow-400/80">
                    Showing a representative component based on your generated code.
                    Copy the code to use in your project for full functionality.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-2xl">
              <ComponentToRender {...componentProps} />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-zinc-500 mb-2">Detected component type: {componentType}</p>
              <p className="text-xs text-zinc-600">
                The actual component uses your generated code above
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Props Control Panel */}
      <div className="border-t border-zinc-700 bg-zinc-800/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Component Props (Sample)</span>
          <button
            onClick={() => setComponentProps({
              children: "Click Me",
              title: "Sample Title",
              description: "Sample description text",
              variant: "primary",
              size: "md"
            })}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            Reset Props
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={componentProps.children || ''}
            placeholder="children"
            className="px-3 py-1 bg-black/30 border border-zinc-700 rounded text-sm text-white"
            onChange={(e) => setComponentProps({ ...componentProps, children: e.target.value })}
          />
          <input
            type="text"
            value={componentProps.title || ''}
            placeholder="title"
            className="px-3 py-1 bg-black/30 border border-zinc-700 rounded text-sm text-white"
            onChange={(e) => setComponentProps({ ...componentProps, title: e.target.value })}
          />
          <input
            type="text"
            value={componentProps.description || ''}
            placeholder="description"
            className="px-3 py-1 bg-black/30 border border-zinc-700 rounded text-sm text-white"
            onChange={(e) => setComponentProps({ ...componentProps, description: e.target.value })}
          />
          <select
            value={componentProps.variant || ''}
            className="px-3 py-1 bg-black/30 border border-zinc-700 rounded text-sm text-white"
            onChange={(e) => setComponentProps({ ...componentProps, variant: e.target.value })}
          >
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="danger">danger</option>
          </select>
          <select
            value={componentProps.size || ''}
            className="px-3 py-1 bg-black/30 border border-zinc-700 rounded text-sm text-white"
            onChange={(e) => setComponentProps({ ...componentProps, size: e.target.value })}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
      </div>
    </div>
  );
}
