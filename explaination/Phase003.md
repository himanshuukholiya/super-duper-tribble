# Phase 3: Infinite Viewport & Navigation

This phase implemented the primary infinite canvas viewport interactions: panning, selection tools, and zoom controls. We added Excalidraw-like tools for navigating the canvas combined with intuitive UI overlays, ensuring that the canvas continues to scale properly without affecting the position or scaling of the UI elements.

## 1. Tool State Management
To enable different interaction modes, we introduced an `activeTool` state in `CanvasBoard`.
- By default, it is set to `'pan'`, which mimics the behavior established in Phase 2.
- A new `'selection'` tool state was added.
- The `handleMouseDown` logic was updated so that standard mouse panning only occurs when the `activeTool` is set to `'pan'` (or dynamically if middle/right mouse buttons are pressed).
- The `getCursorStyle` helper updates the canvas CSS cursor depending on the chosen tool (`cursor-grab`/`cursor-grabbing` for panning and `cursor-default` for selection).

## 2. Keyboard Shortcuts
We bound keyboard listeners to facilitate quick-switching between tools, identical to standard digital whiteboards:
- **H key**: Switches to the Pan Tool.
- **V or 1 key**: Switches to the Selection Tool.
- We added a check in `handleKeyDown` to ignore events if the target is an `INPUT` or `TEXTAREA` so typing doesn't accidentally trigger tool switches.

## 3. Zoom Controls & Logic Updates
We overhauled the canvas scaling controls:
- **Range Constraints**: Both the `handleWheel` scrolling and the manual zoom buttons clamp the zoom ratio strictly between `0.5` (50%) and `2.0` (200%).
- **Manual Zoom UI**: Added a sleek dark-themed zoom control overlay at the bottom-left of the screen.
- **Zoom In/Out Buttons**: When users click `+` or `-`, the canvas calculates the logical center of the viewport and mathematically zooms in/out from the center (adjusting camera `x` and `y` offsets appropriately to keep that point static). The buttons adjust the zoom level in increments of ±10% (`0.1`).
- The zoom percentage is prominently displayed in the center of the rounded, translucent pill widget.

## 4. Top Toolbar UI 
We built an overlay toolbar at the top-center of the screen using standard `.absolute` and `.z-10` classes.
- Used open-source `lucide-react` SVG icons (`Hand` for Pan, `MousePointer2` for Selection).
- Added semantic hover attributes highlighting the text and shortcuts (e.g., `"Selection (V or 1)"`).
- Active tools receive an accented background (`bg-blue-600/20 text-blue-500`) to provide instant visual feedback to the user on what mode they are currently in.

## 5. Viewport Rendering Consistency
All the newly introduced UI elements (Toolbar, Zoom Controls) are placed outside the HTML `<canvas>` tag and inside a React Fragment utilizing absolute positioned overlays. 
- *Why:* This achieves exactly what was requested for the bottom-right watermark in Phase 2. The UI remains pixel-perfect and static relative to the browser window. Zooming and panning *solely* manipulates the 2D transform context of the HTML canvas, meaning our grid moves seamlessly underneath our application interface.

## 6. UI Refinements & Hidden Features
- Added standard `cursor-pointer` (hand icon pointer) to all interactive overlay elements including the top toolbar tools and the zoom control.
- **Double-click Reset:** Integrated an `onDoubleClick` event listener effectively binding the zoom percentage label to serve as a fast way to reset the view. Double-clicking it instantly resets the zoom level to default (100%) and returns the canvas origin point defaults (`x: 0`, `y: 0`), discarding whatever offset was changed from panning.
