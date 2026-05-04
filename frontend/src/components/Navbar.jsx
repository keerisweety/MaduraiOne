import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-indigo-deep shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🚌</span>
            <span className="text-xl font-bold text-white">MaduraiOne</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/bus-booking" className="bg-yellow-400 text-indigo-deep px-3 py-1 rounded-lg font-semibold hover:bg-yellow-300">🎫 Bus Ticket</Link>
            <Link to="/transports/bus" className="text-indigo-100 hover:text-white">🚌 Bus</Link>
            <Link to="/transports/auto" className="text-indigo-100 hover:text-white">🛺 Auto</Link>
            <Link to="/transports/car" className="text-indigo-100 hover:text-white">🚗 Car</Link>
            <Link to="/transports/bike" className="text-indigo-100 hover:text-white">🏍️ Bike</Link>
            <Link to="/transports/train" className="text-indigo-100 hover:text-white">🚂 Train</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-indigo-200">Hello, {user.name}</span>
                {user.is_admin === 1 && (
                  <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-indigo-100 hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-indigo-100 hover:text-white">Login</Link>
                <Link to="/register" className="bg-white text-indigo-deep px-4 py-2 rounded-lg hover:bg-indigo-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/bus-booking" className="bg-yellow-400 text-indigo-deep px-3 py-2 rounded-lg font-semibold text-center">🎫 Book Bus Ticket</Link>
              <Link to="/transports/bus" className="text-indigo-100 hover:text-white">🚌 Bus</Link>
              <Link to="/transports/auto" className="text-indigo-100 hover:text-white">🛺 Auto</Link>
              <Link to="/transports/car" className="text-indigo-100 hover:text-white">🚗 Car</Link>
              <Link to="/transports/bike" className="text-indigo-100 hover:text-white">🏍️ Bike</Link>
              <Link to="/transports/train" className="text-indigo-100 hover:text-white">🚂 Train</Link>
              {user ? (
                <>
                  <span className="text-indigo-200">Hello, {user.name}</span>
                  {user.is_admin === 1 && <Link to="/admin" className="text-purple-200">Admin Panel</Link>}
                  <button onClick={handleLogout} className="text-left text-white">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white">Login</Link>
                  <Link to="/register" className="text-indigo-200">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
