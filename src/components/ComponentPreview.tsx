import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Maximize2, Minimize2, RefreshCw, AlertCircle } from 'lucide-react';

interface ComponentPreviewProps {
  code: string;
  className?: string;
}

export function ComponentPreview({ code, className = '' }: ComponentPreviewProps) {
  const [isPreviewActive, setIsPreviewActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Create the preview HTML with all necessary dependencies
  const createPreviewHTML = (componentCode: string) => {
    // Extract component name from the code (simple regex)
    const componentMatch = componentCode.match(/export\s+(?:const|function)\s+(\w+)/);
    const componentName = componentMatch?.[1] || 'Component';

    // Transform the code for browser execution
    const transformedCode = componentCode
      .replace(/import\s+React(?:,\s*{[^}]*})?\s+from\s+['"]react['"];?/g, '')
      .replace(/import\s+{[^}]+}\s+from\s+['"]lucide-react['"];?/g, '')
      .replace(/export\s+(?:const|function)/g, 'const')
      .replace(/:\s*React\.FC<[^>]+>/g, '')
      .replace(/:\s*React\.FC/g, '');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: linear-gradient(to bottom right, #09090b, #1a1a2e);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #root {
      width: 100%;
      max-width: 800px;
    }
  </style>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            zinc: {
              700: '#3f3f46',
              800: '#27272a',
              900: '#18181b',
            },
            purple: {
              400: '#a78bfa',
              500: '#8b5cf6',
              600: '#7c3aed',
              700: '#6d28d9',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="dark">
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    // Mock Lucide icons
    const ChevronRight = () => <span>›</span>;
    const Home = () => <span>🏠</span>;
    const User = () => <span>👤</span>;
    const Settings = () => <span>⚙️</span>;
    const Menu = () => <span>☰</span>;
    const X = () => <span>✕</span>;
    const Code = () => <span>{ }</span>;
    const AlertCircle = () => <span>⚠️</span>;
    const CheckCircle = () => <span>✓</span>;
    const Copy = () => <span>📋</span>;
    const Eye = () => <span>👁</span>;
    
    try {
      ${transformedCode}
      
      const App = () => {
        try {
          return React.createElement(${componentName}, {});
        } catch (err) {
          return React.createElement('div', {
            className: 'p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400'
          }, 'Component Error: ' + err.message);
        }
      };
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch (error) {
      document.getElementById('root').innerHTML = 
        '<div class="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">' +
        'Preview Error: ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
  };

  useEffect(() => {
    if (!isPreviewActive || !iframeRef.current) return;

    try {
      const previewHTML = createPreviewHTML(code);
      const blob = new Blob([previewHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      iframeRef.current.src = url;
      setError(null);
      
      return () => URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to render preview');
    }
  }, [code, isPreviewActive, key]);

  const refreshPreview = () => {
    setKey(k => k + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
    >
      <div className={`bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-purple-500/20 overflow-hidden ${
        isFullscreen ? 'h-full' : 'h-full'
      }`}>
        {/* Preview Header */}
        <div className="bg-zinc-800/50 border-b border-zinc-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-purple-400" />
            <span className="text-sm font-medium text-zinc-300">Live Preview</span>
            {!isPreviewActive && (
              <span className="text-xs text-zinc-500">(Paused)</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={refreshPreview}
              className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
              title="Refresh preview"
            >
              <RefreshCw className="size-4 text-zinc-400" />
            </button>
            
            <button
              onClick={() => setIsPreviewActive(!isPreviewActive)}
              className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
              title={isPreviewActive ? 'Pause preview' : 'Resume preview'}
            >
              {isPreviewActive ? (
                <Eye className="size-4 text-purple-400" />
              ) : (
                <EyeOff className="size-4 text-zinc-500" />
              )}
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="size-4 text-zinc-400" />
              ) : (
                <Maximize2 className="size-4 text-zinc-400" />
              )}
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="relative h-[calc(100%-48px)]">
          {error ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <AlertCircle className="size-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-400 mb-2">Preview Error</p>
                <p className="text-sm text-zinc-500">{error}</p>
                <button
                  onClick={refreshPreview}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : isPreviewActive ? (
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Component Preview"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <EyeOff className="size-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500">Preview paused</p>
                <button
                  onClick={() => setIsPreviewActive(true)}
                  className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                >
                  Resume Preview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
