import React, { useEffect, useState } from 'react'
import { getMediaUrl, subscribe } from '../storage'

export default function Display() {
  const [mediaUrl, setMediaUrl] = useState<string>('')

  // CAM -> Display data flow
  useEffect(() => {
    // 1️⃣ URL değişikliklerini izle (cookie/localStorage fallback)
    const unsub = subscribe(setMediaUrl)

    // 2️⃣ CAM "onConfigurationUpdate" callback'ini yakala
    ;(window as any).onConfigurationUpdate = (config: any) => {
      if (config?.mediaUrl) {
        console.log('[NZXT] CAM config received:', config.mediaUrl)
        setMediaUrl(config.mediaUrl)
      }
    }

    // 3️⃣ CAM "onMonitoringDataUpdate" (CPU/GPU vs.) callback'i
    ;(window as any).onMonitoringDataUpdate = (data: any) => {
      // CAM sensör verilerini yakalayabilirsin (örnek)
      // console.log('[NZXT] Monitoring data:', data)
    }

    return () => unsub()
  }, [])

  if (!mediaUrl) {
    return (
      <div
        style={{
          background: '#000',
          color: '#ccc',
          fontFamily: 'system-ui, sans-serif',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 16px',
        }}
      >
        <div>
          <p style={{ marginBottom: 8, fontSize: 18 }}>
            No media URL found.
          </p>
          <p style={{ fontSize: 14 }}>
            Open <code>/config.html</code> and save a URL.
          </p>
        </div>
      </div>
    )
  }

  const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(mediaUrl)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isVideo ? (
        <video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <img
          src={mediaUrl}
          alt="pinterest-media"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  )
}
