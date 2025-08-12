import { useEffect } from 'react';

export function useKeyboardShortcuts(callbacks: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isCtrl = event.ctrlKey || event.metaKey;
      
      Object.entries(callbacks).forEach(([shortcut, callback]) => {
        const [modifier, targetKey] = shortcut.toLowerCase().split('+');
        
        if (modifier === 'ctrl' && isCtrl && key === targetKey) {
          event.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
}
