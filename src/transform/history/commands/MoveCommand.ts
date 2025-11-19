/**
 * MoveCommand.ts
 * 
 * Command for element move operations.
 * 
 * This command records element position changes and can undo/redo them.
 */

import type { Command } from '../ActionHistory';
import type { OverlayElement } from '../../../types/overlay';

/**
 * Move command implementation.
 * 
 * Records element position before and after move operation.
 */
export class MoveCommand implements Command {
  type: 'move' = 'move';
  timestamp: number;

  constructor(
    private element: OverlayElement,
    private oldPosition: { x: number; y: number },
    private newPosition: { x: number; y: number },
    private updateElement: (element: OverlayElement) => void
  ) {
    this.timestamp = Date.now();
  }

  execute(): void {
    // Apply new position (redo)
    this.updateElement({
      ...this.element,
      x: this.newPosition.x,
      y: this.newPosition.y,
    });
  }

  undo(): void {
    // Restore old position (undo)
    this.updateElement({
      ...this.element,
      x: this.oldPosition.x,
      y: this.oldPosition.y,
    });
  }
}

