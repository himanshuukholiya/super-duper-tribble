import { useEffect } from 'react';

export const useHotkeys = (setActiveTool) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const key = e.key.toLowerCase();
      switch(key) {
        case 'h': setActiveTool('pan'); break;
        case 'v': case '1': setActiveTool('selection'); break;
        case 'g': case '2': setActiveTool('green_candle'); break;
        case 'r': case '3': setActiveTool('red_candle'); break;
        case 'b': case '4': setActiveTool('box'); break;
        case 'a': case '5': setActiveTool('arrow'); break;
        case '6': setActiveTool('trend_line'); break; // 6 for trend line since t is mapped to text
        case 'p': case '7': setActiveTool('path'); break;
        case 't': case '8': setActiveTool('text'); break; // t for text
        case 'e': case '0': setActiveTool('eraser'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool]);
};
