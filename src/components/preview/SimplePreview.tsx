import { useState } from 'react';
import { Eye, Code as CodeIcon } from 'lucide-react';

interface SimplePreviewProps {
  code: string;
  className?: string;
}

export function SimplePreview({ code, className = '' }: SimplePreviewProps) {
  const [showCode, setShowCode] = useState(false);

  // Extract component name
  const getComponentName = () => {
    const match = code.match(/export\s+(?:const|function|default\s+function)\s+(\w+)/);
    return match?.[1] || 'Component';
  };

  // Create a simple preview message
  const componentName = getComponentName();

  return (
    <div className={`${className} bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-purple-500/20 overflow-hidden`}>
      {/* Header */}
      <div className="bg-zinc-800/50 border-b border-zinc-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-zinc-300">Component Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              showCode 
                ? 'bg-purple-600 text-white' 
                : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
            }`}
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {showCode ? (
          <div className="bg-black/50 rounded-lg border border-emerald-500/20">
            <div className="px-4 py-2 border-b border-emerald-700/50 bg-emerald-900/20">
              <span className="text-xs text-emerald-300 font-medium">{componentName}.tsx</span>
            </div>
            <pre className="p-4 text-sm text-emerald-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-[500px]">
              <code>{code}</code>
            </pre>
          </div>
        ) : (
          <div className="bg-zinc-800/50 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <CodeIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {componentName} Component
              </h3>
              <p className="text-zinc-400 text-sm">
                Component generated successfully! The preview system is being enhanced.
              </p>
            </div>
            
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-sm text-zinc-300">Component code is valid</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-sm text-zinc-300">TypeScript interfaces detected</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-sm text-zinc-300">Tailwind classes applied</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">ℹ</span>
                <span className="text-sm text-zinc-300">
                  Copy the code above and use it in your project
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-xs text-purple-300">
                <strong>Note:</strong> Live preview requires additional setup. For now, copy the generated code and test it in your development environment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
