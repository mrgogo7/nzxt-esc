/**
 * Pinterest Media Extractor Test Page
 * TEST ONLY - This component will be removed after testing.
 * 
 * Access via: ?test=1
 */

import React, { useState } from 'react';
import { fetchPinterestMedia, normalizePinterestUrl } from '../../utils/pinterest';
import { getMediaType } from '../../utils/media';
import './PinterestTest.css';

export default function PinterestTest() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMediaUrl(null);

    try {
      const normalized = normalizePinterestUrl(url);
      if (!normalized) {
        setError('Invalid Pinterest URL format. Example: https://tr.pinterest.com/pin/685391637080855586/');
        setLoading(false);
        return;
      }

      const extractedUrl = await fetchPinterestMedia(url);
      
      if (extractedUrl) {
        setMediaUrl(extractedUrl);
      } else {
        setError('Media URL not found. Pinterest page structure may have changed.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error('[PinterestTest] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mediaType = mediaUrl ? getMediaType(mediaUrl) : null;

  return (
    <div className="pinterest-test">
      <div className="pinterest-test-container">
        <h1>Pinterest Media Extractor Test</h1>
        <p className="pinterest-test-description">
          Test page for extracting media URLs from Pinterest pin URLs.
        </p>

        <form onSubmit={handleSubmit} className="pinterest-test-form">
          <div className="pinterest-test-input-group">
            <label htmlFor="pinterest-url">Pinterest Pin URL:</label>
            <input
              id="pinterest-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://tr.pinterest.com/pin/685391637080855586/ or https://pin.it/2h7rjiNxi"
              disabled={loading}
              className="pinterest-test-input"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !url.trim()}
            className="pinterest-test-button"
          >
            {loading ? 'Extracting...' : 'Extract'}
          </button>
        </form>

        {error && (
          <div className="pinterest-test-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {mediaUrl && (
          <div className="pinterest-test-result">
            <div className="pinterest-test-url-display">
              <strong>Found Media URL:</strong>
              <a 
                href={mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pinterest-test-url-link"
              >
                {mediaUrl}
              </a>
            </div>

            <div className="pinterest-test-media-preview">
              {mediaType === 'video' ? (
                <video
                  src={mediaUrl}
                  autoPlay
                  loop
                  muted
                  controls
                  className="pinterest-test-video"
                >
                  Your browser does not support video playback.
                </video>
              ) : mediaType === 'image' ? (
                <img
                  src={mediaUrl}
                  alt="Pinterest Media"
                  className="pinterest-test-image"
                />
              ) : (
                <div className="pinterest-test-unknown">
                  Unknown media type. Try opening the URL directly.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

