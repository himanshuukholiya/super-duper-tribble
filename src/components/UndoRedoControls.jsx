import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

const UndoRedoControls = ({ undo, redo, historyStep, historyLength }) => {
  const canUndo = historyStep > 0;
  const canRedo = historyStep < historyLength - 1;

  return (
    <div className="flex items-center bg-[#232329] p-1 rounded-lg border border-[#3b3b4f] shadow-lg text-gray-300 select-none">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`p-1.5 rounded-md transition-colors ${
          canUndo ? 'hover:bg-[#31313d] cursor-pointer text-gray-300' : 'text-gray-600 cursor-default'
        }`}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={18} />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`p-1.5 rounded-md transition-colors ${
          canRedo ? 'hover:bg-[#31313d] cursor-pointer text-gray-300' : 'text-gray-600 cursor-default'
        }`}
        title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
      >
        <Redo2 size={18} />
      </button>
    </div>
  );
};

export const setupUndoRedoKeyboard = (undo, redo, elements, setElements) => {
  const handleUndoRedo = (e) => {
    // Ignore if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      redo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      // Temporary shortcut for testing Phase 4 undo/redo history logic
      e.preventDefault();
      setElements([...elements, { id: Date.now(), type: 'dummy' }]);
    }
  };

  window.addEventListener('keydown', handleUndoRedo);
  return () => window.removeEventListener('keydown', handleUndoRedo);
};

export default UndoRedoControls;
