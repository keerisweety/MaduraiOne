import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL

const categoryIcons = {
  bus: '🚌',
  auto: '🛺',
  car: '🚗',
  bike: '🏍️',
  train: '🚂'
}

function TransportDetail() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [transport, setTransport] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
fetch(`${API_URL}/api/transports/${id}`)
      .then(res => res.json())
      .then(data => {
        setTransport(data.transport)
        setReviews(data.reviews)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [id])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to submit a review')
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_URL}/api/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ transport_id: parseInt(id), rating, comment })
      })

      if (res.ok) {
        setComment('')
        setRating(5)
        const response = await fetch(`${API_URL}/api/transports/${id}`)
        const data = await response.json()
        setTransport(data.transport)
        setReviews(data.reviews)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  if (!transport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500">Transport service not found</p>
          <Link to="/" className="text-orange-600 hover:text-orange-700 mt-4 inline-block">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{categoryIcons[transport.category] || '🚗'}</div>
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {transport.category}
              </span>
              <h1 className="text-4xl font-bold mt-2">{transport.name}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-lg">
            <span className="bg-white/20 px-3 py-1 rounded-lg">⭐ {transport.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="p-8">
          <p className="text-gray-600 text-lg leading-relaxed mb-8">{transport.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📍</span>
                <h3 className="font-semibold text-gray-800">Location</h3>
              </div>
              <p className="text-gray-600">{transport.location}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🕐</span>
                <h3 className="font-semibold text-gray-800">Operating Hours</h3>
              </div>
              <p className="text-gray-600">{transport.hours}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💰</span>
                <h3 className="font-semibold text-gray-800">Fare Range</h3>
              </div>
              <p className="text-gray-600">{transport.fare_range}</p>
            </div>
          </div>

          {transport.phone && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Contact</h3>
                  <p className="text-green-700 text-lg">{transport.phone}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Reviews ({reviews.length})
            </h2>

            {user && (
              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-xl mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Share your experience with this transport service..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {!user && (
              <div className="bg-gray-50 p-6 rounded-xl mb-8 text-center">
                <p className="text-gray-600">
                  <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                    Login
                  </Link>{' '}
                  to write a review
                </p>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                          {review.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{review.user_name}</p>
                          <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-yellow-500">
                        {'⭐'.repeat(review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransportDetail
