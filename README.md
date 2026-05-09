# SketchChart

**Objective:** A web-based application providing an interactive, infinite canvas for drawing and customizing candlestick charting patterns. It is designed for educational purposes, allowing learners to freely create, practice, and save candlestick patterns.

## Tech Stack
- **Frontend Framework:** React (initialized via Vite)
- **Styling:** CSS & TailwindCSS
- **Icons:** Lucide React
- **Graphics Rendering:** HTML5 Canvas API (Native 2D Context)
- **State Persistence:** Browser Local Storage

## Implementation Plan: What to Build First and Why

To ensure a solid foundation, the application will be built progressively. We focus on the core engine before layering on specific tools and user interfaces.

### Phase 1: Project Setup & Core Infrastructure (Current)
* **Action:** Set up React with Vite, configure TailwindCSS, establish the project structure, and install Lucide React.
* **Why:** This creates our development environment. We need Tailwind for rapid UI styling and Vite for fast feedback during development.

### Phase 2: The Canvas Rendering Foundation
* **Action:** Implement a pure React component that wraps an HTML5 `<canvas>`. Handle canvas resizing and device pixel ratio (DPI) adjustments for crisp rendering on high-resolution screens.
* **Why:** The entire app relies on the Canvas API. If the canvas doesn't render perfectly sized to the screen, everything drawn on top of it will be blurred or distorted.

### Phase 3: Infinite Viewport & Navigation (Camera System)
* **Action:** Implement an internal "Camera" state containing X offset, Y offset, and Zoom Level. Add event listeners to allow panning (click and drag) and zooming (mouse wheel).
* **Why:** Before we draw anything permanently, the user needs to be able to move around the "infinite" whiteboard. Everything drawn will need coordinates transformed by this camera logic.

### Phase 4: State Management & Action History
* **Action:** Define the JSON schema for elements (e.g., `{ id, type, x, y, color, ... }`). Implement centralized state (an array of these elements) and a History stack to support **Undo & Redo**.
* **Why:** We need a strictly structured way to store user drawings so we can add or revert changes. We build this before tools so tools can blindly dispatch actions to the central store. 

### Phase 5: Basic Drawing Tools 
* **Action:** Implement interaction logic for the simpler tools: **Line, Arrow, Text, and Eraser**.
* **Why:** Doing basic straight lines and text first allows us to test our dispatch system, rendering loops, and interactions before grappling with the complex multi-part logic of candlestick shapes.

### Phase 6: Trading-Specific Tools
* **Action:** Implement the standout tools: **Red/Green Candlesticks, Trend lines, and Paths**.
* **Why:** This is the core unique feature of the application. Candlesticks will consist of a body (rectangle) and wicks (lines) grouped together mathematically.

### Phase 7: Selection & Transformation
* **Action:** Implement the **Selection Tool** so users can click on an already drawn candlestick/line, see a bounding box, and drag it to move.
* **Why:** Users will make mistakes or want to tweak patterns without entirely erasing them. This requires collision detection inside the canvas.

### Phase 8: Data Persistence
* **Action:** Run a background update to stringify the canvas state to JSON and write to `localStorage`.
* **Why:** Essential for retaining student progress without needing a backend server immediately.

### Phase 9: UI Polish, Themes & Export
* **Action:** Build the final Lucide-React powered toolbar. Implement standard Light/Dark/System theme toggles. Build the `exportToPng` feature logic utilizing native canvas data URLs.
* **Why:** This brings the project to MVP completion, making it presentable, user-friendly, and capable of generating the desired graphical output.
