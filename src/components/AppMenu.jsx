import React, { useState, useRef, useEffect } from 'react';
import { Menu, RotateCcw, Sparkles } from 'lucide-react';

const AppMenu = ({ setCamera, setElements }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResetView = () => {
    setCamera({ x: 0, y: 0, zoom: 1 });
    setIsOpen(false);
  };

  const handleClearCanvas = () => {
    // Prompt or just clear? Excalidraw clears immediately but has undo, let's just clear
    setElements([]);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-4 left-4 z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-[#3b82f6] text-white' : 'bg-[#232329] text-gray-300 hover:bg-[#3b3b4f] border border-[#3b3b4f]'
          }`}
        title="Menu"
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#232329] border border-[#3b3b4f] rounded-lg shadow-xl overflow-hidden flex flex-col py-1">
          <button
            onClick={handleResetView}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#3b3b4f] hover:text-white transition-colors w-full text-left"
          >
            <RotateCcw size={16} />
            Reset View
          </button>

          <button
            onClick={handleClearCanvas}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#3b3b4f] hover:text-white transition-colors w-full text-left"
          >
            <Sparkles size={16} />
            Clear Canvas
          </button>
        </div>
      )}
    </div>
  );
};

export default AppMenu;
