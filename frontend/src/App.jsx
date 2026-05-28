import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './component/nav'
import Dashboard from './component/dashboard'
import Homepage from './component/homepage'
import RegisterCustomer from './component/registerCustomer'
import AddressDetails from './component/addressDetails'

function App() {
  return (  
    <Router>
      <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden">
        <Nav />
        <div className="flex-grow flex flex-col relative overflow-hidden">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<RegisterCustomer />} />
            <Route path="/address" element={<AddressDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
