/**
 * Alignment helper utilities for overlay elements.
 * Provides distribution, spacing, and z-index management.
 */

import type { OverlayElement } from '../types/overlay';

/**
 * Brings an element to the front (highest z-index).
 */
export function bringToFront(
  elements: OverlayElement[],
  elementId: string
): OverlayElement[] {
  const maxZIndex = Math.max(
    ...elements.map(el => el.zIndex ?? elements.indexOf(el)),
    -1
  );
  
  return elements.map(el => 
    el.id === elementId 
      ? { ...el, zIndex: maxZIndex + 1 }
      : el
  );
}

/**
 * Sends an element to the back (lowest z-index).
 */
export function sendToBack(
  elements: OverlayElement[],
  elementId: string
): OverlayElement[] {
  const minZIndex = Math.min(
    ...elements.map(el => el.zIndex ?? elements.indexOf(el)),
    Infinity
  );
  
  return elements.map(el => 
    el.id === elementId 
      ? { ...el, zIndex: minZIndex - 1 }
      : el
  );
}

/**
 * Distributes elements horizontally with equal spacing.
 */
export function distributeHorizontally(
  elements: OverlayElement[],
  elementIds: string[]
): OverlayElement[] {
  if (elementIds.length < 2) return elements;
  
  const selectedElements = elements.filter(el => elementIds.includes(el.id));
  if (selectedElements.length < 2) return elements;
  
  // Sort by current x position
  const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
  
  // Calculate spacing
  const leftmost = sorted[0].x;
  const rightmost = sorted[sorted.length - 1].x;
  const totalWidth = rightmost - leftmost;
  const spacing = totalWidth / (sorted.length - 1);
  
  // Update positions
  const updated = [...elements];
  sorted.forEach((el, index) => {
    const elementIndex = updated.findIndex(e => e.id === el.id);
    if (elementIndex !== -1) {
      updated[elementIndex] = {
        ...updated[elementIndex],
        x: leftmost + (spacing * index),
      };
    }
  });
  
  return updated;
}

/**
 * Distributes elements vertically with equal spacing.
 */
export function distributeVertically(
  elements: OverlayElement[],
  elementIds: string[]
): OverlayElement[] {
  if (elementIds.length < 2) return elements;
  
  const selectedElements = elements.filter(el => elementIds.includes(el.id));
  if (selectedElements.length < 2) return elements;
  
  // Sort by current y position
  const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
  
  // Calculate spacing
  const topmost = sorted[0].y;
  const bottommost = sorted[sorted.length - 1].y;
  const totalHeight = bottommost - topmost;
  const spacing = totalHeight / (sorted.length - 1);
  
  // Update positions
  const updated = [...elements];
  sorted.forEach((el, index) => {
    const elementIndex = updated.findIndex(e => e.id === el.id);
    if (elementIndex !== -1) {
      updated[elementIndex] = {
        ...updated[elementIndex],
        y: topmost + (spacing * index),
      };
    }
  });
  
  return updated;
}

/**
 * Aligns elements to the left edge of the leftmost element.
 */
export function alignLeft(
  elements: OverlayElement[],
  elementIds: string[]
): OverlayElement[] {
  if (elementIds.length < 2) return elements;
  
  const selectedElements = elements.filter(el => elementIds.includes(el.id));
  if (selectedElements.length < 2) return elements;
  
  const leftmost = Math.min(...selectedElements.map(el => el.x));
  
  const updated = [...elements];
  elementIds.forEach(id => {
    const elementIndex = updated.findIndex(e => e.id === id);
    if (elementIndex !== -1) {
      updated[elementIndex] = {
        ...updated[elementIndex],
        x: leftmost,
      };
    }
  });
  
  return updated;
}

/**
 * Aligns elements to the right edge of the rightmost element.
 */
export function alignRight(
  elements: OverlayElement[],
  elementIds: string[]
): OverlayElement[] {
  if (elementIds.length < 2) return elements;
  
  const selectedElements = elements.filter(el => elementIds.includes(el.id));
  if (selectedElements.length < 2) return elements;
  
  const rightmost = Math.max(...selectedElements.map(el => el.x));
  
  const updated = [...elements];
  elementIds.forEach(id => {
    const elementIndex = updated.findIndex(e => e.id === id);
    if (elementIndex !== -1) {
      updated[elementIndex] = {
        ...updated[elementIndex],
        x: rightmost,
      };
    }
  });
  
  return updated;
}

/**
 * Aligns elements to the top edge of the topmost element.
 */
export function alignTop(
  elements: OverlayElement[],
  elementIds: string[]
): OverlayElement[] {
  if (elementIds.length < 2) return elements;
  
  const selectedElements = elements.filter(el => elementIds.includes(el.id));
  if (selectedElements.length < 2) return elements;
  
  const topmost = Math.min(...selectedElements.map(el => el.y));
  
  const updated = [...elements];
  elementIds.forEach(id => {
    const elementIndex = updated.findIndex(e => e.id === id);
    if (elementIndex !== -1) {
      updated[elementIndex] = {
        ...updated[elementIndex],
        y: topmost,
      };
    }
  });
  
  return updated;
}

/**
 * Aligns elements to the bottom edge of the bottommost element.
 */
export function alignBottom(
  elements: OverlayElement[],
  elementIds: string[]
): OverlayElement[] {
  if (elementIds.length < 2) return elements;
  
  const selectedElements = elements.filter(el => elementIds.includes(el.id));
  if (selectedElements.length < 2) return elements;
  
  const bottommost = Math.max(...selectedElements.map(el => el.y));
  
  const updated = [...elements];
  elementIds.forEach(id => {
    const elementIndex = updated.findIndex(e => e.id === id);
    if (elementIndex !== -1) {
      updated[elementIndex] = {
        ...updated[elementIndex],
        y: bottommost,
      };
    }
  });
  
  return updated;
}

/**
 * Centers elements horizontally (aligns to center x = 0).
 */
export function alignCenterX(
  elements: OverlayElement[],
  elementIds: string[]
): OverlayElement[] {
  const updated = [...elements];
  elementIds.forEach(id => {
    const elementIndex = updated.findIndex(e => e.id === id);
    if (elementIndex !== -1) {
      updated[elementIndex] = {
        ...updated[elementIndex],
        x: 0,
      };
    }
  });
  
  return updated;
}

/**
 * Centers elements vertically (aligns to center y = 0).
 */
export function alignCenterY(
  elements: OverlayElement[],
  elementIds: string[]
): OverlayElement[] {
  const updated = [...elements];
  elementIds.forEach(id => {
    const elementIndex = updated.findIndex(e => e.id === id);
    if (elementIndex !== -1) {
      updated[elementIndex] = {
        ...updated[elementIndex],
        y: 0,
      };
    }
  });
  
  return updated;
}

