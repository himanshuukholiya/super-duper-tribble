import React from 'react';
import { Square, ArrowUpRight, Type, Eraser } from 'lucide-react';

const TrendLineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PathIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20 L12 12 L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4" cy="20" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="20" cy="16" r="2" fill="currentColor" />
  </svg>
);

const DrawingTools = ({ activeTool, setActiveTool }) => {
  return (
    <>
      <button
        onClick={() => setActiveTool('box')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'box' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Box (B or 4)"
      >
        <Square size={20} />
      </button>
      <button
        onClick={() => setActiveTool('arrow')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'arrow' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Arrow (A or 5)"
      >
        <ArrowUpRight size={20} />
      </button>
      <button
        onClick={() => setActiveTool('trend_line')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'trend_line' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Trend Line (T or 6)"
      >
        <TrendLineIcon />
      </button>
      <button
        onClick={() => setActiveTool('path')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'path' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Path (P or 7)"
      >
        <PathIcon />
      </button>
      <button
        onClick={() => setActiveTool('text')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'text' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Text (T or 8)"
      >
        <Type size={20} />
      </button>
      <button
        onClick={() => setActiveTool('eraser')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'eraser' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Eraser (E or 0)"
      >
        <Eraser size={20} />
      </button>
    </>
  );
};

export const drawShape = (ctx, el) => {
  switch (el.type) {
    case 'box':
      ctx.strokeRect(
        el.startX,
        el.startY,
        el.endX - el.startX,
        el.endY - el.startY
      );
      break;
    case 'trend_line':
      ctx.beginPath();
      ctx.moveTo(el.startX, el.startY);
      ctx.lineTo(el.endX, el.endY);
      ctx.stroke();
      break;
    case 'path':
      if (!el.points || el.points.length < 2) break;
      ctx.beginPath();
      ctx.moveTo(el.points[0].x, el.points[0].y);
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y);
      }
      ctx.stroke();
      ctx.stroke();
      // Arrowhead at the end (only if path is completed)
      if (!el.isDraft) {
        const p1 = el.points[el.points.length - 2];
        const p2 = el.points[el.points.length - 1];
        const anglePath = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const headlenPath = 15;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p2.x - headlenPath * Math.cos(anglePath - Math.PI / 6), p2.y - headlenPath * Math.sin(anglePath - Math.PI / 6));
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p2.x - headlenPath * Math.cos(anglePath + Math.PI / 6), p2.y - headlenPath * Math.sin(anglePath + Math.PI / 6));
        ctx.stroke();
      }
      break;
    case 'arrow':
      const headlen = 15;
      const dx = el.endX - el.startX;
      const dy = el.endY - el.startY;
      const angle = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.moveTo(el.startX, el.startY);
      ctx.lineTo(el.endX, el.endY);
      ctx.lineTo(el.endX - headlen * Math.cos(angle - Math.PI / 6), el.endY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(el.endX, el.endY);
      ctx.lineTo(el.endX - headlen * Math.cos(angle + Math.PI / 6), el.endY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
      break;
    case 'text':
      ctx.font = '16px Inter, system-ui, sans-serif';
      ctx.fillText(el.text, el.x, el.y);
      break;
    default:
      break;
  }
};

export const drawEraserCursor = (ctx, cursorPos, camera) => {
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; // The translucent red fill
  ctx.strokeStyle = '#ef4444';              // The solid red outline
  ctx.lineWidth = 1 / camera.zoom;
  ctx.beginPath();
  ctx.arc(cursorPos.x, cursorPos.y, 10 / camera.zoom, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};

export const handleDrawingMouseDown = ({ worldX, worldY, activeTool, elements, setElements, draftElement, setDraftElement, setIsDragging, hasErasedInCurrentStroke, camera, lastClickTimeRef, isHit }) => {
  if (activeTool === 'text') {
    const text = window.prompt('Enter text:');
    if (text) {
      setElements([...elements, {
        id: Date.now(),
        type: 'text',
        text,
        x: worldX,
        y: worldY,
        color: '#e5e7eb'
      }]);
    }
  } else if (activeTool === 'eraser') {
    setIsDragging(true);
    const nextElements = elements.filter(el => !isHit(worldX, worldY, el, 10 / camera.zoom));
    if (nextElements.length < elements.length) {
      setElements(nextElements);
      hasErasedInCurrentStroke.current = true;
    } else {
      hasErasedInCurrentStroke.current = false;
    }
  } else if (activeTool === 'path') {
    const now = Date.now();
    const isDoubleClick = now - lastClickTimeRef.current < 300;
    lastClickTimeRef.current = now;

    if (isDoubleClick && draftElement && draftElement.type === 'path' && draftElement.points.length > 2) {
      const finalPoints = draftElement.points.slice(0, -1);
      const { isDraft, ...finalElement } = draftElement;
      setElements([...elements, { ...finalElement, points: finalPoints }]);
      setDraftElement(null);
    } else {
      if (!draftElement || draftElement.type !== 'path') {
        setDraftElement({
          id: Date.now(),
          type: 'path',
          points: [{ x: worldX, y: worldY }, { x: worldX, y: worldY }],
          color: '#e5e7eb',
          isDraft: true
        });
      } else {
        setDraftElement(prev => ({
          ...prev,
          points: [...prev.points.slice(0, -1), { x: worldX, y: worldY }, { x: worldX, y: worldY }]
        }));
      }
    }
  } else if (['box', 'trend_line', 'arrow'].includes(activeTool)) {
    setIsDragging(true);
    setDraftElement({
      id: Date.now(),
      type: activeTool,
      startX: worldX,
      startY: worldY,
      endX: worldX,
      endY: worldY,
      color: '#e5e7eb'
    });
  }
};

export const handleDrawingMouseMove = ({ worldX, worldY, activeTool, elements, setElements, draftElement, setDraftElement, isDragging, hasErasedInCurrentStroke, camera, isHit }) => {
  if (!isDragging && activeTool !== 'path') return;

  if (activeTool === 'eraser') {
    const nextElements = elements.filter(el => !isHit(worldX, worldY, el, 10 / camera.zoom));
    if (nextElements.length < elements.length) {
      if (!hasErasedInCurrentStroke.current) {
        setElements(nextElements);
        hasErasedInCurrentStroke.current = true;
      } else {
        setElements(nextElements, true);
      }
    }
  } else if (draftElement && draftElement.type === 'path') {
    setDraftElement(prev => {
      const newPoints = [...prev.points];
      newPoints[newPoints.length - 1] = { x: worldX, y: worldY };
      return { ...prev, points: newPoints };
    });
  } else if (draftElement) {
    setDraftElement(prev => ({
      ...prev,
      endX: worldX,
      endY: worldY
    }));
  }
};

export const handleDrawingMouseUp = ({ isDragging, setIsDragging, draftElement, setDraftElement, elements, setElements, hasErasedInCurrentStroke }) => {
  if (isDragging && draftElement && draftElement.type !== 'path') {
    setElements([...elements, draftElement]);
    setDraftElement(null);
  }
  setIsDragging(false);
  hasErasedInCurrentStroke.current = false;
};

export default DrawingTools;
