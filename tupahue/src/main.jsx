import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Tupahue } from './Tupahue'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tupahue />
  </StrictMode>,
)
