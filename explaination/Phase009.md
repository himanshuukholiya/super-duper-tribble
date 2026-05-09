# Phase 9: Export to PNG

This document details the implementation of the `exportToPng` feature, which allows users to download their canvas drawings as a high-resolution PNG image.

## Overview

The feature comprises three main logic flows:
1. **Canvas Rendering Logic:** Generating an in-memory canvas, filling the background, and drawing all elements with the correct scale and padding.
2. **File Download Logic:** Converting the in-memory canvas to a base64 Data URL and triggering a file download.
3. **User Interface Logic:** Updating the existing export button to trigger the export flow instead of acting as an active tool state.

## Step-by-Step Implementation

### Step 1: Element Bounds Calculation (`src/utils/math.js`)
To ensure the exported image only captures the area containing drawn elements, we implemented a function to calculate the total bounding box for all elements.

- We added `getElementsBounds(elements)` to iterate through all canvas elements and compute the minimum and maximum X/Y coordinates using the existing `getBoundingBox` utility.
- If no elements exist, it returns `null` to abort the export early.

### Step 2: Canvas Rendering & Export Logic (`src/components/CanvasBoard.jsx`)
The core export logic is contained within the `handleExport` callback function inside `CanvasBoard.jsx`.

- **Dimensions & Scaling:** 
  - We calculate the image dimensions based on the element bounds plus a padding of `60px`.
  - To increase the download size and ensure a crisp, high-resolution output, we apply a `scale = 2` factor to the width, height, and rendering context.
- **In-Memory Canvas Generation:** 
  - We create a temporary `<canvas>` element dynamically.
  - We fill the background with `#121212` to preserve the dark theme aesthetic of SketchChart.
- **Drawing Elements:**
  - We apply the translation needed to position the elements perfectly relative to the top-left corner, accounting for the padding.
  - We iterate through `elements` and use the existing `drawElement` function. We ensure no selection boxes are rendered by passing `isSelected = false`.
- **Triggering Download:**
  - We generate a Data URL using `tempCanvas.toDataURL('image/png')`.
  - We create a temporary `<a>` element with a `download` attribute (`SketchChart-[timestamp].png`) and simulate a click to initiate the file download to the device.

### Step 3: User Interface Update (`src/components/ExportTool.jsx`)
Previously, the Export button was hooked up to the `activeTool` state, which would disrupt the user's workflow. We refactored it to be a direct, single-fire action button.

- The `ExportTool` component now accepts an `onExport` prop.
- Clicking the button directly invokes `handleExport`, keeping the user's currently selected drawing tool active seamlessly.

## Conclusion

By leveraging a temporary in-memory canvas and reusing our existing shape-drawing logic (`drawElement`), we successfully implemented a robust, high-resolution export feature that perfectly captures the drawn charts without interfering with the user's active tool state.
