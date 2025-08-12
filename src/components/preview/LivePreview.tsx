import { useState, useEffect, useMemo, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Code, Copy, Check, AlertCircle, Edit, Save, X } from 'lucide-react';
import * as Babel from '@babel/standalone';

interface LivePreviewProps {
  code: string;
  className?: string;
  onCodeUpdate?: (newCode: string) => void;
}

export function LivePreview({ code: initialCode, className = '', onCodeUpdate }: LivePreviewProps) {
  const [code, setCode] = useState(initialCode);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(initialCode);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [componentProps, setComponentProps] = useState<Record<string, any>>({});

  useEffect(() => {
    setCode(initialCode);
    setEditedCode(initialCode);
  }, [initialCode]);

  // Transform the code to be executable
  const transformCode = (sourceCode: string) => {
    try {
      // Remove imports and clean up the code
      let cleanCode = sourceCode
        .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '') // Remove imports
        .replace(/export\s+default\s+/g, '') // Remove export default
        .replace(/export\s+/g, ''); // Remove export
      
      // Remove TypeScript type annotations more aggressively
      cleanCode = cleanCode
        .replace(/:\s*React\.FC<.*?>/g, '') // Remove React.FC types
        .replace(/:\s*React\.FC/g, '')
        .replace(/interface\s+\w+Props\s*{[^}]*}/gs, '') // Remove interfaces
        .replace(/type\s+\w+\s*=\s*{[^}]*}/gs, ''); // Remove type definitions

      // Transform TypeScript to JavaScript
      const result = Babel.transform(cleanCode, {
        presets: ['react', ['typescript', { isTSX: true, allExtensions: true }]],
        filename: 'component.tsx'
      });

      return result.code;
    } catch (err: any) {
      console.error('Transform error:', err);
      setError(`Transform error: ${err.message}`);
      return null;
    }
  };

  // Create the component dynamically
  const DynamicComponent = useMemo(() => {
    setError(null);
    
    try {
      const transformedCode = transformCode(code);
      if (!transformedCode) return null;

      console.log('Transformed code:', transformedCode);

      // Extract component name from original code
      const componentMatch = code.match(/(?:const|function|class)\s+(\w+)/);
      const componentName = componentMatch?.[1];
      
      if (!componentName) {
        setError('Could not find component name in code');
        return null;
      }

      // Create a function that returns the component
      const componentFactory = new Function(
        'React', 'createElement', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef',
        `
        const { useState, useEffect, useCallback, useMemo, useRef } = React;
        
        // Mock lucide-react icons
        const createIcon = (name) => (props) => React.createElement('span', 
          { className: 'inline-flex items-center justify-center w-5 h-5 ' + (props?.className || ''), ...props }, 
          name
        );
        
        const Sparkles = createIcon('✨');
        const Code = createIcon('</>');
        const Eye = createIcon('👁');
        const Copy = createIcon('📋');
        const Check = createIcon('✓');
        const X = createIcon('✕');
        const AlertCircle = createIcon('⚠');
        const ChevronRight = createIcon('›');
        const ChevronDown = createIcon('▼');
        const Home = createIcon('🏠');
        const User = createIcon('👤');
        const Settings = createIcon('⚙');
        const Menu = createIcon('☰');
        const Plus = createIcon('+');
        const Minus = createIcon('-');
        const Search = createIcon('🔍');
        const Loader = createIcon('⟳');
        const Loader2 = createIcon('⟳');
        
        // Mock framer-motion
        const motion = {
          div: (props) => React.createElement('div', props),
          span: (props) => React.createElement('span', props),
          button: (props) => React.createElement('button', props),
          h1: (props) => React.createElement('h1', props),
          h2: (props) => React.createElement('h2', props),
          h3: (props) => React.createElement('h3', props),
          p: (props) => React.createElement('p', props),
          a: (props) => React.createElement('a', props),
        };
        
        const AnimatePresence = ({ children }) => children;
        
        ${transformedCode}
        
        // Return the component
        if (typeof ${componentName} !== 'undefined') {
          return ${componentName};
        }
        
        // Try to find any component
        const allKeys = Object.keys(this);
        for (const key of allKeys) {
          if (typeof this[key] === 'function' && key[0] === key[0].toUpperCase()) {
            return this[key];
          }
        }
        
        return null;
        `
      );

      const Component = componentFactory.call({}, 
        { createElement: () => null, useState: () => [null, () => {}], useEffect: () => {}, useCallback: (fn: any) => fn, useMemo: (fn: any) => fn(), useRef: () => ({ current: null }) },
        () => null, () => [null, () => {}], () => {}, (fn: any) => fn, (fn: any) => fn(), () => ({ current: null })
      );

      if (!Component) {
        console.error('Component not found. Available keys:', Object.keys({}));
        setError('No component found in code. Make sure your component is properly defined.');
        return null;
      }

      return Component;
    } catch (err: any) {
      console.error('Runtime error:', err);
      setError(`Runtime error: ${err.message}`);
      return null;
    }
  }, [code]);

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
          <span className="text-sm font-medium text-zinc-300">Live Preview</span>
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
          {error ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-400 font-medium mb-2">Preview Error</p>
                <p className="text-sm text-zinc-400">{error}</p>
                <div className="mt-4 p-3 bg-black/30 rounded text-left">
                  <p className="text-xs text-zinc-500 mb-2">Tips:</p>
                  <ul className="text-xs text-zinc-500 space-y-1">
                    <li>• Ensure your component is a valid React component</li>
                    <li>• Check for syntax errors in the code</li>
                    <li>• Remove any external dependencies</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : DynamicComponent ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <ErrorBoundary>
                  <DynamicComponent {...componentProps} />
                </ErrorBoundary>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 animate-pulse">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <p className="text-zinc-400">Loading component preview...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Props Control Panel */}
      <div className="border-t border-zinc-700 bg-zinc-800/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Component Props</span>
          <button
            onClick={() => setComponentProps({})}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            Reset Props
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Basic prop controls */}
          <input
            type="text"
            placeholder="children"
            className="px-3 py-1 bg-black/30 border border-zinc-700 rounded text-sm text-white"
            onChange={(e) => setComponentProps({ ...componentProps, children: e.target.value })}
          />
          <select
            className="px-3 py-1 bg-black/30 border border-zinc-700 rounded text-sm text-white"
            onChange={(e) => setComponentProps({ ...componentProps, variant: e.target.value })}
          >
            <option value="">variant</option>
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="danger">danger</option>
          </select>
          <select
            className="px-3 py-1 bg-black/30 border border-zinc-700 rounded text-sm text-white"
            onChange={(e) => setComponentProps({ ...componentProps, size: e.target.value })}
          >
            <option value="">size</option>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-medium mb-2">Component Error</p>
          <p className="text-sm text-zinc-400">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
