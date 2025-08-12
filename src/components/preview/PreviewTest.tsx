import { useState } from 'react';
import { ComponentPreview } from './ComponentPreview';
import { Sparkles } from 'lucide-react';

// Sample component code for testing - simplified without template literals in the embedded code
const sampleComponentCode = `export const MagicButton = ({ 
  variant = 'primary',
  size = 'md',
  children = 'Click Me!',
  onClick
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 inline-flex items-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const classes = baseClasses + ' ' + (variantClasses[variant] || variantClasses.primary) + ' ' + (sizeClasses[size] || sizeClasses.md);
  
  return React.createElement(
    'button',
    { 
      onClick: onClick,
      className: classes
    },
    React.createElement(Sparkles, { className: 'w-4 h-4' }),
    children
  );
};`;

export function PreviewTest() {
  const [code, setCode] = useState(sampleComponentCode);
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="h-full p-8 overflow-y-auto bg-zinc-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-purple-500/20">
          <h1 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Preview System Test
          </h1>
          <p className="text-zinc-400">
            Testing the component preview system with a sample button component.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors"
          >
            {showRaw ? 'Hide' : 'Show'} Raw Code
          </button>
          <button
            onClick={() => setCode(sampleComponentCode)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Reset Code
          </button>
        </div>

        {/* Code Editor (for testing) */}
        {showRaw && (
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-black/50 text-zinc-300 font-mono text-sm p-4 rounded-lg border border-zinc-700 focus:outline-none focus:border-purple-500"
              placeholder="Paste your component code here..."
            />
          </div>
        )}

        {/* Preview */}
        <div className="h-[600px]">
          <ComponentPreview 
            code={code}
            className="h-full"
          />
        </div>

        {/* Debug Info */}
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">Debug Information</h3>
          <div className="text-xs text-zinc-500 space-y-1">
            <p>• Component should render with purple gradient button</p>
            <p>• Props editor should detect variant, size, and children props</p>
            <p>• Preview should update when props change</p>
            <p>• Zoom and theme controls should work</p>
          </div>
        </div>
      </div>
    </div>
  );
}
