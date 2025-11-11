import React, { useEffect, useState } from 'react'
import { getMediaUrl, setMediaUrl } from '../storage'

const wrap: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background: '#121212',
  color: '#fff',
  fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  padding: 24,
}
const card: React.CSSProperties = {
  width: 680, maxWidth: '90vw',
  background: '#1e1e1e', padding: 20, borderRadius: 12,
  boxShadow: '0 10px 30px rgba(0,0,0,.35)',
}

export default function Config() {
  const [url, setUrlState] = useState('')

  useEffect(() => { setUrlState(getMediaUrl()) }, [])

  function save() {
    const u = url.trim()
    if (!u) { alert('Lütfen geçerli bir URL girin.'); return }
    setMediaUrl(u)
    alert('URL kaydedildi. LCD birkaç saniye içinde güncellenecek.')
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <h2 style={{marginTop:0}}>NZXT Pinterest Integration</h2>
        <p>MP4 veya JPG/PNG/GIF URL’si girin (Pinterest dosya URL’si):</p>
        <input
          value={url}
          onChange={(e)=>setUrlState(e.target.value)}
          placeholder="https://…/file.mp4 veya file.jpg"
          style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #333',background:'#0f0f0f',color:'#fff'}}
        />
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button onClick={save} style={btn}>Kaydet</button>
          <a href="./" target="_blank" style={{...btn, background:'#2d2d2d', textDecoration:'none', display:'inline-flex', alignItems:'center', justifyContent:'center'}}>Display’i Aç</a>
        </div>
        <p style={{opacity:.7, marginTop:12, fontSize:14}}>
          Örnekler:<br/>
          • https://i.pinimg.com/736x/1d/86/4f/1d864fa96a5484f6e573e6cf9566579d.jpg<br/>
          • https://v1.pinimg.com/videos/mc/720p/ca/8b/7a/ca8b7a52c9444fed5ddbcd40a704188e.mp4
        </p>
      </div>
    </div>
  )
}

const btn: React.CSSProperties = {
  background:'#e6007a', color:'#fff', border:'none', borderRadius:8, padding:'10px 16px',
  cursor:'pointer'
}
