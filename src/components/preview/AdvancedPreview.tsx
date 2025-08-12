import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Code, Copy, Check, Edit, Save, X, 
  Maximize2, Minimize2, Download,
  Smartphone, Tablet, Monitor, Moon, Sun,
  Play, Pause, Share2
} from 'lucide-react';

interface AdvancedPreviewProps {
  code: string;
  className?: string;
  onCodeUpdate?: (newCode: string) => void;
}

export function AdvancedPreview({ code: initialCode, className = '', onCodeUpdate }: AdvancedPreviewProps) {
  const [code, setCode] = useState(initialCode);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(initialCode);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isPlaying, setIsPlaying] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setCode(initialCode);
    setEditedCode(initialCode);
  }, [initialCode]);

  // Create preview HTML with the component code
  const createPreviewHTML = () => {
    // Extract component name - look for various export patterns
    let componentName = 'Component';
    
    // Try different patterns to find the component name
    // Pattern 1: export default ComponentName (at the end)
    let match = code.match(/export\s+default\s+(\w+)\s*;?\s*$/m);
    if (match) {
      componentName = match[1];
    } else {
      // Pattern 2: export const/function ComponentName
      match = code.match(/export\s+(?:const|function)\s+(\w+)/);
      if (match) {
        componentName = match[1];
      } else {
        // Pattern 3: export default function ComponentName
        match = code.match(/export\s+default\s+function\s+(\w+)/);
        if (match) {
          componentName = match[1];
        } else {
          // Pattern 4: const/function ComponentName (followed by export default)
          match = code.match(/(?:const|function)\s+(\w+)\s*=?\s*(?:\([^)]*\)|\{)\s*(?:=>|\{)/m);
          if (match && code.includes(`export default ${match[1]}`)) {
            componentName = match[1];
          }
        }
      }
    }
    
    console.log('Extracted component name:', componentName);
    console.log('From code:', code.substring(0, 500));

    // Clean the code for execution
    const cleanCode = code
      .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '') // Remove imports
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '')
      .replace(/:\s*React\.FC<.*?>/g, '')
      .replace(/:\s*React\.FC/g, '')
      .replace(/interface\s+\w+Props\s*{[^}]*}/gs, '')
      .replace(/type\s+\w+\s*=\s*{[^}]*}/gs, '');

    return `<!DOCTYPE html>
<html lang="en" class="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${theme === 'dark' 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
      font-family: system-ui, -apple-system, sans-serif;
    }
    #root {
      width: 100%;
      max-width: 1200px;
    }
    .error-display {
      padding: 20px;
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #ef4444;
    }
  </style>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            zinc: { 700: '#3f3f46', 800: '#27272a', 900: '#18181b' },
            purple: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
            emerald: { 400: '#34d399', 500: '#10b981', 600: '#059669' }
          }
        }
      }
    }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    
    // Mock icons
    const Icon = ({ children, className }) => 
      React.createElement('span', { className: 'inline-flex items-center justify-center w-5 h-5 ' + (className || '') }, children);
    
    const Sparkles = (props) => Icon({ children: '✨', ...props });
    const ChevronRight = (props) => Icon({ children: '›', ...props });
    const User = (props) => Icon({ children: '👤', ...props });
    const Home = (props) => Icon({ children: '🏠', ...props });
    const Settings = (props) => Icon({ children: '⚙', ...props });
    const Check = (props) => Icon({ children: '✓', ...props });
    const X = (props) => Icon({ children: '✕', ...props });
    const Menu = (props) => Icon({ children: '☰', ...props });
    const Search = (props) => Icon({ children: '🔍', ...props });
    const Heart = (props) => Icon({ children: '❤', ...props });
    const Star = (props) => Icon({ children: '⭐', ...props });
    
    // Mock framer-motion
    const motion = {
      div: (props) => React.createElement('div', props),
      span: (props) => React.createElement('span', props),
      button: (props) => React.createElement('button', props),
      h1: (props) => React.createElement('h1', props),
      h2: (props) => React.createElement('h2', props),
      h3: (props) => React.createElement('h3', props),
      p: (props) => React.createElement('p', props),
      section: (props) => React.createElement('section', props),
      article: (props) => React.createElement('article', props),
    };
    
    const AnimatePresence = ({ children }) => children;
    
    try {
      ${cleanCode}
      
      // Render the component
      const App = () => {
        try {
          if (typeof ${componentName} !== 'undefined') {
            return React.createElement(${componentName}, {});
          }
          throw new Error('Component not found: ${componentName}');
        } catch (err) {
          return React.createElement('div', { className: 'error-display' },
            React.createElement('h3', {}, '⚠️ Component Error'),
            React.createElement('p', {}, err.message)
          );
        }
      };
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch (error) {
      document.getElementById('root').innerHTML = 
        '<div class="error-display">' +
        '<h3>⚠️ Preview Error</h3>' +
        '<p>' + error.toString() + '</p>' +
        '</div>';
    }
  </script>
</body>
</html>`;
  };

  // Update iframe content
  useEffect(() => {
    if (iframeRef.current && isPlaying) {
      const html = createPreviewHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      
      return () => URL.revokeObjectURL(url);
    }
  }, [code, theme, isPlaying]);

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

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'React Component',
          text: 'Check out this React component I generated!',
          files: [new File([code], 'component.tsx', { type: 'text/typescript' })]
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  // Device view widths
  const deviceWidths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%'
  };

  // Extract component name
  const getComponentName = () => {
    const match = code.match(/(?:const|function|class)\s+(\w+)/);
    return match?.[1] || 'Component';
  };

  const componentName = getComponentName();

  return (
    <motion.div 
      className={`${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''} bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-purple-500/20 overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Header */}
      <div className="bg-zinc-800/50 border-b border-zinc-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-zinc-300">Advanced Preview</span>
          <span className="text-xs text-zinc-500">({componentName})</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded transition-colors ${
                deviceView === 'mobile' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView('tablet')}
              className={`p-1.5 rounded transition-colors ${
                deviceView === 'tablet' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Tablet view"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded transition-colors ${
                deviceView === 'desktop' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
            title={isPlaying ? 'Pause preview' : 'Play preview'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <div className="w-px h-6 bg-zinc-700" />

          {/* Code Toggle */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`p-1.5 rounded transition-colors ${
              showCode ? 'bg-purple-600 text-white' : 'hover:bg-zinc-700 text-zinc-400'
            }`}
            title="Toggle code"
          >
            <Code className="w-4 h-4" />
          </button>

          {/* Edit */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
              title="Edit code"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {/* Actions */}
          <button onClick={copyCode} className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400" title="Copy">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          
          <button onClick={downloadCode} className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400" title="Download">
            <Download className="w-4 h-4" />
          </button>
          
          <button onClick={shareCode} className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400" title="Share">
            <Share2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-zinc-700" />

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex h-[600px]">
        {/* Code Editor Panel */}
        <AnimatePresence>
          {(showCode || isEditing) && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '50%' }}
              exit={{ width: 0 }}
              className="border-r border-zinc-700 bg-black/50 overflow-hidden"
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
                        Save & Preview
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
        <div className="flex-1 bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
          <div 
            style={{ 
              width: deviceWidths[deviceView],
              maxWidth: '100%',
              height: '100%'
            }}
            className="relative"
          >
            {isPlaying ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0 rounded-lg bg-white shadow-2xl"
                title="Component Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800 rounded-lg">
                <div className="text-center">
                  <Pause className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500">Preview paused</p>
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Resume Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
