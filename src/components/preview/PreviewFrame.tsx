import { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface PreviewFrameProps {
  code: string;
  props?: Record<string, any>;
  theme?: 'light' | 'dark';
  zoom?: number;
}

export const PreviewFrame = ({
  code,
  props = {},
  theme = 'dark',
  zoom = 100
}: PreviewFrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  const createPreviewHTML = () => {
    console.log('Creating preview for code:', code.substring(0, 200) + '...');
    
    // Extract component name and interface from code
    const componentMatch = code.match(/export\s+(?:const|function|default\s+function)\s+(\w+)/);
    const componentName = componentMatch?.[1] || 'Component';
    console.log('Detected component name:', componentName);
    
    // Transform code for preview - handle more cases
    const transformedCode = code
      .replace(/import\s+React(?:,\s*{[^}]*})?\s+from\s+['"]react['"];?/g, '')
      .replace(/import\s+{[^}]+}\s+from\s+['"]lucide-react['"];?/g, '')
      .replace(/import\s+{[^}]+}\s+from\s+['"]framer-motion['"];?/g, '')
      .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '') // Remove all imports
      .replace(/export\s+default\s+function/g, 'const')
      .replace(/export\s+(?:const|function)/g, 'const')
      .replace(/:\s*React\.FC<[^>]+>/g, '')
      .replace(/:\s*React\.FC/g, '')
      .replace(/interface\s+\w+Props\s*{[^}]*}/gs, ''); // Remove interface definitions


    return `<!DOCTYPE html>
<html lang="en" class="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${theme === 'dark' 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
      transform: scale(${zoom / 100});
      transform-origin: center center;
    }
    
    #root {
      width: 100%;
      max-width: 1200px;
    }
    
    /* Error boundary styles */
    .error-boundary {
      padding: 2rem;
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 0.5rem;
      color: #ef4444;
      font-family: monospace;
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
            },
            emerald: {
              400: '#34d399',
              500: '#10b981',
              600: '#059669',
            }
          }
        }
      }
    }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    console.log('Preview iframe loaded');
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    
    // Mock Lucide icons as functional components with better styling
    const createIcon = (content, className = '') => {
      return React.createElement('span', {
        className: 'inline-flex items-center justify-center w-4 h-4 ' + className,
        style: { fontSize: '14px' }
      }, content);
    };
    
    const ChevronRight = (props) => createIcon('›', props?.className);
    const ChevronLeft = (props) => createIcon('‹', props?.className);
    const ChevronDown = (props) => createIcon('▼', props?.className);
    const ChevronUp = (props) => createIcon('▲', props?.className);
    const X = (props) => createIcon('✕', props?.className);
    const Check = (props) => createIcon('✓', props?.className);
    const AlertCircle = (props) => createIcon('⚠', props?.className);
    const Info = (props) => createIcon('ⓘ', props?.className);
    const Loader = (props) => createIcon('⟳', props?.className);
    const Loader2 = (props) => createIcon('⟳', props?.className);
    const Search = (props) => createIcon('🔍', props?.className);
    const Plus = (props) => createIcon('+', props?.className);
    const Minus = (props) => createIcon('-', props?.className);
    const Eye = (props) => createIcon('👁', props?.className);
    const EyeOff = (props) => createIcon('⚫', props?.className);
    const Copy = (props) => createIcon('📋', props?.className);
    const Download = (props) => createIcon('⬇', props?.className);
    const Upload = (props) => createIcon('⬆', props?.className);
    const Settings = (props) => createIcon('⚙', props?.className);
    const Menu = (props) => createIcon('☰', props?.className);
    const Home = (props) => createIcon('🏠', props?.className);
    const User = (props) => createIcon('👤', props?.className);
    const Mail = (props) => createIcon('✉', props?.className);
    const Phone = (props) => createIcon('📞', props?.className);
    const Calendar = (props) => createIcon('📅', props?.className);
    const Clock = (props) => createIcon('🕐', props?.className);
    const Star = (props) => createIcon('⭐', props?.className);
    const Heart = (props) => createIcon('❤', props?.className);
    const Trash = (props) => createIcon('🗑', props?.className);
    const Edit = (props) => createIcon('✏', props?.className);
    const Save = (props) => createIcon('💾', props?.className);
    const Sparkles = (props) => createIcon('✨', props?.className);
    const ArrowRight = (props) => createIcon('→', props?.className);
    const ArrowLeft = (props) => createIcon('←', props?.className);
    
    // Error Boundary Component
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      
      render() {
        if (this.state.hasError) {
          return React.createElement('div', { className: 'error-boundary' },
            React.createElement('h3', {}, '⚠️ Component Error'),
            React.createElement('pre', {}, this.state.error?.toString())
          );
        }
        return this.props.children;
      }
    }
    
    try {
      console.log('Executing component code...');
      
      // Add mock framer-motion for components that use it
      const motion = {
        div: (props) => React.createElement('div', props),
        span: (props) => React.createElement('span', props),
        button: (props) => React.createElement('button', props),
        a: (props) => React.createElement('a', props),
        p: (props) => React.createElement('p', props),
        h1: (props) => React.createElement('h1', props),
        h2: (props) => React.createElement('h2', props),
        h3: (props) => React.createElement('h3', props),
      };
      
      // AnimatePresence mock
      const AnimatePresence = ({ children }) => children;
      
      // Execute the transformed code
      ${transformedCode}
      
      console.log('Component code executed, checking for: ${componentName}');
      
      const App = () => {
        const componentProps = ${JSON.stringify(props)};
        
        try {
          // Check if component exists
          if (typeof ${componentName} === 'undefined') {
            console.error('Component ${componentName} is undefined');
            throw new Error('Component "${componentName}" not found. Make sure the component is exported correctly.');
          }
          
          console.log('Rendering component ${componentName} with props:', componentProps);
          
          return React.createElement(ErrorBoundary, {},
            React.createElement(${componentName}, componentProps)
          );
        } catch (innerError) {
          console.error('Component render error:', innerError);
          return React.createElement('div', {
            className: 'p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400'
          }, 
            React.createElement('p', { className: 'font-semibold mb-2' }, '⚠️ Component Error'),
            React.createElement('pre', { className: 'text-xs' }, innerError.message)
          );
        }
      };
      
      console.log('Creating React root and rendering...');
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
      console.log('Component rendered successfully');
    } catch (error) {
      console.error('Preview error:', error);
      document.getElementById('root').innerHTML = 
        '<div class="error-boundary">' +
        '<h3>⚠️ Preview Error</h3>' +
        '<pre>' + error.toString() + '</pre>' +
        '<p style="margin-top: 10px; font-size: 12px;">Check browser console for details</p>' +
        '</div>';
    }
  </script>
</body>
</html>`;
  };

  useEffect(() => {
    if (!iframeRef.current) return;

    try {
      const html = createPreviewHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      setError(null);
      
      return () => URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to render preview');
    }
  }, [code, props, theme, zoom]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-zinc-900 rounded-lg">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-400 font-medium mb-2">Preview Error</p>
          <p className="text-sm text-zinc-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full min-h-[400px] border-0 rounded-lg bg-white"
      title="Component Preview"
      sandbox="allow-scripts allow-same-origin"
      style={{ display: 'block' }}
    />
  );
};
