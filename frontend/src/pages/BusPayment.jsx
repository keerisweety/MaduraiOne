import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const upiApps = [
  { id: 'gpay', name: 'Google Pay', icon: '📱' },
  { id: 'phonepe', name: 'PhonePe', icon: '📱' },
  { id: 'paytm', name: 'Paytm', icon: '📱' },
  { id: 'bhim', name: 'BHIM UPI', icon: '📱' }
]

const banks = [
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'pnb', name: 'Punjab National Bank' },
  { id: 'bob', name: 'Bank of Baroda' }
]

function BusPayment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookingData, setBookingData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [selectedUPI, setSelectedUPI] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [processing, setProcessing] = useState(false)
  const [showUPI, setShowUPI] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [showNetbanking, setShowNetbanking] = useState(false)

  useEffect(() => {
    const data = location.state || JSON.parse(sessionStorage.getItem('busBooking'))
    if (!data) {
      navigate('/bus-booking')
    } else {
      setBookingData(data)
    }
  }, [location, navigate])

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method)
    setShowUPI(method === 'upi')
    setShowCard(method === 'card')
    setShowNetbanking(method === 'netbanking')
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target
    if (name === 'number' && value.length <= 16) {
      setCardDetails({ ...cardDetails, number: value.replace(/\D/g, '') })
    } else if (name === 'name') {
      setCardDetails({ ...cardDetails, name: value })
    } else if (name === 'expiry' && value.length <= 5) {
      setCardDetails({ ...cardDetails, expiry: value })
    } else if (name === 'cvv' && value.length <= 4) {
      setCardDetails({ ...cardDetails, cvv: value })
    }
  }

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method')
      return
    }

    if (paymentMethod === 'upi' && !selectedUPI) {
      alert('Please select a UPI app')
      return
    }

    if (paymentMethod === 'card') {
      if (cardDetails.number.length !== 16 || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Please fill all card details correctly')
        return
      }
    }

    if (paymentMethod === 'netbanking' && !selectedBank) {
      alert('Please select a bank')
      return
    }

    setProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const ticketData = {
      ...bookingData,
      paymentMethod,
      paymentId: 'PAY' + Date.now(),
      ticketId: 'TNSTC' + Date.now().toString().slice(-8),
      timestamp: new Date().toISOString()
    }

    sessionStorage.setItem('busTicket', JSON.stringify(ticketData))
    navigate('/bus-ticket', { state: ticketData })
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-deep to-indigo-dark p-6 text-white">
            <h1 className="text-2xl font-bold">Payment</h1>
            <p className="opacity-90">Complete your ticket purchase</p>
          </div>

          <div className="p-6">
            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">{bookingData.fare.routeName}</span>
                <span className="text-gray-600">Passengers:</span>
                <span className="font-medium">{bookingData.passengers}</span>
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-indigo-base text-lg">₹{bookingData.fare.total}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Select Payment Method</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handlePaymentMethodSelect('upi')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    paymentMethod === 'upi' 
                      ? 'border-indigo-base bg-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-light'
                  }`}
                >
                  <div className="text-3xl mb-2">💳</div>
                  <div className="font-medium text-sm">UPI</div>
                </button>

                <button
                  onClick={() => handlePaymentMethodSelect('card')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-indigo-base bg-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-light'
                  }`}
                >
                  <div className="text-3xl mb-2">💳</div>
                  <div className="font-medium text-sm">Card</div>
                </button>

                <button
                  onClick={() => handlePaymentMethodSelect('netbanking')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    paymentMethod === 'netbanking' 
                      ? 'border-indigo-base bg-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-light'
                  }`}
                >
                  <div className="text-3xl mb-2">🏦</div>
                  <div className="font-medium text-sm">Net Banking</div>
                </button>
              </div>
            </div>

            {showUPI && (
              <div className="mb-6 p-4 border border-indigo-100 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Select UPI App</h4>
                <div className="grid grid-cols-2 gap-3">
                  {upiApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedUPI(app.id)}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        selectedUPI === app.id
                          ? 'border-indigo-base bg-indigo-100'
                          : 'border-gray-200 hover:border-indigo-light'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{app.icon}</span>
                        <span className="font-medium">{app.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showCard && (
              <div className="mb-6 p-4 border border-indigo-100 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Card Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-base"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        placeholder="12/25"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showNetbanking && (
              <div className="mb-6 p-4 border border-indigo-100 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Select Bank</h4>
                <div className="grid grid-cols-2 gap-3">
                  {banks.map(bank => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        selectedBank === bank.id
                          ? 'border-indigo-base bg-indigo-100'
                          : 'border-gray-200 hover:border-indigo-light'
                      }`}
                    >
                      <span className="font-medium">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={processing || !paymentMethod}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                processing || !paymentMethod
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-base text-white hover:bg-indigo-dark'
              }`}
            >
              {processing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay ₹{bookingData.fare.total}
                  <span>→</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>🔒</span>
              <span>Secure payment powered by TNSTC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusPayment
