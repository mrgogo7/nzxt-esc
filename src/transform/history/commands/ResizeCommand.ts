/**
 * ResizeCommand.ts
 * 
 * Command for element resize operations.
 * 
 * This command records element size changes and can undo/redo them.
 */

import type { Command } from '../ActionHistory';
import type { OverlayElement, MetricElementData, TextElementData } from '../../../types/overlay';

/**
 * Resize command implementation.
 * 
 * Records element size before and after resize operation.
 */
export class ResizeCommand implements Command {
  type: 'resize' = 'resize';
  timestamp: number;

  constructor(
    private element: OverlayElement,
    private oldSize: number,
    private newSize: number,
    private updateElement: (element: OverlayElement) => void
  ) {
    this.timestamp = Date.now();
  }

  execute(): void {
    // Apply new size (redo)
    this.updateElement(this.updateElementSize(this.element, this.newSize));
  }

  undo(): void {
    // Restore old size (undo)
    this.updateElement(this.updateElementSize(this.element, this.oldSize));
  }

  /**
   * Updates element size based on element type.
   */
  private updateElementSize(element: OverlayElement, size: number): OverlayElement {
    if (element.type === 'metric') {
      return {
        ...element,
        data: {
          ...(element.data as MetricElementData),
          numberSize: size,
        },
      };
    } else if (element.type === 'text') {
      return {
        ...element,
        data: {
          ...(element.data as TextElementData),
          textSize: size,
        },
      };
    }
    return element;
  }
}

