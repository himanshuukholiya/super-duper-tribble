# Phase 2: Canvas Rendering Foundation

This document explains the implementation details of the canvas foundation setup for SketchChart, satisfying the core rendering, infinite panning, and responsive constraints.

## Overview of Added Files

### 1. `src/components/CanvasBoard.jsx`
This is a new pure React component. It functions as the core engine to render our infinite whiteboard style interface.

#### Key Concepts & Hooks Used

- **`useRef`**: 
  - `canvasRef`: We use this to obtain a direct reference to the actual HTML `<canvas>` DOM node because standard React state cannot efficiently update graphical bits on a single canvas element.
  - `lastMousePos`: Stores the continuous state of X, Y positions during panning, circumventing React's render lifecycle lag for better performance.
  - `animationFrameRef`: Used to handle our central render loop without stalling the main thread.

- **`useState`**:
  - `camera`: Stores our infinite canvas offset positions (`x`, `y`) and `zoom` scale. It's an object with shape `{ x: 0, y: 0, zoom: 1 }`.
  - `isDragging`: A boolean that checks if the canvas is currently being panned (mouse held down + dragging).

- **`useCallback` & `useEffect`**:
  - Combined to build clean effect cleanup and re-calculate our canvas bounding limits effectively.

#### Functions Explained

- **`resizeCanvas`**: 
  - **Purpose**: Solves the "blurry canvas" issue on high-resolution screens (like retina displays).
  - **Specific Logic**: It grabs `window.devicePixelRatio`, scales up the internal memory size of the canvas (`canvas.width`/`height`) and then scales it back visually via CSS (`canvas.style.width`/`height`). It concludes by calling `ctx.scale(dpr, dpr)` so drawing commands match the physical pixels sharply.

- **`draw`**: 
  - **Purpose**: The master rendering function that handles context state. 
  - **Specific Logic**: Clears the canvas via `clearRect()`, applies our `.translate()` camera offset for panning, and `.scale()` for future zoom implementations. It then cascades into drawing our repeating grid.

- **`drawGrid(ctx, rect, cam)`**: 
  - **Purpose**: Provides the "Infinite Document" feel. It calculates an endless background pattern (similar to common design tools like Figma or Excalidraw).
  - **Specific Logic**: Instead of trying to draw millions of dots across an entire "infinite" matrix, we calculate the exact **viewport** based on our current `camera` offsets layout. It then dynamically offsets the `for` loops by modulo division (`% gap`), making the dots look seamlessly continuous across pan interactions. Features `moveTo` + `arc` rendering to inject peak performance.

- **`handleMouseDown`, `handleMouseMove`, `handleMouseUp`**:
  - **Purpose**: Together they enable left-click dragging functionality.
  - **Specific Logic**: Sets an initial anchoring point on mouse-down, detects offset updates to the `.clientX / .clientY` axis on move, updates `setCamera` state to translate the canvas seamlessly, and finalizes release on mouse-up. 
  
- **`handleWheel` (Zooming Mechanism)**:
  - **Purpose**: Prevents the browser from misinterpreting zoom attempts by natively scaling the entire webpage logic, securing a pure canvas zooming flow instead.
  - **Specific Logic**: Mounted via a specialized `useEffect` hook using `{ passive: false }` event listeners so `e.preventDefault()` successfully halts browser interference. Processes logarithmic mouse scroll deltas (`Math.exp()`), then computes a translation offset matrix guaranteeing that zooming zeros-in accurately at exactly where the user places their mouse cursor. Zoom is securely clamped between `0.1x` and `10.0x`.

### 2. `src/App.jsx`
The main application component was modified to properly initialize the core canvas experience.

#### Modifications
- **Rendering Container**: Deleted the placeholder dummy text (`<p>Canvas will go here</p>`) inside `<main>`. 
- **Injected `<CanvasBoard />`**: It is embedded firmly as absolutely layered over the flexible full-screen layout.
- **Dark Mode Architecture**: Integrated a sleek dark theme (`#121212` backgrounds) matching the dark grid layout, replacing the initial light-gray layouts.
- **Removed Navigation Header**: Stripped out the top navigation and dummy `lucide-react` buttons, dedicating 100% of the screen area to the infinite drawing board.
- **Translucent Watermark**: Added a permanent, translucent "SketchChart" title text at the bottom right corner of the canvas. Implemented protective CSS (`pointer-events-none select-none`) so the user can seamlessly mouse-over and draw directly on top of the text without interacting with it.

## Overall Architecture Flow Achieved:
1. React Mounts `<App />` elements.
2. `<CanvasBoard />` mounts, firing our `useEffect` hook to calculate its exact parent `.getBoundingClientRect()`.
3. It multiplies the size by system DPI settings and schedules a request frame animation render cycle `draw()` method.
4. During user drags, the camera vector is manipulated linearly altering the entire rendering stack translation cleanly. Everything inside looks infinitely big despite the actual memory use being completely bound to standard responsive screen-sizes.
