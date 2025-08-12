import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sun, 
  Moon, 
  Monitor, 
  Tablet, 
  Smartphone,
  RotateCw
} from 'lucide-react';

interface PreviewControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  deviceSize: 'mobile' | 'tablet' | 'desktop';
  onDeviceSizeChange: (size: 'mobile' | 'tablet' | 'desktop') => void;
  onRefresh: () => void;
}

export const PreviewControls = ({
  zoom,
  onZoomChange,
  theme,
  onThemeChange,
  deviceSize,
  onDeviceSizeChange,
  onRefresh
}: PreviewControlsProps) => {
  const zoomPresets = [50, 75, 100, 125, 150];
  
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 200);
    onZoomChange(newZoom);
  };
  
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 25);
    onZoomChange(newZoom);
  };

  return (
    <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 mr-2">Zoom</span>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-zinc-400" />
          </button>
          
          <div className="flex items-center gap-1">
            {zoomPresets.map(preset => (
              <button
                key={preset}
                onClick={() => onZoomChange(preset)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  zoom === preset 
                    ? 'bg-purple-600 text-white' 
                    : 'text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
          
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-zinc-400" />
          </button>
          
          <button
            onClick={() => onZoomChange(100)}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors ml-2"
            title="Fit to screen"
          >
            <Maximize2 className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Device Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 mr-2">Device</span>
          <div className="flex items-center bg-zinc-900 rounded-lg p-1">
            <button
              onClick={() => onDeviceSizeChange('mobile')}
              className={`p-1.5 rounded transition-colors ${
                deviceSize === 'mobile'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:bg-zinc-700'
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeviceSizeChange('tablet')}
              className={`p-1.5 rounded transition-colors ${
                deviceSize === 'tablet'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:bg-zinc-700'
              }`}
              title="Tablet view"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeviceSizeChange('desktop')}
              className={`p-1.5 rounded transition-colors ${
                deviceSize === 'desktop'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:bg-zinc-700'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Theme Toggle & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-zinc-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          
          <button
            onClick={onRefresh}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
            title="Refresh preview"
          >
            <RotateCw className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
