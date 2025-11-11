import React, { useEffect, useState } from 'react'
import { getMediaUrl, subscribe, getViewState, isKraken } from '../storage'

const styles: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#000',
  overflow: 'hidden',
}

export default function Display() {
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    return subscribe(setUrl) // storage + polling
  }, [])

  // İleriye dönük: viewstate ile dinamik ölçek kurabiliriz
  const view = getViewState()
  // şimdilik sadece not: const scale = view / 640

  const isVideo = /\.mp4(\?|$)/i.test(url)
  const isImage = /\.(jpg|jpeg|png|gif)(\?|$)/i.test(url)

  return (
    <div style={styles}>
      {!url && (
        <p style={{ color: '#fff', fontFamily: 'sans-serif', opacity: .8, textAlign:'center' }}>
          No media URL found.<br/>
          {!isKraken() && <>Open <code>/config.html</code> and save a URL.</>}
        </p>
      )}

      {url && isVideo && (
        <video
          src={url}
          autoPlay
          loop
          muted
          playsInline
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: 'none' }}
        />
      )}

      {url && isImage && (
        <img
          src={url}
          alt=""
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: 'none' }}
        />
      )}

      {url && !isVideo && !isImage && (
        <p style={{ color: '#fff', fontFamily: 'sans-serif' }}>Unsupported file type</p>
      )}
    </div>
  )
}
