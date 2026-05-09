# Phase 5: Basic Drawing Tools Implementation

In this phase, we expanded the SketchChart application by implementing functional drawing logic for basic tools: **Box, Trend Line (Line), Arrow, Text, and Eraser**. These tools now work perfectly with our infinite canvas camera system and our existing Undo/Redo history tracking.

## 1. Tool Interaction & Event Handling
We updated `CanvasBoard.jsx` to respond intelligently to mouse events based on the `activeTool`.

### Drafting State
To allow users to see a shape as they are drawing it, we introduced a `draftElement` state. 
- On `mousedown`, if a drawing tool (like `box` or `arrow`) is active, we initialize the `draftElement` with the starting coordinates.
- On `mousemove`, we update the `endX` and `endY` properties of the `draftElement` in real-time, giving the user live feedback.
- On `mouseup`, we push the completed `draftElement` into the main `elements` history array and clear the drafting state.

### Coordinate Transformation
Crucially, all mouse coordinates from the DOM (`e.clientX` and `e.clientY`) must be converted into "world coordinates" to respect the user's pan offset and zoom level.
```javascript
const worldX = (mouseX - camera.x) / camera.zoom;
const worldY = (mouseY - camera.y) / camera.zoom;
```

## 2. Rendering System Update
We updated the `draw` loop to render both the saved `elements` and the current `draftElement`. A new `drawElement(ctx, el)` helper function was created to handle the specific Canvas API rendering instructions for each shape type.

- **Box (`ctx.strokeRect`)**: Draws a rectangle using the start and end coordinates.
- **Trend Line (`ctx.moveTo` -> `ctx.lineTo`)**: Draws a simple straight line between two points.
- **Arrow**: Draws a line, and then uses trigonometry (`Math.atan2`, `Math.cos`, `Math.sin`) to calculate and draw two small line segments at the end of the line, forming an arrowhead.
- **Text (`ctx.fillText`)**: For MVP simplicity, we use `window.prompt()` on click to get user input, and then immediately render the resulting text on the canvas at the clicked world coordinates.

## 3. Collision Detection & Eraser Tool
The Eraser tool required a way to mathematically determine if the user's mouse cursor is touching a drawn shape. We created a new utility file (`src/utils/math.js`) to handle these calculations.

### `distanceToLineSegment(px, py, x1, y1, x2, y2)`
We cannot just use a simple point-to-point distance formula. We had to implement a function that calculates the shortest orthogonal distance from the mouse cursor to a finite line segment. This allows us to accurately detect if the user is clicking on or dragging over a Trend Line or an Arrow.

### Erasing Logic
When the `eraser` tool is active, both `mousedown` and `mousemove` trigger the eraser function. This function filters the `elements` array, removing any element where our math utilities detect a "hit" (meaning the mouse distance is within an acceptable threshold or tolerance level).

## Conclusion
With Phase 5 complete, SketchChart now functions as a viable basic digital whiteboard with panning, zooming, shape drawing, erasing, and full history management. This robust foundation prepares us for Phase 6, where we will implement the complex multi-part candlestick objects.
