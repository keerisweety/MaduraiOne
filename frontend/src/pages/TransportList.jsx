import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import TransportCard from '../components/TransportCard'

function TransportList() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search')
  
  const [transports, setTransports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(category || 'all')
  const [searchTerm, setSearchTerm] = useState(search || '')

  useEffect(() => {
    setLoading(true)
    const queryParams = new URLSearchParams()
    if (filter && filter !== 'all') queryParams.set('category', filter)
    if (searchTerm) queryParams.set('search', searchTerm)

    fetch(`http://localhost:5000/api/transports/?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        setTransports(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [filter, searchTerm])

  const categories = [
    { id: 'all', name: 'All', icon: '🚍' },
    { id: 'bus', name: 'Bus', icon: '🚌' },
    { id: 'auto', name: 'Auto', icon: '🛺' },
    { id: 'car', name: 'Car', icon: '🚗' },
    { id: 'bike', name: 'Bike', icon: '🏍️' },
    { id: 'train', name: 'Train', icon: '🚂' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {filter === 'all' ? 'All Transport Services' : categories.find(c => c.id === filter)?.name || 'Transport Services'}
        </h1>
        <p className="text-gray-500 mt-2">Find the best transport options in Madurai</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transports..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              filter === cat.id
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl">⏳</div>
          <p className="text-gray-500 mt-4">Loading transports...</p>
        </div>
      ) : transports.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">No transport services found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transports.map(transport => (
            <TransportCard key={transport.id} transport={transport} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TransportList
