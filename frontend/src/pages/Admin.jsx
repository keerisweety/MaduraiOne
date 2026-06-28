import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function Admin() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [transports, setTransports] = useState([])
  const [stats, setStats] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTransport, setEditingTransport] = useState(null)
  const [formData, setFormData] = useState({
    name: '', category: 'bus', description: '', phone: '', location: '', hours: '', fare_range: ''
  })

  useEffect(() => {
    if (!user || user.is_admin !== 1) {
      navigate('/')
      return
    }
    fetchTransports()
    fetchStats()
  }, [user, navigate])

  const fetchTransports = () => {
    fetch(`${API_URL}/api/transports/`)
      .then(res => res.json())
      .then(data => setTransports(data))
  }

  const fetchStats = () => {
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const url = editingTransport 
      ? `${API_URL}/api/admin/transports/${editingTransport.id}`
      : `${API_URL}/api/admin/transports`
    
    const res = await fetch(url, {
      method: editingTransport ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      setShowModal(false)
      setEditingTransport(null)
      setFormData({ name: '', category: 'bus', description: '', phone: '', location: '', hours: '', fare_range: '' })
      fetchTransports()
      fetchStats()
    }
  }

  const handleEdit = (transport) => {
    setEditingTransport(transport)
    setFormData({
      name: transport.name,
      category: transport.category,
      description: transport.description,
      phone: transport.phone || '',
      location: transport.location,
      hours: transport.hours || '',
      fare_range: transport.fare_range || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this transport service?')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/admin/transports/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      fetchTransports()
      fetchStats()
    }
  }

  const openAddModal = () => {
    setEditingTransport(null)
    setFormData({ name: '', category: 'bus', description: '', phone: '', location: '', hours: '', fare_range: '' })
    setShowModal(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🚌 Admin Panel - Transport Services</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-500 text-sm">Total Transports</p>
            <p className="text-3xl font-bold text-green-600">{stats.transports}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-500 text-sm">Total Reviews</p>
            <p className="text-3xl font-bold text-orange-600">{stats.reviews}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-500 text-sm">Categories</p>
            <p className="text-3xl font-bold text-purple-600">{stats.categories.length}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Manage Transport Services</h2>
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Add Transport
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transports.map(transport => (
                <tr key={transport.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">{transport.name}</span>
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-600">{transport.category}</td>
                  <td className="px-6 py-4">
                    <span className="text-yellow-500">⭐ {transport.rating.toFixed(1)}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{transport.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(transport)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transport.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingTransport ? 'Edit Transport' : 'Add New Transport'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="bus">Bus</option>
                  <option value="auto">Auto</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="train">Train</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => setFormData({...formData, hours: e.target.value})}
                  placeholder="e.g., 6:00 AM - 10:00 PM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Fare Range</label>
                <input
                  type="text"
                  value={formData.fare_range}
                  onChange={(e) => setFormData({...formData, fare_range: e.target.value})}
                  placeholder="e.g., ₹20 - ₹200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                >
                  {editingTransport ? 'Update' : 'Add'} Transport
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
