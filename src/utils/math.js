/**
 * Calculates the shortest distance from a point to a line segment.
 * 
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @param {number} x1 - Line Segment Start X
 * @param {number} y1 - Line Segment Start Y
 * @param {number} x2 - Line Segment End X
 * @param {number} y2 - Line Segment End Y
 * @returns {number} Distance from point to line segment
 */
export const distanceToLineSegment = (px, py, x1, y1, x2, y2) => {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
  
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  
  const projX = x1 + t * (x2 - x1);
  const projY = y1 + t * (y2 - y1);
  
  return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
};

/**
 * Checks if a point is inside a rectangle defined by two opposite corners.
 * 
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @param {number} x1 - Corner 1 X
 * @param {number} y1 - Corner 1 Y
 * @param {number} x2 - Corner 2 X
 * @param {number} y2 - Corner 2 Y
 * @returns {boolean} True if point is inside the rectangle
 */
export const isPointInBox = (px, py, x1, y1, x2, y2) => {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  
  return px >= minX && px <= maxX && py >= minY && py <= maxY;
};

/**
 * Checks if a point is near an element for erasing.
 * 
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @param {object} element - The element to check collision with
 * @param {number} tolerance - Allowed distance to consider it a hit
 * @returns {boolean} True if point hits the element
 */
export const isHit = (px, py, element, tolerance = 10) => {
  switch (element.type) {
    case 'box':
      // Check if near any of the 4 edges
      return (
        distanceToLineSegment(px, py, element.startX, element.startY, element.endX, element.startY) <= tolerance || // Top
        distanceToLineSegment(px, py, element.endX, element.startY, element.endX, element.endY) <= tolerance || // Right
        distanceToLineSegment(px, py, element.endX, element.endY, element.startX, element.endY) <= tolerance || // Bottom
        distanceToLineSegment(px, py, element.startX, element.endY, element.startX, element.startY) <= tolerance    // Left
      );
      
    case 'trend_line':
    case 'arrow':
      return distanceToLineSegment(px, py, element.startX, element.startY, element.endX, element.endY) <= tolerance;
      
    case 'path':
      if (!element.points || element.points.length < 2) return false;
      for (let i = 0; i < element.points.length - 1; i++) {
        if (distanceToLineSegment(px, py, element.points[i].x, element.points[i].y, element.points[i+1].x, element.points[i+1].y) <= tolerance) {
          return true;
        }
      }
      return false;

    case 'candle':
      // Check if near wicks
      if (distanceToLineSegment(px, py, element.x, element.high, element.x, element.low) <= tolerance) return true;
      // Check if inside body
      const minBodyY = Math.min(element.open, element.close);
      const maxBodyY = Math.max(element.open, element.close);
      return px >= element.x - 6 && px <= element.x + 6 && py >= minBodyY && py <= maxBodyY;
      
    case 'text':
      // Rough approximation without knowing exact text metrics width
      // We will assume 16px font and roughly 10px width per char
      const approxWidth = element.text.length * 10;
      const approxHeight = 24; // approx height
      // text is drawn with baseline bottom roughly, but let's assume bounding box
      return (
        px >= element.x && px <= element.x + approxWidth &&
        py >= element.y - approxHeight && py <= element.y + 5 // +5 for descenders
      );
      
    default:
      return false;
  }
};

/**
 * Calculates the bounding box of an element.
 * 
 * @param {object} element
 * @returns {object|null} { minX, minY, maxX, maxY }
 */
export const getBoundingBox = (element) => {
  switch (element.type) {
    case 'box':
    case 'trend_line':
    case 'arrow':
      return {
        minX: Math.min(element.startX, element.endX),
        minY: Math.min(element.startY, element.endY),
        maxX: Math.max(element.startX, element.endX),
        maxY: Math.max(element.startY, element.endY)
      };
    case 'candle': {
      const minBodyY = Math.min(element.open, element.close);
      const maxBodyY = Math.max(element.open, element.close);
      return {
        minX: element.x - 6,
        minY: element.high,
        maxX: element.x + 6,
        maxY: element.low
      };
    }
    case 'path': {
      if (!element.points || element.points.length === 0) return null;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      element.points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      });
      return { minX, minY, maxX, maxY };
    }
    case 'text': {
      const approxWidth = element.text.length * 10;
      const approxHeight = 24;
      return {
        minX: element.x,
        minY: element.y - approxHeight,
        maxX: element.x + approxWidth,
        maxY: element.y + 5
      };
    }
    default:
      return null;
  }
};

/**
 * Calculates the bounding box for an array of elements.
 * 
 * @param {Array} elements
 * @returns {object|null} { minX, minY, maxX, maxY }
 */
export const getElementsBounds = (elements) => {
  if (!elements || elements.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach(el => {
    const box = getBoundingBox(el);
    if (box) {
      minX = Math.min(minX, box.minX);
      minY = Math.min(minY, box.minY);
      maxX = Math.max(maxX, box.maxX);
      maxY = Math.max(maxY, box.maxY);
    }
  });

  if (minX === Infinity) return null;

  return { minX, minY, maxX, maxY };
};


/**
 * Checks if a point hits any of the control points or resize handles of an element.
 * 
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @param {object} element - The element
 * @param {number} radius - Radius of the control point
 * @returns {string|null} The name of the hit control point or null
 */
export const isControlPointHit = (px, py, element, radius = 5) => {
  if (element.type === 'candle') {
    const points = {
      high: { x: element.x, y: element.high },
      low: { x: element.x, y: element.low },
      open: { x: element.x, y: element.open },
      close: { x: element.x, y: element.close }
    };

    for (const [key, point] of Object.entries(points)) {
      const dist = Math.sqrt((px - point.x) * (px - point.x) + (py - point.y) * (py - point.y));
      if (dist <= radius) {
        return key;
      }
    }
    return null;
  }

  const bbox = getBoundingBox(element);
  if (!bbox) return null;

  const handlePoints = {
    nw: { x: bbox.minX, y: bbox.minY },
    ne: { x: bbox.maxX, y: bbox.minY },
    sw: { x: bbox.minX, y: bbox.maxY },
    se: { x: bbox.maxX, y: bbox.maxY },
    n: { x: (bbox.minX + bbox.maxX) / 2, y: bbox.minY },
    s: { x: (bbox.minX + bbox.maxX) / 2, y: bbox.maxY },
    w: { x: bbox.minX, y: (bbox.minY + bbox.maxY) / 2 },
    e: { x: bbox.maxX, y: (bbox.minY + bbox.maxY) / 2 }
  };

  for (const [key, point] of Object.entries(handlePoints)) {
    const dist = Math.sqrt((px - point.x) * (px - point.x) + (py - point.y) * (py - point.y));
    if (dist <= radius) {
      return key;
    }
  }

  return null;
};
