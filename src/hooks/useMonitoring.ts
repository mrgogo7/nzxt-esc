/**
 * Monitoring uses the known-good direct window.nzxt.v1.onMonitoringDataUpdate pattern
 * from the backup version to ensure metrics always work in NZXT CAM.
 * Other NZXT interactions still use safeNZXT for spec compliance.
 */

import { useState, useEffect, useRef } from 'react';
import type { OverlayMetrics } from '../types/overlay';
import type { NZXTMonitoringData } from '../types/nzxt';
import { DEFAULT_METRICS } from '../constants/defaults';
import { mapMonitoringToOverlay } from '../utils/monitoring';

const METRIC_POLL_INTERVAL_MS = 1000;

/**
 * Hook for real NZXT monitoring data.
 * Works in both ConfigPreview and KrakenOverlay.
 * Falls back to DEFAULT_METRICS if NZXT API is not available.
 * 
 * Uses direct window.nzxt.v1.onMonitoringDataUpdate assignment (backup pattern)
 * to ensure metrics always work in NZXT CAM.
 * 
 * @returns Current monitoring metrics
 */
export function useMonitoring(): OverlayMetrics {
  const [metrics, setMetrics] = useState<OverlayMetrics>(DEFAULT_METRICS);
  
  const lastUpdateTime = useRef<number>(0);
  const pendingMetricsRef = useRef<OverlayMetrics | null>(null);

  useEffect(() => {
    const handler = (data: NZXTMonitoringData) => {
      try {
        const mapped = mapMonitoringToOverlay(data);
        const now = performance.now();
        
        // Store pending metrics
        pendingMetricsRef.current = mapped;
        
        // Only update if enough time has passed (1Hz = 1000ms)
        const timeSinceLastUpdate = now - lastUpdateTime.current;
        if (timeSinceLastUpdate >= METRIC_POLL_INTERVAL_MS) {
          setMetrics(mapped);
          lastUpdateTime.current = now;
          pendingMetricsRef.current = null;
        }
      } catch (err) {
        // Error handled silently
      }
    };

    // Backup pattern: ALWAYS assign callback, no conditional check
    // This ensures subscription happens even if API detection fails
    const nzxt: any = (window as any).nzxt || {};
    const prevV1 = nzxt.v1 || {};

    const newV1 = {
      ...prevV1,
      onMonitoringDataUpdate: handler,
    };

    (window as any).nzxt = {
      ...nzxt,
      v1: newV1,
    };

    // Fallback interval to ensure pending metrics are applied
    const fallbackInterval = setInterval(() => {
      if (pendingMetricsRef.current) {
        const now = performance.now();
        const timeSinceLastUpdate = now - lastUpdateTime.current;
        if (timeSinceLastUpdate >= METRIC_POLL_INTERVAL_MS) {
          setMetrics(pendingMetricsRef.current);
          lastUpdateTime.current = now;
          pendingMetricsRef.current = null;
        }
      }
    }, METRIC_POLL_INTERVAL_MS);

    // Cleanup on unmount
    return () => {
      clearInterval(fallbackInterval);
      const current = (window as any).nzxt?.v1;
      if (current && current.onMonitoringDataUpdate === handler) {
        // Restore previous callback if it existed, otherwise delete
        if (prevV1.onMonitoringDataUpdate) {
          current.onMonitoringDataUpdate = prevV1.onMonitoringDataUpdate;
        } else {
          delete current.onMonitoringDataUpdate;
        }
      }
    };
  }, []); // Empty deps - only run once on mount

  return metrics;
}

/**
 * Hook for animated mock monitoring data (ConfigPreview only).
 * Used when NZXT API is not available.
 * 
 * @returns Animated mock metrics
 */
export function useMonitoringMock(): OverlayMetrics {
  const [metrics, setMetrics] = useState<OverlayMetrics>(DEFAULT_METRICS);

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 1;
      setMetrics({
        cpuTemp: 40 + 10 * Math.sin(t / 15),
        cpuLoad: (t * 3) % 100,
        cpuClock: 4500 + (t % 200),
        liquidTemp: 35 + 5 * Math.sin(t / 40),
        gpuTemp: 50 + 15 * Math.sin(t / 25),
        gpuLoad: (t * 2) % 100,
        gpuClock: 1800 + (t % 150),
      });
    }, 1000); // Already 1Hz - no change needed

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
