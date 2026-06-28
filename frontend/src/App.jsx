import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TransportList from './pages/TransportList'
import TransportDetail from './pages/TransportDetail'
import Admin from './pages/Admin'
import Footer from './components/Footer'
import BusBooking from './pages/BusBooking'
import BusPayment from './pages/BusPayment'
import BusTicket from './pages/BusTicket'
import QRVerify from './pages/QRVerify'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/transports" element={<TransportList />} />
              <Route path="/transports/:category" element={<TransportList />} />
              <Route path="/transport/:id" element={<TransportDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/bus-booking" element={<BusBooking />} />
              <Route path="/bus-payment" element={<BusPayment />} />
              <Route path="/bus-ticket" element={<BusTicket />} />
              <Route path="/qr-verify" element={<QRVerify />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
