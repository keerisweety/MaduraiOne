import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function QRVerify() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [ticketId, setTicketId] = useState('')
  const [scanning, setScanning] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [manualEntry, setManualEntry] = useState(true)

  useEffect(() => {
    const savedTicket = sessionStorage.getItem('busTicket')
    if (savedTicket) {
      setVerificationResult(JSON.parse(savedTicket))
    }
  }, [])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setScanning(true)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setTimeout(() => {
        const savedTicket = sessionStorage.getItem('busTicket')
        if (savedTicket) {
          setVerificationResult(JSON.parse(savedTicket))
        } else {
          setVerificationResult(null)
        }
        setScanning(false)
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleManualVerify = (e) => {
    e.preventDefault()
    if (!ticketId.trim()) {
      alert('Please enter a ticket ID')
      return
    }

    setLoading(true)
    
    setTimeout(() => {
      const savedTicket = sessionStorage.getItem('busTicket')
      if (savedTicket) {
        const ticket = JSON.parse(savedTicket)
        if (ticket.ticketId === ticketId.toUpperCase() || ticket.ticketId.includes(ticketId.toUpperCase())) {
          setVerificationResult(ticket)
        } else {
          setVerificationResult({ error: 'invalid', ticketId: ticketId.toUpperCase() })
        }
      } else {
        setVerificationResult({ error: 'not_found', ticketId: ticketId.toUpperCase() })
      }
      setLoading(false)
    }, 1000)
  }

  const handleClearResult = () => {
    setVerificationResult(null)
    setTicketId('')
  }

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getTicketAge = (dateStr) => {
    const ticketTime = new Date(dateStr).getTime()
    const now = Date.now()
    const diffMs = now - ticketTime
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📱</div>
          <h1 className="text-2xl font-bold text-gray-800">Ticket Verification</h1>
          <p className="text-gray-500">Scan QR code or enter ticket ID</p>
        </div>

        {!verificationResult ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setManualEntry(true)}
                className={`flex-1 py-4 font-semibold transition-colors ${
                  manualEntry ? 'text-indigo-base border-b-2 border-indigo-base' : 'text-gray-500'
                }`}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setManualEntry(false)}
                className={`flex-1 py-4 font-semibold transition-colors ${
                  !manualEntry ? 'text-indigo-base border-b-2 border-indigo-base' : 'text-gray-500'
                }`}
              >
                Upload QR
              </button>
            </div>

            <div className="p-6">
              {manualEntry ? (
                <form onSubmit={handleManualVerify}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Enter Ticket ID
                    </label>
                    <input
                      type="text"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                      placeholder="e.g., TNSTC12345678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-base uppercase text-lg tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-base text-white rounded-lg font-semibold hover:bg-indigo-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <span>🔍</span>
                        Verify Ticket
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={scanning}
                    className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-base transition-colors disabled:opacity-50"
                  >
                    {scanning ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin text-3xl">📷</div>
                        <span className="text-gray-500">Scanning QR Code...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-5xl">📤</span>
                        <span className="text-gray-600 font-medium">Click to upload QR Image</span>
                        <span className="text-sm text-gray-400">Supports JPG, PNG formats</span>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {verificationResult.error ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-red-500 p-4 text-white text-center">
                  <div className="text-4xl mb-2">❌</div>
                  <h2 className="text-xl font-bold">Invalid Ticket</h2>
                </div>
                <div className="p-6 text-center">
                  {verificationResult.error === 'invalid' ? (
                    <>
                      <p className="text-gray-600 mb-4">
                        Ticket ID <span className="font-bold">{verificationResult.ticketId}</span> does not match our records.
                      </p>
                      <p className="text-sm text-gray-500">Please check the ticket ID and try again.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-4">
                        No ticket found with ID <span className="font-bold">{verificationResult.ticketId}</span>
                      </p>
                      <p className="text-sm text-gray-500">The ticket may have been expired or does not exist.</p>
                    </>
                  )}
                  <button
                    onClick={handleClearResult}
                    className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-green-500 p-4 text-white text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <h2 className="text-xl font-bold">Ticket Verified</h2>
                  <p className="opacity-90 text-sm">Valid TNSTC Madurai Ticket</p>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="font-semibold">Active Ticket</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{verificationResult.ticketId}</p>
                  </div>

                  <div className="border-t border-b border-dashed border-gray-300 py-4 mb-4">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">🚌</span>
                      <div className="text-left">
                        <p className="font-bold text-indigo-base">TNSTC Madurai</p>
                        <p className="text-sm text-gray-500">Tamil Nadu State Transport</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Route ID</p>
                      <p className="font-bold text-lg">{verificationResult.route}</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Passengers</p>
                      <p className="font-bold text-lg">{verificationResult.passengers}</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg col-span-2">
                      <p className="text-gray-500 text-xs">Fare Paid</p>
                      <p className="font-bold text-lg text-green-600">₹{verificationResult.fare.total}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-gray-500 text-xs mb-1">Route</p>
                    <p className="font-medium">{verificationResult.fare.routeName}</p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Booked On</p>
                      <p className="font-medium">{formatDateTime(verificationResult.timestamp)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Ticket Age</p>
                      <p className="font-medium">{getTicketAge(verificationResult.timestamp)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-500 text-xs mb-1">Payment ID</p>
                    <p className="font-mono text-sm text-gray-600">{verificationResult.paymentId}</p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleClearResult}
                      className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Verify Another
                    </button>
                    <Link
                      to="/bus-booking"
                      className="flex-1 py-3 bg-indigo-base text-white rounded-lg font-semibold hover:bg-indigo-dark transition-colors text-center"
                    >
                      Book Ticket
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-indigo-base hover:text-indigo-dark font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QRVerify
