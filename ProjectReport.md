# SketchChart — Project Report

**Submitted by:** Himanshu Kholiya
**Project Name:** SketchChart
**Project Type:** Web-Based Interactive Canvas Application
**Technology Stack:** React, Vite, TailwindCSS v4, HTML5 Canvas API, Lucide React
**Date:** May 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Background](#11-background)
   - 1.2 [Objectives](#12-objectives)
   - 1.3 [Scope of Project](#13-scope-of-project)
   - 1.4 [Overview of Report](#14-overview-of-report)

2. [System Analysis and Design](#2-system-analysis-and-design)
   - 2.1 [Requirements](#21-requirements)
   - 2.2 [System Architecture](#22-system-architecture)
   - 2.3 [Design Process](#23-design-process)

3. [Technology Stack](#3-technology-stack)

4. [Implementation](#4-implementation)
   - 4.1 [Installation & Project Setup (Phase 1)](#41-installation--project-setup-phase-1)
   - 4.2 [Canvas Rendering Foundation (Phase 2)](#42-canvas-rendering-foundation-phase-2)
   - 4.3 [Infinite Viewport & Navigation (Phase 3)](#43-infinite-viewport--navigation-phase-3)
   - 4.4 [Component Refactoring (Phase 3v2)](#44-component-refactoring-phase-3v2)
   - 4.5 [State Management & Action History (Phase 4)](#45-state-management--action-history-phase-4)
   - 4.6 [Basic Drawing Tools (Phase 5)](#46-basic-drawing-tools-phase-5)
   - 4.7 [Eraser Undo/Redo Bug Fix (Phase 5c1)](#47-eraser-undoredo-bug-fix-phase-5c1)
   - 4.8 [Trading-Specific Tools — Candlesticks (Phase 6)](#48-trading-specific-tools--candlesticks-phase-6)
   - 4.9 [Advanced Selection Tool (Phase 7)](#49-advanced-selection-tool-phase-7)
   - 4.10 [Data Persistence (Phase 8)](#410-data-persistence-phase-8)
   - 4.11 [Export to PNG (Phase 9)](#411-export-to-png-phase-9)
   - 4.12 [Application Menu (Phase 10)](#412-application-menu-phase-10)

5. [Conclusion](#5-conclusion)
   - 5.1 [Summary of Achievement](#51-summary-of-achievement)
   - 5.2 [Innovation and Key Features](#52-innovation-and-key-features)
   - 5.3 [Limitations and Future Works](#53-limitations-and-future-works)
   - 5.4 [Final Thoughts](#54-final-thoughts)

---

# 1. Introduction

## 1.1 Background

Financial markets have become an increasingly important area of study for students, investors, and analysts. Understanding the language of the market — specifically **candlestick chart patterns** — is a foundational skill for anyone entering the world of technical analysis. A candlestick chart is a style of financial chart used to describe price movements of a security, derivative, or currency. Each "candle" represents four key data points: the **Open**, **Close**, **High**, and **Low** prices of an asset within a given timeframe.

Traditionally, learning these patterns required either expensive proprietary charting software (such as TradingView, MetaTrader, or Bloomberg Terminal) or static textbook diagrams that cannot be interactively manipulated. Both approaches present significant barriers for a student who simply wants to **practice drawing patterns**, understand bullish vs. bearish formations, or annotate charts with trend lines and arrows.

The digital whiteboard space has seen significant innovation in recent years. Tools like **Excalidraw**, **Figma**, **Miro**, and **Canva** have demonstrated that a rich, infinite canvas experience can be delivered entirely within a web browser using modern JavaScript technologies — no native app installation required. These tools share common principles: an infinite panning canvas, intuitive drawing primitives, real-time visual feedback, and persistent state management.

**SketchChart** was conceived at the intersection of these two worlds: the need for an accessible candlestick pattern practice tool, and the modern capability to deliver professional-grade canvas experiences in the browser. It is a web-based application that gives the user an infinite whiteboard specifically tailored for drawing, annotating, and saving candlestick charting patterns.

The project was built entirely from first principles using React and the native HTML5 Canvas API — without relying on any third-party charting libraries (like Chart.js or D3.js). This decision was deliberate: it forced a deep understanding of the rendering pipeline, coordinate transformation mathematics, collision detection algorithms, and state management patterns that underlie every canvas-based drawing tool.

## 1.2 Objectives

The primary objectives of the SketchChart project are as follows:

1. **Build an Infinite Canvas:** Implement a pixel-perfect, high-DPI (device pixel ratio aware), infinite scrollable and zoomable whiteboard using the HTML5 Canvas 2D API.

2. **Provide Candlestick Drawing Tools:** Implement dedicated tools for drawing green (bullish) and red (bearish) Japanese candlesticks, complete with body (open/close) and wicks (high/low), that intelligently snap to a grid and automatically inherit the opening price from the previous candle's close.

3. **Provide General Drawing Tools:** Implement the standard annotation primitives found in charting applications: Boxes (rectangles), Arrows, Trend Lines, multi-segment Paths, and free-form Text labels.

4. **Implement Full Undo/Redo History:** Maintain a time-travel capable history stack, allowing users to undo and redo every individual action they perform on the canvas.

5. **Implement a Selection and Transformation Tool:** Allow users to click any drawn shape to select it, drag it to a new position, or resize it by dragging its control handles — including intelligent financial constraints for candle resizing.

6. **Implement Data Persistence:** Automatically save the entire canvas state (all elements and the full history stack) to the browser's `localStorage`, ensuring that drawings are fully restored on page reload.

7. **Implement PNG Export:** Allow users to export their current canvas drawing as a high-resolution (2x scaled) PNG image file that downloads directly to their device.

8. **Provide a Professional, Polished UI:** Build a dark-themed, Excalidraw-inspired user interface with a floating toolbar, zoom controls, undo/redo buttons, and a hamburger application menu — all rendered as HTML overlays on top of the canvas.

9. **Ensure Keyboard Accessibility:** Provide keyboard shortcuts for every tool and action so that power users can work without constantly reaching for the mouse.

## 1.3 Scope of Project

The scope of the SketchChart project covers the following areas:

**In Scope:**
- A fully client-side web application (no backend or database required).
- An infinite canvas rendering engine built on the HTML5 Canvas 2D API.
- A camera system supporting pan (translate) and zoom (scale) with viewport-relative coordinate transformation.
- A unified element schema for all shape types (Box, Arrow, Trend Line, Path, Text, Candle).
- Interactive drawing tools with real-time draft previews for in-progress shapes.
- A robust Eraser tool with proper collision detection for each element type.
- A complete Selection Tool with move and resize capabilities for all element types.
- Candlestick-specific resizing with financial constraint enforcement (open/close cannot cross, wicks must extend past body).
- A persistent, localStorage-backed undo/redo history stack that survives page reloads.
- A high-resolution PNG export feature using an off-screen canvas.
- A hamburger application menu with "Reset View" and "Clear Canvas" functionality.
- Keyboard shortcuts for all 10 tools and 2 history operations.
- A custom eraser cursor (animated red circle following the mouse) rendered directly on the canvas.

**Out of Scope:**
- Backend server, user accounts, or cloud storage.
- Real-time collaboration (multi-user editing).
- Live market data feed or chart data import.
- Mobile/touch support (the application is designed for desktop mouse interaction).
- Advanced charting features like indicators (RSI, MACD, Bollinger Bands).
- Theming (light mode / dark mode toggle) — the app is dark-mode only.

## 1.4 Overview of Report

This report documents the complete design, development, and implementation of the SketchChart project. It is organized to follow the **chronological order of development phases** as planned in the project's `README.md`, allowing the reader to understand not just *what* was built, but *why* each piece was built in that particular order.

**Section 2** covers the system analysis and design: the functional and non-functional requirements, the overall system architecture, and the high-level design decisions made before coding began.

**Section 3** provides a detailed breakdown of the technology stack, explaining the purpose and rationale behind each chosen library and tool.

**Section 4** is the core of this report — a detailed, phase-by-phase implementation walkthrough. Each phase covers the specific files created or modified, every function, class, hook, and component introduced, along with annotated code excerpts and explanations. The phases are:
- **Phase 1:** Project Setup & Core Infrastructure
- **Phase 2:** Canvas Rendering Foundation
- **Phase 3:** Infinite Viewport & Navigation
- **Phase 3v2:** Component Refactoring
- **Phase 4:** State Management & Action History
- **Phase 5:** Basic Drawing Tools
- **Phase 5c1:** Eraser Undo/Redo Bug Fix
- **Phase 6:** Trading-Specific Tools (Candlesticks)
- **Phase 7:** Advanced Selection Tool
- **Phase 8:** Data Persistence
- **Phase 9:** Export to PNG
- **Phase 10:** Application Menu

**Section 5** concludes the report with a summary of achievements, a discussion of innovations and key features, an honest analysis of current limitations, proposed future works, and final thoughts.

---

# 2. System Analysis and Design

## 2.1 Requirements

### 2.1.1 Functional Requirements

The following functional requirements were derived from the project objectives and the planned feature set documented in `README.md`.

| FR# | Requirement | Priority |
|-----|-------------|----------|
| FR-01 | The system shall provide an infinite canvas that can be panned by click-and-drag | High |
| FR-02 | The system shall support mouse-wheel zooming centered at the cursor position | High |
| FR-03 | The system shall maintain a camera state (x offset, y offset, zoom level) | High |
| FR-04 | The system shall render a repeating dot-grid background that moves with the camera | Medium |
| FR-05 | The system shall support drawing Boxes (rectangles) by click-and-drag | High |
| FR-06 | The system shall support drawing Arrows by click-and-drag with trigonometric arrowheads | High |
| FR-07 | The system shall support drawing Trend Lines by click-and-drag | High |
| FR-08 | The system shall support drawing multi-segment Paths by repeated clicking | High |
| FR-09 | The system shall support placing Text labels via a prompt dialog | Medium |
| FR-10 | The system shall support an Eraser tool that removes shapes by proximity | High |
| FR-11 | The system shall support placing Green (bullish) Candlesticks | High |
| FR-12 | The system shall support placing Red (bearish) Candlesticks | High |
| FR-13 | Candlesticks shall snap to an 18px horizontal grid | High |
| FR-14 | New candles shall inherit the open price from the previous candle's close | High |
| FR-15 | The system shall support selecting, moving, and resizing all element types | High |
| FR-16 | Candle resizing shall enforce financial constraints (wick/body logic) | High |
| FR-17 | The system shall provide Undo (Ctrl+Z) and Redo (Ctrl+Y / Ctrl+Shift+Z) | High |
| FR-18 | The system shall auto-save canvas state to localStorage | High |
| FR-19 | The system shall restore state from localStorage on page load | High |
| FR-20 | The system shall export the canvas drawing as a PNG file | Medium |
| FR-21 | The system shall provide a hamburger menu with Reset View and Clear Canvas | Medium |
| FR-22 | All 10 tools shall be accessible via keyboard shortcuts | Medium |

### 2.1.2 Non-Functional Requirements

| NFR# | Requirement | Category |
|------|-------------|----------|
| NFR-01 | The canvas must render at the native device pixel ratio to prevent blurring on HiDPI displays | Performance |
| NFR-02 | The rendering loop must use `requestAnimationFrame` to synchronize with the display refresh rate | Performance |
| NFR-03 | Mouse event handlers must avoid triggering unnecessary React re-renders | Performance |
| NFR-04 | Zoom must be clamped between 50% and 200% to prevent unusable states | Usability |
| NFR-05 | The application must run entirely in the browser with no server-side code | Portability |
| NFR-06 | The UI must follow a consistent dark theme (background `#121212`, toolbar `#232329`) | Aesthetics |
| NFR-07 | All components must be modular and have a single, clear responsibility | Maintainability |
| NFR-08 | localStorage writes must be wrapped in try/catch for resilience | Reliability |
| NFR-09 | Eraser drag must be grouped into a single undo step | Correctness |
| NFR-10 | Exported PNG must be rendered at 2x resolution for crispness | Quality |

## 2.2 System Architecture

### 2.2.1 High-Level Architecture

SketchChart follows a **component-based, single-page application (SPA)** architecture. The entire application state lives in a single parent component (`CanvasBoard`), which acts as the orchestration layer. Child components are responsible only for their own UI rendering and for exporting pure handler functions that the parent calls.

```
index.html
    └── main.jsx (React Root)
        └── App.jsx (Layout Shell)
            └── CanvasBoard.jsx (Orchestrator — owns all state)
                ├── <canvas> (HTML5 Canvas Element)
                ├── AppMenu.jsx (Hamburger Menu — top-left)
                ├── PanSelectionTools.jsx (Pan/Selection toolbar buttons — top-center)
                ├── CandleTools.jsx (Candle toolbar buttons — top-center)
                ├── DrawingTools.jsx (Drawing toolbar buttons — top-center)
                ├── ExportTool.jsx (Export button — top-center)
                ├── ZoomControls.jsx (Zoom widget — bottom-left)
                └── UndoRedoControls.jsx (Undo/Redo widget — bottom-left)
```

### 2.2.2 State Architecture

All application state is managed inside `CanvasBoard.jsx`. There is no global state management library (like Redux or Zustand). State is classified into three categories:

**1. Canvas/Camera State (React `useState`):**
- `camera` — `{ x, y, zoom }` — the viewport transformation
- `isDragging` — boolean, whether the mouse is being held
- `activeTool` — string, the currently selected tool
- `draftElement` — the partially-drawn shape being previewed in real-time
- `selectedElementId` — the ID of the currently selected element
- `dragState` — metadata about an active selection drag (type, startX, startY, initialElement)

**2. Element History State (Custom Hook `useHistory`):**
- `elements` — the array of all placed shapes (the current frame of history)
- `history` — the full array of element-array snapshots
- `historyStep` — the pointer into the history array
- `setElements` — a function to push a new or overwrite the current history step
- `undo` / `redo` — functions to shift the history pointer

**3. Performance Refs (React `useRef`):**
- `canvasRef` — direct reference to the DOM `<canvas>` element
- `lastMousePos` — stores last mouse position for pan delta calculation (avoids re-render)
- `animationFrameRef` — handle for the `requestAnimationFrame` scheduler
- `hasErasedInCurrentStroke` — tracks whether the eraser has hit anything in the current drag
- `lastClickTimeRef` — used to detect double-click for the Path tool
- `cursorPosRef` / `isHoveringRef` — track mouse position for the custom eraser cursor

### 2.2.3 Data Flow

The data flow follows a unidirectional pattern:

```
User Interaction (Mouse/Keyboard)
    ↓
Event Handler in CanvasBoard.jsx
    ↓
Delegated to specific tool handler (exported from component files)
    ↓
setElements() / setCamera() / setActiveTool() called
    ↓
React state update triggers re-render
    ↓
useEffect detects dependency change, schedules requestAnimationFrame
    ↓
draw() function runs: clears canvas → applies transforms → draws grid → draws elements → draws draft → draws selection box → draws eraser cursor
    ↓
User sees updated canvas
```

### 2.2.4 Coordinate System

One of the most critical design decisions is the **dual coordinate system**. The application maintains two spaces:

- **Screen Space:** Raw pixel coordinates from browser events (`e.clientX`, `e.clientY`). These are affected by where the browser window is.
- **World Space:** The "true" position of an element on the infinite canvas, independent of pan and zoom. All elements are stored in world coordinates.

The transformation formula is:
```javascript
const worldX = (mouseX - camera.x) / camera.zoom;
const worldY = (mouseY - camera.y) / camera.zoom;
```

And the inverse (world → screen), applied in the `draw()` function via canvas transforms:
```javascript
ctx.translate(camera.x, camera.y);
ctx.scale(camera.zoom, camera.zoom);
```

This means all element coordinates are zoom-invariant and pan-invariant — they represent absolute positions in an infinite 2D world.

## 2.3 Design Process

### 2.3.1 Planning-First Approach

The project was designed with a strict **planning-first, layered build** approach. Before any tool-specific logic was written, the foundation layers were established and verified:

1. **Layer 0 — Environment:** Vite, React, Tailwind, Lucide icons installed and verified.
2. **Layer 1 — Canvas:** A correctly-sized, DPI-aware canvas that fills the screen and redraws on resize.
3. **Layer 2 — Camera:** A working pan and zoom system with correct coordinate transformation math.
4. **Layer 3 — State:** A history-aware element array before any drawing tools were added.
5. **Layer 4 — Drawing:** Drawing tools that write into the already-proven state system.
6. **Layer 5 — Interaction:** Selection and manipulation of the already-proven drawn shapes.
7. **Layer 6 — Persistence:** Auto-saving the already-proven state to localStorage.
8. **Layer 7 — Polish:** Export, menu, and UX refinements on top of the complete feature set.

This approach prevented a common pitfall in canvas applications: building tools first and then struggling to retrofit a camera system or undo/redo.

### 2.3.2 Modular Code Design

Every component file in `/src/components/` follows a **dual-export pattern**:
- A **default export** for the React JSX component (the visual toolbar buttons).
- **Named exports** for the pure JavaScript handler functions and rendering functions.

For example, `DrawingTools.jsx` exports:
- `default DrawingTools` — the toolbar buttons JSX.
- `export const drawShape` — the Canvas API drawing logic.
- `export const handleDrawingMouseDown` — the mouse-down handler.
- `export const handleDrawingMouseMove` — the mouse-move handler.
- `export const handleDrawingMouseUp` — the mouse-up handler.
- `export const drawEraserCursor` — the eraser visual overlay.

This pattern keeps `CanvasBoard.jsx` clean and focused on orchestration, while making each feature's logic self-contained and easy to locate.

---

# 3. Technology Stack

## 3.1 React (v19)

**Package:** `react`, `react-dom`
**Version:** `^19.2.5`
**Role:** Core UI framework

React was chosen as the UI framework for its component model, which maps perfectly to the multiple distinct UI panels in SketchChart (toolbar, zoom controls, menu). React's `useState`, `useEffect`, `useCallback`, and `useRef` hooks are used extensively throughout the application.

Key React-specific design decisions:
- **`useRef` for performance-critical values:** Mouse positions during drag, animation frame handles, and the canvas DOM node are all stored in refs rather than state. This prevents unnecessary re-renders during mouse move events, which fire dozens of times per second.
- **`useCallback` for stable function references:** Rendering functions like `draw` and `drawElement` are wrapped in `useCallback` with precise dependency arrays to prevent them from being recreated on every render, which would break `useEffect` dependency checks.
- **`requestAnimationFrame` scheduling:** The `draw()` function is never called directly from a `setState`. Instead, a `useEffect` watches for state changes and schedules a `requestAnimationFrame`, ensuring the canvas is redrawn in sync with the display's refresh rate and never mid-frame.

## 3.2 Vite (v8)

**Package:** `vite`, `@vitejs/plugin-react`
**Version:** `^8.0.9`
**Role:** Build tool and development server

Vite was chosen over Create React App for its significantly faster Hot Module Replacement (HMR). When a component file is saved, Vite pushes only the changed module to the browser — the page does not fully reload. This is essential for a canvas-based application where a full reload would lose any un-saved drawing state.

Configuration (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

The `@vitejs/plugin-react` plugin enables JSX compilation and React Fast Refresh. The `@tailwindcss/vite` plugin enables Tailwind CSS v4's new Vite-native integration.

## 3.3 TailwindCSS (v4)

**Package:** `tailwindcss`, `@tailwindcss/vite`
**Version:** `^4.2.3`
**Role:** Utility-first CSS framework for UI components

TailwindCSS v4 introduces a significant change from v3: instead of a `tailwind.config.js` file, all configuration is done in CSS. The only required setup is a single directive in `index.css`:
```css
@import "tailwindcss";
```

Tailwind is used exclusively for the **HTML overlay UI elements** — the toolbar, zoom controls, menu, and watermark. It is **not** used inside the `<canvas>` element (which uses the Canvas 2D API directly). This separation keeps the styling approach clean and consistent.

Key Tailwind classes used throughout the project:
- `absolute`, `top-4`, `left-4`, `z-50` — for overlay positioning
- `bg-[#232329]`, `border-[#3b3b4f]` — custom dark colors
- `rounded-lg`, `shadow-lg` — visual polish
- `transition-colors`, `hover:bg-[#31313d]` — micro-animations
- `cursor-grab`, `cursor-grabbing`, `cursor-crosshair`, `cursor-none` — dynamic cursor states

## 3.4 HTML5 Canvas API

**Type:** Native Browser API (no package)
**Role:** Core rendering engine for all drawings

The HTML5 Canvas 2D API is the rendering backbone of SketchChart. It provides a low-level, immediate-mode drawing surface where every frame is redrawn from scratch. Key Canvas API methods used:

| Method | Usage |
|--------|-------|
| `ctx.clearRect()` | Clear entire canvas before each frame |
| `ctx.save()` / `ctx.restore()` | Push/pop transform matrix state |
| `ctx.translate(x, y)` | Apply camera pan offset |
| `ctx.scale(sx, sy)` | Apply camera zoom and DPI scaling |
| `ctx.strokeRect()` | Draw box outlines |
| `ctx.fillRect()` | Draw candle bodies |
| `ctx.beginPath()` / `ctx.stroke()` | Draw lines, arrows, trend lines |
| `ctx.moveTo()` / `ctx.lineTo()` | Define line paths |
| `ctx.arc()` | Draw dot grid and eraser cursor |
| `ctx.fillText()` | Render text elements |
| `ctx.setLineDash()` | Dashed selection box outline |
| `canvas.toDataURL('image/png')` | PNG export data URL generation |

The Canvas API was chosen over SVG for rendering because it scales better for a large number of elements (SVG becomes slow with many DOM nodes) and gives more direct control over the rendering pipeline.

## 3.5 Lucide React

**Package:** `lucide-react`
**Version:** `^1.8.0`
**Role:** Icon library for all toolbar and menu icons

Lucide React provides clean, consistent SVG icons as React components. Icons used throughout SketchChart:

| Icon Component | Used For |
|----------------|----------|
| `Hand` | Pan tool button |
| `MousePointer2` | Selection tool button |
| `Square` | Box tool button |
| `ArrowUpRight` | Arrow tool button |
| `Type` | Text tool button |
| `Eraser` | Eraser tool button |
| `Download` | Export PNG button |
| `Minus` / `Plus` | Zoom out / Zoom in buttons |
| `Undo2` / `Redo2` | Undo / Redo buttons |
| `Menu` | Hamburger menu toggle |
| `RotateCcw` | Reset View menu item |
| `Sparkles` | Clear Canvas menu item |

Custom SVG icon components were created inline for tools that don't have a matching Lucide icon:
- `TrendLineIcon` — a diagonal line SVG
- `PathIcon` — a multi-point path SVG
- `GreenCandleIcon` — a green candlestick SVG
- `RedCandleIcon` — a red candlestick SVG

## 3.6 Browser localStorage API

**Type:** Native Browser API (no package)
**Role:** Client-side data persistence

The `localStorage` API provides a synchronous key-value store that persists data across browser sessions. SketchChart uses a single key (`'sketchChart_state'`) to store the complete serialized state object — the full history array plus the current step index. The value is serialized with `JSON.stringify` and deserialized with `JSON.parse`.

---

---

# 4. Implementation

This section documents the complete, chronological implementation of every phase of the SketchChart project. Each phase is a self-contained layer of functionality, built on top of the verified layers that came before it. Code excerpts are provided for the most technically significant functions in each phase.

---

## 4.1 Installation & Project Setup (Phase 1)

**Goal:** Establish the development environment, install all dependencies, and remove boilerplate to start from a clean slate.

### Files Created / Modified
- `package.json` — dependency manifest
- `vite.config.js` — build tool configuration
- `index.css` — global styles entry point
- `src/App.jsx` — application shell (cleaned)

### Step 1 — Scaffolding with Vite

The project was initialized using Vite's official React template. Vite was selected over Create React App because of its **native ES module development server**, which avoids bundling during development and results in near-instant hot module replacement (HMR). This is critically important for a canvas application, where a full page reload would destroy any in-progress drawing state.

```bash
# Initialize new Vite + React project in the current directory
npm create vite@latest . -- --template react

# Install base dependencies
npm install
```

### Step 2 — Installing TailwindCSS v4

TailwindCSS v4 introduces a breaking change from v3: configuration is done entirely in CSS, not in a JavaScript config file. The only required setup is a single `@import` directive.

```bash
npm install -D tailwindcss @tailwindcss/vite
```

`vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

`index.css`:
```css
@import "tailwindcss";
```

### Step 3 — Installing Lucide React

```bash
npm install lucide-react
```

Lucide React provides clean, tree-shakeable SVG icon components. Since Vite performs ESM-based dead code elimination, only the icons actually imported are included in the production bundle.

### Step 4 — Cleaning Boilerplate

The default Vite template includes a counter demo, Vite and React logo assets, and CSS animations for those logos. All of this was removed. `App.jsx` was reduced to a minimal layout shell:

```jsx
// src/App.jsx — After cleanup
function App() {
  return (
    <main className="w-screen h-screen bg-[#121212] overflow-hidden relative">
      {/* CanvasBoard will be mounted here in Phase 2 */}
    </main>
  );
}
export default App;
```

**Outcome:** A dark-background, full-screen shell ready to receive the canvas component.

---

## 4.2 Canvas Rendering Foundation (Phase 2)

**Goal:** Create the `CanvasBoard` component with a pixel-perfect, DPI-aware canvas, a dot-grid background renderer, and a working pan interaction.

### Files Created / Modified
- `src/components/CanvasBoard.jsx` — **[NEW]** core canvas orchestrator
- `src/App.jsx` — modified to mount `<CanvasBoard />`

### Key Design Decision: Immediate-Mode Rendering

The HTML5 Canvas 2D API uses **immediate-mode rendering** — there is no scene graph or DOM of drawn shapes. Every single frame, the entire canvas must be cleared and redrawn from scratch. This is fundamentally different from SVG (retained-mode) and is the reason why the `draw()` function is the heartbeat of the entire application.

### Function: `resizeCanvas()`

High-DPI displays (Retina screens) have a `window.devicePixelRatio` greater than 1 (commonly 2 on modern MacBooks and 4K monitors). If the canvas logical resolution is not scaled up to match the physical pixel density, all rendering appears blurry. The `resizeCanvas` function solves this:

```javascript
const resizeCanvas = useCallback(() => {
  const canvas = canvasRef.current;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Scale up the canvas memory buffer
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Keep CSS display size the same
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  // Scale all drawing commands to match DPR
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
}, []);
```

This function is called once on mount and again on every `window.resize` event via a `ResizeObserver`.

### Function: `drawGrid(ctx, canvas, cam)`

The infinite dot-grid background creates the perception of an unbounded workspace. The naive approach — iterating over all possible dot positions — would be computationally catastrophic. Instead, the grid is computed using a **modular offset algorithm**:

```javascript
const drawGrid = (ctx, canvas, cam) => {
  const gap = 30;  // pixels between dots in world space
  const dotRadius = 1;

  // Calculate the visible world-space bounds
  const startX = -cam.x / cam.zoom;
  const startY = -cam.y / cam.zoom;
  const endX = (canvas.width / window.devicePixelRatio - cam.x) / cam.zoom;
  const endY = (canvas.height / window.devicePixelRatio - cam.y) / cam.zoom;

  // Find the first dot position that is on-screen
  const offsetX = ((startX % gap) + gap) % gap;
  const offsetY = ((startY % gap) + gap) % gap;

  ctx.fillStyle = '#3b3b4f';
  for (let x = startX - offsetX; x < endX; x += gap) {
    for (let y = startY - offsetY; y < endY; y += gap) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
```

The key insight is the modular offset calculation. By finding the first dot that would appear in the top-left corner of the viewport (`offsetX`, `offsetY`), the loop only iterates over the dots that are actually visible — making it O(screen pixels / gap²) rather than O(world size / gap²).

### Function: `handleWheel(e)` — Zoom Implementation

Mouse-wheel zooming must be handled with a non-passive event listener because `e.preventDefault()` must be called to stop the browser from scrolling the page. The zoom is applied using **logarithmic scaling** to make each scroll increment feel proportional (a 10% zoom-in at 100% feels the same magnitude as a 10% zoom-in at 200%):

```javascript
const handleWheel = useCallback((e) => {
  e.preventDefault();
  const zoomFactor = Math.exp(-e.deltaY * 0.001);
  const newZoom = Math.max(0.5, Math.min(2.0, camera.zoom * zoomFactor));

  // Zoom centered at the mouse cursor position
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const newX = mouseX - (mouseX - camera.x) * (newZoom / camera.zoom);
  const newY = mouseY - (mouseY - camera.y) * (newZoom / camera.zoom);

  setCamera({ x: newX, y: newY, zoom: newZoom });
}, [camera]);
```

The translation formula (`newX = mouseX - (mouseX - camera.x) * ratio`) ensures that the point in world space currently under the mouse cursor remains stationary after the zoom — this is the standard implementation of cursor-relative zoom.

### The `draw()` Function — The Render Loop

The `draw` function is called inside a `requestAnimationFrame` callback scheduled by a `useEffect`:

```javascript
const draw = useCallback(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);

  // 1. Clear
  ctx.clearRect(0, 0, width, height);

  // 2. Save the identity matrix state
  ctx.save();

  // 3. Apply camera transforms (pan + zoom)
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  // 4. Draw background grid (in world space)
  drawGrid(ctx, canvas, camera);

  // 5. Draw all committed elements (added in later phases)

  // 6. Restore identity matrix
  ctx.restore();
}, [camera, drawGrid]);
```

The `ctx.save()` / `ctx.restore()` pair is critical — it ensures that the camera transform matrix is applied only while drawing world-space content. Any screen-space overlays (like the eraser cursor, added later) are drawn after `ctx.restore()`.

**Outcome:** A smooth, infinite dot-grid canvas that pans correctly when the user clicks and drags.

---

## 4.3 Infinite Viewport & Navigation (Phase 3)

**Goal:** Add a toolbar UI overlay, implement tool switching with keyboard shortcuts, add a zoom control widget, and enforce sensible zoom bounds.

### Files Created / Modified
- `src/components/CanvasBoard.jsx` — modified to add `activeTool` state and keyboard handling
- UI JSX for toolbar and zoom controls added inline (extracted in Phase 3v2)

### Tool State Management

A new `activeTool` state was added to `CanvasBoard`:

```javascript
const [activeTool, setActiveTool] = useState('pan');
```

The `handleMouseDown` was updated to branch based on `activeTool`:

```javascript
const handleMouseDown = (e) => {
  if (activeTool === 'pan' || e.button === 1) {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }
  // Tool-specific handlers will be called here in later phases
};
```

### Keyboard Shortcuts

A `keydown` event listener was added to `window`:

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    // Ignore if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'h': case 'H': setActiveTool('pan'); break;
      case 'v': case 'V': case '1': setActiveTool('selection'); break;
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Zoom Controls UI

A zoom control widget was added as an absolutely positioned HTML overlay at the bottom-left of the screen. The zoom percentage label was made double-click resettable — double-clicking instantly resets `camera` to `{ x: 0, y: 0, zoom: 1 }`.

Manual zoom buttons use center-relative zooming:
```javascript
const handleZoomIn = () => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const newZoom = Math.min(2.0, camera.zoom + 0.1);
  setCamera({
    x: centerX - (centerX - camera.x) * (newZoom / camera.zoom),
    y: centerY - (centerY - camera.y) * (newZoom / camera.zoom),
    zoom: newZoom,
  });
};
```

**Outcome:** A fully navigable infinite canvas with keyboard-accessible tool switching and a polished zoom UI.

---

## 4.4 Component Refactoring (Phase 3v2)

**Goal:** Extract the monolithic `CanvasBoard.jsx` into modular child components to prevent it from becoming unmanageable as more tools are added.

### Files Created
- `src/components/ZoomControls.jsx` — **[NEW]**
- `src/components/PanSelectionTools.jsx` — **[NEW]**
- `src/components/CandleTools.jsx` — **[NEW]** (stub for Phase 6)
- `src/components/DrawingTools.jsx` — **[NEW]** (stub for Phase 5)
- `src/components/ExportTool.jsx` — **[NEW]** (stub for Phase 9)

### The Dual-Export Pattern

Every component file in `src/components/` was designed to follow a **dual-export pattern**:

1. A **default export** for the React JSX component (the visual toolbar buttons or controls).
2. **Named exports** for the pure JavaScript logic functions that `CanvasBoard` will call.

This pattern was established in preparation for later phases. For example, `DrawingTools.jsx` would eventually export both the toolbar JSX and the `handleDrawingMouseDown`, `handleDrawingMouseMove`, and `handleDrawingMouseUp` handler functions.

### `ZoomControls.jsx` Extraction

The zoom widget JSX (including `-`, `+` buttons and the percentage display) was moved out of `CanvasBoard.jsx`:

```jsx
// src/components/ZoomControls.jsx
export default function ZoomControls({ camera, handleZoomOut, handleZoomIn, onReset }) {
  return (
    <div className="flex items-center gap-1 bg-[#232329] border border-[#3b3b4f] rounded-lg px-1 py-1">
      <button onClick={handleZoomOut} className="..."><Minus size={14} /></button>
      <span onDoubleClick={onReset} className="... cursor-pointer">
        {Math.round(camera.zoom * 100)}%
      </span>
      <button onClick={handleZoomIn} className="..."><Plus size={14} /></button>
    </div>
  );
}
```

Note that absolute positioning was **removed** from `ZoomControls`. Instead, `CanvasBoard` provides a wrapper `div` with `absolute bottom-6 left-6 flex items-center gap-2`, which hosts both `ZoomControls` and `UndoRedoControls` side by side. This separation of layout from component internals is a best practice.

**Outcome:** `CanvasBoard.jsx` shrunk significantly and became a clean orchestration layer, with each feature's UI delegated to its own file.

---

## 4.5 State Management & Action History (Phase 4)

**Goal:** Implement a time-travel capable undo/redo system using a custom React hook and a history stack before any drawing tools are built.

### Files Created / Modified
- `src/hooks/useHistory.js` — **[NEW]** custom hook
- `src/components/UndoRedoControls.jsx` — **[NEW]** UI component
- `src/components/ZoomControls.jsx` — modified (removed absolute positioning)
- `src/components/CanvasBoard.jsx` — modified to use hook and mount UI

### The `useHistory` Custom Hook

The hook manages the history as a single atomic state object — a critical design decision that prevents the stale-closure race condition described in Phase 5c1:

```javascript
// src/hooks/useHistory.js
import { useState, useCallback } from 'react';

export function useHistory(initialState) {
  const [state, setState] = useState({
    history: [initialState],
    step: 0,
  });

  const setElements = useCallback((newElements, overwrite = false) => {
    setState((prev) => {
      if (overwrite) {
        // Replace the current history step (used by eraser during drag)
        const newHistory = [...prev.history];
        newHistory[prev.step] = newElements;
        return { history: newHistory, step: prev.step };
      } else {
        // Drop any "future" history (if the user had undone) and push new state
        const newHistory = prev.history.slice(0, prev.step + 1);
        newHistory.push(newElements);
        return { history: newHistory, step: prev.step + 1 };
      }
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.max(0, prev.step - 1),
    }));
  }, []);

  const redo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.min(prev.history.length - 1, prev.step + 1),
    }));
  }, []);

  return {
    elements: state.history[state.step],
    setElements,
    undo,
    redo,
    historyStep: state.step,
    history: state.history,
  };
}
```

**Why a single state object?** If `history` and `step` were separate `useState` calls, calling `setElements` rapidly (as the eraser does during a drag) would create a race condition: the `setElements` function's closure captures the value of `step` at the time it was last rendered, but React batches state updates asynchronously. By the time the second `setElements` call runs, it might still see the old `step` value. Merging them into one object and using the **functional update form** (`setState(prev => ...)`) guarantees each update always reads the absolute latest state.

### The `overwrite` Flag

The `setElements` function accepts an optional `overwrite` parameter. When `true`, it replaces the **current** history step instead of pushing a new one. This flag is used by the Eraser tool (Phase 5) to group all erasures in a single drag gesture into one undoable action.

### UndoRedoControls Component

```jsx
// src/components/UndoRedoControls.jsx
export default function UndoRedoControls({ undo, redo, historyStep, historyLength }) {
  return (
    <div className="flex items-center gap-1 bg-[#232329] border border-[#3b3b4f] rounded-lg px-1 py-1">
      <button
        onClick={undo}
        disabled={historyStep === 0}
        className="p-1.5 rounded hover:bg-[#31313d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Undo2 size={16} />
      </button>
      <button
        onClick={redo}
        disabled={historyStep >= historyLength - 1}
        className="p-1.5 rounded hover:bg-[#31313d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Redo2 size={16} />
      </button>
    </div>
  );
}
```

Buttons are `disabled` when at the boundaries of the history stack. The `disabled:opacity-30` and `disabled:cursor-not-allowed` Tailwind classes provide instant visual feedback.

### Keyboard Shortcuts

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') { e.preventDefault(); undo(); }
      if (e.key === 'y' || (e.shiftKey && e.key === 'z')) { e.preventDefault(); redo(); }
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [undo, redo]);
```

**Outcome:** A provably correct, race-condition-free undo/redo system capable of handling rapid sequential calls — ready to support all drawing tools.

---

## 4.6 Basic Drawing Tools (Phase 5)

**Goal:** Implement interactive drawing tools — Box, Trend Line, Arrow, Path, Text, and Eraser — with real-time draft previews, collision detection, and full undo/redo integration.

### Files Created / Modified
- `src/components/DrawingTools.jsx` — **[MODIFIED]** handler and rendering logic added
- `src/utils/math.js` — **[NEW]** geometric utility functions
- `src/components/CanvasBoard.jsx` — modified to wire up drawing events

### New State: `draftElement`

A **draft** is the in-progress shape being drawn before the user releases the mouse. It is stored in React state separately from the committed `elements` array:

```javascript
const [draftElement, setDraftElement] = useState(null);
```

The draft is rendered in the `draw()` loop after all committed elements, giving it a visual "preview" appearance (same styling as a committed element). When the user releases the mouse, the draft is pushed into the history via `setElements` and cleared.

### Coordinate Transformation

Every screen-space mouse coordinate must be converted to world space before being stored in the element or draft:

```javascript
const toWorld = (screenX, screenY) => ({
  x: (screenX - camera.x) / camera.zoom,
  y: (screenY - camera.y) / camera.zoom,
});
```

This ensures that elements placed at zoom level 150% will render at the same position if the user zooms out to 75% — their coordinates are invariant to camera state.

### Element Schema

All elements share a common shape with type-specific additional fields:

```javascript
{
  id: crypto.randomUUID(),  // Unique identifier
  type: 'box' | 'arrow' | 'trendline' | 'path' | 'text' | 'candle',
  x1, y1,          // Start point (world coordinates)
  x2, y2,          // End point (world coordinates)
  // type === 'text': label (string)
  // type === 'path': points ([{x, y}, ...])
  // type === 'candle': open, close, high, low, centerX, color
}
```

### The `drawElement(ctx, el)` Function

A central `drawElement` helper dispatches rendering by element type:

```javascript
const drawElement = (ctx, el) => {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;

  switch (el.type) {
    case 'box':
      ctx.strokeRect(el.x1, el.y1, el.x2 - el.x1, el.y2 - el.y1);
      break;

    case 'trendline':
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
      break;

    case 'arrow': {
      // Draw the shaft
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
      // Compute arrowhead using trigonometry
      const angle = Math.atan2(el.y2 - el.y1, el.x2 - el.x1);
      const headLen = 12;
      ctx.beginPath();
      ctx.moveTo(el.x2, el.y2);
      ctx.lineTo(
        el.x2 - headLen * Math.cos(angle - Math.PI / 6),
        el.y2 - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(el.x2, el.y2);
      ctx.lineTo(
        el.x2 - headLen * Math.cos(angle + Math.PI / 6),
        el.y2 - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
      break;
    }

    case 'path':
      if (el.points.length < 2) break;
      ctx.beginPath();
      ctx.moveTo(el.points[0].x, el.points[0].y);
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y);
      }
      ctx.stroke();
      break;

    case 'text':
      ctx.fillStyle = '#ffffff';
      ctx.font = `${14 / camera.zoom}px Inter, sans-serif`;
      ctx.fillText(el.label, el.x1, el.y1);
      break;
  }
};
```

### Utility File: `src/utils/math.js`

The Eraser tool requires computing the distance from a point to a line segment — not just to the segment's endpoints. A naive point-to-point distance check would only hit the shape at its anchor points.

```javascript
// src/utils/math.js

/**
 * Shortest distance from point P to line segment AB.
 * Uses vector projection to find the nearest point on the segment.
 */
export function distanceToLineSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay); // Segment is a point

  // Project point onto the line, clamped to [0, 1] to stay within segment
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
```

The `isHit(worldX, worldY, el, threshold)` function in `CanvasBoard` uses this utility to detect eraser collisions:

```javascript
const isHit = (wx, wy, el, threshold) => {
  switch (el.type) {
    case 'box':
      return wx >= Math.min(el.x1, el.x2) - threshold &&
             wx <= Math.max(el.x1, el.x2) + threshold &&
             wy >= Math.min(el.y1, el.y2) - threshold &&
             wy <= Math.max(el.y1, el.y2) + threshold;
    case 'trendline':
    case 'arrow':
      return distanceToLineSegment(wx, wy, el.x1, el.y1, el.x2, el.y2) < threshold;
    case 'text':
      return Math.abs(wx - el.x1) < 60 && Math.abs(wy - el.y1) < 20;
    default:
      return false;
  }
};
```

### Path Tool — Double-Click to Finalize

The Path tool builds a `points` array incrementally. Each `mousedown` appends a new point. A double-click finalizes the path:

```javascript
const handleMouseDown = (e) => {
  if (activeTool === 'path') {
    const now = Date.now();
    const isDoubleClick = now - lastClickTimeRef.current < 300;
    lastClickTimeRef.current = now;

    if (isDoubleClick && draftElement?.type === 'path') {
      // Finalize the path
      setElements([...elements, draftElement]);
      setDraftElement(null);
    } else if (draftElement?.type === 'path') {
      // Append a new point
      setDraftElement({ ...draftElement, points: [...draftElement.points, { x: wx, y: wy }] });
    } else {
      // Start a new path
      setDraftElement({ id: crypto.randomUUID(), type: 'path', points: [{ x: wx, y: wy }] });
    }
  }
};
```

**Outcome:** A fully functional digital whiteboard with Box, Arrow, Trend Line, Path, Text, and Eraser tools, all integrated with the history system.

---

## 4.7 Eraser Undo/Redo Bug Fix (Phase 5c1)

**Goal:** Fix a critical bug where the Eraser tool corrupted the undo/redo stack during click-and-drag erasing.

### The Problem

The Eraser tool called `setElements` on every `mousemove` event without an `overwrite` flag. This created a separate history step for every pixel the mouse moved over, flooding the history stack with hundreds of intermediate states. Additionally, because `history` and `step` were originally two separate `useState` values, the `setElements` function's closure captured a **stale** value of `step` between React's asynchronous batch updates, causing the overwrite to target the wrong history index.

### The Fix — Part 1: Atomic State

The `useHistory` hook was refactored to use a single state object instead of two separate pieces of state. This eliminated the stale closure issue entirely, as described in Section 4.5.

### The Fix — Part 2: Stroke Grouping

A `useRef` was added to track whether the current drag gesture has already committed an erase to history:

```javascript
const hasErasedInCurrentStroke = useRef(false);
```

**On `mousedown`:** If an element is hit, push a **new** history step and set the flag to `true`.
**On `mousemove`:** If an element is hit:
- If `hasErasedInCurrentStroke` is `false`: push a **new** step and set the flag to `true`.
- If `hasErasedInCurrentStroke` is `true`: call `setElements(nextElements, true)` — **overwrite** the current step.
**On `mouseup`:** Reset the flag to `false`.

```javascript
// Mouse move handler — eraser logic
if (activeTool === 'eraser') {
  const nextElements = elements.filter(el => !isHit(worldX, worldY, el, 10 / camera.zoom));
  if (nextElements.length < elements.length) {
    if (!hasErasedInCurrentStroke.current) {
      setElements(nextElements);           // First hit: new history step
      hasErasedInCurrentStroke.current = true;
    } else {
      setElements(nextElements, true);     // Subsequent hits: overwrite
    }
  }
}
```

This ensures that drawing a shape, erasing it with a single drag gesture, and pressing `Ctrl+Z` requires exactly **one** undo action to restore the shape — matching user expectation.

**Outcome:** A provably correct eraser with single-step undo semantics for entire drag strokes.

---

---

## 4.8 Trading-Specific Tools — Candlesticks (Phase 6)

**Goal:** Implement the core domain feature of SketchChart — interactive green and red Japanese candlestick tools — with slot-based grid snapping, price-continuity inheritance, and a modular rendering engine.

### Files Created / Modified
- `src/components/CandleTools.jsx` — **[MODIFIED]** full drawing and rendering logic
- `src/components/CanvasBoard.jsx` — modified to wire candle mouse events
- `src/utils/math.js` — modified (candle hit detection added)

### Constants

Two constants govern all candle geometry:

```javascript
const CANDLE_SLOT_SIZE = 18;  // px — horizontal grid unit
const CANDLE_WIDTH     = 14;  // px — body width
```

Every candle's X position must be a multiple of `CANDLE_SLOT_SIZE`. This creates an invisible horizontal time grid, ensuring all candles align perfectly regardless of where the user clicks.

### Function: `drawCandle(ctx, el)`

The rendering function distinguishes between green (bullish) and red (bearish) candles using the standard financial convention:

```javascript
export function drawCandle(ctx, el) {
  const { centerX, open, close, high, low, color } = el;
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = 1;

  // --- Wick (High → Low) ---
  ctx.beginPath();
  ctx.moveTo(centerX, high);
  ctx.lineTo(centerX, low);
  ctx.stroke();

  // --- Body (Open ↔ Close) ---
  // Green: close is visually above open (lower Y value)
  // Red:   open  is visually above close (lower Y value)
  const bodyTopY    = Math.min(open, close);
  const bodyHeight  = Math.abs(close - open);
  ctx.fillRect(centerX - CANDLE_WIDTH / 2, bodyTopY, CANDLE_WIDTH, bodyHeight);
}
```

### Function: `createCandle(worldX, worldY, color, elements)`

This is the spatial-continuity engine. When the user clicks to place a candle, this function:

1. **Snaps X to the grid:** `centerX = Math.round(worldX / CANDLE_SLOT_SIZE) * CANDLE_SLOT_SIZE`
2. **Searches for a left-side neighbour:** Scans existing candles whose `centerX` is within `5 * CANDLE_SLOT_SIZE` to the left of the new snap position.
3. **Inherits the open price:** If a neighbour is found, the new candle's `open` is set to the neighbour's `close`, ensuring seamless price-action continuity.
4. **Falls back to mouse Y:** If no neighbour exists, the candle is centred at the user's `worldY` click position.
5. **Generates default wicks:** A default body height of `60px` is applied, and wicks extend `20px` beyond the body.

```javascript
export function createCandle(worldX, worldY, color, elements) {
  const centerX = Math.round(worldX / CANDLE_SLOT_SIZE) * CANDLE_SLOT_SIZE;

  // Find nearest candle strictly to the left within 5 slots
  const prev = elements
    .filter(el => el.type === 'candle' && el.centerX < centerX
                  && centerX - el.centerX <= 5 * CANDLE_SLOT_SIZE)
    .sort((a, b) => b.centerX - a.centerX)[0];

  const openY  = prev ? prev.close : worldY - 30;
  const closeY = openY + (color === '#10b981' ? -60 : 60); // green goes up
  const highY  = Math.min(openY, closeY) - 20;
  const lowY   = Math.max(openY, closeY) + 20;

  return {
    id: crypto.randomUUID(),
    type: 'candle',
    centerX,
    open: openY, close: closeY,
    high: highY, low: lowY,
    color,
  };
}
```

### Mouse Interaction

Candle placement uses a single `mousedown` (no drag required for initial placement). The draft system shows a live preview candle while the user is dragging — adjusting `close` in real time — before committing on `mouseup`.

### Candle Hit Detection (`math.js`)

The eraser's `isHit` function was extended with a candle branch:

```javascript
case 'candle':
  return Math.abs(wx - el.centerX) <= CANDLE_WIDTH / 2 + threshold
      && wy >= el.high - threshold
      && wy <= el.low  + threshold;
```

**Outcome:** Fully functional green and red candlestick tools with realistic price-continuity chaining and slot-grid alignment.

---

## 4.9 Advanced Selection Tool (Phase 7)

**Goal:** Upgrade the basic selection stub into a full move-and-resize interaction system supporting all element types, with dynamic cursor feedback and financial constraints for candle resizing.

### Files Created / Modified
- `src/utils/math.js` — `getBoundingBox`, `isControlPointHit` added
- `src/components/PanSelectionTools.jsx` — full selection handler logic
- `src/components/CanvasBoard.jsx` — `drawSelectionBox`, cursor management

### New Math Utilities

**`getBoundingBox(el)`** — Returns `{ minX, minY, maxX, maxY }` for any element:

```javascript
export function getBoundingBox(el) {
  switch (el.type) {
    case 'box':
    case 'arrow':
    case 'trendline':
      return {
        minX: Math.min(el.x1, el.x2), maxX: Math.max(el.x1, el.x2),
        minY: Math.min(el.y1, el.y2), maxY: Math.max(el.y1, el.y2),
      };
    case 'path': {
      const xs = el.points.map(p => p.x);
      const ys = el.points.map(p => p.y);
      return { minX: Math.min(...xs), maxX: Math.max(...xs),
               minY: Math.min(...ys), maxY: Math.max(...ys) };
    }
    case 'candle':
      return {
        minX: el.centerX - CANDLE_WIDTH / 2, maxX: el.centerX + CANDLE_WIDTH / 2,
        minY: el.high, maxY: el.low,
      };
  }
}
```

**`isControlPointHit(px, py, el, radius)`** — Returns the handle name string if a resize handle is hit, or `null`:

- For candles: checks 4 named points — `'high'`, `'open'`, `'close'`, `'low'`.
- For other shapes: derives 8 cardinal handles (e.g., `'nw'`, `'n'`, `'ne'`, …) from the bounding box corners and midpoints.

### Selection State

`CanvasBoard` adds two new state variables:

```javascript
const [selectedElementId, setSelectedElementId] = useState(null);
const [dragState, setDragState]                 = useState(null);
// dragState: { type: 'move'|'resize', handle, startX, startY, initialElement }
```

The `initialElement` is a **deep copy** taken at `mousedown`. All move/resize deltas are computed relative to this snapshot — preventing cumulative floating-point drift from repeated small updates.

### Mouse Down — Intent Resolution

```javascript
// Priority order: resize handle → move (inside bbox) → select/deselect
const handle = isControlPointHit(worldX, worldY, selected, 6 / camera.zoom);
if (handle) {
  setDragState({ type: 'resize', handle, startX: worldX, startY: worldY,
                 initialElement: deepCopy(selected) });
} else if (insideBoundingBox(worldX, worldY, selected)) {
  setDragState({ type: 'move',   startX: worldX, startY: worldY,
                 initialElement: deepCopy(selected) });
} else {
  // Try to select a different element the user clicked on
  const hit = elements.find(el => isHit(worldX, worldY, el, 5 / camera.zoom));
  setSelectedElementId(hit?.id ?? null);
  setDragState(null);
}
```

### Mouse Move — Mutation Engine

All mutations are computed from the `initialElement` plus the cumulative `(dx, dy)`:

```javascript
const dx = worldX - dragState.startX;
const dy = worldY - dragState.startY;
const init = dragState.initialElement;
```

**Moving a candle** snaps horizontally to the grid:
```javascript
const rawX  = init.centerX + dx;
newEl.centerX = Math.round(rawX / CANDLE_SLOT_SIZE) * CANDLE_SLOT_SIZE;
newEl.open  = init.open  + dy;
newEl.close = init.close + dy;
newEl.high  = init.high  + dy;
newEl.low   = init.low   + dy;
```

**Resizing a candle** with financial constraints:
```javascript
if (handle === 'close') {
  newEl.close = worldY;
  // Green candle: close must stay above open (lower Y)
  if (color === '#10b981') newEl.close = Math.min(worldY, newEl.open - 2);
  // Red candle:   close must stay below open (higher Y)
  if (color === '#ef4444') newEl.close = Math.max(worldY, newEl.open + 2);
  // Wick must always extend past body
  newEl.high = Math.min(newEl.high, Math.min(newEl.open, newEl.close) - 2);
  newEl.low  = Math.max(newEl.low,  Math.max(newEl.open, newEl.close) + 2);
}
```

**Resizing a standard box** by its southeast handle:
```javascript
if (handle.includes('e')) {
  // Whichever of x1/x2 is rightmost gets updated
  if (init.x2 >= init.x1) newEl.x2 = init.x2 + dx;
  else                     newEl.x1 = init.x1 + dx;
}
if (handle.includes('s')) {
  if (init.y2 >= init.y1) newEl.y2 = init.y2 + dy;
  else                     newEl.y1 = init.y1 + dy;
}
```

### Visual Selection Overlay (`drawSelectionBox`)

Rendered after `ctx.restore()` — in world space, but after the camera transform is re-applied — so it appears correctly positioned over the selected element:

- **Standard shapes:** dashed blue `strokeRect` bounding box + 8 small white `fillRect` handles.
- **Candles:** 4 circular `arc` handles at `high`, `open`, `close`, `low` positions.

### Dynamic Cursor — Zero React Re-renders

On every `mousemove`, the cursor is updated by directly mutating the DOM, bypassing React's render cycle entirely:

```javascript
canvasRef.current.style.cursor = computedCursor;
```

Possible values: `'nwse-resize'`, `'nesw-resize'`, `'ns-resize'`, `'ew-resize'`, `'move'`, `'pointer'`, `'crosshair'`, `'default'`.

**Outcome:** A professional-grade selection, move, and resize system with financially-constrained candle handles and zero-latency cursor feedback.

---

## 4.10 Data Persistence (Phase 8)

**Goal:** Automatically save the complete canvas state (all elements and the full undo/redo history) to `localStorage` on every change, and restore it on page load.

### Files Modified
- `src/hooks/useHistory.js` — lazy initializer + `useEffect` auto-save

### Implementation

The entire persistence logic lives inside `useHistory.js`, keeping `CanvasBoard` completely unaware of storage concerns.

**Step 1 — Lazy Initializer:**

```javascript
const LOCAL_STORAGE_KEY = 'sketchChart_state';

const [state, setState] = useState(() => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate shape before trusting it
      if (parsed.history && typeof parsed.step === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('SketchChart: Failed to load saved state.', e);
  }
  return { history: [initialState], step: 0 };
});
```

The **lazy initializer** (a function passed to `useState`) runs only once at component mount. Using the function form guarantees `localStorage.getItem` is called exactly once — not on every render.

**Step 2 — Auto-Save Effect:**

```javascript
useEffect(() => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('SketchChart: Failed to save state.', e);
  }
}, [state]);
```

The `try/catch` block protects against `QuotaExceededError` — thrown when the browser's 5 MB `localStorage` limit is reached — ensuring the application never crashes due to a storage write failure.

### What is Persisted

The serialized JSON object has the shape:
```json
{
  "history": [
    [],
    [{ "id": "...", "type": "box", "x1": 100, ... }],
    [{ "id": "...", "type": "box", "x1": 100, ... }, { "id": "...", ... }]
  ],
  "step": 2
}
```

Both the complete history array **and** the current step pointer are saved. This means a user can draw, close the browser, reopen, and still press `Ctrl+Z` to undo — the full time-travel state is preserved across sessions.

**Outcome:** Fully transparent, zero-configuration automatic persistence with graceful failure handling.

---

## 4.11 Export to PNG (Phase 9)

**Goal:** Allow users to download a crisp, high-resolution PNG image of all drawn elements via a single button click.

### Files Created / Modified
- `src/utils/math.js` — `getElementsBounds()` added
- `src/components/CanvasBoard.jsx` — `handleExport` function
- `src/components/ExportTool.jsx` — refactored from tool state to action button

### New Utility: `getElementsBounds(elements)`

```javascript
export function getElementsBounds(elements) {
  if (!elements.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  elements.forEach(el => {
    const bb = getBoundingBox(el);
    if (!bb) return;
    minX = Math.min(minX, bb.minX);
    minY = Math.min(minY, bb.minY);
    maxX = Math.max(maxX, bb.maxX);
    maxY = Math.max(maxY, bb.maxY);
  });
  return { minX, minY, maxX, maxY };
}
```

### The `handleExport` Function

```javascript
const handleExport = useCallback(() => {
  if (!elements.length) return;

  const PADDING = 60;
  const SCALE   = 2; // 2x for HiDPI crispness

  const bounds  = getElementsBounds(elements);
  const w = (bounds.maxX - bounds.minX + PADDING * 2) * SCALE;
  const h = (bounds.maxY - bounds.minY + PADDING * 2) * SCALE;

  // 1. Create an off-screen canvas — never attached to the DOM
  const temp = document.createElement('canvas');
  temp.width  = w;
  temp.height = h;
  const ctx = temp.getContext('2d');

  // 2. Fill dark background
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, w, h);

  // 3. Apply scale + translate so elements are padded from the edge
  ctx.scale(SCALE, SCALE);
  ctx.translate(-bounds.minX + PADDING, -bounds.minY + PADDING);

  // 4. Draw every element (reusing the existing drawElement function)
  elements.forEach(el => drawElement(ctx, el, false));

  // 5. Trigger browser file download
  const link      = document.createElement('a');
  link.download   = `SketchChart-${Date.now()}.png`;
  link.href       = temp.toDataURL('image/png');
  link.click();
}, [elements, drawElement]);
```

**Key design choices:**
- The off-screen canvas is **never attached to the DOM**, avoiding layout reflow.
- `SCALE = 2` doubles the pixel density of the exported image, making it look sharp on Retina screens and when printed.
- The `translate` call repositions the world origin so that the top-left-most element is `PADDING` pixels from the image edge — no matter where on the infinite canvas the drawings are.
- `drawElement` is called with `isSelected = false` to suppress any selection overlay rendering in the exported image.

### ExportTool Refactor

The export button was previously wired to `setActiveTool('export')`, which would interrupt the user's current drawing tool. It was refactored to be a **direct-action button**:

```jsx
// src/components/ExportTool.jsx
export default function ExportTool({ onExport }) {
  return (
    <button
      onClick={onExport}
      title="Export to PNG"
      className="p-2 rounded-lg hover:bg-[#31313d] transition-colors text-gray-300"
    >
      <Download size={18} />
    </button>
  );
}
```

**Outcome:** One-click, 2× resolution PNG export that captures all elements with correct dark background, with no disruption to the active drawing tool.

---

## 4.12 Application Menu (Phase 10)

**Goal:** Provide a hamburger menu overlay in the top-left corner housing application-level commands: Reset View and Clear Canvas.

### Files Created / Modified
- `src/components/AppMenu.jsx` — **[NEW]**
- `src/components/CanvasBoard.jsx` — modified to mount `<AppMenu />`

### Component: `AppMenu.jsx`

```jsx
// src/components/AppMenu.jsx
import { useRef, useState, useEffect } from 'react';
import { Menu, RotateCcw, Sparkles } from 'lucide-react';

export default function AppMenu({ setCamera, setElements }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResetView = () => {
    setCamera({ x: 0, y: 0, zoom: 1 });
    setIsOpen(false);
  };

  const handleClearCanvas = () => {
    setElements([]);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="absolute top-4 left-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`p-2 rounded-lg border transition-colors
          ${isOpen
            ? 'bg-blue-600 text-white border-blue-500'
            : 'bg-[#232329] text-gray-300 border-[#3b3b4f] hover:bg-[#31313d]'
          }`}
      >
        <Menu size={18} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="mt-2 w-48 bg-[#232329] border border-[#3b3b4f] rounded-lg shadow-xl overflow-hidden">
          <button onClick={handleResetView}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#31313d] transition-colors">
            <RotateCcw size={15} /> Reset View
          </button>
          <button onClick={handleClearCanvas}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#31313d] transition-colors">
            <Sparkles size={15} /> Clear Canvas
          </button>
        </div>
      )}
    </div>
  );
}
```

### Click-Outside-to-Close

The `useEffect` attaches a `mousedown` listener on the entire `document`. It compares the click target against `menuRef.current` using the native `Node.contains()` API. If the click is outside the menu's DOM subtree, the dropdown is closed. The listener is removed in the cleanup function to prevent memory leaks.

### Integration in `CanvasBoard`

```jsx
<AppMenu
  setCamera={setCamera}
  setElements={(els) => setElements(els)}
/>
```

Passing `setElements` from `useHistory` means that clearing the canvas correctly pushes an empty array as a new history step — making "Clear Canvas" a fully **undoable** action.

**Outcome:** A scalable, accessible application menu with a correct click-outside-close pattern and undo-integrated canvas clearing.

---

# 5. Conclusion

## 5.1 Summary of Achievement

SketchChart was successfully designed and developed as a complete, production-quality, client-side web application. Over the course of ten implementation phases, the project grew from an empty Vite scaffold into a fully featured, infinite-canvas charting whiteboard.

The final application delivers on every objective listed in Section 1.2:

| Objective | Status |
|-----------|--------|
| Infinite canvas with DPI-aware rendering | ✅ Complete |
| Green and red candlestick tools with price continuity | ✅ Complete |
| Box, Arrow, Trend Line, Path, and Text drawing tools | ✅ Complete |
| Full undo/redo history (Ctrl+Z / Ctrl+Y) | ✅ Complete |
| Selection tool with move and resize for all types | ✅ Complete |
| Financial constraint enforcement for candle resizing | ✅ Complete |
| Automatic localStorage persistence | ✅ Complete |
| High-resolution (2×) PNG export | ✅ Complete |
| Professional dark-themed UI with keyboard shortcuts | ✅ Complete |
| Hamburger application menu | ✅ Complete |

The total codebase consists of **8 React component files**, **1 custom hook**, **1 utility module**, and **13 phase documentation files** — all structured to a consistent, single-responsibility pattern.

## 5.2 Innovation and Key Features

Several technical and design decisions in SketchChart go beyond a typical student project:

**1. Atomic History State to Prevent Stale Closures**
The identification and resolution of the React stale-closure race condition in the `useHistory` hook (Phase 5c1) demonstrates a deep understanding of how JavaScript closures interact with React's asynchronous state batching. The fix — merging two state variables into a single atomic object and always using the functional update form — is the same pattern used in production React applications.

**2. Cursor-Relative Logarithmic Zoom**
The zoom implementation uses `Math.exp()` for perceptually uniform scaling and applies the cursor-relative translation formula to keep the point under the mouse cursor stationary. This is the correct mathematical implementation used by Figma and Excalidraw, not a simplified approximation.

**3. Modular Offset Grid Algorithm**
The dot-grid background uses a modular offset calculation that makes grid rendering O(viewport area) rather than O(infinite canvas area). This is the same approach used in production infinite-canvas tools and demonstrates understanding of computational geometry.

**4. Financial Constraint Engine**
The candle resize system enforces real-world trading chart invariants (green close > open, wick always extends past body) at the interaction level. This domain-specific logic distinguishes SketchChart from a generic drawing tool.

**5. Zero-Re-render Cursor Management**
Cursor state is updated by directly mutating `canvasRef.current.style.cursor`, bypassing React's render cycle. This prevents dozens of unnecessary re-renders per second during mouse movement — a critical performance optimization for canvas applications.

**6. Off-Screen Canvas Export**
The PNG export generates a 2× resolution image using an off-screen `<canvas>` element that is never attached to the DOM, ensuring zero visual disruption during export. The `getElementsBounds` utility precisely crops the output to the drawn content, with configurable padding.

## 5.3 Limitations and Future Works

### Current Limitations

| Limitation | Impact |
|------------|--------|
| No touch / stylus support | Application is desktop-only; cannot be used on tablets or phones |
| `window.prompt()` for text input | Interrupts flow; doesn't support rich text or multi-line labels |
| Path tool lacks individual point editing | Cannot reposition a single vertex of a drawn path |
| `localStorage` size limit (~5 MB) | Very complex drawings with long histories could hit quota |
| No color picker | All shapes are white; no per-element color customization |
| No grid snapping for non-candle tools | Box and line tools do not snap to any grid |

### Proposed Future Works

1. **Cloud Sync via Supabase or Firebase:** Replace `localStorage` with a backend database to enable cross-device access and sharing of chart patterns via URL.

2. **Real-time Collaboration:** Integrate a CRDT (Conflict-free Replicated Data Type) library such as `Yjs` with a WebSocket server to allow multiple users to draw on the same canvas simultaneously — the same approach used by Excalidraw Plus.

3. **Touch and Stylus Support:** Add `touchstart`, `touchmove`, and `touchend` event handlers with multi-touch pinch-to-zoom, enabling use on iPads and drawing tablets.

4. **Rich Text Labels:** Replace `window.prompt()` with a floating `<textarea>` element that renders directly on the canvas at the clicked position, supporting multi-line text.

5. **Per-Element Styling:** Add a context toolbar that appears when an element is selected, allowing the user to change stroke color, fill color, line width, and opacity.

6. **Pattern Library:** Implement a searchable panel of common candlestick pattern templates (e.g., Doji, Hammer, Engulfing, Head & Shoulders) that can be dragged onto the canvas with a single click.

7. **Live Market Data Integration:** Connect to a public REST API (such as Binance's public candlestick endpoint) to import real historical OHLC data and render it as a series of pre-drawn candles on the canvas.

8. **Presentation Mode:** Add a "slide" system that allows users to define named viewport positions (pan + zoom) and step through them in sequence — useful for teaching chart analysis to students.

## 5.4 Final Thoughts

SketchChart is the result of a disciplined, planning-first approach to software engineering. By establishing each foundation layer — environment, rendering, camera, state, drawing, interaction, persistence — before building on top of it, the project avoided the most common failure modes of canvas-based applications: retrofitting a coordinate system after the fact, or discovering undo/redo is impossible because state was never structured for it.

The project demonstrates that modern browser APIs — the Canvas 2D API, `localStorage`, `requestAnimationFrame`, `crypto.randomUUID()` — are powerful enough to build professional-grade interactive applications without any backend infrastructure. Every line of rendering, every collision detection algorithm, every state management pattern was written from first principles in pure JavaScript and React.

Most importantly, SketchChart solves a real problem: it gives finance students and retail traders a free, open, browser-native tool to practice drawing and recognising candlestick chart patterns — something that previously required expensive proprietary software or static textbook diagrams.

---

*End of Report*

**SketchChart** — *Designed and developed by Himanshu Kholiya, May 2026.*

