import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Bus, CreditCard, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import axios from 'axios';

const RAZORPAY_KEY = 'rzp_test_SY7xpt0Hb2Wj2L';

export default function GovernmentBus() {
  const [busNumber, setBusNumber] = useState('');
  const [route, setRoute] = useState('');
  const [fare, setFare] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [step, setStep] = useState('input');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/bus/routes');
      const data = await res.json();
      setRoutes(data);
    } catch (error) {
      setRoutes([
        'Madurai Junction - Anna Nagar',
        'Madurai Junction - Mattuthavani',
        'Madurai Junction - Goripalayam',
        'Madurai Junction - Thiruparankundram',
        'Madurai Junction - Viswanathapuram',
        'Madurai Junction - K.K. Nagar',
        'Anna Nagar - Mattuthavani',
        'Anna Nagar - Thiruparankundram',
        'Mattuthavani - Goripalayam',
        'Mattuthavani - K.K. Nagar'
      ]);
    }
  };

  const calculateFare = () => {
    if (!busNumber.trim() || !route) {
      toast.error('Please enter bus number and select route');
      return;
    }

    const busRegex = /^TN[\s-]?\d{2}[\s-]?[A-Z]{1,2}[\s-]?\d{4}$/i;
    if (!busRegex.test(busNumber.trim())) {
      toast.error('Invalid bus number format. Expected: TN 45 A 1234');
      return;
    }

    const routeFares = {
      'Madurai Junction - Anna Nagar': 25,
      'Madurai Junction - Mattuthavani': 30,
      'Madurai Junction - Goripalayam': 20,
      'Madurai Junction - Thiruparankundram': 35,
      'Madurai Junction - Viswanathapuram': 22,
      'Madurai Junction - K.K. Nagar': 28,
      'Anna Nagar - Mattuthavani': 25,
      'Anna Nagar - Thiruparankundram': 30,
      'Mattuthavani - Goripalayam': 25,
      'Mattuthavani - K.K. Nagar': 20
    };

    const calculatedFare = routeFares[route] || 30;
    setFare(calculatedFare);
    setStep('payment');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processPayment = async () => {
    if (!fare) {
      toast.error('Please calculate fare first');
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment system. Please try again.');
        setLoading(false);
        return;
      }

      const orderData = {
        amount: fare * 100,
        currency: 'INR',
        receipt: 'bus_' + Date.now(),
        busNumber: busNumber.toUpperCase(),
        route: route
      };

      let razorpayOrderId;
      try {
        const orderRes = await axios.post('/api/create-order', orderData);
        razorpayOrderId = orderRes.data.id;
      } catch (apiError) {
        razorpayOrderId = 'order_' + Date.now();
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: fare * 100,
        currency: 'INR',
        name: 'Madurai One',
        description: `Bus Ticket - ${busNumber} (${route})`,
        order_id: razorpayOrderId,
        prefill: {
          name: 'Customer',
          email: '',
          contact: ''
        },
        theme: {
          color: '#1565C0'
        },
        handler: async function (response) {
          if (response.razorpay_payment_id) {
            await generateTicket(response.razorpay_payment_id);
          } else {
            toast.error('Payment failed. Please try again.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      toast.error('Payment error. Please try again.');
      setLoading(false);
    }
  };

  const generateTicket = async (paymentId) => {
    try {
      const ticketData = {
        busNumber: busNumber.toUpperCase(),
        route,
        fare,
        paymentId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      };

      const qrData = JSON.stringify({
        ...ticketData,
        ticketId: 'TKT' + Date.now().toString(36).toUpperCase()
      });

      setTicket({
        ...ticketData,
        ticketId: 'TKT' + Date.now().toString(36).toUpperCase(),
        qrData
      });

      setStep('ticket');
      toast.success(t.paymentSuccess);
    } catch (error) {
      toast.error('Failed to generate ticket. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = () => {
    const ticketHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Madurai One - Ticket</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: auto; }
            .header { background: #1565C0; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: white; padding: 20px; border: 2px solid #1565C0; border-top: none; border-radius: 0 0 12px 12px; }
            .qr { text-align: center; margin: 20px 0; }
            .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Madurai One</h2>
            <p>Bus Ticket</p>
          </div>
          <div class="content">
            <div class="detail"><span>Ticket ID:</span><strong>${ticket.ticketId}</strong></div>
            <div class="detail"><span>Bus Number:</span><strong>${ticket.busNumber}</strong></div>
            <div class="detail"><span>Route:</span><strong>${ticket.route}</strong></div>
            <div class="detail"><span>Fare:</span><strong>₹${ticket.fare}</strong></div>
            <div class="detail"><span>Payment ID:</span><strong>${ticket.paymentId}</strong></div>
            <div class="detail"><span>Valid Until:</span><strong>${new Date(ticket.expiresAt).toLocaleString()}</strong></div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([ticketHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.ticketId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => {
              if (step === 'ticket') {
                navigate('/transport');
              } else if (step === 'payment') {
                setStep('input');
              } else {
                navigate('/transport');
              }
            }}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-4xl">🚌</div>
          <h1 className={`text-xl font-bold text-white ${blindMode ? 'text-2xl' : ''}`}>
            {t.governmentBus}
          </h1>
        </div>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto">
        {step === 'input' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${blindMode ? 'text-xl' : ''}`}>
                {t.busNumber}
              </label>
              <input
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value.toUpperCase())}
                placeholder={t.busNumberPlaceholder}
                className={`input-field ${blindMode ? 'h-16 text-xl' : ''}`}
              />
            </div>

            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${blindMode ? 'text-xl' : ''}`}>
                {t.route}
              </label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className={`input-field ${blindMode ? 'h-16 text-xl' : ''}`}
              >
                <option value="">{t.selectRoute}</option>
                {routes.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button
              onClick={calculateFare}
              className={`btn-primary flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''}`}
            >
              <Bus className="w-5 h-5" />
              <span>{t.proceedToPay}</span>
            </button>
          </div>
        )}

        {step === 'payment' && fare && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className={`font-semibold text-gray-800 ${blindMode ? 'text-xl' : ''}`}>
                    {busNumber}
                  </p>
                  <p className={`text-gray-500 ${blindMode ? 'text-lg' : ''}`}>{route}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className={`text-gray-600 ${blindMode ? 'text-lg' : ''}`}>{t.fare}</span>
                  <span className={`text-3xl font-bold text-primary ${blindMode ? 'text-4xl' : ''}`}>
                    ₹{fare}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className={`font-semibold text-gray-800 ${blindMode ? 'text-lg' : ''}`}>
                    {t.razorpayPayment}
                  </p>
                  <p className={`text-gray-500 text-sm ${blindMode ? 'text-base' : ''}`}>
                    {t.securePayment}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={processPayment}
              disabled={loading}
              className={`btn-primary flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <span className="animate-pulse">{t.processing}</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>{t.payNow} ₹{fare}</span>
                </>
              )}
            </button>
          </div>
        )}

        {step === 'ticket' && ticket && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-white font-bold ${blindMode ? 'text-xl' : ''}`}>
                  {t.paymentSuccess}
                </h2>
                <p className={`text-white/80 ${blindMode ? 'text-base' : 'text-sm'}`}>
                  {t.ticketGenerated}
                </p>
              </div>
              
              <div className="p-6">
                <div className="bg-white p-4 rounded-xl mb-6 mx-auto" style={{ width: '200px', height: '200px' }}>
                  <QRCode value={ticket.qrData} size={180} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.ticketId}</span>
                    <span className="font-semibold">{ticket.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.busNumber}</span>
                    <span className="font-semibold">{ticket.busNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.route}</span>
                    <span className="font-semibold text-right text-sm">{ticket.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.fare}</span>
                    <span className="font-bold text-primary text-xl">₹{ticket.fare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.paymentId}</span>
                    <span className="text-sm font-mono">{ticket.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.validUntil}</span>
                    <span className="text-sm">{new Date(ticket.expiresAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={downloadTicket}
              className={`btn-secondary ${blindMode ? 'h-16 text-xl' : ''}`}
            >
              {t.downloadTicket}
            </button>

            <button
              onClick={() => navigate('/transport')}
              className={`w-full py-3 text-primary font-semibold ${blindMode ? 'text-xl' : ''}`}
            >
              {t.back} to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
