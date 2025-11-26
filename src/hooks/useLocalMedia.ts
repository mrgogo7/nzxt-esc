import { useEffect, useRef, useState } from 'react';
import type { AppSettings } from '../constants/defaults';
import { getLocalMedia } from '../storage/localMedia';

export type LocalMediaKind = 'image' | 'video';

export interface UseLocalMediaResult {
  blobUrl: string | null;
  isLoading: boolean;
  isMissing: boolean;
  error: Error | null;
  kind: LocalMediaKind | null;
}

interface UseLocalMediaParams {
  settings: AppSettings;
  activePresetId: string | null;
}

/**
 * React hook for loading local media from IndexedDB.
 *
 * Responsibilities:
 * - Only active when settings.sourceType === 'local'.
 * - Reads blob from IndexedDB using settings.localMediaId (or activePresetId as fallback).
 * - Creates and manages a blob URL, revoking old URLs to avoid leaks.
 * - Protects against race conditions when source or preset changes rapidly.
 *
 * IMPORTANT:
 * - This hook NEVER writes binary data to presets or localStorage.
 * - It only reads from IndexedDB and exposes a blob URL for rendering.
 */
export function useLocalMedia({ settings, activePresetId }: UseLocalMediaParams): UseLocalMediaResult {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMissing, setIsMissing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [kind, setKind] = useState<LocalMediaKind | null>(null);

  const currentUrlRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    // If not in local mode, clear state and revoke any existing blob URL
    if (settings.sourceType !== 'local') {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
      setBlobUrl(null);
      setIsLoading(false);
      setIsMissing(false);
      setError(null);
      setKind(null);
      return;
    }

    const mediaId = settings.localMediaId || activePresetId;

    if (!mediaId) {
      // Local mode but we don't have an identifier yet – treat as missing
      setBlobUrl(null);
      setIsLoading(false);
      setIsMissing(true);
      setError(null);
      setKind(null);
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    setIsLoading(true);
    setIsMissing(false);
    setError(null);
    setKind(null);

    let cancelled = false;

    (async () => {
      try {
        const record = await getLocalMedia(mediaId);

        // Ignore if this request is stale
        if (cancelled || currentRequestId !== requestIdRef.current) return;

        if (!record) {
          if (currentUrlRef.current) {
            URL.revokeObjectURL(currentUrlRef.current);
            currentUrlRef.current = null;
          }
          setBlobUrl(null);
          setIsLoading(false);
          setIsMissing(true);
          setKind(null);
          return;
        }

        // Determine media kind from MIME type (used later by MediaRenderer)
        const mime = record.mime || '';
        const detectedKind: LocalMediaKind | null =
          mime.startsWith('video/') ? 'video' : mime.startsWith('image/') ? 'image' : null;

        // Create new blob URL and revoke previous one
        const newUrl = URL.createObjectURL(record.blob);
        if (currentUrlRef.current && currentUrlRef.current !== newUrl) {
          URL.revokeObjectURL(currentUrlRef.current);
        }
        currentUrlRef.current = newUrl;

        setBlobUrl(newUrl);
        setIsLoading(false);
        setIsMissing(false);
        setKind(detectedKind);
      } catch (err) {
        if (cancelled || currentRequestId !== requestIdRef.current) return;

        if (currentUrlRef.current) {
          URL.revokeObjectURL(currentUrlRef.current);
          currentUrlRef.current = null;
        }

        setBlobUrl(null);
        setIsLoading(false);
        setIsMissing(true);
        setError(err instanceof Error ? err : new Error(String(err)));
        setKind(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [settings.sourceType, settings.localMediaId, activePresetId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
    };
  }, []);

  return {
    blobUrl,
    isLoading,
    isMissing,
    error,
    kind,
  };
}


