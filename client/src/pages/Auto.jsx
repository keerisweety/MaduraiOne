import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ExternalLink, Smartphone } from 'lucide-react';

export default function Auto() {
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  const autoServices = [
    {
      id: 'vaigai',
      name: t.vaigaiMetraAuto,
      websiteUrl: 'https://vaigaimeterauto.com/',
      appUrl: 'https://play.google.com/store/apps/details?id=com.vaigaimeterauto',
      icon: '🛺',
      color: 'bg-blue-500'
    },
    {
      id: 'vagai',
      name: t.vagaimetraAuto,
      websiteUrl: 'https://vaagaimeterauto.in',
      appUrl: 'https://play.google.com/store/apps/details?id=com.vaagaimetra',
      icon: '🚕',
      color: 'bg-teal-500'
    },
    {
      id: 'rapido',
      name: t.rapido,
      websiteUrl: 'https://www.rapido.bike',
      appUrl: 'https://play.google.com/store/apps/details?id=com.rapido.bike.user',
      icon: '🏍️',
      color: 'bg-yellow-500'
    }
  ];

  const openWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openApp = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/transport')}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-4xl">🛺</div>
          <h1 className={`text-xl font-bold text-white ${blindMode ? 'text-2xl' : ''}`}>
            {t.auto}
          </h1>
        </div>
        <p className={`text-white/80 ${blindMode ? 'text-lg' : ''}`}>
          {t.bookAuto}
        </p>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className={`font-bold text-gray-800 mb-4 ${blindMode ? 'text-xl' : ''}`}>
            {t.autoServices}
          </h2>
          <div className="space-y-4">
            {autoServices.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 p-4 bg-gray-50">
                  <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center text-xl`}>
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-gray-800 ${blindMode ? 'text-lg' : ''}`}>
                      {service.name}
                    </p>
                  </div>
                </div>
                <div className="flex divide-x divide-gray-200">
                  <button
                    onClick={() => openWebsite(service.websiteUrl)}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-primary font-medium hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className={blindMode ? 'text-lg' : 'text-sm'}>{t.website}</span>
                  </button>
                  <button
                    onClick={() => openApp(service.appUrl)}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-green-600 font-medium hover:bg-green-50 transition-colors"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className={blindMode ? 'text-lg' : 'text-sm'}>{t.app}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-5">
          <h3 className={`font-semibold text-gray-800 mb-2 ${blindMode ? 'text-lg' : ''}`}>
            {t.quickBooking}
          </h3>
          <p className={`text-gray-600 text-sm mb-4 ${blindMode ? 'text-base' : ''}`}>
            {t.quickBookingDesc}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/payment')}
              className="btn-primary flex-1"
            >
              {t.bookTicket}
            </button>
            <button
              onClick={() => navigate('/send-money')}
              className="btn-secondary flex-1"
            >
              {t.sendMoney}
            </button>
          </div>
        </div>
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
