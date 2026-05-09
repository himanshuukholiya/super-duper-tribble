import React from 'react';
import CanvasBoard from './components/CanvasBoard';
import './App.css';

function App() {
  return (
    <div className="w-screen h-screen flex flex-col bg-[#121212] text-gray-100 font-sans relative overflow-hidden">
      <main className="flex-1 relative overflow-hidden bg-[#121212]">
        <CanvasBoard />
      </main>
      
      {/* Translucent bottom-right watermark */}
      <h1 className="absolute bottom-6 right-8 text-2xl font-bold text-white/10 tracking-wide pointer-events-none select-none z-10">
        SketchChart
      </h1>
    </div>
  );
}

export default App;
