/**
 * DevTools — PART 4: Runtime State Diagnostics (Development Only)
 * 
 * Development tools for debugging and inspecting overlay runtime state.
 * 
 * Design Principles:
 * - Development-only (tree-shakeable)
 * - Pure functions only
 * - No production dependencies
 * - Comprehensive diagnostics
 * 
 * FAZ-3E PATCH #2: All devtools functions should only be called when IS_DEV === true.
 * This ensures they are tree-shaken in production builds.
 */

import type { OverlayRuntimeState } from './types';
import type { ValidationError } from './validation';
import { validateState } from './validation';
import * as elementStore from './elementStore';
import * as selection from './selection';
import * as history from './history';
import * as transactions from './transactions';
// IS_DEV is used implicitly via tree-shaking - functions should only be called when IS_DEV === true

/**
 * State report interface.
 */
export interface StateReport {
  /** Element count */
  elementCount: number;
  /** Selection count */
  selectionCount: number;
  /** Z-order length */
  zOrderLength: number;
  /** History size */
  historySize: number;
  /** Transaction active */
  transactionActive: boolean;
  /** Validation errors */
  validationErrors: ValidationError[];
  /** Element type breakdown */
  elementTypes: Record<string, number>;
  /** Z-order consistency */
  zOrderConsistent: boolean;
  /** Selection consistency */
  selectionConsistent: boolean;
}

/**
 * Generate comprehensive state report.
 * 
 * @param state - State to report on
 * @returns State report
 */
export function generateStateReport(state: OverlayRuntimeState): StateReport {
  const validation = validateState(state);
  
  // Element type breakdown
  const elementTypes: Record<string, number> = {};
  for (const element of state.elements.values()) {
    elementTypes[element.type] = (elementTypes[element.type] || 0) + 1;
  }
  
  // Check z-order consistency
  const zOrderSet = new Set(state.zOrder);
  const elementIds = new Set(state.elements.keys());
  const zOrderConsistent = 
    state.zOrder.length === elementIds.size &&
    state.zOrder.every(id => elementIds.has(id)) &&
    Array.from(elementIds).every(id => zOrderSet.has(id));
  
  // Check selection consistency
  const selectionConsistent = Array.from(state.selection.selectedIds).every(
    id => state.elements.has(id)
  ) && (
    !state.selection.lastSelectedId || state.elements.has(state.selection.lastSelectedId)
  );
  
  return {
    elementCount: elementStore.getElementCount(state.elements),
    selectionCount: selection.getSelectionCount(state.selection),
    zOrderLength: state.zOrder.length,
    historySize: history.getHistorySize(state),
    transactionActive: transactions.isTransactionActive(state),
    validationErrors: validation.errors,
    elementTypes,
    zOrderConsistent,
    selectionConsistent,
  };
}

/**
 * Diagnose state issues.
 * Returns detailed diagnostic information.
 * 
 * @param state - State to diagnose
 * @returns Diagnostic information
 */
export function diagnoseState(state: OverlayRuntimeState): {
  issues: Array<{ severity: 'error' | 'warning' | 'info'; message: string }>;
  statistics: StateReport;
} {
  const report = generateStateReport(state);
  const issues: Array<{ severity: 'error' | 'warning' | 'info'; message: string }> = [];
  
  // Validation errors
  for (const error of report.validationErrors) {
    issues.push({
      severity: 'error',
      message: `[${error.code}] ${error.message}${error.elementId ? ` (element: ${error.elementId})` : ''}`,
    });
  }
  
  // Z-order consistency
  if (!report.zOrderConsistent) {
    issues.push({
      severity: 'error',
      message: 'Z-order inconsistency: z-order array and element store are out of sync',
    });
  }
  
  // Selection consistency
  if (!report.selectionConsistent) {
    issues.push({
      severity: 'error',
      message: 'Selection inconsistency: selected elements not found in element store',
    });
  }
  
  // Transaction active
  if (report.transactionActive) {
    issues.push({
      severity: 'warning',
      message: 'Active transaction detected (should be committed or rolled back)',
    });
  }
  
  // History size
  if (report.historySize > state.history.maxHistorySize) {
    issues.push({
      severity: 'warning',
      message: `History size (${report.historySize}) exceeds limit (${state.history.maxHistorySize})`,
    });
  }
  
  // Empty state
  if (report.elementCount === 0) {
    issues.push({
      severity: 'info',
      message: 'State is empty (no elements)',
    });
  }
  
  return {
    issues,
    statistics: report,
  };
}

/**
 * Pretty print state (for console debugging).
 * 
 * @param state - State to print
 * @returns Formatted string representation
 */
export function prettyPrintState(state: OverlayRuntimeState): string {
  const report = generateStateReport(state);
  const lines: string[] = [];
  
  lines.push('=== Overlay Runtime State ===');
  lines.push('');
  
  lines.push('Elements:');
  lines.push(`  Count: ${report.elementCount}`);
  lines.push(`  Types: ${JSON.stringify(report.elementTypes)}`);
  lines.push('');
  
  lines.push('Selection:');
  lines.push(`  Selected: ${report.selectionCount}`);
  lines.push(`  Last Selected: ${state.selection.lastSelectedId || '(none)'}`);
  lines.push('');
  
  lines.push('Z-Order:');
  lines.push(`  Length: ${report.zOrderLength}`);
  lines.push(`  Consistent: ${report.zOrderConsistent ? '✓' : '✗'}`);
  lines.push('');
  
  lines.push('History:');
  lines.push(`  Size: ${report.historySize}`);
  lines.push(`  Can Undo: ${history.canUndo(state) ? '✓' : '✗'}`);
  lines.push(`  Can Redo: ${history.canRedo(state) ? '✓' : '✗'}`);
  lines.push('');
  
  lines.push('Transaction:');
  lines.push(`  Active: ${report.transactionActive ? '✓' : '✗'}`);
  if (report.transactionActive) {
    const batchSize = transactions.getBatchSize(state);
    lines.push(`  Batch Size: ${batchSize}`);
  }
  lines.push('');
  
  if (report.validationErrors.length > 0) {
    lines.push('Validation Errors:');
    for (const error of report.validationErrors) {
      lines.push(`  [${error.code}] ${error.message}`);
    }
    lines.push('');
  }
  
  lines.push('=== End State Report ===');
  
  return lines.join('\n');
}

/**
 * Diff two states (for debugging state changes).
 * 
 * @param prevState - Previous state
 * @param nextState - Next state
 * @returns Diff report
 */
export function diffState(
  prevState: OverlayRuntimeState,
  nextState: OverlayRuntimeState
): {
  elementsAdded: string[];
  elementsRemoved: string[];
  elementsModified: string[];
  selectionChanged: boolean;
  zOrderChanged: boolean;
  historyChanged: boolean;
  transactionChanged: boolean;
} {
  // Elements added
  const prevElementIds = new Set(prevState.elements.keys());
  const nextElementIds = new Set(nextState.elements.keys());
  const elementsAdded = Array.from(nextElementIds).filter(id => !prevElementIds.has(id));
  const elementsRemoved = Array.from(prevElementIds).filter(id => !nextElementIds.has(id));
  
  // Elements modified
  const elementsModified: string[] = [];
  for (const elementId of prevElementIds) {
    if (nextElementIds.has(elementId)) {
      const prevElement = prevState.elements.get(elementId);
      const nextElement = nextState.elements.get(elementId);
      if (prevElement && nextElement) {
        // Simple deep equality check (can be improved)
        if (JSON.stringify(prevElement) !== JSON.stringify(nextElement)) {
          elementsModified.push(elementId);
        }
      }
    }
  }
  
  // Selection changed
  const prevSelected = Array.from(prevState.selection.selectedIds).sort().join(',');
  const nextSelected = Array.from(nextState.selection.selectedIds).sort().join(',');
  const selectionChanged = 
    prevSelected !== nextSelected ||
    prevState.selection.lastSelectedId !== nextState.selection.lastSelectedId;
  
  // Z-order changed
  const zOrderChanged = JSON.stringify(prevState.zOrder) !== JSON.stringify(nextState.zOrder);
  
  // History changed
  const historyChanged = 
    prevState.history.past.length !== nextState.history.past.length ||
    prevState.history.future.length !== nextState.history.future.length ||
    (prevState.history.present?.id !== nextState.history.present?.id);
  
  // Transaction changed
  const transactionChanged = 
    prevState.transactions.active !== nextState.transactions.active ||
    (prevState.transactions.batch?.length || 0) !== (nextState.transactions.batch?.length || 0);
  
  return {
    elementsAdded,
    elementsRemoved,
    elementsModified,
    selectionChanged,
    zOrderChanged,
    historyChanged,
    transactionChanged,
  };
}

