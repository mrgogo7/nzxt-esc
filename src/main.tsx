import React from 'react'
import { createRoot } from 'react-dom/client'
import Display from './ui/Display'
import Config from './ui/Config'

const params = new URLSearchParams(window.location.search)
const isConfig = params.has('config')

createRoot(document.getElementById('root')!).render(
  isConfig ? <Config /> : <Display />
)
