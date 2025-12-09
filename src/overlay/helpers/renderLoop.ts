/**
 * 60Hz render loop for LCD hardware.
 * 
 * Hard-caps all overlay preview rendering to 60Hz (Kraken Elite LCD hardware spec).
 * Uses requestAnimationFrame with delta time accumulation to ensure consistent frame rate.
 */

/**
 * LCD frame time in milliseconds (60Hz = 16.67ms per frame).
 */
export const LCD_FRAME_MS = 16.67;

/**
 * Starts a 60Hz render loop that calls the callback at most once per frame.
 * 
 * Accumulates delta time and only fires the callback when elapsed >= 16.67ms.
 * This ensures consistent 60Hz rendering regardless of browser refresh rate.
 * 
 * @param cb - Callback function to call at 60Hz
 * @returns Disposer function to stop the loop
 */
export function startRenderLoop(cb: () => void): () => void {
  let isRunning = true;
  let lastTime = performance.now();
  let accumulatedTime = 0;
  let rafId: number | null = null;

  const loop = (currentTime: number) => {
    if (!isRunning) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    accumulatedTime += deltaTime;

    // Only fire callback when accumulated time >= frame time
    if (accumulatedTime >= LCD_FRAME_MS) {
      accumulatedTime -= LCD_FRAME_MS;
      cb();
    }

    // Continue loop
    rafId = requestAnimationFrame(loop);
  };

  // Start the loop
  rafId = requestAnimationFrame(loop);

  // Return disposer
  return () => {
    isRunning = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
