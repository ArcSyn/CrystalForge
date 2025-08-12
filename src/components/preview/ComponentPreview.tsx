import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { PreviewFrame } from './PreviewFrame';
import { PreviewControls } from './PreviewControls';
import { PropsEditor } from './PropsEditor';

interface ComponentPreviewProps {
  code: string;
  className?: string;
}

export function ComponentPreview({ code, className = '' }: ComponentPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPropsEditor, setShowPropsEditor] = useState(false);
  const [componentProps, setComponentProps] = useState<Record<string, any>>({});
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [zoom, setZoom] = useState(100);
  const [deviceSize, setDeviceSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  const handlePropsChange = useCallback((newProps: Record<string, any>) => {
    setComponentProps(newProps);
  }, []);

  // Get container width based on device size
  const getContainerStyle = () => {
    switch (deviceSize) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' };
      case 'desktop':
      default:
        return { maxWidth: '100%' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-zinc-900' : ''}`}
    >
      <div className="bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-purple-500/20 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-zinc-800/50 border-b border-zinc-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-zinc-300">Component Preview</span>
            <div className="flex items-center gap-1 ml-4">
              <span className="text-xs text-zinc-500">Device:</span>
              <span className="text-xs text-purple-400 font-medium capitalize">{deviceSize}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-500">Zoom:</span>
              <span className="text-xs text-purple-400 font-medium">{zoom}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPropsEditor(!showPropsEditor)}
              className={`p-1.5 rounded transition-colors ${
                showPropsEditor 
                  ? 'bg-purple-600 text-white' 
                  : 'hover:bg-zinc-700 text-zinc-400'
              }`}
              title="Toggle props editor"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-zinc-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          </div>
        </div>

        {/* Preview Controls */}
        <PreviewControls
          zoom={zoom}
          onZoomChange={setZoom}
          theme={theme}
          onThemeChange={setTheme}
          deviceSize={deviceSize}
          onDeviceSizeChange={setDeviceSize}
          onRefresh={handleRefresh}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Props Editor Panel */}
          <AnimatePresence>
            {showPropsEditor && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '320px', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-r border-zinc-700 overflow-hidden"
              >
                <PropsEditor
                  code={code}
                  props={componentProps}
                  onPropsChange={handlePropsChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Frame */}
          <div className="flex-1 bg-zinc-950 p-4">
            <div style={getContainerStyle()} className="h-full">
              <PreviewFrame
                key={refreshKey}
                code={code}
                props={componentProps}
                theme={theme}
                zoom={zoom}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
