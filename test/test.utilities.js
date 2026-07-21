import { sendMouse, resetMouse } from '@web/test-runner-commands';

/** Viewport-center of an element, rounded for CDP mouse coordinates. */
export const findCenter = (element) => {
  const { top, left, height, width } = element.getBoundingClientRect();
  return [Math.round(left + width / 2), Math.round(top + height / 2)];
};

/**
 * Drag with real browser mouse input (CDP via sendMouse).
 * Synthetic PointerEvents cannot activate setPointerCapture, so interaction
 * coverage must go through native input.
 */
export const dragBy = async (element, dx, dy) => {
  const [x, y] = findCenter(element);
  await sendMouse({ type: 'move', position: [x, y] });
  await sendMouse({ type: 'down' });
  await sendMouse({ type: 'move', position: [x + dx, y + dy] });
  await sendMouse({ type: 'up' });
};

export const releaseMouse = () => resetMouse();

export const px = (value) => Number(String(value).replace(/px$/, '') || 0);
