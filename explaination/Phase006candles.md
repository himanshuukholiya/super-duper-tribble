# Phase 6: Candlestick Design and Logic Implementation

This document details the step-by-step design decisions and programmatic logic implemented to build the Green and Red Candlestick tools in the SketchChart application.

## 1. Visual Design & Rendering (`drawCandle`)

The candlesticks were designed to mimic standard financial charting software, featuring both a solid body and thin wicks extending from the top and bottom.

*   **Colors**: 
    *   Green (Bullish): `#10b981`
    *   Red (Bearish): `#ef4444`
*   **Wicks (High/Low)**: We explicitly set the `ctx.lineWidth` to `1` to make the wicks thin and distinct. A line is drawn connecting the `high` and `low` coordinates to the top and bottom of the body.
*   **Body (Open/Close)**: The body is drawn using `ctx.fillRect`. To achieve a wider appearance, the width is set to `14px` (`CANDLE_WIDTH`). The Y-coordinates for the body are determined dynamically based on the candle type:
    *   **Green**: The `bodyTopY` maps to the `close` (visually higher), and the `bodyBottomY` maps to the `open` (visually lower).
    *   **Red**: The `bodyTopY` maps to the `open` (visually higher), and the `bodyBottomY` maps to the `close` (visually lower).

## 2. Instant Creation & Snapping Logic

The creation of candlesticks follows a precise continuity logic, allowing them to snap sequentially and simulate realistic price action.

*   **Slot-Based Snapping**: Every new candle placed on the canvas snaps its X-coordinate to an invisible grid layout (`CANDLE_SLOT_SIZE` of `18px`). This ensures uniform horizontal spacing between all candles.
*   **Spatial Continuity Logic**: When a candle is drawn, the tool searches spatially for the nearest reference candle located strictly to its left within a `5 * CANDLE_SLOT_SIZE` range.
*   **Price Inheritance**: 
    *   If a candidate candle is found, the newly created candle inherits its `open` price directly from the `close` price of the previous candle. This ensures a seamless chart progression.
    *   If no candle is found within the range, the new candle anchors its center to the user's mouse Y-coordinate, creating a brand new price action sequence.
*   **Default Sizing**: Upon placement, the tool instantly generates a default body height (`60px`) and automatically calculates the `high` and `low` wicks (extending `20px` past the top and bottom of the body). This logic is cleanly abstracted into a standalone `createCandle` function.

## 3. Modularization

To prevent `CanvasBoard.jsx` from becoming bloated, all candlestick-specific logic was extracted into `CandleTools.jsx`.
*   `drawCandle`: Handles the HTML5 Canvas rendering.
*   `createCandle`: Calculates the coordinates and generates the element state payload.
*   `handleCandleMouseDown`: Orchestrates the spatial continuity search, grid snapping, and dispatches the new element to the global state.

## 4. Selection & Resizing Engine

To change the size of a candle after it has been placed, we implemented a robust selection and resizing system using the `Selection` tool (`V` or `1`).

### Hit Detection (`math.js`)
We created a new geometric utility function, `isControlPointHit()`. When a user clicks, this function calculates the Euclidean distance between the mouse pointer and four mathematically defined invisible points on the candlestick (`high`, `low`, `open`, `close`). If the distance is within the `5px` radius, a drag operation begins.

### Resizing and Strict Constraints (`PanSelectionTools.jsx`)
When dragging one of the four control points, the system dynamically updates the coordinate of that specific point while enforcing the following real-world trading constraints:

1.  **Color Integrity (Crossover Prevention)**: 
    *   For a **Green** candle, the `close` must represent a higher price than the `open`. The logic explicitly prevents the `close` point from being dragged physically below the `open` point.
    *   For a **Red** candle, the logic prevents the `close` point from being dragged physically above the `open` point.
2.  **Wick Boundaries**: The `high` wick is strictly prevented from being dragged below the top of the body, and the `low` wick is prevented from crossing the bottom of the body. If the body is resized, the wicks are automatically pushed outward to ensure they always extend past or touch the body.

### Visual UI Adjustments
Initially, the selection tool rendered a dashed blue bounding box and white control points. Based on design preferences, this visual UI was removed. The interactive hit-boxes remain active invisibly, allowing clean, uncluttered resizing.
