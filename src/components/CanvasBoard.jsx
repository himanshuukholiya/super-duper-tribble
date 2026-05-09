import React, { useRef, useEffect, useState, useCallback } from 'react';
import ZoomControls, { performZoomIn, performZoomOut, setupWheelZoom } from './ZoomControls';
import PanSelectionTools, { handleSelectionMouseDown, handleSelectionMouseMove, handleSelectionMouseUp, drawSelectionBox, handlePanMouseMove, getSelectionCursor, handlePanMouseDown } from './PanSelectionTools';
import CandleTools, { drawCandle, handleCandleMouseDown } from './CandleTools';
import DrawingTools, { drawShape, handleDrawingMouseDown, handleDrawingMouseMove, handleDrawingMouseUp, drawEraserCursor } from './DrawingTools';
import ExportTool from './ExportTool';
import UndoRedoControls, { setupUndoRedoKeyboard } from './UndoRedoControls';
import AppMenu from './AppMenu';
import { useHistory } from '../hooks/useHistory';
import { useHotkeys } from '../hooks/useHotkeys';
import { drawGrid, getCursorStyle } from '../utils/canvasUtils';
import { isHit, isControlPointHit, getBoundingBox, getElementsBounds } from '../utils/math';

const CanvasBoard = () => {
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeTool, setActiveTool] = useState('pan'); // 'pan' or 'selection'
  const [draftElement, setDraftElement] = useState(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const hasErasedInCurrentStroke = useRef(false);
  const lastClickTimeRef = useRef(0);
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);

  const [selectedElementId, setSelectedElementId] = useState(null);
  const [dragState, setDragState] = useState(null);

  const { elements, setElements, undo, redo, historyStep, history } = useHistory([]);

  // Resize handler for crisp rendering
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    // Set actual size in memory (scaled for DPI)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Set display size in CSS
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    draw();
  }, [camera]);
  // We include camera so it redraws with correct position after resize

  // Dedicated draw function to be run on resize or camera change
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Context transform for camera and DPI
    ctx.save();
    // Scale for high DPI displays
    ctx.scale(dpr, dpr);
    // Translate for infinite canvas panning
    ctx.translate(camera.x, camera.y);
    // Scale for zooming feature (future-proof)
    ctx.scale(camera.zoom, camera.zoom);

    // Draw the dot grid pattern
    drawGrid(ctx, rect, camera);

    // Draw saved elements
    elements.forEach(el => drawElement(ctx, el, el.id === selectedElementId));

    // Draw drafting element
    if (draftElement) {
      drawElement(ctx, draftElement, false);
    }

    // Draw selection box
    if (selectedElementId) {
      const selectedEl = elements.find(el => el.id === selectedElementId);
      if (selectedEl) {
        drawSelectionBox(ctx, selectedEl);
      }
    }

    // Eraser Cursor
    if (activeTool === 'eraser' && isHoveringRef.current) {
      drawEraserCursor(ctx, cursorPosRef.current, camera);
    }

    ctx.restore();
  }, [camera, elements, draftElement, selectedElementId, activeTool]);



  const drawElement = useCallback((ctx, el, isSelected = false) => {
    if (el.type === 'candle') {
      drawCandle(ctx, el, isSelected);
    } else {
      ctx.strokeStyle = el.color || '#3b82f6'; // default blue
      ctx.fillStyle = el.color || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawShape(ctx, el);
    }
  }, []);



  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // initial sizing

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    // We use RequestAnimationFrame to schedule drawing, preventing React state lag
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      draw();
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [camera, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    return setupWheelZoom(canvas, setCamera);
  }, []);

  useHotkeys(setActiveTool);

  useEffect(() => {
    return setupUndoRedoKeyboard(undo, redo, elements, setElements);
  }, [undo, redo, elements, setElements]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Screen coordinates
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // World coordinates
    const worldX = (mouseX - camera.x) / camera.zoom;
    const worldY = (mouseY - camera.y) / camera.zoom;

    if (activeTool === 'pan' || (e.button === 1 || e.button === 2)) {
      // Start panning (middle/right click also pans in many apps)
      handlePanMouseDown({ e, setIsDragging, lastMousePos });
    } else if (activeTool === 'selection') {
      setIsDragging(true);
      handleSelectionMouseDown({
        worldX, worldY, elements, selectedElementId, setSelectedElementId,
        setDragState, isControlPointHit, isHit, camera
      });
    } else if (activeTool === 'green_candle' || activeTool === 'red_candle') {
      handleCandleMouseDown({ worldX, worldY, activeTool, elements, setElements });
    } else {
      handleDrawingMouseDown({
        worldX, worldY, activeTool, elements, setElements,
        draftElement, setDraftElement, setIsDragging,
        hasErasedInCurrentStroke, camera, lastClickTimeRef, isHit
      });
    }
    // selection drag will be handled here later
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !(activeTool === 'path' && draftElement) && activeTool !== 'selection' && activeTool !== 'eraser') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - camera.x) / camera.zoom;
    const worldY = (mouseY - camera.y) / camera.zoom;

    // Update cursor dynamically for selection tool (to avoid re-renders)
    if (activeTool === 'selection' && !isDragging) {
      const newCursor = getSelectionCursor({ worldX, worldY, elements, selectedElementId, isControlPointHit, isHit, camera });
      canvas.style.cursor = newCursor;
    } else if (activeTool !== 'selection') {
      canvas.style.cursor = ''; // Let tailwind class handle it
    }

    if (activeTool === 'eraser') {
      isHoveringRef.current = true;
      cursorPosRef.current = { x: worldX, y: worldY };
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => draw());
    }

    if (!isDragging && !(activeTool === 'path' && draftElement)) return;

    const isPanAction = activeTool === 'pan' || e.buttons === 4 || e.buttons === 2;

    if (isPanAction) {
      handlePanMouseMove({ e, isDragging, lastMousePos, setCamera });
    } else if (activeTool === 'selection') {
      handleSelectionMouseMove({ worldX, worldY, elements, setElements, selectedElementId, dragState });
    } else if (activeTool === 'green_candle' || activeTool === 'red_candle') {
      // No drag creation for candles anymore
    } else {
      handleDrawingMouseMove({
        worldX, worldY, activeTool, elements, setElements,
        draftElement, setDraftElement, isDragging,
        hasErasedInCurrentStroke, camera, isHit
      });
    }
  };

  const handleMouseUp = (e) => {
    if (e && (e.button === 1 || e.button === 2)) {
      setIsDragging(false);
      return;
    }

    if (activeTool === 'selection') {
      handleSelectionMouseUp({ setDragState, elements, setElements });
      setIsDragging(false);
    } else if (activeTool !== 'pan') {
      handleDrawingMouseUp({
        isDragging, setIsDragging, draftElement, setDraftElement,
        elements, setElements, hasErasedInCurrentStroke
      });
    } else {
      setIsDragging(false);
    }
  };

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (activeTool === 'eraser') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => draw());
    }
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    handleMouseUp();
    if (activeTool === 'eraser') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => draw());
    }
  };



  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`absolute top-0 left-0 w-full h-full touch-none outline-none ${getCursorStyle(activeTool, isDragging)}`}
        tabIndex={0}
      />

      {/* Top Left Menu */}
      <AppMenu setCamera={setCamera} setElements={setElements} />

      {/* Top Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center bg-[#232329] p-1.5 rounded-lg border border-[#3b3b4f] shadow-lg gap-1 z-10">
        <PanSelectionTools activeTool={activeTool} setActiveTool={setActiveTool} />
        <div className="w-[1px] h-6 bg-[#3b3b4f] mx-1"></div>
        <CandleTools activeTool={activeTool} setActiveTool={setActiveTool} />
        <div className="w-[1px] h-6 bg-[#3b3b4f] mx-1"></div>
        <DrawingTools activeTool={activeTool} setActiveTool={setActiveTool} />
        <div className="w-[1px] h-6 bg-[#3b3b4f] mx-1"></div>
        <ExportTool elements={elements} drawElement={drawElement} />
      </div>

      {/* Bottom Left Controls */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 z-10">
        <ZoomControls
          camera={camera}
          setCamera={setCamera}
          handleZoomOut={() => performZoomOut(canvasRef.current, setCamera)}
          handleZoomIn={() => performZoomIn(canvasRef.current, setCamera)}
        />
        <UndoRedoControls
          undo={undo}
          redo={redo}
          historyStep={historyStep}
          historyLength={history.length}
        />
      </div>
    </>
  );
};

export default CanvasBoard;

