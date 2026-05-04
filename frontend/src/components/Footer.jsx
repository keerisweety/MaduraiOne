import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🚌</span> MaduraiOne Transport
            </h3>
            <p className="text-gray-400">Your complete guide to all transport options in Madurai.</p>
          </div>
            <div>
            <h4 className="font-semibold mb-4">Transport Types</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/bus-booking" className="text-yellow-400 hover:text-yellow-300 font-semibold">🎫 TNSTC Bus Tickets</Link>
              <Link to="/transports/bus" className="text-gray-400 hover:text-white">🚌 Bus Services</Link>
              <Link to="/transports/auto" className="text-gray-400 hover:text-white">🛺 Auto Rickshaw</Link>
              <Link to="/transports/car" className="text-gray-400 hover:text-white">🚗 Car/Taxi</Link>
              <Link to="/transports/bike" className="text-gray-400 hover:text-white">🏍️ Bike Taxi</Link>
              <Link to="/transports/train" className="text-gray-400 hover:text-white">🚂 Train Station</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Madurai, Tamil Nadu, India</p>
            <p className="text-gray-400">help@maduraione.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 MaduraiOne Transport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
