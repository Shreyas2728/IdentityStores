import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'

const developmentKey=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!developmentKey){
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not defined");
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={developmentKey}>

      <App />
    </ClerkProvider>
  </StrictMode>,
)
