import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Download, Share2, Check } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function Ticket() {
  const { id } = useParams();
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  const mockTicket = {
    ticketId: id || 'TKT123456',
    busNumber: 'TN 45 A 1234',
    route: 'Madurai Junction - Anna Nagar',
    fare: 25,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed'
  };

  const qrData = JSON.stringify({
    ticketId: mockTicket.ticketId,
    busNumber: mockTicket.busNumber,
    route: mockTicket.route,
    fare: mockTicket.fare
  });

  const downloadTicket = () => {
    const ticketHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Madurai One - Ticket ${mockTicket.ticketId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: auto; }
            .header { background: #1565C0; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: white; padding: 20px; border: 2px solid #1565C0; border-top: none; border-radius: 0 0 12px 12px; }
            .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .qr { text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Madurai One</h2>
            <p>Bus Ticket</p>
          </div>
          <div class="content">
            <div class="detail"><span>Ticket ID:</span><strong>${mockTicket.ticketId}</strong></div>
            <div class="detail"><span>Bus Number:</span><strong>${mockTicket.busNumber}</strong></div>
            <div class="detail"><span>Route:</span><strong>${mockTicket.route}</strong></div>
            <div class="detail"><span>Fare:</span><strong>₹${mockTicket.fare}</strong></div>
            <div class="detail"><span>Valid Until:</span><strong>${new Date(mockTicket.expiresAt).toLocaleString()}</strong></div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([ticketHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${mockTicket.ticketId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareTicket = async () => {
    const shareText = `Madurai One Ticket\nID: ${mockTicket.ticketId}\nBus: ${mockTicket.busNumber}\nRoute: ${mockTicket.route}\nFare: ₹${mockTicket.fare}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Madurai One Ticket',
          text: shareText
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Ticket details copied to clipboard!');
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-primary to-secondary px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/transport')}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className={`text-xl font-bold text-white ${blindMode ? 'text-2xl' : ''}`}>
            {t.ticket}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 -mt-8 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="w-6 h-6 text-white" />
              <span className={`text-white font-semibold ${blindMode ? 'text-xl' : ''}`}>
                {t.paymentSuccess}
              </span>
            </div>
            <h2 className={`text-white ${blindMode ? 'text-2xl' : ''}`}>
              {t.ticketGenerated}
            </h2>
          </div>

          <div className="p-6">
            <div className="bg-white p-4 rounded-xl mb-6 flex items-center justify-center" style={{ width: '200px', height: '200px', margin: '0 auto' }}>
              <QRCode value={qrData} size={180} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Ticket ID</span>
                <span className="font-semibold">{mockTicket.ticketId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">{t.busNumber}</span>
                <span className="font-semibold">{mockTicket.busNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">{t.route}</span>
                <span className="font-semibold text-right text-sm max-w-[60%]">{mockTicket.route}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">{t.fare}</span>
                <span className="font-bold text-primary text-2xl">₹{mockTicket.fare}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">{t.validUntil}</span>
                <span className="font-medium text-sm">{new Date(mockTicket.expiresAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={downloadTicket}
                className={`btn-primary flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''}`}
              >
                <Download className="w-5 h-5" />
                <span>{t.downloadTicket}</span>
              </button>

              <button
                onClick={shareTicket}
                className={`btn-secondary flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''}`}
              >
                <Share2 className="w-5 h-5" />
                <span>{t.shareTicket}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
