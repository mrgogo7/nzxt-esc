import { useState, useEffect } from 'react';
import { devMode } from '../../debug/devToggle';

/**
 * Dev mode badge component.
 * 
 * Renders a small floating badge in the top-right corner when in dev mode.
 * Automatically hidden in production builds (tree-shakeable).
 * Reactively updates when dev mode is toggled.
 */
export default function AppDevBadge() {
  const [isDevMode, setIsDevMode] = useState(() => devMode.enabled);

  useEffect(() => {
    // Subscribe to dev mode changes
    const unsubscribe = devMode.subscribe((enabled) => {
      setIsDevMode(enabled);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Don't render if dev mode is disabled
  if (!isDevMode) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '8px',
        right: '8px',
        background: 'rgba(255, 0, 0, 0.25)',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#ff0000',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      DEV MODE
    </div>
  );
}

