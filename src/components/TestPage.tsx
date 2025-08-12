import React, { useState, useEffect } from 'react';
import { generateTestComponents, verifyTailwindClasses } from '../utils/testComponentGenerator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle, XCircle, Copy, Eye } from 'lucide-react';

export const TestPage: React.FC = () => {
  const [tailwindStatus, setTailwindStatus] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<string>('primaryButton');
  const [showPreview, setShowPreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  
  const testComponents = generateTestComponents();
  
  useEffect(() => {
    const status = verifyTailwindClasses();
    setTailwindStatus(status);
  }, []);
  
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const testInfo = {
    primaryButton: { 
      name: 'Primary Button', 
      description: 'A button with hover effects, sizes, and disabled states' 
    },
    statusBadge: { 
      name: 'Status Badge', 
      description: 'Dynamic color badges with optional pulse animation' 
    },
    userCard: { 
      name: 'User Card', 
      description: 'Profile card with avatar, info, and action buttons' 
    },
    responsiveNav: { 
      name: 'Responsive Navigation', 
      description: 'Desktop/mobile navigation with hamburger menu' 
    },
    formInput: { 
      name: 'Form Input', 
      description: 'Input field with validation states and error messages' 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-purple-900/10 to-zinc-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Phase 2 Verification Suite
          </h1>
          <p className="text-zinc-400">Test components to verify Tailwind v3 setup</p>
        </div>

        {/* Tailwind Status Card */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Tailwind CSS Status</h2>
              {tailwindStatus && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {tailwindStatus.isWorking ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={tailwindStatus.isWorking ? 'text-green-400' : 'text-red-400'}>
                      {tailwindStatus.isWorking ? 'Working Correctly' : 'Configuration Issues Detected'}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-500 space-y-1">
                    <div>Background: {tailwindStatus.details.backgroundColor}</div>
                    <div>Text Color: {tailwindStatus.details.color}</div>
                    <div>Padding: {tailwindStatus.details.padding}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-3xl">
              {tailwindStatus?.isWorking ? '✅' : '⚠️'}
            </div>
          </div>
        </div>

        {/* Test Component Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Component List */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Test Components</h3>
              <div className="space-y-2">
                {Object.entries(testInfo).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTest(key)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedTest === key
                        ? 'bg-purple-600/20 border border-purple-500/50 text-purple-400'
                        : 'bg-zinc-700/50 border border-zinc-600/50 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    <div className="font-medium">{info.name}</div>
                    <div className="text-xs mt-1 opacity-75">{info.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Checklist */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-4">
              <h3 className="text-lg font-semibold text-white mb-4">Success Criteria</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Components compile</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Tailwind classes apply</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Dynamic colors work</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>TypeScript types correct</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Responsive design</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Display */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
              {/* Toolbar */}
              <div className="bg-zinc-900 p-4 border-b border-zinc-700 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {testInfo[selectedTest as keyof typeof testInfo].name}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    {testInfo[selectedTest as keyof typeof testInfo].description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3 py-1.5 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showPreview ? 'Code' : 'Preview'}</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(testComponents[selectedTest as keyof typeof testComponents])}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Code/Preview */}
              <div className="p-4 max-h-[600px] overflow-y-auto">
                {showPreview ? (
                  <div className="space-y-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-8">
                      <p className="text-center text-zinc-400 mb-4">
                        Component Preview Placeholder
                      </p>
                      <p className="text-center text-sm text-zinc-500">
                        To test the component, copy the code and add it to your project
                      </p>
                    </div>
                  </div>
                ) : (
                  <SyntaxHighlighter
                    language="typescript"
                    style={oneDark}
                    customStyle={{
                      background: 'transparent',
                      padding: 0,
                      margin: 0,
                      fontSize: '14px'
                    }}
                  >
                    {testComponents[selectedTest as keyof typeof testComponents]}
                  </SyntaxHighlighter>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-4">
              <h4 className="text-sm font-semibold text-purple-400 mb-2">How to Test:</h4>
              <ol className="text-sm text-zinc-400 space-y-1 list-decimal list-inside">
                <li>Copy the component code above</li>
                <li>Create a new file in <code className="text-purple-400">src/components/test/</code></li>
                <li>Paste the code and save the file</li>
                <li>Import and use in your Dashboard or App component</li>
                <li>Verify the styling and functionality work correctly</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Phase 2 Summary */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Phase 2 Completion Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">✅ Completed:</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Tailwind v3 configuration</li>
                <li>• Component generation prompts updated</li>
                <li>• Test components created</li>
                <li>• TypeScript interfaces defined</li>
                <li>• Responsive patterns implemented</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">📝 Next Steps:</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Test AI generation with new prompts</li>
                <li>• Verify all test components render</li>
                <li>• Check dynamic color application</li>
                <li>• Confirm responsive breakpoints</li>
                <li>• Ready for Phase 3 implementation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
