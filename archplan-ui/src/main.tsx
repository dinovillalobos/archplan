import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 1. Importamos el motor
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Envolvemos nuestra App con el motor de URLs */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)