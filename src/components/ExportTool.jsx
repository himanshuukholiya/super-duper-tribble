import React, { useCallback } from 'react';
import { Download } from 'lucide-react';
import { getElementsBounds } from '../utils/math';

export const performExport = (elements, drawElement) => {
  if (elements.length === 0) return;
  
  const bounds = getElementsBounds(elements);
  if (!bounds) return;

  const padding = 60; // Increased padding slightly
  // Increase size by scaling (e.g., 2x for higher resolution)
  const scale = 2; // Increased size as requested
  const width = (bounds.maxX - bounds.minX + 2 * padding) * scale;
  const height = (bounds.maxY - bounds.minY + 2 * padding) * scale;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return;

  // Fill Background
  ctx.fillStyle = '#121212'; // The app uses dark mode by default
  ctx.fillRect(0, 0, width, height);

  ctx.scale(scale, scale);
  ctx.translate(padding - bounds.minX, padding - bounds.minY);
  
  // Draw Elements
  elements.forEach(el => {
    ctx.save();
    drawElement(ctx, el, false);
    ctx.restore();
  });

  const dataUrl = tempCanvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  const timestamp = Date.now();
  link.download = `SketchChart-${timestamp}.png`;
  link.href = dataUrl;
  link.click();
};

const ExportTool = ({ elements, drawElement }) => {
  const handleExport = useCallback(() => {
    performExport(elements, drawElement);
  }, [elements, drawElement]);

  return (
    <button
      onClick={handleExport}
      className="p-2 rounded-md transition-colors cursor-pointer text-gray-300 hover:bg-[#31313d]"
      title="Export PNG"
    >
      <Download size={20} />
    </button>
  );
};

export default ExportTool;
