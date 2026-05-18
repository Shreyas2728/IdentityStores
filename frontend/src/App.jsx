import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Nav from './component/nav'
import Dashboard from './component/dashboard'

function App() {
  return (  
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-50 font-sans overflow-hidden">
        <Nav />
        <div className="flex-grow flex flex-col relative overflow-hidden">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center flex-grow p-8 text-center h-full">
                <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Welcome to IdentityStores</h1>
                <p className="text-xl text-slate-400 max-w-2xl">Use the navigation above to access the new Dashboard interface and start exploring custom apparel designs.</p>
              </div>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
