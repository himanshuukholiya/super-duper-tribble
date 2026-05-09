import React from 'react';

const GreenCandleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="3" x2="12" y2="21" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    <rect x="8" y="7" width="8" height="10" fill="#10b981" rx="1" />
  </svg>
);

const RedCandleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="3" x2="12" y2="21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    <rect x="8" y="7" width="8" height="10" fill="#ef4444" rx="1" />
  </svg>
);

const CandleTools = ({ activeTool, setActiveTool }) => {
  return (
    <>
      <button
        onClick={() => setActiveTool('green_candle')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'green_candle' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Green Candle (G or 2)"
      >
        <GreenCandleIcon />
      </button>
      <button
        onClick={() => setActiveTool('red_candle')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${activeTool === 'red_candle' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-300 hover:bg-[#31313d]'}`}
        title="Red Candle (R or 3)"
      >
        <RedCandleIcon />
      </button>
    </>
  );
};

export const drawCandle = (ctx, el, isSelected = false) => {
  const isGreen = el.candleType === 'green';
  const color = isGreen ? '#10b981' : '#ef4444';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1; 

  const bodyTopY = isGreen ? el.close : el.open;
  const bodyBottomY = isGreen ? el.open : el.close;

  ctx.beginPath();
  ctx.moveTo(el.x, el.high);
  ctx.lineTo(el.x, bodyTopY);
  ctx.moveTo(el.x, bodyBottomY);
  ctx.lineTo(el.x, el.low);
  ctx.stroke();

  const bodyHeight = bodyBottomY - bodyTopY;
  const CANDLE_WIDTH = 14; 
  ctx.fillRect(el.x - CANDLE_WIDTH / 2, bodyTopY, CANDLE_WIDTH, bodyHeight);
};

export const createCandle = (x, y, variant, openY) => {
  const bodyHeight = 60;
  const wickLen = 20;
  
  let bodyTop;
  let bodyBottom;

  if (openY !== undefined) {
      if (variant === 'green') {
          // Green: Price goes UP. Open is Lower (High Y) -> Body Bottom
          bodyBottom = openY;
          bodyTop = openY - bodyHeight;
      } else {
          // Red: Price goes DOWN. Open is Higher (Low Y) -> Body Top
          bodyTop = openY;
          bodyBottom = openY + bodyHeight;
      }
  } else {
      bodyTop = y - bodyHeight / 2;
      bodyBottom = y + bodyHeight / 2;
  }
  
  // Map back to our open/close schema
  let open, close;
  if (variant === 'green') {
      open = bodyBottom;
      close = bodyTop;
  } else {
      open = bodyTop;
      close = bodyBottom;
  }

  return {
      id: Date.now(),
      type: 'candle',
      candleType: variant,
      x,
      open,
      close,
      high: bodyTop - wickLen,
      low: bodyBottom + wickLen,
      color: variant === 'green' ? '#10b981' : '#ef4444'
  };
};

export const handleCandleMouseDown = ({ worldX, worldY, activeTool, elements, setElements }) => {
  const CANDLE_SLOT_SIZE = 18;
  const snapToSlot = (val, size) => Math.round(val / size) * size;
  
  if (activeTool === 'green_candle' || activeTool === 'red_candle') {
      const variant = activeTool === 'green_candle' ? 'green' : 'red';
      const snappedX = snapToSlot(worldX, CANDLE_SLOT_SIZE);
      
      // --- Continuity Logic ---
      // Search for reference candle to the left
      const searchRange = 5 * CANDLE_SLOT_SIZE;
      let openY = undefined;

      // Filter elements: must be candle, must be to the left, must be within range
      const candidates = elements.filter(el => 
          el.type === 'candle' &&
          el.x < snappedX && // strictly left
          el.x >= snappedX - searchRange
      );

      if (candidates.length > 0) {
          // Find the one with largest X (closest to current from the left)
          candidates.sort((a, b) => b.x - a.x);
          const prev = candidates[0];
          
          // Determine previous close
          // Green: Close is Top (bodyTopY). Red: Close is Bottom (bodyBottomY).
          const bodyTopY = prev.candleType === 'green' ? prev.close : prev.open;
          const bodyBottomY = prev.candleType === 'green' ? prev.open : prev.close;
          const prevClose = prev.candleType === 'green' ? bodyTopY : bodyBottomY;
          openY = prevClose;
      }
      // --- End Continuity Logic ---

      const newCandle = createCandle(snappedX, worldY, variant, openY);
      setElements([...elements, newCandle]);
      return;
  }
};

export default CandleTools;

