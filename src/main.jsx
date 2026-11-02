import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/barlow/600.css'
import '@fontsource/barlow/700.css'
import '@fontsource/barlow/900-italic.css'
import '@fontsource-variable/noto-sans-sc'
import './styles.css'

import './lib/device.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
