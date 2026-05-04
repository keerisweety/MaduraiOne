import React from 'react'
import { Link } from 'react-router-dom'

const categoryIcons = {
  bus: '🚌',
  auto: '🛺',
  car: '🚗',
  bike: '🏍️',
  train: '🚂'
}

function TransportCard({ transport }) {
  return (
    <Link to={`/transport/${transport.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl">{categoryIcons[transport.category] || '🚗'}</div>
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
              {transport.rating.toFixed(1)} ⭐
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors mb-2">
            {transport.name}
          </h3>
          <p className="text-sm text-orange-600 font-medium mb-2 capitalize">{transport.category}</p>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{transport.description}</p>
          <div className="space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span className="truncate">{transport.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span>{transport.hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span>{transport.fare_range}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TransportCard
