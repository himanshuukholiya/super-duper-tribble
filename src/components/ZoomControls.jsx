import React from 'react';
import { Minus, Plus } from 'lucide-react';

const ZoomControls = ({ camera, setCamera, handleZoomOut, handleZoomIn }) => {
  return (
    <div className="flex items-center bg-[#232329] p-1 rounded-lg border border-[#3b3b4f] shadow-lg text-gray-300 select-none">
      <button 
        onClick={handleZoomOut}
        className="p-1.5 hover:bg-[#31313d] rounded-md transition-colors cursor-pointer disabled:cursor-default"
        disabled={camera.zoom <= 0.5}
      >
        <Minus size={18} />
      </button>
      <div 
        onDoubleClick={() => setCamera({ x: 0, y: 0, zoom: 1 })}
        className="w-14 text-center text-xs font-medium cursor-pointer hover:bg-[#31313d] py-1 rounded-md transition-colors"
        title="Double-click to reset view"
      >
        {Math.round(camera.zoom * 100)}%
      </div>
      <button 
        onClick={handleZoomIn}
        className="p-1.5 hover:bg-[#31313d] rounded-md transition-colors cursor-pointer disabled:cursor-default"
        disabled={camera.zoom >= 2.0}
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

export const performZoomIn = (canvas, setCamera) => {
  setCamera(prev => {
    let newZoom = prev.zoom + 0.1;
    if (newZoom > 2.0) newZoom = 2.0;
    
    if (!canvas) return { ...prev, zoom: newZoom };
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const worldX = (centerX - prev.x) / prev.zoom;
    const worldY = (centerY - prev.y) / prev.zoom;
    
    const newX = centerX - worldX * newZoom;
    const newY = centerY - worldY * newZoom;
    
    return { x: newX, y: newY, zoom: newZoom };
  });
};

export const performZoomOut = (canvas, setCamera) => {
  setCamera(prev => {
    let newZoom = prev.zoom - 0.1;
    if (newZoom < 0.5) newZoom = 0.5;
    
    if (!canvas) return { ...prev, zoom: newZoom };
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const worldX = (centerX - prev.x) / prev.zoom;
    const worldY = (centerY - prev.y) / prev.zoom;
    
    const newX = centerX - worldX * newZoom;
    const newY = centerY - worldY * newZoom;
    
    return { x: newX, y: newY, zoom: newZoom };
  });
};

export const setupWheelZoom = (canvas, setCamera) => {
  let wheelDeltaAccumulator = 0;

  const handleWheel = (e) => {
    e.preventDefault(); // Stop browser from zooming/scrolling the whole page
    
    // Normalize wheel delta (Firefox uses lines instead of pixels sometimes)
    const delta = e.deltaMode === 1 ? e.deltaY * 20 : e.deltaY;
    wheelDeltaAccumulator += delta;
    
    // Fire a 10% zoom step for every ~80 units of scroll (catches standard 100px notches)
    const threshold = 80;
    
    if (Math.abs(wheelDeltaAccumulator) >= threshold) {
      const steps = Math.trunc(wheelDeltaAccumulator / threshold);
      wheelDeltaAccumulator %= threshold; // Keep the remainder
      
      setCamera(prev => {
        let newZoom = prev.zoom - (steps * 0.1);
        
        // Clamp to avoid extreme zooming (50% to 200%)
        if (newZoom < 0.5) newZoom = 0.5;
        if (newZoom > 2.0) newZoom = 2.0;

        // Force to exactly one decimal place (e.g. 1.2)
        newZoom = Math.round(newZoom * 10) / 10;

        // If zoom hasn't changed because it's clamped, no need to recalculate offsets
        if (newZoom === prev.zoom) {
          return prev;
        }
      
        const rect = canvas.getBoundingClientRect();
        // Mouse position in screen coordinates relative to canvas
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // The point in world coordinates before zoom
        const worldX = (mouseX - prev.x) / prev.zoom;
        const worldY = (mouseY - prev.y) / prev.zoom;
        
        // Calculate new X and Y offsets so that we zoom at the mouse cursor
        const newX = mouseX - worldX * newZoom;
        const newY = mouseY - worldY * newZoom;
        
        return {
          x: newX,
          y: newY,
          zoom: newZoom
        };
      });
    }
  };
  
  // passive: false is specifically required to allow preventDefault()
  canvas.addEventListener('wheel', handleWheel, { passive: false });
  
  return () => {
    canvas.removeEventListener('wheel', handleWheel);
  };
};

export default ZoomControls;
