import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { installReactDomPicker } from '@dom-picker/react'
import './index.css'
import App from './App.jsx'

if (import.meta.env.DEV) {
  installReactDomPicker()
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)