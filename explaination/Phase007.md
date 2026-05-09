# Phase 007: Advanced Selection Tool Implementation

This phase focused on upgrading the basic selection tool to a fully-featured, Excalidraw-like interaction system. This allows users to not only select elements, but also freely move and resize them using intuitive bounding boxes and control handles.

## 1. Hit Detection & Bounding Box Utilities (`src/utils/math.js`)

To interact with shapes, the system first needs to understand their spatial boundaries. We added two key utilities:

- **`getBoundingBox(element)`**: This function calculates the absolute mathematical boundaries (`minX`, `minY`, `maxX`, `maxY`) of any given shape. 
  - For simple shapes like **boxes** or **lines**, it's just the minimum and maximum of the `startX/Y` and `endX/Y` properties.
  - For complex shapes like **paths**, it iterates over all drawn points to find the extremes.
  - For **text**, it calculates based on the font size and string length.
- **`isControlPointHit(px, py, element, radius)`**: This function checks if the user clicked exactly on a resize handle.
  - For **candles**, it explicitly checks the 4 key data points: `open`, `close`, `high`, `low`.
  - For **other shapes**, it uses the bounding box to calculate the 8 cardinal handles (North-West, North, North-East, East, South-East, South, South-West, West) and checks if the click landed on any of them.

## 2. Visual Feedback & Rendering (`src/components/CanvasBoard.jsx`)

When an element is selected, the user needs to know what they can do with it. We implemented a dedicated rendering block `drawSelectionBox` that is painted *on top* of the selected element.

- **For Standard Shapes**: It draws a dashed blue rectangle precisely around the shape's bounding box, and 8 small white square handles at the edges and corners.
- **For Candles**: It calculates a tight bounding box around the wick and body. It places 4 circular handles specifically on the High, Open, Close, and Low points.

## 3. Interaction Logic: Move and Resize (`src/components/PanSelectionTools.jsx`)

The interaction lifecycle is broken into three mouse events:

### Mouse Down (`handleSelectionMouseDown`)
When the user clicks, the system decides the intent:
1. **Resize Intent**: Check `isControlPointHit`. If the user clicked a handle, set the drag state to `resize` and record which handle was clicked (e.g., `'nw'`, `'close'`).
2. **Move Intent**: Check if the user clicked inside the bounding box. If so, set the drag state to `move`.
3. **Select/Deselect Intent**: If they clicked outside the bounding box, check if they clicked *on* another shape using `isHit` to select it, otherwise deselect everything.

*Note: We store the `initialElement` state deeply copied into the `dragState`. This is crucial because all dragging is calculated as a delta (`dx`, `dy`) from the original starting point, preventing cumulative rounding errors.*

### Mouse Move (`handleSelectionMouseMove`)
This is the core engine where shapes are mutated based on the `dx` and `dy` of the mouse drag.

#### Logic per Tool Type:

**1. Candlesticks (`candle`)**
- **Moving**: When moving a candle, we apply `dy` to all vertical properties (`open`, `close`, `high`, `low`). For horizontal movement (`dx`), we enforce **grid snapping**. A candle's `x` coordinate is snapped to the nearest multiple of `18` (the `GAP` constant). This ensures that dragged candles always lock perfectly into the chart's horizontal time grid.
- **Resizing**: We directly update the specific property being dragged (e.g., `newEl.close = worldY`). We strictly enforce financial logic: `close` cannot cross `open` based on whether it is a green or red candle. We also ensure the wicks (`high` / `low`) are always attached to or extending past the body (`minBodyY` / `maxBodyY`).

**2. Basic Shapes (`box`, `trend_line`, `arrow`)**
- **Moving**: Both the `start` and `end` coordinate pairs receive the exact `dx` and `dy` deltas, shifting the entire shape without changing its dimensions.
- **Resizing**: The system determines which edge is being dragged based on the handle string (e.g., `'se'` contains `'e'` and `'s'`). If `'e'` (East) is being dragged, it finds the maximum X coordinate (whether that is `startX` or `endX`) and updates it. This allows the bounding box logic to seamlessly stretch lines, arrows, and boxes in any direction. Arrow heads automatically adjust their angle based on the new start and end coordinates.

**3. Complex Shapes (`path`, `text`)**
- **Moving**: For paths, we iterate through every point in the path array and add `dx`/`dy` to shift the whole drawing. For text, we simply shift its origin `x` and `y`.
- **Resizing**: Currently, complex path deformation or font-size scaling via dragging is disabled to maintain simplicity. They only respond to `move` interactions.

### Mouse Up (`handleSelectionMouseUp`)
Releasing the mouse finalizes the mutation by pushing the deeply updated array into the `useHistory` stack, creating a checkpoint that the user can Undo/Redo.

## 4. Dynamic Cursors (`src/components/CanvasBoard.jsx`)

To make the selection tool feel native and professional, the mouse cursor updates in real-time as you hover over different parts of the canvas:

- In `handleMouseMove` of the main canvas, if no dragging is currently happening, we proactively run the hit detection logic.
- If the mouse is hovering over a resize handle (like the North-West corner), the cursor becomes `nwse-resize` (diagonal arrows).
- If the mouse is inside the bounding box of a selected shape, the cursor becomes `move`.
- If the mouse is over an unselected shape, it becomes a `pointer`.
- We apply this by directly mutating `canvasRef.current.style.cursor` to avoid expensive React re-renders on every single mouse pixel movement.
