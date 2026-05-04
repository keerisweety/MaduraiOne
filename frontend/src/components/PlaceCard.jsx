import React from 'react'
import { Link } from 'react-router-dom'

function PlaceCard({ place }) {
  return (
    <Link to={`/place/${place.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={place.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
            {place.rating.toFixed(1)} ⭐
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
            {place.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2 capitalize">{place.category}</p>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">{place.description}</p>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="mr-1">📍</span>
            {place.location}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PlaceCard
