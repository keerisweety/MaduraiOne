import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, CreditCard, Smartphone, Send, Ticket, Check, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';

const paymentOptions = [
  { id: 'upi', name: 'UPI', icon: '💳', color: 'bg-green-500' },
  { id: 'gpay', name: 'Google Pay', icon: '📱', color: 'bg-blue-500' },
  { id: 'phonepe', name: 'PhonePe', icon: '📱', color: 'bg-purple-500' },
  { id: 'paytm', name: 'Paytm', icon: '📱', color: 'bg-blue-400' },
  { id: 'card', name: 'Card', icon: '💳', color: 'bg-gray-500' }
];

const upiApps = [
  { id: 'gpay', name: 'Google Pay', icon: '💳', url: 'tez://' },
  { id: 'phonepe', name: 'PhonePe', icon: '💰', url: 'phonepe://' },
  { id: 'paytm', name: 'Paytm', icon: '📱', url: 'paytmmp://' }
];

export default function Payment() {
  const [step, setStep] = useState('select');
  const [paymentType, setPaymentType] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  const handlePaymentTypeSelect = (type) => {
    setPaymentType(type);
    setStep('amount');
  };

  const handleAmountSelect = (presetAmount) => {
    setAmount(presetAmount.toString());
  };

  const generateUPIUrl = () => {
    const upiId = 'maduraione@upi';
    const note = paymentType === 'sendMoney' ? `Send to ${recipient}` : 'Ticket Booking';
    if (paymentType === 'sendMoney' && recipient) {
      return `upi://pay?pa=${recipient}&pn=Recipient&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;
    }
    return `upi://pay?pa=${upiId}&pn=MaduraiOne&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;
  };

  const openPaymentApp = (appUrl) => {
    let fullUrl;
    if (paymentType === 'sendMoney' && recipient) {
      fullUrl = appUrl + `pay?pa=${recipient}&pn=Recipient&am=${amount}&tn=SendMoney&cu=INR`;
    } else {
      fullUrl = appUrl + `pay?pa=maduraione@upi&pn=MaduraiOne&am=${amount}&tn=TicketBooking&cu=INR`;
    }
    window.location.href = fullUrl;
  };

  const processPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(t.enterValidAmount);
      return;
    }
    if (paymentType === 'sendMoney' && !recipient) {
      toast.error(t.enterRecipient);
      return;
    }
    if (!paymentMethod) {
      toast.error(t.selectPaymentMethod);
      return;
    }

    setLoading(true);
    setStep('pay');
    setLoading(false);
  };

  const confirmPayment = async () => {
    setLoading(true);
    
    try {
      const transactionId = 'TXN' + Date.now().toString(36).toUpperCase();
      
      const transactionData = {
        id: transactionId,
        type: paymentType,
        amount: parseFloat(amount),
        recipient: paymentType === 'sendMoney' ? recipient : null,
        service: paymentType === 'bookTicket' ? 'Bus Ticket' : null,
        paymentMethod,
        createdAt: new Date().toISOString(),
        status: 'success'
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      setTransaction(transactionData);
      setStep('success');
      toast.success(t.paymentSuccess);
    } catch (error) {
      toast.error(t.paymentFailed);
    } finally {
      setLoading(false);
    }
  };

  const resetPayment = () => {
    setStep('select');
    setPaymentType('');
    setAmount('');
    setRecipient('');
    setPaymentMethod('');
    setTransaction(null);
  };

  const goBack = () => {
    if (step === 'pay') {
      setStep('amount');
    } else if (step === 'amount') {
      setStep('select');
    } else {
      navigate('/transport');
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-primary to-secondary px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={goBack}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-4xl">
            {paymentType === 'sendMoney' ? '💸' : '🎫'}
          </div>
          <h1 className={`text-xl font-bold text-white ${blindMode ? 'text-2xl' : ''}`}>
            {paymentType === 'sendMoney' ? t.sendMoney : paymentType === 'bookTicket' ? t.bookTicket : t.payment}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {step === 'select' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className={`font-semibold text-gray-800 mb-4 ${blindMode ? 'text-xl' : ''}`}>
                {t.selectService}
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => handlePaymentTypeSelect('sendMoney')}
                  className="w-full p-5 rounded-xl border-2 border-gray-200 bg-white flex items-center gap-4 hover:border-primary/50 transition-all"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <Send className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-gray-800 ${blindMode ? 'text-lg' : ''}`}>
                      {t.sendMoney}
                    </p>
                    <p className={`text-gray-500 text-sm ${blindMode ? 'text-base' : ''}`}>
                      {t.sendMoneyDesc}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handlePaymentTypeSelect('bookTicket')}
                  className="w-full p-5 rounded-xl border-2 border-gray-200 bg-white flex items-center gap-4 hover:border-primary/50 transition-all"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-gray-800 ${blindMode ? 'text-lg' : ''}`}>
                      {t.bookTicket}
                    </p>
                    <p className={`text-gray-500 text-sm ${blindMode ? 'text-base' : ''}`}>
                      {t.bookTicketDesc}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-5">
              <h3 className={`font-semibold text-gray-800 mb-2 ${blindMode ? 'text-lg' : ''}`}>
                {t.quickActions}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/bus/government')}
                  className="p-4 bg-white rounded-xl text-center hover:shadow-md transition-all"
                >
                  <div className="text-2xl mb-1">🚌</div>
                  <p className={`text-sm text-gray-700 ${blindMode ? 'text-base' : ''}`}>{t.busTicket}</p>
                </button>
                <button
                  onClick={() => navigate('/auto')}
                  className="p-4 bg-white rounded-xl text-center hover:shadow-md transition-all"
                >
                  <div className="text-2xl mb-1">🛺</div>
                  <p className={`text-sm text-gray-700 ${blindMode ? 'text-base' : ''}`}>{t.autoBooking}</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'amount' && (
          <div className="space-y-6 animate-fade-in">
            {paymentType === 'sendMoney' && (
              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${blindMode ? 'text-xl' : ''}`}>
                  {t.recipientUPI}
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={t.recipientPlaceholder}
                  className={`input-field ${blindMode ? 'h-16 text-xl' : ''}`}
                />
              </div>
            )}

            {paymentType === 'bookTicket' && (
              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${blindMode ? 'text-xl' : ''}`}>
                  {t.ticketType}
                </label>
                <select className={`input-field ${blindMode ? 'h-16 text-xl' : ''}`}>
                  <option>{t.busTicket}</option>
                  <option>{t.trainTicket}</option>
                  <option>{t.autoBooking}</option>
                </select>
              </div>
            )}

            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${blindMode ? 'text-xl' : ''}`}>
                {t.amount}
              </label>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold text-primary ${blindMode ? 'text-4xl' : ''}`}>₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className={`input-field text-3xl font-bold ${blindMode ? 'h-16 text-3xl' : 'h-14 text-2xl'}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-gray-700 font-medium mb-3 ${blindMode ? 'text-xl' : ''}`}>
                {t.quickAmount}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 200, 500].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAmountSelect(preset)}
                    className={`py-3 rounded-xl font-semibold transition-all ${
                      amount === preset.toString()
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${blindMode ? 'text-lg py-4' : ''}`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`font-semibold text-gray-700 mb-3 ${blindMode ? 'text-xl' : ''}`}>
                {t.paymentMethods}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                      paymentMethod === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center text-lg`}>
                      {option.icon}
                    </div>
                    <span className={`font-medium ${blindMode ? 'text-lg' : ''}`}>{option.name}</span>
                    {paymentMethod === option.id && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={processPayment}
              disabled={!amount || (paymentType === 'sendMoney' && !recipient) || !paymentMethod}
              className={`btn-primary flex items-center justify-center gap-2 ${
                blindMode ? 'h-16 text-xl' : ''
              } ${(!amount || (paymentType === 'sendMoney' && !recipient) || !paymentMethod) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CreditCard className="w-5 h-5" />
              <span>{t.proceedToPayment} ₹{amount || '0'}</span>
            </button>
          </div>
        )}

        {step === 'pay' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <h3 className={`font-bold text-gray-800 mb-2 ${blindMode ? 'text-xl' : ''}`}>
                {t.scanToPay}
              </h3>
              <p className={`text-gray-500 text-sm mb-4 ${blindMode ? 'text-base' : ''}`}>
                {t.scanQRCode}
              </p>
              
              <div className="bg-white p-4 rounded-xl mb-4 mx-auto" style={{ width: '220px', height: '220px' }}>
                <QRCode value={generateUPIUrl()} size={200} />
              </div>
              
              <p className={`text-lg font-semibold text-primary mb-2 ${blindMode ? 'text-xl' : ''}`}>
                ₹{amount}
              </p>
              <p className={`text-gray-500 text-sm ${blindMode ? 'text-base' : ''}`}>
                {paymentType === 'sendMoney' ? `Pay to: ${recipient}` : t.payToUPI}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h4 className={`font-semibold text-gray-700 mb-3 ${blindMode ? 'text-lg' : ''}`}>
                {t.openApp}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {upiApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => openPaymentApp(app.url)}
                    className="p-3 bg-gray-50 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className={`text-xs text-gray-700 ${blindMode ? 'text-sm' : ''}`}>{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className={`text-green-700 text-sm text-center ${blindMode ? 'text-base' : ''}`}>
                {t.makePaymentNote}
              </p>
            </div>

            <button
              onClick={confirmPayment}
              disabled={loading}
              className={`btn-primary flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''} ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? (
                <span className="animate-pulse">{t.verifying}</span>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>{t.confirmPayment}</span>
                </>
              )}
            </button>
          </div>
        )}

        {step === 'success' && transaction && (
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
                  {t.transactionComplete}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500">{t.transactionId}</span>
                  <span className={`font-semibold ${blindMode ? 'text-lg' : ''}`}>
                    {transaction.id}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500">{t.amount}</span>
                  <span className={`font-bold text-2xl text-primary ${blindMode ? 'text-3xl' : ''}`}>
                    ₹{transaction.amount}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500">{t.type}</span>
                  <span className={`font-medium ${blindMode ? 'text-lg' : ''}`}>
                    {transaction.type === 'sendMoney' ? t.sendMoney : t.bookTicket}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{t.paidVia}</span>
                  <span className={`font-medium ${blindMode ? 'text-lg' : ''}`}>
                    {paymentOptions.find(p => p.id === transaction.paymentMethod)?.name}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={() => {
                    const receiptHtml = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Receipt - ${transaction.id}</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: auto; }
                            .header { background: #1565C0; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
                            .content { background: white; padding: 20px; border: 2px solid #1565C0; border-top: none; border-radius: 0 0 12px 12px; }
                            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                            .amount { font-size: 24px; font-weight: bold; color: #1565C0; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h2>Madurai One</h2>
                            <p>Payment Receipt</p>
                          </div>
                          <div class="content">
                            <div class="row"><span>Transaction ID:</span><strong>${transaction.id}</strong></div>
                            <div class="row"><span>Amount:</span><strong class="amount">₹${transaction.amount}</strong></div>
                            <div class="row"><span>Type:</span><strong>${transaction.type === 'sendMoney' ? 'Send Money' : 'Book Ticket'}</strong></div>
                            <div class="row"><span>Paid Via:</span><strong>${paymentOptions.find(p => p.id === transaction.paymentMethod)?.name}</strong></div>
                            <div class="row"><span>Date:</span><strong>${new Date(transaction.createdAt).toLocaleString()}</strong></div>
                          </div>
                        </body>
                      </html>
                    `;
                    const blob = new Blob([receiptHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `receipt-${transaction.id}.html`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="btn-secondary w-full"
                >
                  {t.downloadReceipt}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetPayment}
                className="btn-primary flex-1"
              >
                {t.newPayment}
              </button>
              <button
                onClick={() => navigate('/transport')}
                className="btn-secondary flex-1"
              >
                {t.goHome}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => navigate('/transport')}
          className={`w-full py-3 text-primary font-semibold ${blindMode ? 'text-xl' : ''}`}
        >
          {t.back}
        </button>
      </div>
    </div>
  );
}
