import { useState, useEffect } from 'react';
import type { OverlayMetrics } from '../types/overlay';
import type { NZXTMonitoringData } from '../types/nzxt';
import { DEFAULT_METRICS } from '../constants/defaults';
import { mapMonitoringToOverlay } from '../utils/monitoring';

/**
 * Hook for real NZXT monitoring data.
 * Works in both ConfigPreview and KrakenOverlay.
 * Falls back to DEFAULT_METRICS if NZXT API is not available.
 * 
 * @returns Current monitoring metrics
 */
export function useMonitoring(): OverlayMetrics {
  const [metrics, setMetrics] = useState<OverlayMetrics>(DEFAULT_METRICS);

  useEffect(() => {
    const handler = (data: NZXTMonitoringData) => {
      try {
        const mapped = mapMonitoringToOverlay(data);
        setMetrics(mapped);
      } catch (err) {
        console.error('[useMonitoring] Failed to map monitoring data:', err);
      }
    };

    const prevNzxt = window.nzxt || {};
    const prevV1 = prevNzxt.v1 || {};

    window.nzxt = {
      ...prevNzxt,
      v1: {
        ...prevV1,
        onMonitoringDataUpdate: handler,
      },
    };

    return () => {
      const current = window.nzxt?.v1;
      if (current && current.onMonitoringDataUpdate === handler) {
        delete current.onMonitoringDataUpdate;
      }
    };
  }, []);

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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

