# Phase 10: Application Menu (Hamburger Menu)

## Objective
Implement a top-left hamburger menu to house application-wide actions, starting with "Reset View" and "Clear Canvas". The design and functionality should be inspired by modern canvas applications like Excalidraw, aligning seamlessly with the existing dark mode UI of SketchChart.

## Requirements
1. **Hamburger Menu Toggle:** A button in the top-left corner that opens a dropdown menu.
2. **Reset View:** An option to reset the camera's panning (x, y) and zoom level back to default values.
3. **Clear Canvas:** An option to remove all drawn elements from the canvas.
4. **UI Styling:** The menu should match the SketchChart aesthetic (dark gray background, rounded borders, hover effects, Lucide-react icons).

## Implementation Details

### 1. Creating the `AppMenu` Component
A new component `src/components/AppMenu.jsx` was created to encapsulate the menu logic and UI.

- **State Management:** Uses `useState` for toggling the `isOpen` state of the menu dropdown.
- **Click Outside to Close:** Implemented a `useEffect` hook listening for `mousedown` events on the `document`. It checks if the click occurred outside the `menuRef` and closes the dropdown if so. This provides a natural user experience.

### 2. Adding Menu Actions
The `AppMenu` component accepts two props from `CanvasBoard.jsx`: `setCamera` and `setElements`.

- **`handleResetView`:** Resets the camera state to `{ x: 0, y: 0, zoom: 1 }` and closes the menu.
- **`handleClearCanvas`:** Resets the elements array to `[]` and closes the menu.

### 3. Integrating with `CanvasBoard.jsx`
The `AppMenu` was imported into the main `CanvasBoard.jsx` component and positioned absolutely in the top-left corner (`absolute top-4 left-4 z-50`).

### 4. UI Design & Icons
- The toggle button features an active state (`bg-[#3b82f6] text-white`) when the menu is open, mimicking the toolbar buttons.
- The dropdown itself uses the consistent dark background (`bg-[#232329]`) with subtle borders (`border-[#3b3b4f]`).
- Icons from `lucide-react` were used:
  - `<Menu />` for the hamburger toggle.
  - `<RotateCcw />` for "Reset View".
  - `<Sparkles />` for "Clear Canvas".

## Summary
The addition of the `AppMenu` provides a scalable foundation for application-level commands, keeping the main drawing toolbar uncluttered while making crucial canvas management actions readily accessible.
