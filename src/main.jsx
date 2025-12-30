import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress TinyMCE event listener warnings (non-critical performance warnings)
if (typeof window !== 'undefined') {
  const originalWarn = console.warn
  console.warn = (...args) => {
    // Filter out TinyMCE non-passive event listener warnings
    if (
      args[0]?.includes?.('[Violation]') &&
      args[0]?.includes?.('non-passive event listener')
    ) {
      return
    }
    originalWarn.apply(console, args)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
