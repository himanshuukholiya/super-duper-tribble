# Phase 003v2: Refactoring CanvasBoard Toolbar and Zoom Controls

## Objective
The primary goal of this phase is to refactor the monolithic `CanvasBoard.jsx` component by extracting the toolbar and zoom control UI logic into smaller, maintainable separate files. No new functional logic is added; this phase focuses entirely on codebase organization.

## Step-by-Step Implementation

### Step 1: Create Zoom Controls Component
Extracted the zoom control elements from the bottom-left of the canvas into a new file `ZoomControls.jsx`.
- **File**: `src/components/ZoomControls.jsx`
- **Props**: `camera`, `setCamera`, `handleZoomOut`, `handleZoomIn`
- **Action**: Moved the JSX for the `-`, `+`, and percentage display, along with the `Minus` and `Plus` imports from `lucide-react`.

### Step 2: Create Pan and Selection Tools Component
Extracted the general pan and selection tools from the top toolbar into a new file `PanSelectionTools.jsx`.
- **File**: `src/components/PanSelectionTools.jsx`
- **Props**: `activeTool`, `setActiveTool`
- **Action**: Moved the JSX for the Hand and Mouse Pointer buttons, and their respective icon imports from `lucide-react`.

### Step 3: Create Candle Tools Component
Extracted the financial chart specific tools (Red and Green candles) into a new file `CandleTools.jsx`.
- **File**: `src/components/CandleTools.jsx`
- **Props**: `activeTool`, `setActiveTool`
- **Action**: Moved the `GreenCandleIcon` and `RedCandleIcon` SVG definitions along with the button JSX.

### Step 4: Create Drawing Tools Component
Extracted the standard drawing and markup tools into a new file `DrawingTools.jsx`.
- **File**: `src/components/DrawingTools.jsx`
- **Props**: `activeTool`, `setActiveTool`
- **Action**: Moved the button JSX for Box, Arrow, Trend Line, Path, Text, and Eraser. Also relocated the `TrendLineIcon` and `PathIcon` SVG definitions, as well as necessary `lucide-react` imports (`Square`, `ArrowUpRight`, `Type`, `Eraser`).

### Step 5: Create Export Tool Component
Extracted the export button into its own component file `ExportTool.jsx`.
- **File**: `src/components/ExportTool.jsx`
- **Props**: `activeTool`, `setActiveTool`
- **Action**: Moved the Download button JSX and `lucide-react` `Download` import.

### Step 6: Refactor CanvasBoard.jsx
Updated the main `CanvasBoard.jsx` file to consume the newly created components.
- **Action**: 
  - Removed all old UI inline JSX elements for the toolbar and zoom controls.
  - Removed old SVG function components and `lucide-react` imports that are no longer used directly in this file.
  - Imported all five new tool components (`ZoomControls`, `PanSelectionTools`, `CandleTools`, `DrawingTools`, `ExportTool`).
  - Rendered the imported components by passing them the necessary states and functions (`activeTool`, `setActiveTool`, `camera`, `setCamera`, `handleZoomIn`, `handleZoomOut`).

## Conclusion
The `CanvasBoard.jsx` component is now significantly cleaner, focusing more on the core canvas rendering loop, state management, and event handling, while delegating UI rendering to specialized child components.
