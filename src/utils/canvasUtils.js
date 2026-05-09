export const drawGrid = (ctx, rect, cam) => {
  const gap = 24; // Distance between dots
  const dotRadius = 0.8; // Size of the dot
  
  // Calculate the visible bounds in world coordinates
  const startX = -cam.x / cam.zoom;
  const startY = -cam.y / cam.zoom;
  const endX = startX + rect.width / cam.zoom;
  const endY = startY + rect.height / cam.zoom;

  // Calculate dynamic offsets to find the first visible dot
  // This allows the grid to seamlessly continue as the user pans
  let firstX = startX - (startX % gap);
  if (startX < 0) firstX -= gap;
  
  let firstY = startY - (startY % gap);
  if (startY < 0) firstY -= gap;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Highly transparent white for dark mode dots
  
  ctx.beginPath();
  for (let x = firstX; x <= endX + gap; x += gap) {
    for (let y = firstY; y <= endY + gap; y += gap) {
      // Use move and arc for much better performance than beginPath every loop
      ctx.moveTo(x, y);
      ctx.arc(x, y, dotRadius / cam.zoom, 0, Math.PI * 2);
    }
  }
  ctx.fill();
};

export const getCursorStyle = (activeTool, isDragging) => {
  if (activeTool === 'pan') {
    return isDragging ? 'cursor-grabbing' : 'cursor-grab';
  } else if (['box', 'trend_line', 'arrow'].includes(activeTool)) {
    return 'cursor-crosshair';
  } else if (activeTool === 'text') {
    return 'cursor-text';
  } else if (activeTool === 'eraser') {
    return 'cursor-none';
  }
  return 'cursor-default';
};
