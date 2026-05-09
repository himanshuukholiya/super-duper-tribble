# Phase 005c1: Fixing Eraser Tool Undo/Redo

## The Issue
During testing, it was observed that the `eraser` tool did not work properly with the Undo and Redo functionality. When a shape (like a box, arrow, or trend line) was drawn and subsequently erased, attempting to undo the erasure would either not work as expected or require multiple undo actions to restore the shape.

The root cause of this issue was twofold:
1. **Continuous History State Pushing**: The `eraser` logic in `CanvasBoard.jsx` called `setElements` continuously during the `handleMouseMove` event. Without an `overwrite` flag, this flooded the history stack with hundreds of intermediate states (many identical, some just partially erased).
2. **Stale Closure in `useHistory` Hook**: The `useHistory` hook managed the history array and the `historyStep` index as two separate React states. The `setElements` function was wrapped in a `useCallback` that depended on `historyStep`. When `setElements` was called rapidly (such as during a continuous click-and-drag erase with the `overwrite` flag), the closure captured a stale `historyStep` value before React could asynchronously batch update it. This caused the tool to overwrite the wrong history index, completely corrupting the undo/redo stack.

## What Was Corrected
- Refactored the `useHistory` custom hook to merge `history` and `historyStep` into a single, atomic state object. This ensures that updates always reference the absolute latest step and array.
- Updated the `eraser` logic in `CanvasBoard.jsx` to group an entire click-and-drag continuous erase stroke into a single undoable history step.
- Optimized the eraser to only push a new history state if an element was actually hit and removed, preventing identical dummy states from padding the undo stack.

## Step-by-Step Resolution

### 1. Atomic State Refactoring in `useHistory.js`
We combined the `history` array and `historyStep` integer into a single state object:
```javascript
const [state, setState] = useState({
  history: [initialState],
  step: 0,
});
```
By doing this, the `setElements` updater function `setState((prevState) => ...)` has synchronous access to both the latest history and the correct step index. This eliminates the race condition where `overwrite: true` was modifying the wrong index due to stale closures.

### 2. Grouping Eraser Strokes in `CanvasBoard.jsx`
We introduced a `useRef` to track if an erasure had occurred during the current drag interaction:
```javascript
const hasErasedInCurrentStroke = useRef(false);
```

### 3. Handling Initial Erase (Mouse Down)
When the user clicks the eraser, we check if an element is hit. If an element is erased on the initial click, we push a new history step and mark the stroke as having erased something:
```javascript
const nextElements = elements.filter(el => !isHit(worldX, worldY, el, 10 / camera.zoom));
if (nextElements.length < elements.length) {
  setElements(nextElements); // Pushes a new step
  hasErasedInCurrentStroke.current = true;
} else {
  hasErasedInCurrentStroke.current = false;
}
```

### 4. Handling Continuous Erase (Mouse Move)
As the user drags the mouse, if they hit another element, we check if we've already pushed a history step for this stroke. If we haven't, we push one. If we have, we pass `true` to `setElements` to **overwrite** the current step, effectively grouping all erasures in that drag into one undo action:
```javascript
const nextElements = elements.filter(el => !isHit(worldX, worldY, el, 10 / camera.zoom));
if (nextElements.length < elements.length) {
  if (!hasErasedInCurrentStroke.current) {
    setElements(nextElements); // First erase in drag, push new step
    hasErasedInCurrentStroke.current = true;
  } else {
    setElements(nextElements, true); // Already erasing, overwrite current step
  }
}
```

### 5. Resetting State (Mouse Up)
Finally, when the user releases the mouse, we reset the stroke tracker:
```javascript
hasErasedInCurrentStroke.current = false;
```

With these changes, drawing a shape, erasing it, and clicking Undo will cleanly restore the shape in exactly one action, providing a smooth and predictable user experience.
