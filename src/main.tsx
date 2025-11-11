import React from 'react'
import { createRoot } from 'react-dom/client'
import Display from './ui/Display'
import Config from './ui/Config'

const params = new URLSearchParams(window.location.search)
const isKraken = params.get('kraken') === '1' // CAM böyle açar

createRoot(document.getElementById('root')!).render(
  isKraken ? <Display /> : <Config />
)
