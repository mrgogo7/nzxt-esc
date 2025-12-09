import { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS } from '../constants/storage';
import { getMediaUrl, setMediaUrl, subscribe } from '../utils/storage';
import { useStorageSync } from './useStorageSync';

/**
 * Hook for managing media URL.
 * Uses storage.ts module for cross-process compatibility.
 * Also listens to direct localStorage 'media_url' key for backward compatibility.
 * 
 * @returns Media URL and setter function
 */
export function useMediaUrl() {
  // Try to get URL from multiple sources (priority order)
  const getInitialUrl = (): string => {
    // 1. Try storage.ts (with cookie fallback) - this is the source of truth
    // Check if localStorage key exists first (to distinguish between "not set" and "empty string")
    let storageKeyExists = false;
    try {
      storageKeyExists = localStorage.getItem('media_url') !== null;
    } catch (e) {
      // Ignore
    }
    
    const fromStorage = getMediaUrl();
    // If storage key exists (even with empty string), use it as source of truth
    // Empty string is a valid value (means cleared), so return it
    if (storageKeyExists) {
      return fromStorage;
    }
    
    // 2. Try direct localStorage 'media_url' key (backward compatibility)
    try {
      const fromLocalStorage = localStorage.getItem(STORAGE_KEYS.MEDIA_URL);
      if (fromLocalStorage !== null) return fromLocalStorage;
    } catch (e) {
      // localStorage read failed
    }
    
    // 3. Try config object (ConfigPreview writes URL there for backward compatibility)
    // Only if storage.ts is truly empty (not set, not just empty string)
    try {
      const configStr = localStorage.getItem(STORAGE_KEYS.CONFIG) || 
                        localStorage.getItem(STORAGE_KEYS.CONFIG_COMPAT);
      if (configStr) {
        const config = JSON.parse(configStr);
        if (config.url) return config.url;
      }
    } catch (e) {
      // Ignore parse errors
    }
    
    return '';
  };

  const [mediaUrl, setMediaUrlState] = useState<string>(getInitialUrl());
  const lastCheckedUrlRef = useRef<string>('');

  // Subscribe to storage.ts changes (handles cross-process sync)
  useEffect(() => {
    const unsubscribe = subscribe((url) => {
      // Handle both empty and non-empty URLs (important for reset functionality)
      // Use ref to avoid stale closure issues
      if (url !== lastCheckedUrlRef.current) {
        setMediaUrlState(url);
        lastCheckedUrlRef.current = url;
      }
    });
    return () => {
      unsubscribe();
    };
  }, []); // Empty deps - subscribe once, use ref for current value

  // Also listen to direct localStorage 'media_url' key (for Config.tsx compatibility)
  // BUT: Don't call setMediaUrl() here to avoid circular updates
  // storage.ts is the source of truth, localStorage is just a mirror
  useStorageSync(STORAGE_KEYS.MEDIA_URL, (newValue) => {
    // Handle both empty and non-empty URLs (important for reset functionality)
    const urlValue = newValue || '';
    if (urlValue !== mediaUrl && urlValue !== lastCheckedUrlRef.current) {
      setMediaUrlState(urlValue);
      lastCheckedUrlRef.current = urlValue;
      // DON'T call setMediaUrl() here - it would create a circular update
      // storage.ts should be updated by updateMediaUrl() function only
    }
  }, true); // immediate = true to get initial value

  // Listen to config object changes (ConfigPreview writes URL there for backward compatibility)
  // But we prioritize storage.ts as the source of truth
  // IMPORTANT: Only sync from config if storage.ts key doesn't exist (truly empty, not cleared)
  useEffect(() => {
    const checkConfigUrl = () => {
      try {
        // Check if storage.ts key exists (even with empty string, key exists means it was set/cleared)
        const storageKeyExists = localStorage.getItem('media_url') !== null;
        
        // Only sync from config if storage.ts key doesn't exist (backward compatibility)
        // If key exists (even with empty string), it means storage.ts is the source of truth
        if (storageKeyExists) {
          return; // Don't override storage.ts
        }
        
        const configStr = localStorage.getItem(STORAGE_KEYS.CONFIG) || 
                          localStorage.getItem(STORAGE_KEYS.CONFIG_COMPAT);
        if (configStr) {
          const config = JSON.parse(configStr);
          // Only sync if config has URL and storage.ts key doesn't exist
          if (config.url && config.url !== lastCheckedUrlRef.current) {
            setMediaUrlState(config.url);
            lastCheckedUrlRef.current = config.url;
            // Sync to storage.ts (source of truth)
            setMediaUrl(config.url);
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    };

    const onConfigChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.CONFIG || e.key === STORAGE_KEYS.CONFIG_COMPAT) {
        checkConfigUrl();
      }
    };

    window.addEventListener('storage', onConfigChange);
    // Also check on mount (only once for backward compatibility)
    checkConfigUrl();
    
    return () => window.removeEventListener('storage', onConfigChange);
  }, []); // Empty deps - check once, use ref for current value

  const updateMediaUrl = (url: string) => {
    setMediaUrl(url); // storage.ts (with cookie fallback)
    // Also write directly to localStorage for backward compatibility
    try {
      localStorage.setItem(STORAGE_KEYS.MEDIA_URL, url);
    } catch (e) {
      // localStorage write failed
    }
    setMediaUrlState(url);
  };

  return { mediaUrl, setMediaUrl: updateMediaUrl };
}

