# Phase 6: Trading-Specific Tools

This phase focuses on implementing the primary trading charting features: Trend Lines, Paths, and Red/Green Candlesticks.

## 1. Trend Lines
Trend lines function similarly to standard line segments or arrows, but lack the arrowhead at the end. In our `CanvasBoard` component, this interaction was handled identically to the "Arrow" tool:
- **Interaction**: Mousedown to start, drag to adjust the endpoint, mouseup to finish.
- **Rendering**: Uses `ctx.moveTo` and `ctx.lineTo` with a standard `ctx.stroke()`.

## 2. Paths
Paths allow users to draw multi-segment line charts, which are a sequence of connected points forming a continuous path, finishing with an arrow.
- **Interaction Mechanism**: Unlike standard click-and-drag tools, a Path involves clicking to add a new vertex and moving the mouse to draft the connecting line. To end the path, the user double-clicks.
- **Data Structure**: Instead of a simple `startX, startY, endX, endY`, the state requires a `points: [{x, y}, ...]` array.
- **Rendering Loop**:
    ```javascript
    ctx.beginPath();
    ctx.moveTo(el.points[0].x, el.points[0].y);
    for (let i = 1; i < el.points.length; i++) {
      ctx.lineTo(el.points[i].x, el.points[i].y);
    }
    ctx.stroke();
    // Arrow logic for the last segment
    ```

## 3. Candlesticks (Red & Green)
The application supports placing dynamic red and green candlesticks that intelligently snap to a grid.
- **Auto-Snapping (Next 5 Candle Space)**: When the user activates the candle tool, the logic finds the most recently placed candlestick. It enforces a standard gap (e.g., 30 pixels). No matter where the user clicks horizontally, the new candle snaps precisely to a multiple of this gap away from the last candle, keeping the chart organized.
- **Open-Close Mechanism**: 
    - The `open` price defaults to the `close` of the preceding candlestick, ensuring continuity.
    - Dragging the mouse sets the current candle's `close` price.
- **Rendering**:
    - The color matches the tool selected (Green for bullish, Red for bearish).
    - A narrow `fillRect` is drawn for the "Body", and a thin line is drawn between the generated `high` and `low` coordinates for the "Wicks".
