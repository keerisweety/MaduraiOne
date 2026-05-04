import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

function QRCode({ data, size = 200 }) {
  const canvasRef = useRef(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!data || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
    }
    img.onerror = () => {
      setError(true)
    }
    img.src = qrUrl
  }, [data, size])

  if (error) {
    return (
      <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        <span>QR Code unavailable</span>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg inline-block">
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}

function BusTicket() {
  const navigate = useNavigate()
  const location = useLocation()
  const [ticketData, setTicketData] = useState(null)

  useEffect(() => {
    const data = location.state || JSON.parse(sessionStorage.getItem('busTicket'))
    if (!data) {
      navigate('/bus-booking')
    } else {
      setTicketData(data)
    }
  }, [location, navigate])

  const handleDownload = () => {
    window.print()
  }

  const handleNewBooking = () => {
    sessionStorage.removeItem('busBooking')
    sessionStorage.removeItem('busTicket')
    navigate('/bus-booking')
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  const qrData = JSON.stringify({
    ticketId: ticketData.ticketId,
    route: ticketData.route,
    routeName: ticketData.fare.routeName,
    passengers: ticketData.passengers,
    fare: ticketData.fare.total,
    dateTime: ticketData.timestamp,
    paymentId: ticketData.paymentId
  })

  const formattedDate = new Date(ticketData.timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white text-center">
            <div className="text-4xl mb-2">✅</div>
            <h1 className="text-xl font-bold">Payment Successful!</h1>
            <p className="opacity-90 text-sm">Your ticket has been generated</p>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <QRCode data={qrData} size={200} />
              <p className="text-sm text-gray-500 mt-3">Scan this QR code when boarding</p>
            </div>

            <div className="border-t border-b border-dashed border-gray-300 py-4 mb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl">🚌</span>
                <span className="text-lg font-bold text-indigo-base">TNSTC Madurai</span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{ticketData.ticketId}</p>
                <p className="text-sm text-gray-500">Ticket ID</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center gap-2">
                  <span>🛤️</span> Route
                </span>
                <span className="font-semibold text-right max-w-[60%]">{ticketData.fare.routeName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center gap-2">
                  <span>👥</span> Passengers
                </span>
                <span className="font-semibold">{ticketData.passengers}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center gap-2">
                  <span>💰</span> Fare Paid
                </span>
                <span className="font-bold text-green-600">₹{ticketData.fare.total}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 flex items-center gap-2">
                  <span>📅</span> Date & Time
                </span>
                <span className="font-semibold">{formattedDate}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleDownload}
                className="w-full py-3 bg-indigo-base text-white rounded-lg font-semibold hover:bg-indigo-dark transition-colors flex items-center justify-center gap-2"
              >
                <span>📥</span> Download Ticket
              </button>
              <button
                onClick={handleNewBooking}
                className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Book New Ticket
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Important Instructions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Show this QR code to the bus conductor</li>
                <li>• Valid for single journey only</li>
                <li>• Keep this ticket until journey completes</li>
              </ul>
            </div>

            <div className="mt-4 text-center">
              <Link 
                to="/qr-verify" 
                className="text-indigo-base hover:text-indigo-dark text-sm font-medium"
              >
                Verify Ticket →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusTicket
