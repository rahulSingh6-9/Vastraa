import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext.jsx'
import ScrollRestoration from './components/ScrollRestoration.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <ScrollRestoration />
        <App />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
