import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
import './Generator.css'
import SoundGenerator from './SoundGenerator'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoundGenerator />
  </StrictMode>,
)
