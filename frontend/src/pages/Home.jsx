import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TransportCard from '../components/TransportCard'

function Home() {
  const [featuredTransports, setFeaturedTransports] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/api/transports/featured')
      .then(res => res.json())
      .then(data => setFeaturedTransports(data))
      .catch(err => console.error('Error:', err))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/transports?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const categories = [
    { id: 'bus-ticket', name: '🎫 TNSTC Ticket', icon: '🎫', desc: 'Book Bus Tickets Online' },
    { id: 'bus', name: 'Bus', icon: '🚌', desc: 'Govt & Private Buses' },
    { id: 'auto', name: 'Auto', icon: '🛺', desc: 'Metered Auto Rickshaw' },
    { id: 'car', name: 'Car/Taxi', icon: '🚗', desc: 'Cabs & Taxis' },
    { id: 'bike', name: 'Bike', icon: '🏍️', desc: 'Quick Bike Rides' },
    { id: 'train', name: 'Train', icon: '🚂', desc: 'Railway Station' }
  ]

  return (
    <div>
      <section className="bg-gradient-to-r from-indigo-deep to-indigo-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🚌 MaduraiOne Transport
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your complete guide to all transport options in Madurai
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for buses, autos, taxis..."
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-light"
              />
              <button 
                type="submit"
                className="bg-indigo-base text-white px-8 py-4 rounded-xl hover:bg-indigo-dark transition-colors font-semibold"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Browse Transport Options</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={cat.id === 'bus-ticket' ? '/bus-booking' : `/transports/${cat.id}`}
              className={`p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center group ${
                cat.id === 'bus-ticket' ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'
              }`}
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className={`text-sm font-semibold mb-1 ${cat.id === 'bus-ticket' ? 'text-indigo-deep' : 'text-gray-800'}`}>{cat.name}</h3>
              <p className="text-gray-500 text-xs">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Top Rated Services</h2>
            <Link to="/transports" className="text-indigo-base hover:text-indigo-dark font-semibold">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTransports.map(transport => (
              <TransportCard key={transport.id} transport={transport} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why MaduraiOne?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🚌</div>
            <h3 className="text-xl font-semibold mb-2">All Transport Types</h3>
            <p className="text-gray-600">From government buses to app-based rides, find everything in one place</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">Real Reviews</h3>
            <p className="text-gray-600">Honest ratings and reviews from real commuters</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">24/7 Available</h3>
            <p className="text-gray-600">Find round-the-clock transport options for any time of day</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
