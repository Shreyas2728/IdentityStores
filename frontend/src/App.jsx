import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Nav from './component/nav'
import Dashboard from './component/dashboard'
import RegisterCustomer from './component/registerCustomer'
import AddressDetails from './component/addressDetails'
function App() {
  return (  
              </div>
            } />
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
