/**
 * RotateCommand.ts
 * 
 * Command for element rotation operations.
 * 
 * This command records element rotation angle changes and can undo/redo them.
 */

import type { Command } from '../ActionHistory';
import type { OverlayElement } from '../../../types/overlay';

/**
 * Rotate command implementation.
 * 
 * Records element rotation angle before and after rotate operation.
 */
export class RotateCommand implements Command {
  type: 'rotate' = 'rotate';
  timestamp: number;

  constructor(
    private element: OverlayElement,
    private oldAngle: number | undefined,
    private newAngle: number | undefined,
    private updateElement: (element: OverlayElement) => void
  ) {
    this.timestamp = Date.now();
  }

  execute(): void {
    // Apply new angle (redo)
    this.updateElement({
      ...this.element,
      angle: this.newAngle === 0 ? undefined : this.newAngle,
    });
  }

  undo(): void {
    // Restore old angle (undo)
    this.updateElement({
      ...this.element,
      angle: this.oldAngle === 0 ? undefined : this.oldAngle,
    });
  }
}

