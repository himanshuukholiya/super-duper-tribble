import React from 'react';
import { Hand, MousePointer2 } from 'lucide-react';
import { getBoundingBox } from '../utils/math';

const PanSelectionTools = ({ activeTool, setActiveTool }) => {
  return (
    <>
      <button
        onClick={() => setActiveTool('pan')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'pan' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Pan (H)"
      >
        <Hand size={20} />
      </button>
      <button
        onClick={() => setActiveTool('selection')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'selection' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Selection (V or 1)"
      >
        <MousePointer2 size={20} />
      </button>
    </>
  );
};

export const handleSelectionMouseDown = ({ worldX, worldY, elements, selectedElementId, setSelectedElementId, setDragState, isControlPointHit, isHit, camera }) => {
  // If an element is already selected, check if we clicked one of its control points or inside it to move
  if (selectedElementId) {
    const selectedElement = elements.find(el => el.id === selectedElementId);
    if (selectedElement) {
      const hitControlPoint = isControlPointHit(worldX, worldY, selectedElement, 10 / camera.zoom);
      if (hitControlPoint) {
        setDragState({ type: 'resize', point: hitControlPoint, startX: worldX, startY: worldY, initialElement: JSON.parse(JSON.stringify(selectedElement)) });
        return; // Handled control point click
      }

      // Check if clicked inside bounding box to move
      const bbox = getBoundingBox(selectedElement);
      if (bbox && worldX >= bbox.minX && worldX <= bbox.maxX && worldY >= bbox.minY && worldY <= bbox.maxY) {
        setDragState({ type: 'move', startX: worldX, startY: worldY, initialElement: JSON.parse(JSON.stringify(selectedElement)) });
        return;
      }
    }
  }

  // Otherwise, check if we hit any element to select it
  // Loop backwards to select the topmost element
  for (let i = elements.length - 1; i >= 0; i--) {
    if (isHit(worldX, worldY, elements[i], 10 / camera.zoom)) {
      setSelectedElementId(elements[i].id);
      return;
    }
  }

  // Clicked empty space, deselect
  setSelectedElementId(null);
  setDragState(null);
};

export const handleSelectionMouseMove = ({ worldX, worldY, elements, setElements, selectedElementId, dragState }) => {
  if (dragState && selectedElementId) {
    setElements(elements.map(el => {
      if (el.id === selectedElementId) {
        let newEl = { ...el };
        const { type, point, startX, startY, initialElement } = dragState;
        const dx = worldX - startX;
        const dy = worldY - startY;

        if (type === 'move') {
          if (newEl.type === 'candle') {
            const GAP = 18;
            const snappedDx = Math.round(dx / GAP) * GAP;
            newEl.x = initialElement.x + snappedDx;
            newEl.open = initialElement.open + dy;
            newEl.close = initialElement.close + dy;
            newEl.high = initialElement.high + dy;
            newEl.low = initialElement.low + dy;
          } else if (['box', 'trend_line', 'arrow'].includes(newEl.type)) {
            newEl.startX = initialElement.startX + dx;
            newEl.startY = initialElement.startY + dy;
            newEl.endX = initialElement.endX + dx;
            newEl.endY = initialElement.endY + dy;
          } else if (newEl.type === 'path') {
            newEl.points = initialElement.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
          } else if (newEl.type === 'text') {
            newEl.x = initialElement.x + dx;
            newEl.y = initialElement.y + dy;
          }
        } else if (type === 'resize') {
          if (newEl.type === 'candle') {
            // Update the specific point being dragged
            newEl[point] = worldY;

            // Enforce constraint: Close cannot cross Open
            if (point === 'close') {
              if (newEl.candleType === 'green' && newEl.close > newEl.open) {
                newEl.close = newEl.open;
              } else if (newEl.candleType === 'red' && newEl.close < newEl.open) {
                newEl.close = newEl.open;
              }
            } else if (point === 'open') {
              if (newEl.candleType === 'green' && newEl.open < newEl.close) {
                newEl.open = newEl.close;
              } else if (newEl.candleType === 'red' && newEl.open > newEl.close) {
                newEl.open = newEl.close;
              }
            }

            // Keep wicks logical
            const minBodyY = Math.min(newEl.open, newEl.close);
            const maxBodyY = Math.max(newEl.open, newEl.close);
            
            if (point === 'high' && newEl.high > minBodyY) newEl.high = minBodyY;
            if (point === 'low' && newEl.low < maxBodyY) newEl.low = maxBodyY;
            
            if (newEl.high > minBodyY) newEl.high = minBodyY;
            if (newEl.low < maxBodyY) newEl.low = maxBodyY;
          } else if (['box', 'trend_line', 'arrow'].includes(newEl.type)) {
             if (point.includes('e')) {
                if (initialElement.startX > initialElement.endX) newEl.startX = initialElement.startX + dx;
                else newEl.endX = initialElement.endX + dx;
             }
             if (point.includes('w')) {
                if (initialElement.startX < initialElement.endX) newEl.startX = initialElement.startX + dx;
                else newEl.endX = initialElement.endX + dx;
             }
             if (point.includes('s')) {
                if (initialElement.startY > initialElement.endY) newEl.startY = initialElement.startY + dy;
                else newEl.endY = initialElement.endY + dy;
             }
             if (point.includes('n')) {
                if (initialElement.startY < initialElement.endY) newEl.startY = initialElement.startY + dy;
                else newEl.endY = initialElement.endY + dy;
             }
          }
        }
        return newEl;
      }
      return el;
    }), true); // overwrite history step during drag
  }
};

export const handleSelectionMouseUp = ({ setDragState, elements, setElements }) => {
  // Trigger a normal setElements to finalize history if we were dragging
  setElements([...elements]);
  setDragState(null);
};

export const drawSelectionBox = (ctx, el) => {
  if (el.type === 'candle') {
    const padding = 4;
    const minX = el.x - 7 - padding;
    const maxX = el.x + 7 + padding;
    const minY = el.high - padding;
    const maxY = el.low + padding;
    
    ctx.strokeStyle = '#3b82f6'; // blue
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.setLineDash([]);
    
    const handleRadius = 4;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    
    const handles = [
      { x: el.x, y: el.high },
      { x: el.x, y: el.open },
      { x: el.x, y: el.close },
      { x: el.x, y: el.low }
    ];
    
    handles.forEach(h => {
      ctx.beginPath();
      ctx.arc(h.x, h.y, handleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    return;
  }

  const bbox = getBoundingBox(el);
  if (!bbox) return;

  const { minX, minY, maxX, maxY } = bbox;
  
  ctx.strokeStyle = '#3b82f6'; // blue
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  // Draw bounding box
  ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
  
  ctx.setLineDash([]); // reset dash
  
  // Draw handles
  const handleSize = 6;
  const handleOffset = handleSize / 2;
  
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1;

  const handles = [
    { x: minX, y: minY }, // nw
    { x: maxX, y: minY }, // ne
    { x: minX, y: maxY }, // sw
    { x: maxX, y: maxY }, // se
    { x: (minX + maxX) / 2, y: minY }, // n
    { x: (minX + maxX) / 2, y: maxY }, // s
    { x: minX, y: (minY + maxY) / 2 }, // w
    { x: maxX, y: (minY + maxY) / 2 }  // e
  ];

  handles.forEach(h => {
    ctx.fillRect(h.x - handleOffset, h.y - handleOffset, handleSize, handleSize);
    ctx.strokeRect(h.x - handleOffset, h.y - handleOffset, handleSize, handleSize);
  });
};

export const handlePanMouseDown = ({ e, setIsDragging, lastMousePos }) => {
  setIsDragging(true);
  lastMousePos.current = { x: e.clientX, y: e.clientY };
};

export const handlePanMouseMove = ({ e, isDragging, lastMousePos, setCamera }) => {
  if (!isDragging) return;
  const dx = e.clientX - lastMousePos.current.x;
  const dy = e.clientY - lastMousePos.current.y;
  
  setCamera(prev => ({
    ...prev,
    x: prev.x + dx,
    y: prev.y + dy
  }));
  
  lastMousePos.current = { x: e.clientX, y: e.clientY };
};

export const getSelectionCursor = ({ worldX, worldY, elements, selectedElementId, isControlPointHit, isHit, camera }) => {
  let newCursor = 'default';
  if (selectedElementId) {
    const selectedEl = elements.find(el => el.id === selectedElementId);
    if (selectedEl) {
      const hitPoint = isControlPointHit(worldX, worldY, selectedEl, 10 / camera.zoom);
      if (hitPoint) {
        const cursors = {
          nw: 'nwse-resize', se: 'nwse-resize',
          ne: 'nesw-resize', sw: 'nesw-resize',
          n: 'ns-resize', s: 'ns-resize',
          e: 'ew-resize', w: 'ew-resize',
          high: 'ns-resize', low: 'ns-resize', open: 'ns-resize', close: 'ns-resize'
        };
        newCursor = cursors[hitPoint] || 'pointer';
      } else {
        const bbox = getBoundingBox(selectedEl);
        if (bbox && worldX >= bbox.minX && worldX <= bbox.maxX && worldY >= bbox.minY && worldY <= bbox.maxY) {
          newCursor = 'move';
        }
      }
    }
  } else {
    for (let i = elements.length - 1; i >= 0; i--) {
      if (isHit(worldX, worldY, elements[i], 10 / camera.zoom)) {
        newCursor = 'pointer';
        break;
      }
    }
  }
  return newCursor;
};

export default PanSelectionTools;
